#!/usr/bin/env python3
"""
Simple HTTP server to test the heretical game locally.
This avoids CORS issues when loading the questions.json file.
"""

import http.server
import socketserver
import os
import webbrowser
import socket

# Change to the script's directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

# Get local IP address
hostname = socket.gethostname()
local_ip = socket.gethostbyname(hostname)

with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at:")
    print(f"  - Local: http://localhost:{PORT}/heretical-game.html")
    print(f"  - Network: http://{local_ip}:{PORT}/heretical-game.html")
    print(f"\n On your Android phone, open:")
    print(f"  http://{local_ip}:{PORT}/heretical-game.html")
    print(f"\nPress Ctrl+C to stop the server")
    
    # Optionally open the browser automatically
    webbrowser.open(f'http://localhost:{PORT}/heretical-game.html')
    
    httpd.serve_forever()