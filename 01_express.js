// const http = require('http');
// const server = http.createServer();
// server.on('request', function (req, res) {
//     const url = req.url;
//     let content = '<h1>首页</h1>';
//     if (url == '/' || url == '/index.html')
//         content = '<h1>首页</h1>';
//     else if (url == '/about.html')
//         content = '<h1></h1>'
// })
// res.setHeader('Content-Type', 'text/html; charset=utf-8');
// res.end(content);
const { log } = require('console');
const http = require('http'); 
const server = http.createServer();

server.on('request', function(req, res) { 
    const url = req.url; 
    let content = '';

if (url === '/' || url === '/index.html') { content = '首页'; } 
else if (url === '/about.html') { content = '关于我们'; } 
else { content = '404 Not Found'; res.statusCode = 404; }
res.setHeader('Content-Type', 'text/html; charset=utf-8');
 res.end(content); });
 server.listen(80,()=>{
    console.log('server running at http://127.0.0.1');
 })