#!/bin/bash

# EduLens Frontend - Complete Setup & Test Script
# This script sets up and tests the frontend in Chrome

echo "================================================"
echo "🔬 EduLens Frontend - Setup & Test"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📂 Working directory: ${NC}$SCRIPT_DIR"
echo ""

# Check for browser
echo -e "${BLUE}🔍 Checking for browsers...${NC}"
if command -v google-chrome &> /dev/null; then
    BROWSER="google-chrome"
    echo -e "${GREEN}✅ Chrome found${NC}"
elif command -v chromium-browser &> /dev/null; then
    BROWSER="chromium-browser"
    echo -e "${GREEN}✅ Chromium found${NC}"
elif command -v open &> /dev/null; then
    BROWSER="open -a 'Google Chrome'"
    echo -e "${GREEN}✅ macOS Chrome launcher found${NC}"
else
    echo -e "${YELLOW}⚠️  Chrome not found in PATH${NC}"
    BROWSER=""
fi
echo ""

# Check file structure
echo -e "${BLUE}📋 Verifying file structure...${NC}"
REQUIRED_FILES=(
    "index.html"
    "viewer.html"
    "dashboard.html"
    "test.html"
    "css/styles.css"
    "css/viewer.css"
    "css/dashboard.css"
    "js/uploader.js"
    "js/viewer.js"
    "js/dashboard.js"
)

ALL_PRESENT=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file (MISSING)"
        ALL_PRESENT=false
    fi
done
echo ""

if [ "$ALL_PRESENT" = false ]; then
    echo -e "${RED}❌ Some files are missing. Please check the installation.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required files present${NC}"
echo ""

# Check for Python
echo -e "${BLUE}🐍 Checking for Python...${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ $PYTHON_VERSION found${NC}"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    PYTHON_VERSION=$(python --version)
    echo -e "${GREEN}✅ $PYTHON_VERSION found${NC}"
else
    echo -e "${RED}❌ Python not found!${NC}"
    echo ""
    echo "Please install Python from: https://www.python.org/downloads/"
    exit 1
fi
echo ""

# Kill any existing server on port 8000
echo -e "${BLUE}🔧 Checking for existing servers on port 8000...${NC}"
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Port 8000 is in use. Attempting to free it...${NC}"
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 2
    echo -e "${GREEN}✅ Port 8000 freed${NC}"
else
    echo -e "${GREEN}✅ Port 8000 is available${NC}"
fi
echo ""

# Start the server
echo -e "${BLUE}🚀 Starting development server...${NC}"
echo ""
echo "================================================"
echo -e "${GREEN}✅ Server starting on http://localhost:8000${NC}"
echo "================================================"
echo ""
echo -e "${BLUE}📝 Available pages:${NC}"
echo "   🏠 Test Page:    http://localhost:8000/test.html"
echo "   🏠 Home:         http://localhost:8000/index.html"
echo "   📊 Dashboard:    http://localhost:8000/dashboard.html"
echo "   🎯 3D Viewer:    http://localhost:8000/viewer.html"
echo ""
echo -e "${YELLOW}💡 Tip: The test page is a good starting point!${NC}"
echo ""
echo "================================================"
echo ""

# Open browser if available
if [ -n "$BROWSER" ]; then
    echo -e "${BLUE}🌐 Opening test page in Chrome...${NC}"
    sleep 2
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open -a "Google Chrome" "http://localhost:8000/test.html" 2>/dev/null || \
        open "http://localhost:8000/test.html"
    else
        # Linux
        $BROWSER "http://localhost:8000/test.html" >/dev/null 2>&1 &
    fi
    echo -e "${GREEN}✅ Browser opened${NC}"
    echo ""
fi

echo -e "${YELLOW}⏱️  Server is running...${NC}"
echo -e "${RED}Press Ctrl+C to stop the server${NC}"
echo ""
echo "================================================"
echo ""

# Start Python HTTP server
$PYTHON_CMD -m http.server 8000
