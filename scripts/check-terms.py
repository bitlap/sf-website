"""Check generated bilingual terms, links and document structure."""
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(ROOT/'scripts/build-terms.py'),'--check'],check=True)
for name in ['index.html','zh-CN.html','en.html']:
    path=ROOT/'terms'/name;page=path.read_text()
    assert '<script' not in page and '<form' not in page
    ids=re.findall(r'\bid="([^"]+)"',page);assert len(ids)==len(set(ids))
    for link in re.findall(r'(?:href|src)="([^"]+)"',page):
        uri=urlsplit(link)
        if uri.scheme or uri.netloc:continue
        target=(path.parent/unquote(uri.path)).resolve() if uri.path else path
        if target.is_dir():target=target/'index.html'
        assert target.is_relative_to(ROOT) and target.exists(),link
        if uri.fragment:assert 'id="'+uri.fragment+'"' in target.read_text(),link
    if name!='index.html':
        policy=json.loads((ROOT/'policies'/('terms-'+name.replace('.html','.json'))).read_text())
        for section in policy['sections']:
            for paragraph in section['paragraphs']:assert paragraph in page
print('PASS: bilingual service terms, full paragraphs, public links and anchors')
