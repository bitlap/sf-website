import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const check=process.argv.includes('--check');
const digest=async file=>createHash('sha256').update(await readFile(file)).digest('hex').slice(0,12);
async function update(file,transform){
 const source=await readFile(file,'utf8'),result=await transform(source);
 if(check)assert.equal(source,result,`${file}: asset versions are stale; run npm run assets:version`);
 else if(source!==result)await writeFile(file,result);
}
// Version the dependency chain as well as the entrypoint; cached imports cannot outlive their release.
const localeVersion=await digest('locales/en.js');
await update('i18n.js',source=>source.replace(/from '\.\/locales\/en\.js(?:\?v=[a-f0-9]+)?'/,`from './locales/en.js?v=${localeVersion}'`));
const languageVersion=await digest('i18n.js'),configVersion=await digest('site-config.js');
await update('app.js',source=>source
 .replace(/from '\.\/i18n\.js(?:\?v=[a-f0-9]+)?'/,`from './i18n.js?v=${languageVersion}'`)
 .replace(/from '\.\/site-config\.js(?:\?v=[a-f0-9]+)?'/,`from './site-config.js?v=${configVersion}'`));
const versions={};
for(const file of ['app.js','styles.css','about.css'])versions[file]=await digest(file);
for(const file of ['index.html','about.html','support.html','404.html'])await update(file,source=>source.replace(/((?:href|src)="(?:https:\/\/dreamylost\.com\/)?)(app\.js|styles\.css|about\.css)(?:\?v=[a-f0-9]+)?(")/g,(_,prefix,name,suffix)=>`${prefix}${name}?v=${versions[name]}${suffix}`));
console.log(check?'Asset versions are current.':'Updated content-based asset versions.');
