import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'node:http';

const bareServer = createBareServer('/bare/');
const server = http.createServer((req, res) => {
    console.log('REQ URL:', req.url, 'SHOULD ROUTE:', bareServer.shouldRoute(req));
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(9876, async () => {
    const res = await fetch('http://localhost:9876/bare/');
    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log('BODY:', text);
    server.close();
});
