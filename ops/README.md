# Bildungshaus static release

Release `20260907-v1` is deployed at `https://dreambau.com/bildungshaus/` and passed the coordinator’s live browser checks on 2026-09-07. See `docs/VERIFICATION.md`. The commands below describe subsequent releases; preparing files alone does not deploy them.

## Scope

Reuse `matrix/dreambau-homepage`, its existing nginx image, Service, TLS secret, security settings and resource limits. Add two read-only mounts: a release-specific static directory and a small versioned nginx ConfigMap. No additional server service, database or pod type is introduced.

The existing `/site` ConfigMap remains unchanged. Apex `/`, `/homepage-assets/`, Matrix discovery and Testmails keep their routes. A separate Ingress matches only the `/bildungshaus` path prefix. The new nginx location serves `/bildungshaus/` from the new mount and redirects `/bildungshaus` to the canonical trailing-slash URL.

Images, local fonts, scripts, CSS and Markdown remain together in a release directory. Multi-megabyte assets do not go into a ConfigMap. There is no general host filesystem mount: only `/root/releases/bildungshaus/<release>/site` is mounted read-only. This assumes the currently inspected single-node K3s setup; multi-node operation requires shared storage or an image-based artifact.

## Content security policy

The apex policy is preserved. Only the Bildungshaus path allows same-origin font loading and document fetches, plus inline styles needed by the UI primitives. No external script, analytics or API host is added. Real browser acceptance must include opening the source-backed detail content, not just the entry page.

## Prepare and inspect

Run from the web repository after the final build:

```sh
npm run build
python3 ops/deploy.py --release 20260907-v1
```

The default invocation validates **locally only**. It prints artifact count, size and the index hash. It does not connect to the server or modify a deployment. Release identifiers must be unique; reusing an existing release directory is rejected.

## Deploy after the start signal

```sh
python3 ops/deploy.py --release 20260907-v1 --ssh-host m4dreambau --apply
```

The script saves the current Deployment and Bildungshaus Ingress, freezes the `dist` files, verifies every uploaded checksum, checks nginx syntax in the current image, and performs server-side Kubernetes dry runs before updating the existing pod template. It leaves the original homepage ConfigMap intact. The new Ingress is applied after the rollout becomes ready.

Each release keeps its backup, checksums, applied template and configuration under `/root/releases/bildungshaus/<release>`. Local release evidence is under `output/deploy/<release>`. No domain or DNS change is needed.

## Public acceptance

- Open `/bildungshaus/` in a fresh browser; check the thesis, scrolling and all problem-detail levels.
- Open the whitepaper and a synthesis; check their fetched contents and source links.
- Check desktop/mobile, keyboard access, reduced motion and browser errors.
- Check that `/bildungshaus` redirects to the correct public HTTPS URL, without port 8080.
- Check apex phrase sequence, byte-identical Matrix Discovery, Testmails login HTTP 200 and protected API HTTP 401.
- Missing static assets must return 404, not a successful HTML page.

A ready pod does not complete this acceptance.

## Rollback

```sh
python3 ops/rollback.py --release 20260907-v1 --ssh-host m4dreambau
python3 ops/rollback.py --release 20260907-v1 --ssh-host m4dreambau --apply
```

The first invocation is a read-only drift check. The second restores only the saved homepage pod template and the separate Bildungshaus Ingress. Later template or route changes cause an explicit stop instead of being overwritten. Existing static release files and ConfigMaps are retained for inspection; no shared route, secret or database is deleted.

If a failed deployment did not create its applied-template snapshot, inspect the saved backup before acting. Do not use broad cluster cleanup as a recovery action.
