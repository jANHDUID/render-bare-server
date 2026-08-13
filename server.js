import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'node:http';

const PORT = process.env.PORT || 8080;
const bareServer = createBareServer('/bare/');

const server = http.createServer();

server.on('request', (req, res) => {
    // Add full CORS support for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            service: 'Render Node.js Bare Server',
            endpoint: '/bare/'
        }, null, 2));
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen(PORT, () => {
    console.log(`Render Bare Server running on port ${PORT}`);
});
