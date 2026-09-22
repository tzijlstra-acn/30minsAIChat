#!/usr/bin/env python3
"""V8 copy linter: flags em dashes, hard conclusions, and superlatives in client-facing strings."""
import sys, os, re, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATTERNS = ['**/*.html', '**/*.js']
EXCLUDE = ['.git', 'node_modules', 'assets/vendor', 'assets/team', 'scripts/']

EM_DASH = '—'
BANNED = {
    'must', 'will', 'always', 'never', 'guarantee', 'guaranteed',
    'best', 'highest', 'lowest', 'fastest', 'revolutionary',
    'game-changing', 'conquer', 'world-class', 'disruptive'
}
REVIEW = {'will', 'must', 'never', 'always'}

hits = []

def check_file(path):
    rel = os.path.relpath(path, ROOT)
    if any(ex in rel.replace('\\', '/') for ex in EXCLUDE):
        return
    try:
        lines = open(path, encoding='utf-8').readlines()
    except Exception:
        return
    for i, line in enumerate(lines, 1):
        # Em dash check
        if EM_DASH in line:
            hits.append((rel, i, 'em-dash', line.rstrip()))
        # Exclamation mark in non-comment, non-code lines
        if '!' in line and not re.match(r'\s*(//|<!--|/\*)', line):
            # Only flag if in a text string (between quotes)
            for m in re.finditer(r'["\']([^"\']*![^"\']*)["\']', line):
                hits.append((rel, i, 'exclamation-in-string', m.group(0)[:80]))
        # Banned terms (only in quoted strings or HTML text)
        for m in re.finditer(r'["\']([^"\']{0,200})["\']|>([^<]{1,200})<', line):
            text = (m.group(1) or m.group(2) or '').lower()
            for term in BANNED:
                if re.search(r'\b'+re.escape(term)+r'\b', text):
                    # Allow inline suppression: # lint-ok
                    if 'lint-ok' not in line:
                        hits.append((rel, i, 'review:'+term, line.strip()[:100]))

if hits or True:
    for pat in PATTERNS:
        for path in glob.glob(os.path.join(ROOT, pat), recursive=True):
            check_file(path)

if hits:
    print(f'Copy lint: {len(hits)} item(s) to review')
    for rel, ln, kind, ctx in hits[:40]:
        print(f'  {rel}:{ln} [{kind}] {ctx}')
    if len(hits) > 40:
        print(f'  ... and {len(hits)-40} more')
    sys.exit(1)
else:
    print('Copy lint: no issues found.')
