"""Generate public bilingual service terms using the shared legal-page frame."""
import html
import json
import runpy
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
frame = runpy.run_path(str(ROOT / 'scripts/build-privacy.py'))['frame']
frame.__globals__['BASE'] = 'https://dreamylost.com/terms/'
outputs = {}
policies = {lang: json.loads((ROOT / f'policies/terms-{lang}.json').read_text()) for lang in ['zh-CN', 'en']}
assert [(s['id'],len(s['paragraphs'])) for s in policies['zh-CN']['sections']] == [(s['id'],len(s['paragraphs'])) for s in policies['en']['sections']]
for lang,p in policies.items():
    title = '服务条款' if lang == 'zh-CN' else 'Terms of service'
    toc = ''.join(f'<li><a href="#{s["id"]}">{html.escape(s["title"])}</a></li>' for s in p['sections'])
    sections = ''.join(f'<section><h2 id="{s["id"]}">{html.escape(s["title"])}</h2>'+''.join(f'<p>{text}</p>' for text in s['paragraphs'])+'</section>' for s in p['sections'])
    content = f'<div class="policy-hero section-wrap"><h1>{title}</h1><p>{p["updated"]} · 简体中文 / English</p></div><div class="policy-layout section-wrap"><aside class="policy-toc"><div class="policy-toc-desktop"><p>{'On this page' if lang == 'en' else '本页目录'}</p><nav aria-label="{'Terms contents' if lang == 'en' else '条款目录'}"><ol>{toc}</ol></nav></div><details class="policy-toc-mobile"><summary>{'On this page' if lang == 'en' else '本页目录'}<span aria-hidden="true">＋</span></summary><nav aria-label="{'Terms contents' if lang == 'en' else '条款目录'}"><ol>{toc}</ol></nav></details></aside><article class="policy-document">{sections}</article></div>'
    page = frame(lang,title,content,lang+'.html')
    page = page.replace('Read how SnapFlow handles your information and how to contact us about privacy.', 'Read the rules for SnapFlow accounts, public browsing, content and sharing.').replace('了解幻兔如何处理账号、照片、内容、推荐、消息及天气定位信息，以及如何提出隐私请求。','了解幻兔的账号、游客浏览、内容发布和相册分享规则。')
    page = page.replace('<a href="index.html">Privacy policy</a>','<a href="../privacy/en.html">Privacy policy</a>').replace('<a href="index.html">隐私政策</a>','<a href="../privacy/zh-CN.html">隐私政策</a>')
    outputs[lang+'.html']=page
content='<section class="policy-selector section-wrap"><h1>服务条款<span lang="en">Terms of service</span></h1><div class="policy-language-cards"><a href="zh-CN.html">简体中文 · 阅读服务条款</a><a href="en.html" lang="en">English · Read terms</a></div><p><a href="../privacy/">隐私政策 / Privacy Policy</a></p></section>'
outputs['index.html']=frame('zh-CN','服务条款 / Terms of service',content).replace('了解幻兔如何处理账号、照片、内容、推荐、消息及天气定位信息，以及如何提出隐私请求。','了解幻兔的账号、游客浏览、内容发布和相册分享规则。').replace('<a href="index.html">隐私政策</a>','<a href="../privacy/">隐私政策</a>')
for name,page in outputs.items():
    path=ROOT/'terms'/name
    if '--check' in sys.argv:
        assert path.exists() and path.read_text() == page, f'Regenerate terms/{name}'
    else:
        path.parent.mkdir(exist_ok=True);path.write_text(page)
print('Built three bilingual terms pages')
