import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {siteConfig} from '../site-config.js';
import {en} from '../locales/en.js';
for(const file of ['index.html','support.html','404.html']){
 const html=await readFile(file,'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,`${file}: duplicate IDs`);
 for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  const value=match[1];if(/^(?:https?:|mailto:|data:)/.test(value))continue;
  const [name,anchor]=value.split('#');
  if(name){await access(name.split('?')[0]);if(anchor&&name.endsWith('.html')){const target=await readFile(name,'utf8');assert(target.includes(`id="${anchor}"`),`${file}: missing ${value}`)}}
  else if(anchor)assert(ids.includes(anchor),`${file}: missing #${anchor}`);
 }
 assert(html.includes('rel="canonical"'),`${file}: missing canonical URL`);
 assert(html.includes('id="language-select"'),`${file}: missing language control`);
 assert(!html.includes('官网 UI 预览'),`${file}: preview copy leaked`);
}
for(const platform of Object.values(siteConfig.platforms)){
 if(platform.url)assert(new URL(platform.url).protocol==='https:','Download links must use HTTPS');
 if(platform.qrImage)await access(platform.qrImage);
}
assert.equal((await readFile('CNAME','utf8')).trim(),new URL(siteConfig.origin).hostname);
assert(Object.keys(en).length>140,'Incomplete English dictionary');
console.log('All pages, local links, anchors, configuration, and locale checks passed.');
