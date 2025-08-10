const http = require('http');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const PORT = 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.pdf': 'application/pdf'
};

const server = http.createServer(async (req, res) => {
    try {
        // Parse URL and remove query string
        let filePath = decodeURIComponent(req.url.split('?')[0]);
        
        // Default to index.html for root
        if (filePath === '/') {
            filePath = '/index.html';
        }
        
        // Handle directory requests
        if (filePath.endsWith('/') && filePath !== '/') {
            filePath += 'index.html';
        }
        
        const fullPath = path.join(__dirname, filePath);
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        
        // Security check - prevent directory traversal
        if (!fullPath.startsWith(__dirname)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Access denied');
            return;
        }
        
        // Set common headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Handle OPTIONS requests (CORS preflight)
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }
        
        // Only allow GET and HEAD methods
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method not allowed');
            return;
        }
        
        // Check if file exists
        let stats;
        try {
            stats = await fs.stat(fullPath);
        } catch (error) {
            // Try index.html in subdirectory
            if (error.code === 'ENOENT') {
                const indexPath = path.join(fullPath, 'index.html');
                try {
                    stats = await fs.stat(indexPath);
                    const content = await fs.readFile(indexPath);
                    res.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8',
                        'Content-Length': content.length
                    });
                    res.end(content);
                    return;
                } catch {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found: ' + filePath);
                    return;
                }
            }
            throw error;
        }
        
        // If it's a directory, try to serve index.html
        if (stats.isDirectory()) {
            const indexPath = path.join(fullPath, 'index.html');
            try {
                const content = await fs.readFile(indexPath);
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Content-Length': content.length
                });
                res.end(content);
                return;
            } catch {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Directory listing not allowed');
                return;
            }
        }
        
        // Serve the file
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        // For large files, use streaming
        if (stats.size > 1024 * 1024) { // 1MB
            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': stats.size,
                'Cache-Control': 'public, max-age=3600'
            });
            
            const stream = fsSync.createReadStream(fullPath);
            stream.pipe(res);
            
            stream.on('error', (error) => {
                console.error('Stream error:', error);
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Server Error');
                }
            });
        } else {
            // For small files, read into memory
            const content = await fs.readFile(fullPath);
            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': content.length,
                'Cache-Control': 'public, max-age=3600'
            });
            res.end(content);
        }
        
    } catch (error) {
        console.error('Server error:', error);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please try a different port or stop the other server.`);
    } else {
        console.error('❌ Server Error:', err.message);
    }
    process.exit(1);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n⏹️  Server shutting down...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

// Start the server
server.listen(PORT, '127.0.0.1', () => {
    console.log(`\n🚀 Craft Furniture Server Running!`);
    console.log(`📍 URL: http://127.0.0.1:${PORT}`);
    console.log(`🌐 Alternative: http://localhost:${PORT}`);
    console.log(`\n⏹️  Press Ctrl+C to stop\n`);
});