#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 3000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

# Change to the directory containing the website
os.chdir(Path(__file__).parent)

print("🚀 Starting Craft Furniture Local Server...")
print(f"📁 Serving directory: {os.getcwd()}")
print(f"🌐 Server will run on: http://localhost:{PORT}")
print("\n📋 Available pages:")
print("  • http://localhost:3000/ - トップページ")
print("  • http://localhost:3000/works/ - 施工事例")
print("  • http://localhost:3000/craftsmen/ - 職人紹介")
print("  • http://localhost:3000/simulator/ - 見積もり")
print("  • http://localhost:3000/showroom/ - ショールーム")
print("\n🔧 Press Ctrl+C to stop server\n")

try:
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"✅ Server started successfully on port {PORT}")
        print("📌 Open your browser and visit: http://localhost:3000")
        print("=" * 50)
        
        # Try to open browser automatically
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
            
        httpd.serve_forever()
        
except OSError as e:
    if e.errno == 10048:  # Port already in use on Windows
        print(f"❌ Port {PORT} is already in use!")
        print("💡 Try these solutions:")
        print("   1. Close other applications using port 3000")
        print("   2. Wait a moment and try again")
        print("   3. Use a different port")
    else:
        print(f"❌ Error starting server: {e}")
except KeyboardInterrupt:
    print("\n👋 Server stopped by user")
except Exception as e:
    print(f"❌ Unexpected error: {e}")

input("\nPress Enter to exit...")