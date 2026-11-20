"""Render the complete bilingual App policy without JavaScript or browser storage."""
import argparse
import html
import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://dreamylost.com/privacy/'
LANGUAGES = {'zh-CN': '简体中文', 'en': 'English'}


def frame(lang, title, content, filename=''):
    english = lang == 'en'
    nav = [('Features', 'features'), ('Explore', 'explore'), ('Download', 'download'), ('FAQ', 'faq')] if english else [('产品功能', 'features'), ('灵感探索', 'explore'), ('下载应用', 'download'), ('常见问题', 'faq')]
    navlinks = ''.join(f'<a href="../index.html{"?lang=en" if english else ""}#{anchor}">{label}</a>' for label, anchor in nav)
    locales = ''.join(f'<a href="{code}.html" lang="{code}" hreflang="{code}"'+(' aria-current="page"' if code == lang and filename else '')+f'>{label}</a>' for code, label in LANGUAGES.items())
    description = 'Read how SnapFlow handles your information and how to contact us about privacy.' if english else '了解幻兔如何处理账号、照片、内容、推荐、消息及天气定位信息，以及如何提出隐私请求。'
    return f'''<!doctype html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f8faf8">
  <title>{html.escape(title)} · SnapFlow 幻兔</title><meta name="description" content="{description}">
  <link rel="canonical" href="{BASE}{filename}">
  <link rel="alternate" hreflang="zh-CN" href="{BASE}zh-CN.html"><link rel="alternate" hreflang="en" href="{BASE}en.html"><link rel="alternate" hreflang="x-default" href="{BASE}">
  <meta property="og:type" content="website"><meta property="og:title" content="{html.escape(title)} · SnapFlow"><meta property="og:description" content="{description}"><meta property="og:url" content="{BASE}{filename}"><meta property="og:image" content="https://dreamylost.com/assets/social-cover.jpg">
  <link rel="icon" type="image/png" href="../assets/logo.png"><link rel="apple-touch-icon" href="../assets/logo.png"><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../privacy.css">
</head>
<body class="policy-page">
<a class="skip-link" href="#policy">{'Skip to policy' if english else '跳至政策正文'}</a>
<header class="header"><a class="brand" href="../index.html{'?lang=en' if english else ''}"><img src="../assets/logo.png" width="42" height="42" alt=""><strong>SnapFlow<span>幻兔</span></strong></a><nav class="desktop-nav" aria-label="{'Main navigation' if english else '主导航'}">{navlinks}</nav><nav class="policy-languages" aria-label="语言 / Language">{locales}</nav><details class="policy-mobile-menu"><summary aria-label="{'Open menu' if english else '展开菜单'}"><span></span><span></span><span></span></summary><nav>{navlinks}</nav></details></header>
<main id="policy">{content}</main>
<footer class="footer section-wrap"><div class="footer-top"><a class="brand" href="../index.html"><img src="../assets/logo.png" width="33" height="33" alt=""><strong>SnapFlow<span>幻兔</span></strong></a><p>{'Save the moment. Discover more.' if english else '记录此刻，发现更多。'}</p><a href="index.html">{'Privacy policy' if english else '隐私政策'}</a><a href="../support.html{'?lang=en' if english else ''}">{'Help & support' if english else '帮助与支持'}</a></div><div class="footer-bottom"><span>© {date.today().year} SnapFlow 幻兔</span><a href="mailto:dreamylost@outlook.com">dreamylost@outlook.com</a></div></footer>
</body></html>
'''


def render():
    policies = {code: json.loads((ROOT / 'policies' / f'{code}.json').read_text()) for code in LANGUAGES}
    baseline = [(s['id'], len(s['paragraphs'])) for s in policies['zh-CN']['sections']]
    outputs = {}
    for code, policy in policies.items():
        assert policy['language'] == code
        assert [(s['id'], len(s['paragraphs'])) for s in policy['sections']] == baseline
        assert len({s['id'] for s in policy['sections']}) == 12
        english = code == 'en'
        title = 'Privacy policy' if english else '隐私政策'
        updated = 'Last updated: November 20, 2026' if english else '最近更新：2026年11月20日'
        lead = 'A clear look at the information behind your everyday moments.' if english else '关于你的信息，我们希望说得清楚、透明。'
        toc = ''.join(f'<li><a href="#{s["id"]}">{html.escape(s["title"])}</a></li>' for s in policy['sections'])
        sections = ''.join(f'<section aria-labelledby="{s["id"]}"><h2 id="{s["id"]}">{html.escape(s["title"])}</h2>'+''.join(f'<p>{p}</p>' for p in s['paragraphs'])+'</section>' for s in policy['sections'])
        contact_title = 'Your privacy, your questions.' if english else '关于隐私，随时联系我们。'
        contact_text = 'For access, correction, or deletion requests, email the developer.' if english else '访问、更正或删除请求，请通过邮件联系开发者。'
        content = f'''<div class="policy-hero section-wrap"><a class="policy-breadcrumb" href="index.html">{'Legal & privacy' if english else '法律与隐私'}</a><h1>{title}<span class="policy-title-mark">✳</span></h1><p class="policy-lead">{lead}</p><div class="policy-meta"><span>{updated}</span><span>{LANGUAGES[code]}</span></div></div><div class="policy-layout section-wrap"><aside class="policy-toc"><div class="policy-toc-desktop"><p>{'On this page' if english else '本页目录'}</p><nav aria-label="{'Policy contents' if english else '政策目录'}"><ol>{toc}</ol></nav></div><details class="policy-toc-mobile"><summary>{'On this page' if english else '本页目录'}<span aria-hidden="true">＋</span></summary><nav aria-label="{'Policy contents' if english else '政策目录'}"><ol>{toc}</ol></nav></details><a class="policy-contact" href="mailto:dreamylost@outlook.com">{'Contact us' if english else '联系开发者'} <span>✧</span></a></aside><article class="policy-document">{sections}<div class="policy-contact-panel"><span>✧</span><h2>{contact_title}</h2><p>{contact_text}</p><a href="mailto:dreamylost@outlook.com">dreamylost@outlook.com</a></div></article></div>'''
        outputs[f'{code}.html'] = frame(code, title, content, f'{code}.html')
    content = '''<section class="policy-selector section-wrap"><span class="policy-emblem" aria-hidden="true">✳</span><p class="eyebrow">法律与隐私 / LEGAL & PRIVACY</p><h1>隐私，从透明开始。<span lang="en">Privacy starts with clarity.</span></h1><p class="policy-selector-intro">了解幻兔如何处理你的信息，以及如何联系我们提出隐私请求。<span lang="en">Learn how SnapFlow handles your information and how to contact us about your privacy.</span></p><div class="policy-language-cards"><a href="zh-CN.html" lang="zh-CN"><span class="language-symbol">中</span><span><small>简体中文</small><strong>阅读隐私政策</strong></span><span class="language-card-mark">✧</span></a><a href="en.html" lang="en"><span class="language-symbol">En</span><span><small>ENGLISH</small><strong>Read the privacy policy</strong></span><span class="language-card-mark">✧</span></a></div><p class="policy-selector-date">最近更新：2026年11月20日 · Last updated: November 20, 2026</p><p class="policy-page-note">政策页面不使用 Cookie 或本地存储记录语言偏好。<br><span lang="en">Policy pages do not store language preferences in cookies or local storage.</span></p></section>'''
    outputs['index.html'] = frame('zh-CN', '隐私政策 / Privacy policy', content)
    return outputs


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    for filename, content in render().items():
        target = ROOT / 'privacy' / filename
        if args.check:
            assert target.exists() and target.read_text() == content, f'Regenerate privacy/{filename}'
        else:
            target.parent.mkdir(exist_ok=True)
            target.write_text(content)
    print('Privacy pages are current' if args.check else 'Built three themed privacy pages')
