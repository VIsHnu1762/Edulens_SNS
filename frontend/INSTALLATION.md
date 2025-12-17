# 🚀 EduLens Frontend - Installation & Troubleshooting

## ✅ FIXED ISSUES

### Problems Resolved:
1. ✅ **Three.js CDN Links** - Updated to modern ES modules format
2. ✅ **Module Loading** - Fixed import statements
3. ✅ **Chrome Compatibility** - All pages now work in Chrome
4. ✅ **Script Loading** - Proper module type declarations

---

## 📦 QUICK START (3 STEPS)

### Step 1: Navigate to Frontend Directory
```bash
cd /Users/uset/Documents/Github/Edulens_SNS/frontend
```

### Step 2: Run the Test Script
```bash
./test-chrome.sh
```

This will:
- ✅ Check all required files
- ✅ Start the server on port 8000
- ✅ Open Chrome automatically
- ✅ Show the test page

### Step 3: Test the Pages
Open these URLs in Chrome:
- **Test Page:** http://localhost:8000/test.html ⭐ (Start here!)
- **Home:** http://localhost:8000/index.html
- **Dashboard:** http://localhost:8000/dashboard.html
- **3D Viewer:** http://localhost:8000/viewer.html

---

## 🔧 MANUAL INSTALLATION

If the script doesn't work, follow these manual steps:

### 1. Install Python (if not installed)
**macOS:**
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python3
```

**Windows:**
Download from: https://www.python.org/downloads/

**Linux:**
```bash
sudo apt update
sudo apt install python3
```

### 2. Start the Server Manually
```bash
cd /Users/uset/Documents/Github/Edulens_SNS/frontend

# Using Python 3
python3 -m http.server 8000

# OR using Python 2
python -m SimpleHTTPServer 8000
```

### 3. Open Chrome
1. Open Google Chrome
2. Go to: http://localhost:8000/test.html

---

## 🐛 TROUBLESHOOTING

### Issue: "Port 8000 already in use"

**Solution 1 - Kill the process:**
```bash
# Find process on port 8000
lsof -ti:8000

# Kill it
lsof -ti:8000 | xargs kill -9

# Start server again
./test-chrome.sh
```

**Solution 2 - Use different port:**
```bash
python3 -m http.server 8080
# Then open: http://localhost:8080/test.html
```

---

### Issue: "Python not found"

**Check Python installation:**
```bash
which python3
python3 --version
```

**If not installed, install it:**
- macOS: `brew install python3`
- Windows: Download from python.org
- Linux: `sudo apt install python3`

---

### Issue: "Three.js not loading in Chrome"

**Solution:**
1. Open Chrome DevTools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Look for errors
4. Common fixes:
   - Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
   - Disable browser extensions
   - Check if running on http:// (not file://)

**Correct URL format:**
```
✅ http://localhost:8000/viewer.html
❌ file:///Users/.../viewer.html
```

---

### Issue: "Module not found" errors

**This means you're not using a web server.**

**Solution:**
Always use a web server (Python, Node, etc.), never open files directly:
```bash
# CORRECT
python3 -m http.server 8000
# Then: http://localhost:8000

# WRONG
# Opening file directly in browser
```

---

### Issue: "CORS errors"

**Solution:**
Make sure you're accessing via localhost, not file://
```bash
# Start server in frontend directory
cd /Users/uset/Documents/Github/Edulens_SNS/frontend
python3 -m http.server 8000
```

---

### Issue: "Dashboard data not loading"

**This is NORMAL in demo mode!**

The frontend includes demo/fallback data that works without a backend.

**What you should see:**
- ✅ Streak: 4 days
- ✅ XP: 120
- ✅ Level: 2
- ✅ Demo activities
- ✅ Demo badges
- ✅ Sample quiz questions

**To connect real backend:**
1. Start your backend server
2. Edit `js/uploader.js`, `js/dashboard.js`
3. Update API URLs (currently uses `/upload-image`, etc.)

---

### Issue: "3D model not loading"

**Expected behavior:**
- The viewer will try to load a model from session storage
- If no model data exists, it shows the loading screen

**To test 3D viewer:**
1. Go to http://localhost:8000/index.html
2. Upload an image (will use demo data)
3. Click "Open 3D Model"
4. OR manually set model data in browser console:
```javascript
sessionStorage.setItem('modelData', JSON.stringify({
    path: '/static/models/heart.glb',
    subject: 'Heart',
    confidence: 95
}));
// Then refresh viewer.html
```

---

## ✅ VERIFICATION CHECKLIST

### Check if everything works:

1. **Server Running**
   ```bash
   curl http://localhost:8000/test.html
   # Should return HTML content
   ```

2. **Files Accessible**
   - http://localhost:8000/test.html ✅
   - http://localhost:8000/index.html ✅
   - http://localhost:8000/dashboard.html ✅
   - http://localhost:8000/viewer.html ✅

3. **JavaScript Loading**
   - Open Chrome DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Check that all .js files load (status 200)

4. **Console Clean**
   - Open Chrome DevTools Console
   - Should see: "✅ EduLens loaded successfully"
   - No red errors

5. **Demo Data Working**
   - Dashboard shows streak, XP, level
   - Quiz button works
   - Activity feed populated

---

## 📋 FILE STRUCTURE VERIFICATION

Make sure all these files exist:

```
frontend/
├── index.html ✅
├── viewer.html ✅
├── dashboard.html ✅
├── test.html ✅
├── test-chrome.sh ✅
├── start-server.sh ✅
├── css/
│   ├── styles.css ✅
│   ├── viewer.css ✅
│   └── dashboard.css ✅
├── js/
│   ├── uploader.js ✅
│   ├── viewer.js ✅
│   ├── dashboard.js ✅
│   ├── config.example.js ✅
│   └── components/
│       ├── streak.js ✅
│       ├── mcq.js ✅
│       ├── recentActivity.js ✅
│       └── rewards.js ✅
└── assets/ ✅
```

**Check with:**
```bash
cd /Users/uset/Documents/Github/Edulens_SNS/frontend
ls -la
ls -la css/
ls -la js/
ls -la js/components/
```

---

## 🌐 BROWSER TESTING

### Chrome (Recommended)
```bash
# Start server
./test-chrome.sh

# Or manually:
python3 -m http.server 8000
open -a "Google Chrome" http://localhost:8000/test.html
```

### Safari
```bash
python3 -m http.server 8000
open -a Safari http://localhost:8000/test.html
```

### Firefox
```bash
python3 -m http.server 8000
open -a Firefox http://localhost:8000/test.html
```

---

## 📱 MOBILE TESTING

### Test on iPhone/iPad:

1. **Find your computer's IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Example output: inet 192.168.1.100
   ```

2. **Start server:**
   ```bash
   python3 -m http.server 8000
   ```

3. **On iPhone/iPad:**
   - Open Safari
   - Go to: http://YOUR_IP:8000/test.html
   - Example: http://192.168.1.100:8000/test.html

### Test on Android:

Same steps as above, but use Chrome on Android.

---

## 🎯 WHAT TO EXPECT

### Test Page (test.html)
- ✅ Clean landing page
- ✅ Links to all pages
- ✅ Status indicators
- ✅ Feature list

### Home Page (index.html)
- ✅ Image upload area
- ✅ Drag & drop works
- ✅ Image preview
- ✅ Demo classification result

### Dashboard (dashboard.html)
- ✅ Welcome section with stats
- ✅ Streak counter (shows 4)
- ✅ XP bar (shows 120/200)
- ✅ Quiz button works
- ✅ Activity feed populated
- ✅ Badges visible

### 3D Viewer (viewer.html)
- ✅ Loading screen appears
- ✅ Controls visible
- ✅ Camera controls work
- ⚠️ Model won't load without data (expected)

---

## 💡 QUICK FIXES

### Clear Everything and Restart:

```bash
# Kill all Python servers
pkill -f "python.*http.server"

# Clear browser cache
# Chrome: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)

# Restart server
cd /Users/uset/Documents/Github/Edulens_SNS/frontend
./test-chrome.sh
```

### Force Refresh in Browser:
- Mac: Cmd + Shift + R
- Windows: Ctrl + Shift + R

### Check Server Logs:
Look at terminal output for errors:
```
127.0.0.1 - - [17/Dec/2025 10:30:00] "GET /test.html HTTP/1.1" 200 -
```
- `200` = Success ✅
- `404` = File not found ❌
- `500` = Server error ❌

---

## 🎓 NEXT STEPS

Once everything works:

1. ✅ Explore all pages
2. ✅ Test quiz functionality
3. ✅ Try mobile view (Chrome DevTools)
4. ✅ Read README.md for backend integration
5. ✅ Customize theme colors (CSS variables)

---

## 📞 STILL HAVING ISSUES?

### Debug Mode:

Open Chrome DevTools and run:
```javascript
// Check what's loaded
console.log('Pages:', {
    test: window.location.href.includes('test.html'),
    index: window.location.href.includes('index.html'),
    dashboard: window.location.href.includes('dashboard.html'),
    viewer: window.location.href.includes('viewer.html')
});

// Check if Three.js loaded (on viewer page)
console.log('THREE:', typeof THREE !== 'undefined');

// Check demo data (on dashboard)
if (window.dashboard) {
    console.log('Dashboard loaded:', window.dashboard);
}
```

### Common Console Messages:

**✅ Good:**
```
✅ EduLens Frontend loaded successfully!
✅ EduLens configuration loaded
Dashboard data loaded
```

**❌ Bad:**
```
Failed to load module script
CORS error
404 Not Found
```

---

## 📊 SUCCESS INDICATORS

You'll know it's working when:

1. ✅ Server starts without errors
2. ✅ Browser opens automatically (or you can open manually)
3. ✅ Test page loads with colored boxes and links
4. ✅ Dashboard shows demo data (streak, XP, badges)
5. ✅ Quiz modal opens when you click "Start Quiz"
6. ✅ No red errors in Chrome Console (F12)

---

## 🎉 ALL DONE!

If you can see:
- ✅ Test page at http://localhost:8000/test.html
- ✅ Dashboard with demo data
- ✅ Quiz works
- ✅ No console errors

**Then everything is working perfectly! 🎊**

---

**Need help? Check the terminal output and Chrome Console (F12) for error messages.**
