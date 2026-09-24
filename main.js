const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const vm = require('vm');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.htm': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

// Doc toan bo config.js de tra ve cho /api/config theo chu ky 2s cua layout4.js
function getFullConfig() {
    try {
        const configContent = fs.readFileSync(path.join(ROOT_DIR, 'config.js'), 'utf8');
        return vm.runInNewContext(configContent + '\n CONFIG;');
    } catch (e) {
        console.error('Loi khi parse config.js:', e);
        return {};
    }
}

// Doc API key weather tu config.js neu co
function getApiKey() {
    const config = getFullConfig();
    return (config.WIDGET_WEATHER && config.WIDGET_WEATHER.apiKey) || '68901924b9374df4819145817261807';
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // CORS Preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // Dynamic API Routes
    if (pathname === '/api/config') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end(JSON.stringify(getFullConfig()));
    }

    // Proxy Lanyard API — bypass CORS cho Discord user presence
    if (pathname.startsWith('/api/lanyard/')) {
        const userId = pathname.replace('/api/lanyard/', '').split('/')[0];
        const lanyardUrl = `https://api.lanyard.rest/v1/users/${userId}`;
        https.get(lanyardUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (apiRes) => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                res.writeHead(apiRes.statusCode, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            });
        }).on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });
        return;
    }

    if (pathname === '/api/weather') {
        const location = parsedUrl.query.q || 'Saigon';
        const apiKey = getApiKey();
        const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=1`;

        https.get(weatherUrl, (apiRes) => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(data);
            });
        }).on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });
        return;
    }

    // Default to index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.normalize(path.join(ROOT_DIR, pathname));

    // Security check to prevent Directory Traversal
    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
            return res.end('<h1>404 Not Found</h1>');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Support HTTP Range Requests for MP3 audio streaming
        if (req.headers.range && (ext === '.mp3' || ext === '.wav' || ext === '.ogg')) {
            const range = req.headers.range;
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
            const chunksize = (end - start) + 1;

            const stream = fs.createReadStream(filePath, { start, end });
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': contentType,
            });
            stream.pipe(res);
            return;
        }

        // Standard File Streaming
        res.writeHead(200, {
            'Content-Length': stats.size,
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes'
        });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('\n==================================================');
    console.log(` Web Server is running on: http://0.0.0.0:${PORT}`);
    console.log(' Webay khong can Laragon / PHP nua!');
    console.log('==================================================\n');
});
