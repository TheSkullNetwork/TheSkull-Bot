const http = require('http');
const { INFO } = require('../emojis');
const { db } = require('../database/database');

function startStatsServer() {
    const port = Number(process.env.STATS_PORT) || 8788;
    const host = process.env.STATS_HOST || '0.0.0.0';

    const server = http.createServer((req, res) => {
        const route = (req.url || '/').split('?')[0];
        if (route !== '/stats') {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
            return;
        }
        const profileCount = db.prepare('SELECT COUNT(*) AS c FROM profiles').get().c;
        const skullboardCount = db.prepare('SELECT COUNT(*) AS c FROM skullboard').get().c;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ profileCount, skullboardCount }));
    });

    server.listen(port, host, () => {
        console.log(`${INFO} Stats endpoint listening on http://${host}:${port}/stats`);
    });

    return server;
}

module.exports = { startStatsServer };
