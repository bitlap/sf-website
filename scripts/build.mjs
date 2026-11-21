import {cp,mkdir,rm} from 'node:fs/promises';
const files=['index.html','support.html','404.html','styles.css','app.js','i18n.js','site-config.js','locales','assets','CNAME','robots.txt','sitemap.xml','privacy','terms','privacy.css','.nojekyll'];
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of files)await cp(file,`dist/${file}`,{recursive:true});
console.log('Static site ready in dist/');
