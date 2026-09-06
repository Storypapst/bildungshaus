#!/usr/bin/env python3
"""Stage a frozen static release, then extend the existing homepage deployment.

Default operation is LOCAL validation only. --apply must be given for remote writes.
The caller runs the final build and QA before invoking this script.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import re
import shlex
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
DEPLOYMENT = 'dreambau-homepage'
NAMESPACE = 'matrix'
ANNOTATION = 'bildungshaus.dreambau.com/release'


def run(args: list[str], *, data: bytes | None = None) -> bytes:
    return subprocess.run(args, input=data, stdout=subprocess.PIPE,
                          stderr=subprocess.PIPE, check=True).stdout


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', required=True, help='Unique lower-case release id')
    parser.add_argument('--ssh-host', default='m4dreambau')
    parser.add_argument('--apply', action='store_true', help='Perform authorised remote deployment')
    args = parser.parse_args()
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,38}', args.release):
        parser.error('release must contain 1–39 lowercase letters, digits or hyphens')
    if not re.fullmatch(r'[A-Za-z0-9_.@-]+', args.ssh_host) or args.ssh_host.startswith('-'):
        parser.error('invalid SSH host alias')
    dist = ROOT / 'dist'
    index = dist / 'index.html'
    if not index.is_file():
        parser.error('dist/index.html missing; run the final production build first')
    if '/bildungshaus/' not in index.read_text():
        parser.error('built index must use the /bildungshaus/ base')
    files = sorted(p for p in dist.rglob('*') if p.is_file())
    if any(p.is_symlink() for p in dist.rglob('*')):
        parser.error('symlinks are not permitted in the static release')
    hashes = {p.relative_to(dist).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
    result = {'release': args.release, 'files': len(files), 'bytes': sum(p.stat().st_size for p in files),
              'index_sha256': hashes['index.html'], 'mode': 'apply' if args.apply else 'local-validation-only'}
    print(json.dumps(result, indent=2))
    if not args.apply:
        return

    def remote(argv: list[str], data: bytes | None = None) -> bytes:
        return run(['ssh', args.ssh_host, shlex.join(argv)], data=data)

    def kubectl(*argv: str) -> bytes:
        return remote(['kubectl', '-n', NAMESPACE, *argv])

    # Record the real live state before any deployment mutation.
    previous = json.loads(kubectl('get', 'deployment', DEPLOYMENT, '-o', 'json'))
    containers = previous['spec']['template']['spec']['containers']
    if len(containers) != 1 or containers[0]['name'] != 'homepage':
        raise RuntimeError('Unexpected homepage container layout; inspect before extending it')
    if containers[0].get('image') != 'nginx:1.31-alpine':
        raise RuntimeError('Homepage image differs from the inspected baseline; inspect before proceeding')
    ingress_raw = kubectl('get', 'ingress', 'dreambau-bildungshaus', '--ignore-not-found', '-o', 'json')
    previous_ingress = json.loads(ingress_raw) if ingress_raw.strip() else None
    release = '/root/releases/bildungshaus/' + args.release
    remote(['mkdir', '-p', '/root/releases/bildungshaus'])
    remote(['mkdir', release])  # Refuse to overwrite any earlier release.
    remote(['mkdir', release + '/site', release + '/backup'])

    def put(relative: str, content: bytes) -> None:
        remote(['python3', '-c', 'import pathlib,sys; pathlib.Path(sys.argv[1]).write_bytes(sys.stdin.buffer.read())',
                release + '/' + relative], content)

    put('backup/deployment.json', json.dumps(previous).encode())
    put('backup/ingress.json', json.dumps(previous_ingress).encode())
    put('checksums.json', json.dumps(hashes, indent=2).encode())
    put('nginx.conf', (ROOT / 'ops/nginx.conf').read_bytes())
    put('ingress.yaml', (ROOT / 'ops/ingress.yaml').read_bytes())
    output = ROOT / 'output' / 'deploy' / args.release
    output.mkdir(parents=True, exist_ok=False)
    archive = output / 'site.tar.gz'
    with tarfile.open(archive, 'w:gz') as bundle:
        for p in files:
            bundle.add(p, arcname=p.relative_to(dist), recursive=False)
    put('site.tar.gz', archive.read_bytes())
    remote(['tar', '-xzf', release + '/site.tar.gz', '-C', release + '/site'])
    remote(['chmod', '-R', 'a+rX', release + '/site'])
    verify = '''import hashlib,json,pathlib,sys
r=pathlib.Path(sys.argv[1]); expected=json.loads((r/'checksums.json').read_text())
actual={p.relative_to(r/'site').as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in (r/'site').rglob('*') if p.is_file()}
if actual!=expected: raise SystemExit('Static release checksum mismatch')
print('Remote file checksums verified')'''
    print(remote(['python3', '-c', verify, release]).decode().strip())
    # Test the full nginx syntax inside the current nginx image before changing the pod.
    remote(['kubectl', '-n', NAMESPACE, 'exec', '-i', 'deployment/' + DEPLOYMENT, '--', 'sh', '-c',
            'cat > /tmp/bildungshaus-candidate.conf; nginx -t -c /tmp/bildungshaus-candidate.conf'],
           (ROOT / 'ops/nginx.conf').read_bytes())
    config_name = 'bildungshaus-nginx-' + args.release
    config = kubectl('create', 'configmap', config_name, '--from-file=nginx.conf=' + release + '/nginx.conf',
                     '--dry-run=client', '-o', 'json')
    patch = {'spec': {'template': {'metadata': {'annotations': {ANNOTATION: args.release}}, 'spec': {
        'containers': [{'name': 'homepage', 'args': ['-c', '/etc/dreambau-web/nginx.conf', '-g', 'daemon off;'],
                        'volumeMounts': [{'name': 'bildungshaus', 'mountPath': '/bildungshaus', 'readOnly': True},
                                         {'name': 'bildungshaus-nginx', 'mountPath': '/etc/dreambau-web', 'readOnly': True}]}],
        'volumes': [{'name': 'bildungshaus', 'hostPath': {'path': release + '/site', 'type': 'Directory'}},
                    {'name': 'bildungshaus-nginx', 'configMap': {'name': config_name}}]}}}}
    put('deployment-patch.json', json.dumps(patch).encode())
    remote(['kubectl', 'apply', '--dry-run=server', '-f', '-'], config)
    kubectl('patch', 'deployment', DEPLOYMENT, '--type=strategic', '--patch-file', release + '/deployment-patch.json', '--dry-run=server')
    kubectl('apply', '--dry-run=server', '-f', release + '/ingress.yaml')
    # Commit the limited change. On failure preserve backups and report the exact rollback command.
    try:
        remote(['kubectl', 'apply', '-f', '-'], config)
        kubectl('patch', 'deployment', DEPLOYMENT, '--type=strategic', '--patch-file', release + '/deployment-patch.json')
        applied = json.loads(kubectl('get', 'deployment', DEPLOYMENT, '-o', 'json'))
        put('applied-template.json', json.dumps(applied['spec']['template']).encode())
        kubectl('rollout', 'status', 'deployment/' + DEPLOYMENT, '--timeout=45s')
        kubectl('apply', '-f', release + '/ingress.yaml')
        put('applied-ingress.json', kubectl('get', 'ingress', 'dreambau-bildungshaus', '-o', 'json'))
    except subprocess.CalledProcessError:
        print('Deployment needs inspection. Previous state is preserved under ' + release + '/backup')
        print('Rollback: python3 ops/rollback.py --release ' + args.release + ' --ssh-host ' + args.ssh_host + ' --apply')
        raise
    (output / 'release.json').write_text(json.dumps(result | {'server_release': release, 'files_sha256': hashes}, indent=2))
    print('Deployment applied. Public browser acceptance still required: https://dreambau.com/bildungshaus/')


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as error:
        # Commands in this script contain only static artifact paths and Kubernetes object names.
        print(error.stderr.decode(errors='replace').strip())
        raise SystemExit(error.returncode)
