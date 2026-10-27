import http from 'node:http';
import { readFileSync } from 'node:fs';
const page = new URL('../mockup/index.html', import.meta.url);
http.createServer((req, res) => {
  if (req.url !== '/' && req.url !== '/index.html') {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(readFileSync(page));
}).listen(8768, '127.0.0.1', () => console.log('http://127.0.0.1:8768'));
