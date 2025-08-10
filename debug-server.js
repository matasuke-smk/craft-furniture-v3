const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔍 Debug Information:');
console.log('- Node.js Version:', process.version);
console.log('- Platform:', process.platform);
console.log('- Current Directory:', __dirname);
console.log('- Network Interfaces:', Object.keys(os.networkInterfaces()));
console.log('');

const PORT = 8080;

// Test if we can bind to the port first
const testServer = http.createServer();

testServer.on('error', (err) => {
    console.error('❌ Port Test Failed:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.log('💡 Port 8080 is already in use. Trying port 3000...');
        startServer(3000);
    } else if (err.code === 'EACCES') {
        console.log('💡 Permission denied. Trying port 8000...');
        startServer(8000);
    } else {
        console.log('💡 Unknown error. Trying different approach...');
        startServer(9000);
    }
});

testServer.on('listening', () => {
    console.log('✅ Port test successful');
    testServer.close();
    startServer(PORT);
});

function startServer(port) {
    console.log(`🚀 Attempting to start server on port ${port}...`);
    
    const server = http.createServer((req, res) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Request: ${req.method} ${req.url}`);
        
        let filePath = req.url === '/' ? '/index.html' : req.url;
        
        if (filePath.endsWith('/') && filePath !== '/') {
            filePath += 'index.html';
        }
        
        filePath = path.join(__dirname, filePath);
        console.log(`[${timestamp}] Serving file: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            const indexPath = path.join(filePath, 'index.html');
            if (fs.existsSync(indexPath)) {
                filePath = indexPath;
            } else {
                console.log(`[${timestamp}] ❌ File not found: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <html>
                    <head><title>404 - Not Found</title></head>
                    <body style="font-family: Arial; text-align: center; padding: 50px;">
                        <h1>404 - Page Not Found</h1>
                        <p>File: ${filePath}</p>
                        <p>Current Directory: ${__dirname}</p>
                        <a href="/">← Back to Home</a>
                    </body>
                    </html>
                `);
                return;
            }
        }
        
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
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
            console.log(`[${timestamp}] ✅ Served: ${filePath} (${content.length} bytes)`);
        } catch (error) {
            console.error(`[${timestamp}] ❌ Error reading file:`, error.message);
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <html>
                <head><title>500 - Server Error</title></head>
                <body style="font-family: Arial; text-align: center; padding: 50px;">
                    <h1>500 - Server Error</h1>
                    <p>Error: ${error.message}</p>
                    <a href="/">← Back to Home</a>
                </body>
                </html>
            `);
        }
    });
    
    server.on('error', (err) => {
        console.error('❌ Server Error:', err.message);
        if (err.code === 'EADDRINUSE') {
            console.log(`💡 Port ${port} is in use. Trying port ${port + 1000}...`);
            startServer(port + 1000);
        }
    });
    
    server.listen(port, () => {
        console.log('\n🎉 Server Started Successfully!');
        console.log('================================');
        console.log(`✅ Server URL: http://localhost:${port}`);
        console.log(`📁 Directory: ${__dirname}`);
        console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
        console.log('\n📋 Available Pages:');
        console.log(`  • http://localhost:${port}/ - トップページ`);
        console.log(`  • http://localhost:${port}/works/ - 施工事例`);
        console.log(`  • http://localhost:${port}/craftsmen/ - 職人紹介`);
        console.log(`  • http://localhost:${port}/simulator/ - 見積もり`);
        console.log(`  • http://localhost:${port}/showroom/ - ショールーム`);
        console.log('\n🔧 Press Ctrl+C to stop');
        console.log('================================\n');
        
        // Test if index.html exists
        const indexPath = path.join(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
            console.log('✅ index.html found');
        } else {
            console.log('❌ index.html NOT found!');
            console.log('📁 Files in directory:');
            try {
                const files = fs.readdirSync(__dirname);
                files.forEach(file => console.log(`  - ${file}`));
            } catch (e) {
                console.log('Error reading directory:', e.message);
            }
        }
    });
}

// Start the port test
console.log('🧪 Testing port availability...');
testServer.listen(PORT);