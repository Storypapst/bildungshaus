#!/usr/bin/env python3
"""Check local Markdown and Obsidian link resolution in a supplied Core.

External URLs are counted, not fetched. The archive is intentionally excluded.
No source files are modified.
"""
import argparse
import json
from pathlib import Path
import re
from urllib.parse import unquote

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--core', required=True, type=Path)
args = parser.parse_args()
root = args.core.resolve(strict=True)
files = [p for p in root.rglob('*') if p.is_file() and '90 - Archive' not in p.relative_to(root).parts]
markdown = [p for p in files if p.suffix == '.md']
lookup = {}
for p in files:
    lookup.setdefault(p.stem, set()).add(p)
    lookup.setdefault(p.name, set()).add(p)
issues, internal, external = [], 0, 0
for p in markdown:
    text = re.sub(r'```.*?```', '', p.read_text(), flags=re.S)
    for target in re.findall(r'\[\[([^\]]+)\]\]', text):
        internal += 1
        target = target.split('|')[0].split('#')[0]
        if not target:
            continue
        if any(q.exists() for q in (root / target, p.parent / target,
                                    root / (target + '.md'), p.parent / (target + '.md'))):
            continue
        hits = lookup.get(target, set())
        if len(hits) != 1:
            issues.append({'file': str(p.relative_to(root)), 'target': target,
                           'error': 'ambiguous' if hits else 'missing'})
    for target in re.findall(r'(?<!!)\[[^\]]*\]\(([^\n]+?)\)', text):
        target = target.strip().strip('<>')
        if target.startswith(('http:', 'https:', 'mailto:', 'app:', 'codex:')):
            external += 1
            continue
        if target.startswith('#'):
            continue
        internal += 1
        target = unquote(target.split('#')[0])
        if not (p.parent / target).exists():
            issues.append({'file': str(p.relative_to(root)), 'target': target, 'error': 'missing'})
print(json.dumps({'markdown_files': len(markdown), 'internal_links': internal,
                  'external_links_not_fetched': external, 'issues': issues}, ensure_ascii=False, indent=2))
raise SystemExit(1 if issues else 0)
