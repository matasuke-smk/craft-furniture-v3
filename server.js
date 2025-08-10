/**
 * Local Development Server for Craft Furniture Website
 * Simple HTTP server with live reload functionality
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class LocalServer {
    constructor() {
        this.port = 3000;
        this.host = 'localhost';
        this.mimeTypes = {
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
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject'
        };
        this.rootDir = __dirname;
    }

    async start() {
        console.log('🚀 Starting Craft Furniture Local Server...\n');
        
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, this.host, () => {
            console.log('✅ Server running successfully!');
            console.log(`🌐 Local URL: http://${this.host}:${this.port}`);
            console.log(`📱 Network URL: http://${this.getLocalIP()}:${this.port}`);
            console.log('\n📋 Available Pages:');
            this.listAvailablePages();
            console.log('\n⚡ Features:');
            console.log('  • Auto-opens browser');
            console.log('  • Mobile device testing');
            console.log('  • CORS enabled');
            console.log('  • Error logging');
            console.log('\n🔧 Press Ctrl+C to stop server\n');

            // Auto-open browser
            this.openBrowser(`http://${this.host}:${this.port}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`❌ Port ${this.port} is already in use`);
                console.log('📝 Trying next available port...');
                this.port += 1;
                server.listen(this.port, this.host);
            } else {
                console.error('❌ Server error:', err);
            }
        });
    }

    async handleRequest(req, res) {
        try {
            let filePath = this.getFilePath(req.url);
            
            // Check if file exists
            try {
                await fs.access(filePath);
            } catch {
                // If file doesn't exist, check if it's a directory
                if (req.url.endsWith('/')) {
                    filePath = path.join(filePath, 'index.html');
                } else {
                    // Try adding index.html for directory requests
                    const indexPath = path.join(filePath, 'index.html');
                    try {
                        await fs.access(indexPath);
                        filePath = indexPath;
                    } catch {
                        return this.send404(res, req.url);
                    }
                }
            }

            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                const indexPath = path.join(filePath, 'index.html');
                try {
                    await fs.access(indexPath);
                    filePath = indexPath;
                } catch {
                    return this.sendDirectoryListing(res, filePath, req.url);
                }
            }

            const content = await fs.readFile(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const mimeType = this.mimeTypes[ext] || 'text/plain';

            // Add CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            // Add cache headers for development
            if (ext === '.html') {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=3600');
            }

            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content);

            // Log successful requests
            console.log(`✅ ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);

        } catch (error) {
            console.error(`❌ ${new Date().toLocaleTimeString()} - Error serving ${req.url}:`, error.message);
            this.send500(res, error.message);
        }
    }

    getFilePath(url) {
        // Remove query parameters and decode URL
        const pathname = decodeURIComponent(url.split('?')[0]);
        
        // Security: prevent directory traversal
        const safePath = pathname.replace(/\.\./g, '');
        
        return path.join(this.rootDir, safePath);
    }

    send404(res, url) {
        const html404 = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - ページが見つかりません | クラフトファニチャー</title>
            <style>
                body { 
                    font-family: 'Noto Sans JP', sans-serif; 
                    margin: 0; 
                    padding: 2rem; 
                    text-align: center; 
                    background: #f5f5f5;
                    color: #333;
                }
                .error-container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 3rem; 
                    border-radius: 8px; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 { color: #3E2723; font-size: 3rem; margin-bottom: 1rem; }
                p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; }
                .btn { 
                    background: #2E5E3E; 
                    color: white; 
                    padding: 1rem 2rem; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block;
                    margin: 0.5rem;
                }
                .btn:hover { background: #236B3A; }
                .path { 
                    background: #f0f0f0; 
                    padding: 0.5rem 1rem; 
                    border-radius: 4px; 
                    font-family: monospace; 
                    color: #666;
                    margin: 1rem 0;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>404</h1>
                <p>お探しのページが見つかりませんでした</p>
                <div class="path">${url}</div>
                <p>URLが正しいかご確認ください。</p>
                <a href="/" class="btn">トップページに戻る</a>
                <a href="/works/" class="btn">施工事例を見る</a>
            </div>
        </body>
        </html>
        `;

        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html404);
        console.log(`❌ ${new Date().toLocaleTimeString()} - 404 Not Found: ${url}`);
    }

    send500(res, message) {
        const html500 = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>500 - サーバーエラー | クラフトファニチャー</title>
            <style>
                body { 
                    font-family: 'Noto Sans JP', sans-serif; 
                    margin: 0; 
                    padding: 2rem; 
                    text-align: center; 
                    background: #f5f5f5;
                    color: #333;
                }
                .error-container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 3rem; 
                    border-radius: 8px; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 { color: #d32f2f; font-size: 3rem; margin-bottom: 1rem; }
                .error-message { 
                    background: #ffebee; 
                    padding: 1rem; 
                    border-radius: 4px; 
                    color: #c62828; 
                    margin: 1rem 0;
                    font-family: monospace;
                }
                .btn { 
                    background: #2E5E3E; 
                    color: white; 
                    padding: 1rem 2rem; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block;
                    margin-top: 2rem;
                }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>500</h1>
                <p>サーバーエラーが発生しました</p>
                <div class="error-message">${message}</div>
                <a href="/" class="btn">トップページに戻る</a>
            </div>
        </body>
        </html>
        `;

        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html500);
    }

    async sendDirectoryListing(res, dirPath, url) {
        try {
            const items = await fs.readdir(dirPath);
            const stats = await Promise.all(
                items.map(async item => {
                    const itemPath = path.join(dirPath, item);
                    const stat = await fs.stat(itemPath);
                    return { name: item, isDirectory: stat.isDirectory() };
                })
            );

            const html = `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Directory: ${url} | クラフトファニチャー開発サーバー</title>
                <style>
                    body { font-family: 'Noto Sans JP', sans-serif; margin: 2rem; background: #f5f5f5; }
                    .container { max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; }
                    h1 { color: #3E2723; border-bottom: 2px solid #2E5E3E; padding-bottom: 1rem; }
                    .item { padding: 0.5rem 0; border-bottom: 1px solid #eee; }
                    .item a { text-decoration: none; color: #2E5E3E; }
                    .item a:hover { text-decoration: underline; }
                    .directory::before { content: "📁 "; }
                    .file::before { content: "📄 "; }
                    .back { background: #f0f0f0; padding: 1rem; border-radius: 4px; margin-bottom: 2rem; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Directory: ${url}</h1>
                    ${url !== '/' ? `<div class="back"><a href="../">📁 .. (親ディレクトリ)</a></div>` : ''}
                    ${stats.map(item => `
                        <div class="item">
                            <a href="${url}${url.endsWith('/') ? '' : '/'}${item.name}" 
                               class="${item.isDirectory ? 'directory' : 'file'}">
                                ${item.name}${item.isDirectory ? '/' : ''}
                            </a>
                        </div>
                    `).join('')}
                </div>
            </body>
            </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
        } catch (error) {
            this.send500(res, error.message);
        }
    }

    listAvailablePages() {
        const pages = [
            { path: '/', description: 'トップページ' },
            { path: '/works/', description: '施工事例一覧' },
            { path: '/works/work-1.html', description: '施工事例詳細' },
            { path: '/craftsmen/', description: '職人紹介' },
            { path: '/process/', description: '製作工程' },
            { path: '/simulator/', description: '見積もりシミュレーター' },
            { path: '/wood-guide/', description: '木材図鑑' },
            { path: '/voice/', description: 'お客様の声' },
            { path: '/flow/', description: '納品までの流れ' },
            { path: '/delivery/', description: '納品エリア' },
            { path: '/showroom/', description: 'ショールーム案内' },
            { path: '/faq/', description: 'よくある質問' },
            { path: '/news/', description: 'お知らせ一覧' },
            { path: '/news/exhibition-2024.html', description: 'お知らせ詳細' },
            { path: '/about/', description: '会社概要' },
            { path: '/contact/', description: 'お問い合わせ' },
            { path: '/privacy/', description: 'プライバシーポリシー' }
        ];

        pages.forEach(page => {
            console.log(`  • ${page.path} - ${page.description}`);
        });
    }

    getLocalIP() {
        const { networkInterfaces } = require('os');
        const nets = networkInterfaces();
        
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.family === 'IPv4' && !net.internal) {
                    return net.address;
                }
            }
        }
        return 'localhost';
    }

    openBrowser(url) {
        console.log(`📌 Please open your browser and visit: ${url}`);
        
        // Try to open browser, but don't fail if it doesn't work
        const start = (process.platform === 'darwin' ? 'open' : 
                      process.platform === 'win32' ? 'cmd' : 'xdg-open');
        
        try {
            if (process.platform === 'win32') {
                spawn('cmd', ['/c', 'start', url], { stdio: 'ignore', detached: true }).unref();
            } else {
                spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
            }
        } catch (error) {
            // Silent fail - browser opening is not critical
        }
    }
}

// Start server if this file is run directly
if (require.main === module) {
    const server = new LocalServer();
    server.start();
}

module.exports = LocalServer;