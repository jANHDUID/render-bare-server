import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'node:http';
import https from 'node:https';

const PORT = process.env.PORT || 8080;

const agentOptions = {
    keepAlive: false,
    maxSockets: Infinity,
    maxFreeSockets: 256
};

const httpAgent = new http.Agent(agentOptions);
const httpsAgent = new https.Agent(agentOptions);

const bareServer = createBareServer('/bare/', {
    logErrors: true,
    httpAgent,
    httpsAgent,
});

const server = http.createServer();

server.on('request', (req, res) => {
    // Add complete CORS headers to all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', '*');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
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
