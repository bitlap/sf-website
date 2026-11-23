import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {siteConfig} from '../site-config.js';
import {en} from '../locales/en.js';
for(const file of ['index.html','about.html','support.html','404.html']){
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
for(const file of ['index.html','about.html','support.html','404.html']){
 const html=await readFile(file,'utf8');
 const text=html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'');
 const messages=[...text.split(/<[^>]*>/),...[...html.matchAll(/(?:alt|aria-label|placeholder)="([^"]+)"/g)].map(m=>m[1])];
 for(const raw of messages){const message=raw.trim();if(/[\u4e00-\u9fff]/.test(message))assert(Object.hasOwn(en,message),`${file}: missing English translation: ${message}`);}
}
for(const file of ['index.html','about.html','support.html','404.html','app.js','site-config.js','locales/en.js']){
 const source=await readFile(file,'utf8');
 assert(!source.includes('github.com/bitlap'),`${file}: repository link exposed in public website`);
 assert(!source.includes('GitHub'),`${file}: obsolete GitHub feedback copy`);
}
const about=await readFile('about.html','utf8');
for(const removed of ['uni-app','Qwen3','Transformers','>ViT<','Spark SQL'])assert(!about.includes(removed),`about.html: removed technology ${removed}`);
for(const id of ['downloads','photos','account','feedback','delete-account','support-search'])assert((await readFile('support.html','utf8')).includes(`id="${id}"`),`support.html: missing direct help route ${id}`);
const categoryImages=[...(await readFile('app.js','utf8')).matchAll(/image:'([^']+)'/g)].map(match=>match[1]);
assert.equal(categoryImages.length,4,'Each explore category needs an image');
assert.equal(new Set(categoryImages).size,4,'Explore categories must use distinct, relevant images');
for(const image of categoryImages)await access(`assets/${image}`);
console.log('All pages, local links, anchors, configuration, and locale checks passed.');
