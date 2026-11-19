import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
  try {
    let requestPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file=path.resolve(root,'.'+requestPath);
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);
  } catch {
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}).end(await readFile(path.join(root,'404.html')).catch(()=>'<h1>404</h1>'));
  }
}).listen(4174,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4174'));
