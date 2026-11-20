"""Check complete bilingual policy pages, local links, and script-free privacy pages."""
import importlib.util
import json
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('privacy_build',ROOT/'scripts/build-privacy.py')
build=importlib.util.module_from_spec(spec);spec.loader.exec_module(build)

class Page(HTMLParser):
    def __init__(self,strict=True):
        super().__init__(convert_charrefs=True)
        self.strict=strict
        self.ids=set();self.links=[];self.paragraphs=[];self.current=None;self.depth=0;self.language=None
    def handle_starttag(self,tag,attrs):
        data=dict(attrs)
        assert not self.strict or tag not in ('script','iframe','form'),f'Privacy page contains unexpected {tag}'
        assert not any(key.startswith('on') for key in data),'Inline handler in privacy page'
        if tag=='html':self.language=data.get('lang')
        if 'id' in data:
            assert data['id'] not in self.ids,'Duplicate ID'
            self.ids.add(data['id'])
        for attr in ('href','src'):
            if attr in data:self.links.append(data[attr])
        if tag=='link' and data.get('rel')=='stylesheet':assert not urlsplit(data['href']).scheme,'Remote stylesheet'

for filename,expected in build.render().items():
    path=ROOT/'privacy'/filename
    actual=path.read_text();assert actual==expected,f'Regenerate privacy/{filename}'
    page=Page();page.feed(actual)
    if filename!='index.html':
        code=filename.removesuffix('.html');policy=json.loads((ROOT/'policies'/f'{code}.json').read_text())
        assert len(policy['sections'])==12 and page.language==code
        effective=date.fromisoformat(policy['updated'])
        label=f'{effective.year}年{effective.month}月{effective.day}日' if code=='zh-CN' else f'{effective.strftime("%B")} {effective.day}, {effective.year}'
        assert label in actual and label in (ROOT/'privacy/index.html').read_text(), 'Policy date mismatch'
        for section in policy['sections']:
            assert section['id'] in page.ids
            for paragraph in section['paragraphs']:assert f'<p>{paragraph}</p>' in actual,'Policy text changed or omitted'
    for link in page.links:
        parsed=urlsplit(link)
        if parsed.scheme:
            assert parsed.scheme in ('https','mailto'),f'Unsafe link: {link}'
            continue
        target=(path.parent/unquote(parsed.path)).resolve() if parsed.path else path
        if target.is_dir():target=target/'index.html'
        assert target.is_file(),f'Broken privacy link: {filename}: {link}'
        if parsed.fragment:
            other=Page(strict=False);other.feed(target.read_text());assert parsed.fragment in other.ids,f'Missing anchor {link}'
assert 'https://dreamylost.com/privacy/' in (ROOT/'site-config.js').read_text()
for file in ['index.html','support.html','404.html','i18n.js','site-config.js']:
    assert 'bitlap.org/sf-app-privacy' not in (ROOT/file).read_text(),f'Old privacy URL in {file}'
print('PASS: all 12 sections and every paragraph in both languages; no scripts/forms; all privacy links valid')
