#!/usr/bin/env python3
"""
LLM Agent POC - Cache-Busting HTTP Server

This server ensures that browsers always load the most current version of files
by adding strong cache-busting headers and timestamp parameters to URLs.
"""

import http.server
import socketserver
import webbrowser
import os
import time
from urllib.parse import urlparse, parse_qs
import threading

class ForceRefreshHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom HTTP request handler that forces browsers to reload files
    by adding strong cache-busting headers.
    """
    
    def end_headers(self):
        # Add strong cache-busting headers to force browser refresh
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('ETag', f'"{int(time.time())}"')
        self.send_header('Last-Modified', time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime()))
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom logging to show what files are being served
        client_address = self.address_string()
        timestamp = time.strftime('[%Y-%m-%d %H:%M:%S]')
        message = format % args
        print(f"{timestamp} {client_address} - {message}")

def check_files():
    """Check and display file information for verification."""
    files_to_check = ['index.html', 'agent.js', 'demo.html']
    
    print("📁 File verification:")
    for filename in files_to_check:
        if os.path.exists(filename):
            stat = os.stat(filename)
            size = stat.st_size
            mtime = time.ctime(stat.st_mtime)
            print(f"  ✅ Found {filename} ({size:,} bytes, modified: {mtime})")
        else:
            print(f"  ❌ Missing {filename}")
    print()

def open_browser_with_cache_busting(port=8000, delay=2):
    """Open browser with cache-busting parameters after a delay."""
    def delayed_open():
        time.sleep(delay)
        timestamp = int(time.time())
        cache_bust_params = f"?v={timestamp}&t={timestamp}&nocache={timestamp}"
        
        # Open only the main index.html page
        main_url = f"http://localhost:{port}/index.html{cache_bust_params}"
        
        try:
            webbrowser.open(main_url)
            print(f"✅ Browser opened: {main_url}")
            
        except Exception as e:
            print(f"⚠️  Could not open browser automatically: {e}")
            print(f"🤖 Agent interface: {main_url}")
    
    # Start browser opening in a separate thread
    browser_thread = threading.Thread(target=delayed_open, daemon=True)
    browser_thread.start()

def start_server(port=8000):
    """Start the cache-busting HTTP server."""
    
    print("=" * 50)
    print("    LLM Agent POC - Cache-Busting Server")
    print("=" * 50)
    print()
    
    # Check current working directory
    cwd = os.getcwd()
    print(f"📂 Working directory: {cwd}")
    print()
    
    # Verify files exist
    check_files()
    
    # Create server with custom handler
    handler = ForceRefreshHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 Server starting on port {port}")
            print(f"🌐 Server URL: http://localhost:{port}")
            print(f"📖 Demo page: http://localhost:{port}/demo.html")
            print(f"🤖 Agent interface: http://localhost:{port}/index.html")
            print()
            print("💡 Cache-busting enabled - browsers will always load current files")
            print("🛑 Press Ctrl+C to stop the server")
            print()
            
            # Open browser after a short delay
            open_browser_with_cache_busting(port)
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 10048:  # Port already in use on Windows
            print(f"❌ Port {port} is already in use!")
            print("💡 Try closing other servers or use a different port")
            print("   You can modify the port in this script if needed")
        else:
            print(f"❌ Server error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    # You can change the port here if needed
    SERVER_PORT = 8000
    
    try:
        start_server(SERVER_PORT)
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        input("Press Enter to exit...")
