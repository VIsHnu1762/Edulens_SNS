# EduLens Frontend - Quick Start Guide

## 🎯 Three Ways to Run the Frontend

### Option 1: Using the Quick Start Script (Recommended)

```bash
cd frontend
chmod +x start-server.sh
./start-server.sh
```

Then open: http://localhost:8000/index.html

### Option 2: Using Python

```bash
cd frontend

# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Option 3: Using Node.js

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run server
cd frontend
http-server -p 8000
```

---

## 🌐 Available Pages

Once the server is running, open these URLs:

- **Home Page (Upload):** http://localhost:8000/index.html
- **Student Dashboard:** http://localhost:8000/dashboard.html
- **3D Viewer:** http://localhost:8000/viewer.html

---

## ⚙️ Backend Configuration

The frontend expects these backend endpoints:

```
POST /upload-image
GET  /user/dashboard
GET  /user/mcq/daily
POST /user/mcq/submit
POST /user/activity/log
POST /user/streak/complete
```

### Using Demo Data (No Backend Required)

The app includes demo/fallback data for testing without a backend:
- Streak: 4 days
- XP: 120
- Level: 2
- Sample quizzes
- Sample activities
- Sample badges

### Connecting to Backend

Edit the API base URL in JavaScript files:

**js/uploader.js:**
```javascript
// Change this line (around line 90)
const response = await fetch('/upload-image', {
// To:
const response = await fetch('http://your-backend:5000/upload-image', {
```

**js/dashboard.js:**
```javascript
// Change this line (around line 30)
const response = await fetch('/user/dashboard');
// To:
const response = await fetch('http://your-backend:5000/user/dashboard');
```

**Or set globally:**
Create `js/config.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',
    ENDPOINTS: {
        UPLOAD: '/upload-image',
        DASHBOARD: '/user/dashboard',
        MCQ_DAILY: '/user/mcq/daily',
        MCQ_SUBMIT: '/user/mcq/submit',
        ACTIVITY_LOG: '/user/activity/log',
        STREAK_COMPLETE: '/user/streak/complete'
    }
};
```

Then include it in HTML files:
```html
<script src="js/config.js"></script>
```

---

## 🎨 Features Included

### ✅ Home Page (index.html)
- Image upload with drag & drop
- Image preview
- Classification result display
- Confidence meter
- "Open 3D Model" button

### ✅ 3D Viewer (viewer.html)
- WebGL-based 3D rendering
- OrbitControls (rotate, zoom, pan)
- Touch gestures support
- Model loading with progress bar
- Animation playback controls
- Camera presets (top view, side view)
- Wireframe toggle
- Grid and axes helpers
- Object selection with raycasting
- Screenshot capture
- Fullscreen mode

### ✅ Dashboard (dashboard.html)
- Welcome section with stats
- Daily streak tracker with flame icon
- XP & Level progress bar
- Daily quiz challenge (5 MCQs)
- Quick start section
  - Continue learning
  - Subject buttons (Biology, Chemistry, Physics)
  - Upload new image
- Recent activity feed
- Achievements/Badges grid
- Personalized recommendations
- Mobile responsive layout

### ✅ Components
- **Streak Manager:** Daily streak tracking
- **MCQ Manager:** Quiz functionality with scoring
- **Activity Manager:** Activity logging and display
- **Rewards Manager:** Badges, achievements, recommendations

---

## 📱 Mobile Support

All pages are fully responsive and touch-enabled:
- Touch gestures in 3D viewer
- Mobile-optimized UI
- Responsive grid layouts
- Touch-friendly buttons
- Swipe-friendly cards

---

## 🎯 Testing Without Backend

The app works standalone with demo data:

1. Start the server
2. Open any page
3. Demo data will load automatically
4. All UI features work (quiz, badges, etc.)
5. 3D viewer requires actual GLB files

---

## 📦 What's Included

```
frontend/
├── index.html              ✅ Home/upload page
├── viewer.html             ✅ 3D viewer
├── dashboard.html          ✅ Student dashboard
├── start-server.sh         ✅ Quick start script
├── QUICKSTART.md          ✅ This file
├── README.md              ✅ Full documentation
├── css/
│   ├── styles.css         ✅ Global styles
│   ├── viewer.css         ✅ 3D viewer styles
│   └── dashboard.css      ✅ Dashboard styles
└── js/
    ├── uploader.js        ✅ Upload functionality
    ├── viewer.js          ✅ 3D viewer with Three.js
    ├── dashboard.js       ✅ Dashboard controller
    └── components/
        ├── streak.js      ✅ Streak widget
        ├── mcq.js         ✅ Quiz system
        ├── recentActivity.js  ✅ Activity feed
        └── rewards.js     ✅ Badges & rewards
```

---

## 🔍 Debugging

### Browser Console
Open developer tools (F12) and check the Console tab for errors.

### Common Issues

**Issue:** Pages don't load
- Make sure you're accessing via http:// (not file://)
- Check that server is running
- Try a different port if 8000 is busy

**Issue:** 3D model not loading
- Check that model path is correct
- Verify GLB file exists
- Check browser console for CORS errors

**Issue:** Upload fails
- Backend must be running
- Check CORS settings on backend
- Verify endpoint URL is correct

---

## 🎓 Next Steps

1. ✅ Start the server
2. ✅ Open dashboard.html
3. ✅ Test quiz functionality
4. ✅ Try uploading an image
5. ✅ View a 3D model
6. 🔧 Connect to your backend
7. 🎨 Customize theme colors
8. 📦 Add your own GLB models

---

## 💡 Tips

- **Demo Mode:** Works without backend using fallback data
- **Offline Testing:** All UI features work locally
- **Mobile Testing:** Use Chrome DevTools device emulation
- **Performance:** Use smaller GLB files (< 10MB)
- **Customization:** Edit CSS variables for easy theming

---

## 📞 Need Help?

1. Check the [full README.md](README.md) for detailed documentation
2. Review browser console for errors
3. Test with demo data first
4. Verify backend endpoints if using real backend

---

**Happy coding! 🚀**
