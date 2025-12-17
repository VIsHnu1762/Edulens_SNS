#!/bin/bash

# ============================================
# EduLens Frontend - COMPLETE SETUP
# ============================================

clear

cat << "EOF"
╔═══════════════════════════════════════════════╗
║                                               ║
║        🔬 EduLens Frontend v1.0.0            ║
║                                               ║
║     Educational 3D Model Learning Platform    ║
║                                               ║
╚═══════════════════════════════════════════════╝

EOF

echo ""
echo "================================================"
echo "           🚀 QUICK START GUIDE"
echo "================================================"
echo ""

# Check current directory
CURRENT_DIR=$(pwd)
echo "📂 Current Directory: $CURRENT_DIR"
echo ""

# Check if we're in the right directory
if [[ ! -f "test.html" ]]; then
    echo "⚠️  Not in frontend directory!"
    echo ""
    echo "Please run:"
    echo "  cd /Users/uset/Documents/Github/Edulens_SNS/frontend"
    echo "  ./START.sh"
    echo ""
    exit 1
fi

echo "✅ Correct directory confirmed"
echo ""

# Check Python
echo "🔍 Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ $PYTHON_VERSION found"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo "✅ $PYTHON_VERSION found"
    PYTHON_CMD="python"
else
    echo "❌ Python not found!"
    echo ""
    echo "Install Python:"
    echo "  macOS: brew install python3"
    echo "  Or download from: https://www.python.org/downloads/"
    echo ""
    exit 1
fi
echo ""

# Check Chrome
echo "🔍 Checking Chrome..."
if [[ -d "/Applications/Google Chrome.app" ]]; then
    echo "✅ Chrome found"
    CHROME_FOUND=true
else
    echo "⚠️  Chrome not found (will provide manual link)"
    CHROME_FOUND=false
fi
echo ""

# Check files
echo "📋 Verifying files..."
FILES_OK=true

check_file() {
    if [[ -f "$1" ]]; then
        echo "  ✅ $1"
    else
        echo "  ❌ $1 MISSING!"
        FILES_OK=false
    fi
}

check_file "index.html"
check_file "dashboard.html"
check_file "viewer.html"
check_file "test.html"
check_file "css/styles.css"
check_file "js/viewer.js"
check_file "js/dashboard.js"

echo ""

if [[ "$FILES_OK" = false ]]; then
    echo "❌ Some files are missing!"
    exit 1
fi

echo "✅ All files present"
echo ""

# Kill existing servers
echo "🔧 Checking for existing servers..."
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8000 in use. Clearing..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Port cleared"
else
    echo "✅ Port 8000 available"
fi
echo ""

# Display info
cat << "EOF"
================================================
           🎯 SERVER STARTING NOW
================================================

EOF

echo "📍 Server URL: http://localhost:8000"
echo ""
echo "📝 Available Pages:"
echo "   • Test Page:    http://localhost:8000/test.html"
echo "   • Home:         http://localhost:8000/index.html"
echo "   • Dashboard:    http://localhost:8000/dashboard.html"
echo "   • 3D Viewer:    http://localhost:8000/viewer.html"
echo ""

cat << "EOF"
================================================
           ✨ FEATURES INCLUDED
================================================

✅ Image Upload & Classification
✅ Interactive 3D Model Viewer
✅ Daily Streak Tracker (🔥 4 days)
✅ XP & Level System (⚡ Level 2)
✅ Daily Quiz Challenge (📝 5 questions)
✅ Badges & Achievements (🏆 2 unlocked)
✅ Activity Feed (📊 Recent actions)
✅ Mobile Responsive (📱 Touch gestures)

================================================
           💡 DEMO MODE ACTIVE
================================================

The app works with demo data out of the box!
No backend needed for testing.

Demo includes:
  • Streak: 4 days
  • XP: 120 / 200
  • Level: 2
  • Quiz: 5 questions
  • Badges: 6 total (2 unlocked)
  • Activities: 5 recent

================================================
           🌐 OPENING BROWSER
================================================

EOF

# Open browser
if [[ "$CHROME_FOUND" = true ]]; then
    echo "🚀 Opening Chrome in 2 seconds..."
    echo ""
    sleep 2
    open -a "Google Chrome" "http://localhost:8000/test.html" 2>/dev/null
    echo "✅ Chrome opened"
else
    echo "⚠️  Please open Chrome manually and go to:"
    echo "   http://localhost:8000/test.html"
fi

echo ""
cat << "EOF"
================================================
           ⏱️  SERVER RUNNING
================================================

✅ Server is active and ready!

To stop the server:
  Press Ctrl+C

To restart:
  ./START.sh

================================================

EOF

# Start server
$PYTHON_CMD -m http.server 8000
