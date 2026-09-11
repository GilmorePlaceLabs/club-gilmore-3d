import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {availabilityMiddleware} from './availability.mjs';

const root=resolve('dist');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.svg':'image/svg+xml','.glb':'model/gltf-binary'};
createServer((req,res)=>{
 availabilityMiddleware(req,res,async()=>{
  try {
   if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
   const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   const file=resolve(root,`.${path==='/'?'/index.html':path}`);
   if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return;}
   const content=await readFile(file);
   res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');
   res.end(req.method==='HEAD'?undefined:content);
  } catch {res.writeHead(404);res.end('Not found');}
 });
}).listen(Number(process.env.PORT||4173),process.env.HOST||'127.0.0.1',()=>console.log('Club Gilmore viewer and availability server ready'));
