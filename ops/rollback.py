#!/usr/bin/env python3
"""Restore a specific Bildungshaus release's prior template and own Ingress.

Default is a read-only drift check. --apply is required for restoration.
Unrelated post-release edits stop the rollback for manual inspection.
"""
import argparse
import json
import re
import shlex
import subprocess


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', required=True)
    parser.add_argument('--ssh-host', default='m4dreambau')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,38}', args.release):
        parser.error('invalid release')
    if not re.fullmatch(r'[A-Za-z0-9_.@-]+', args.ssh_host) or args.ssh_host.startswith('-'):
        parser.error('invalid SSH host')
    release = '/root/releases/bildungshaus/' + args.release

    def remote(argv, data=None):
        return subprocess.run(['ssh', args.ssh_host, shlex.join(argv)], input=data,
                              capture_output=True, check=True).stdout

    def saved(name, optional=False):
        script = 'import pathlib,sys; p=pathlib.Path(sys.argv[1]); print(p.read_text() if p.exists() else "null")'
        result = json.loads(remote(['python3', '-c', script, release + '/' + name]))
        if result is None and not optional:
            raise RuntimeError('Missing release snapshot: ' + name)
        return result

    previous = saved('backup/deployment.json')
    before_ingress = saved('backup/ingress.json', optional=True)
    applied = saved('applied-template.json')
    applied_ingress = saved('applied-ingress.json', optional=True)
    live = json.loads(remote(['kubectl', '-n', 'matrix', 'get', 'deployment', 'dreambau-homepage', '-o', 'json']))
    if live['spec']['template'] != applied:
        raise RuntimeError('Deployment template changed after this release; refusing to overwrite later edits')
    raw = remote(['kubectl', '-n', 'matrix', 'get', 'ingress', 'dreambau-bildungshaus', '--ignore-not-found', '-o', 'json'])
    ingress = json.loads(raw) if raw.strip() else None
    expected = applied_ingress or before_ingress
    if (ingress or {}).get('spec') != (expected or {}).get('spec'):
        raise RuntimeError('Bildungshaus Ingress changed after snapshot; inspect before rollback')
    print('Rollback scope: homepage pod template and dreambau-bildungshaus Ingress only; static releases retained.')
    if not args.apply:
        print('Read-only check passed. Add --apply to restore the previous state.')
        return
    if before_ingress is None:
        remote(['kubectl', '-n', 'matrix', 'delete', 'ingress', 'dreambau-bildungshaus', '--ignore-not-found'])
    else:
        before_ingress.pop('status', None)
        for key in ('resourceVersion', 'uid', 'creationTimestamp', 'managedFields', 'generation'):
            before_ingress['metadata'].pop(key, None)
        remote(['kubectl', 'apply', '-f', '-'], json.dumps(before_ingress).encode())
    patch = [{'op': 'replace', 'path': '/spec/template', 'value': previous['spec']['template']}]
    remote(['kubectl', '-n', 'matrix', 'patch', 'deployment', 'dreambau-homepage', '--type=json', '-p', json.dumps(patch)])
    remote(['kubectl', '-n', 'matrix', 'rollout', 'status', 'deployment/dreambau-homepage', '--timeout=45s'])
    print('Previous state restored. Recheck public apex, Matrix, Testmails and previous Bildungshaus state.')


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as error:
        print(error.stderr.decode(errors='replace').strip())
        raise SystemExit(error.returncode)
