const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080; // Different port

const server = http.createServer((req, res) => {
    console.log('Request:', req.url);
    
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Handle directory requests
    if (filePath.endsWith('/') && filePath !== '/') {
        filePath += 'index.html';
    }
    
    filePath = path.join(__dirname, filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        // If file doesn't exist, try adding index.html for directories
        const indexPath = path.join(filePath, 'index.html');
        if (fs.existsSync(indexPath)) {
            filePath = indexPath;
        } else {
            console.log('File not found:', filePath);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                <head><title>404 - Not Found</title></head>
                <body style="font-family: Arial; text-align: center; padding: 50px;">
                    <h1>404 - Page Not Found</h1>
                    <p>The requested page could not be found.</p>
                    <a href="/">← Back to Home</a>
                </body>
                </html>
            `);
            return;
        }
    }
    
    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/html; charset=utf-8';
    
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };
    
    if (mimeTypes[ext]) {
        contentType = mimeTypes[ext];
    }
    
    try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
        console.log(`✅ Served: ${filePath}`);
    } catch (error) {
        console.error('Error reading file:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
            <head><title>500 - Server Error</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1>500 - Server Error</h1>
                <p>Error reading file: ${error.message}</p>
                <a href="/">← Back to Home</a>
            </body>
            </html>
        `);
    }
});

server.listen(PORT, 'localhost', () => {
    console.log('\n🚀 Craft Furniture Server Started!');
    console.log('===================================');
    console.log(`✅ Server URL: http://localhost:${PORT}`);
    console.log(`📁 Directory: ${__dirname}`);
    console.log('\n📋 Available Pages:');
    console.log(`  • http://localhost:${PORT}/ - トップページ`);
    console.log(`  • http://localhost:${PORT}/works/ - 施工事例`);
    console.log(`  • http://localhost:${PORT}/craftsmen/ - 職人紹介`);
    console.log(`  • http://localhost:${PORT}/simulator/ - 見積もり`);
    console.log(`  • http://localhost:${PORT}/showroom/ - ショールーム`);
    console.log('\n🔧 Press Ctrl+C to stop');
    console.log('===================================\n');
});

server.on('error', (err) => {
    console.error('❌ Server Error:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.log(`💡 Port ${PORT} is in use. Try a different port.`);
    }
});