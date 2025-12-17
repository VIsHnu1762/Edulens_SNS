#!/bin/bash

# EduLens Frontend Quick Start Script
# This script helps you quickly start the frontend development server

echo "🔬 EduLens Frontend - Quick Start"
echo "================================="
echo ""

# Check if Python is installed
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    echo "🚀 Starting server on http://localhost:8000"
    echo ""
    echo "📝 Pages available:"
    echo "   - Home: http://localhost:8000/index.html"
    echo "   - Dashboard: http://localhost:8000/dashboard.html"
    echo "   - 3D Viewer: http://localhost:8000/viewer.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    cd "$(dirname "$0")"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python found"
    echo "🚀 Starting server on http://localhost:8000"
    echo ""
    echo "📝 Pages available:"
    echo "   - Home: http://localhost:8000/index.html"
    echo "   - Dashboard: http://localhost:8000/dashboard.html"
    echo "   - 3D Viewer: http://localhost:8000/viewer.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    cd "$(dirname "$0")"
    python -m http.server 8000
elif command -v php &> /dev/null; then
    echo "✅ PHP found"
    echo "🚀 Starting server on http://localhost:8000"
    echo ""
    echo "📝 Pages available:"
    echo "   - Home: http://localhost:8000/index.html"
    echo "   - Dashboard: http://localhost:8000/dashboard.html"
    echo "   - 3D Viewer: http://localhost:8000/viewer.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    cd "$(dirname "$0")"
    php -S localhost:8000
else
    echo "❌ No suitable server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: https://www.python.org/downloads/"
    echo "  - PHP: https://www.php.net/downloads"
    echo "  - Node.js (with http-server): npm install -g http-server"
    echo ""
    echo "Or use any static file server of your choice."
    exit 1
fi
