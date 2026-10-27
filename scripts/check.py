"""Check local references, fragment targets, IDs, and external-link isolation."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.refs, self.errors = path, set(), [], []
        self.h1 = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        identity = attrs.get('id')
        if identity:
            if identity in self.ids: self.errors.append(f'duplicate id: {identity}')
            self.ids.add(identity)
        if tag == 'h1': self.h1 += 1
        for key in ('src', 'href'):
            if attrs.get(key): self.refs.append(attrs[key])
        if tag == 'a' and attrs.get('target') == '_blank':
            if 'noopener' not in attrs.get('rel', '').split():
                self.errors.append('external new-tab link missing noopener')
pages = {}
for path in ROOT.glob('*.html'):
    page = Page(path)
    page.feed(path.read_text(encoding='utf-8-sig'))
    pages[path.resolve()] = page
errors = []
for path, page in pages.items():
    errors.extend(f'{path.name}: {e}' for e in page.errors)
    if page.h1 != 1: errors.append(f'{path.name}: expected one h1')
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc: continue
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        if not target.is_relative_to(ROOT): errors.append(f'{path.name}: reference outside project: {ref}')
        elif not target.is_file(): errors.append(f'{path.name}: missing file: {ref}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{path.name}: missing fragment: {ref}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Checked {len(pages)} pages: local references, fragments, IDs, and external links passed.')
