/**
 * Simple server startup script for Windows
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = 'localhost';

// MIME types
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

function serveFile(res, filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <body style="font-family: Arial; text-align: center; padding: 50px;">
                        <h1>404 - File Not Found</h1>
                        <p>The requested file was not found: ${filePath}</p>
                        <a href="/">Back to Home</a>
                    </body>
                </html>
            `);
            return;
        }

        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const indexPath = path.join(filePath, 'index.html');
            if (fs.existsSync(indexPath)) {
                serveFile(res, indexPath);
                return;
            } else {
                // Directory listing
                const files = fs.readdirSync(filePath);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <body style="font-family: Arial; padding: 20px;">
                            <h1>Directory: ${filePath}</h1>
                            <ul>
                                ${files.map(file => `
                                    <li><a href="${path.join(path.dirname(filePath), file)}">${file}</a></li>
                                `).join('')}
                            </ul>
                        </body>
                    </html>
                `);
                return;
            }
        }

        const content = fs.readFileSync(filePath);
        const contentType = getContentType(filePath);

        res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': contentType.includes('html') ? 'no-cache' : 'public, max-age=3600'
        });
        res.end(content);

        console.log(`✅ ${new Date().toLocaleTimeString()} - Served: ${filePath}`);
    } catch (error) {
        console.error(`❌ Error serving ${filePath}:`, error.message);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <body style="font-family: Arial; text-align: center; padding: 50px;">
                    <h1>500 - Server Error</h1>
                    <p>Error: ${error.message}</p>
                    <a href="/">Back to Home</a>
                </body>
            </html>
        `);
    }
}

const server = http.createServer((req, res) => {
    let filePath = decodeURIComponent(req.url.split('?')[0]);
    
    // Security: prevent directory traversal
    filePath = filePath.replace(/\.\./g, '');
    
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    const fullPath = path.join(__dirname, filePath);
    
    console.log(`📥 ${new Date().toLocaleTimeString()} - Request: ${req.url} -> ${fullPath}`);
    
    serveFile(res, fullPath);
});

server.listen(PORT, HOST, () => {
    console.log('\n🚀 Craft Furniture Local Server Started!');
    console.log('=========================================');
    console.log(`✅ Server running at: http://${HOST}:${PORT}`);
    console.log(`📱 Network access: http://localhost:${PORT}`);
    console.log('\n📋 Available Pages:');
    console.log('  • http://localhost:3000/ - トップページ');
    console.log('  • http://localhost:3000/works/ - 施工事例');
    console.log('  • http://localhost:3000/craftsmen/ - 職人紹介');
    console.log('  • http://localhost:3000/simulator/ - 見積もり');
    console.log('  • http://localhost:3000/showroom/ - ショールーム');
    console.log('  • http://localhost:3000/news/ - お知らせ');
    console.log('\n🔧 Press Ctrl+C to stop server');
    console.log('=========================================\n');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.log('💡 Try these solutions:');
        console.log('   1. Close other applications using port 3000');
        console.log('   2. Wait a moment and try again');
        console.log('   3. Restart your computer');
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});