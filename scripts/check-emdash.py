#!/usr/bin/env python3
"""Guard: fail if any tracked file contains a U+2014 em-dash."""
import sys, os, glob

PATTERNS = ['**/*.html', '**/*.css', '**/*.js']
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCLUDE = ['.git', 'node_modules', 'assets/vendor']

hits = []
for pat in PATTERNS:
    for path in glob.glob(os.path.join(ROOT, pat), recursive=True):
        if any(ex in path for ex in EXCLUDE):
            continue
        try:
            text = open(path, encoding='utf-8').read()
            if '—' in text:
                hits.append(path)
        except Exception:
            pass

if hits:
    print('Em-dash found in:')
    for h in hits:
        print(' ', os.path.relpath(h, ROOT))
    sys.exit(1)
else:
    print('No em-dashes found.')
