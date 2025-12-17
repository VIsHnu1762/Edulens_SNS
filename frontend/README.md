# EduLens Frontend Documentation

## 🎯 Overview

EduLens is a lightweight, framework-free web application that converts 2D images into interactive 3D educational models with a gamified student dashboard.

**Tech Stack:**
- HTML5 + CSS3 + Vanilla JavaScript
- Three.js (via CDN) for 3D rendering
- No frameworks or build tools required
- Mobile-first responsive design

---

## 📁 Project Structure

```
frontend/
├── index.html              # Home page with image upload
├── viewer.html             # 3D model viewer
├── dashboard.html          # Student dashboard with gamification
├── css/
│   ├── styles.css          # Global styles and components
│   ├── viewer.css          # 3D viewer specific styles
│   └── dashboard.css       # Dashboard specific styles
├── js/
│   ├── uploader.js         # Image upload functionality
│   ├── viewer.js           # Three.js 3D viewer
│   ├── dashboard.js        # Dashboard controller
│   └── components/
│       ├── streak.js       # Daily streak widget
│       ├── mcq.js          # Quiz functionality
│       ├── recentActivity.js  # Activity feed
│       └── rewards.js      # Badges and achievements
└── assets/                 # Static assets (images, icons)
```

---

## 🚀 Getting Started

### 1. Basic Setup

No build process required! Simply serve the files with any static server:

```bash
# Using Python
cd frontend
python -m http.server 8000

# Using Node.js http-server
npx http-server frontend -p 8000

# Using PHP
php -S localhost:8000
```

Then open: `http://localhost:8000/index.html`

### 2. Backend Integration

Configure your backend API base URL in each JavaScript file, or set it globally:

```javascript
// Add to the top of uploader.js, dashboard.js
const API_BASE_URL = 'http://localhost:5000'; // Your backend URL
```

---

## 🌐 API Integration Guide

### Required Backend Endpoints

#### 1. Image Upload & Classification
```http
POST /upload-image
Content-Type: multipart/form-data

Request Body:
- image: File (binary)

Response:
{
  "predicted_subject": "heart",
  "confidence": 95,
  "model_path": "/static/models/heart.glb"
}
```

#### 2. Dashboard Data
```http
GET /user/dashboard

Response:
{
  "user_name": "Student Name",
  "streak": 4,
  "completedToday": false,
  "xp": 120,
  "level": 2,
  "xp_for_next_level": 200,
  "total_badges": 2,
  "models_viewed": 8,
  "recent_activity": [...],
  "badges": [...],
  "recommended_topics": [...],
  "daily_mcqs": {
    "count": 5,
    "reward": 50
  },
  "last_topic": "Human Heart"
}
```

#### 3. Daily Quiz Questions
```http
GET /user/mcq/daily

Response:
{
  "questions": [
    {
      "id": "q1",
      "question": "What are the four chambers of the heart?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}
```

#### 4. Submit Quiz
```http
POST /user/mcq/submit
Content-Type: application/json

Request Body:
{
  "answers": [0, 1, 2, 1, 2],
  "score": 4,
  "total": 5,
  "time_taken": 120,
  "xp_earned": 40
}
```

#### 5. Log Activity
```http
POST /user/activity/log
Content-Type: application/json

Request Body:
{
  "activity_type": "model_view",
  "subject": "heart",
  "timestamp": "2025-12-17T10:30:00Z"
}
```

#### 6. Mark Streak Complete
```http
POST /user/streak/complete
Content-Type: application/json

Request Body:
{
  "timestamp": "2025-12-17T10:30:00Z"
}
```

---

## 🎨 Customization Guide

### Theme Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    /* Primary Colors */
    --primary-color: #2563eb;      /* Main blue */
    --secondary-color: #7c3aed;    /* Purple */
    --accent-color: #f59e0b;       /* Orange */
    
    /* Subject Colors */
    --biology-color: #059669;      /* Green */
    --chemistry-color: #7c3aed;    /* Purple */
    --physics-color: #dc2626;      /* Red */
}
```

### Adding New Subjects

1. **Add subject color in CSS:**
```css
--geology-color: #8b4513;
```

2. **Add subject button in dashboard.html:**
```html
<button class="subject-btn geology-btn" data-subject="geology">
    <span class="subject-icon">🪨</span>
    <span>Geology</span>
</button>
```

3. **Add hover style in dashboard.css:**
```css
.geology-btn:hover {
    border-color: var(--geology-color);
    background: rgba(139, 69, 19, 0.1);
    transform: translateY(-3px);
}
```

### Adding New Badge Types

Edit `getDemoBadges()` in `js/components/rewards.js`:

```javascript
{
    id: 'chemistry_expert',
    name: 'Chemistry Expert',
    description: 'Complete 10 chemistry quizzes',
    icon: '⚗️',
    unlocked: false,
    progress: 3,
    total: 10
}
```

---

## 🎯 3D Viewer Features

### Controls

- **Rotate:** Left-click/touch drag
- **Zoom:** Scroll wheel or pinch
- **Pan:** Right-click drag or two-finger drag
- **Select Parts:** Click on model parts
- **Reset Camera:** Reset to default view

### Loading Custom GLB Models

1. **Place GLB file in backend static folder:**
```
backend/static/models/your-model.glb
```

2. **Model naming convention:**
```
{subject_name}.glb
Example: heart.glb, cell.glb, atom.glb
```

3. **Model requirements:**
- Format: GLB (binary GLTF)
- Size: < 50MB recommended
- Textures: Embedded in GLB
- Animations: Optional (will auto-detect)

### Viewer Configuration

Edit `viewer.js` initialization:

```javascript
// Camera settings
this.camera = new THREE.PerspectiveCamera(
    45,  // Field of view
    window.innerWidth / window.innerHeight,
    0.1,  // Near clipping
    1000  // Far clipping
);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
```

---

## 📱 Mobile Responsiveness

All pages are fully responsive with breakpoints:

- **Desktop:** > 1024px
- **Tablet:** 768px - 1024px
- **Mobile:** < 768px
- **Small Mobile:** < 480px

### Touch Gestures Supported

- ✅ Single finger drag (rotate)
- ✅ Two finger drag (pan)
- ✅ Pinch zoom
- ✅ Tap to select
- ✅ Touch-friendly UI buttons

---

## 🎮 Dashboard Features

### Gamification Elements

1. **Daily Streaks**
   - Track consecutive days of learning
   - Visual flame indicator
   - Completion status

2. **XP & Levels**
   - Earn XP from activities
   - Level up system
   - Progress bar visualization

3. **Badges & Achievements**
   - Unlockable badges
   - Progress tracking
   - Badge detail modal

4. **Daily Quiz**
   - 5 questions per day
   - XP rewards
   - Score visualization

5. **Activity Feed**
   - Real-time activity logging
   - Timestamp formatting
   - Icon-based display

6. **Recommendations**
   - AI-suggested topics
   - Based on learning history
   - Subject-specific

---

## 🔧 Common Tasks

### Adding a New Quiz Question

Edit `getDemoQuestions()` in `js/components/mcq.js`:

```javascript
{
    id: 'q6',
    question: 'Your new question here?',
    options: [
        'Option A',
        'Option B',
        'Option C',
        'Option D'
    ],
    correct: 2  // Index of correct answer (0-3)
}
```

### Adding a New Activity Type

Edit `getDemoActivities()` in `js/components/recentActivity.js`:

```javascript
{
    type: 'new_activity',
    description: 'Custom activity description',
    timestamp: new Date().toISOString(),
    icon: '🎉'
}
```

### Customizing XP Rewards

In `js/components/mcq.js`, modify:

```javascript
// XP per correct answer (default: 10)
const earnedXP = correctAnswers * 10;

// Bonus for perfect score
if (score === total) {
    earnedXP += 20; // Bonus XP
}
```

---

## 🐛 Debugging

### Enable Console Logging

Add to any JavaScript file:

```javascript
const DEBUG = true;

function log(...args) {
    if (DEBUG) console.log('[EduLens]', ...args);
}
```

### Common Issues

**Issue:** Model not loading
- Check GLB file path in backend response
- Verify CORS headers on backend
- Check browser console for errors

**Issue:** Upload fails
- Verify backend endpoint is running
- Check file size limits
- Ensure multipart/form-data support

**Issue:** Dashboard data not loading
- Check API endpoint configuration
- Verify backend is returning correct JSON structure
- Use demo data for testing (already implemented)

---

## 🚀 Performance Optimization

### 3D Viewer

```javascript
// Reduce pixel ratio for better performance on high-DPI screens
this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Enable shadows only if needed
this.renderer.shadowMap.enabled = false; // Disable for better performance

// Reduce model complexity
// Use decimation in 3D modeling software before exporting
```

### Image Upload

```javascript
// Compress image before upload
async function compressImage(file, maxWidth = 1920) {
    // Implementation in uploader.js
}
```

---

## 🌍 Browser Compatibility

**Supported Browsers:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

**Required Features:**
- WebGL 2.0
- ES6+ JavaScript
- Fetch API
- CSS Grid & Flexbox

---

## 📚 Additional Resources

### Three.js Documentation
- Official Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/

### GLB Model Resources
- Sketchfab: https://sketchfab.com/
- TurboSquid: https://www.turbosquid.com/
- Free3D: https://free3d.com/

### Educational Icons & Emojis
- Uses native emoji for better compatibility
- No external icon libraries required

---

## 🤝 Contributing

### Code Style

- Use descriptive variable names
- Comment complex logic
- Keep functions small and focused
- Follow existing naming conventions

### File Organization

- Keep related code in component files
- Use consistent indentation (4 spaces)
- Group related functions together

---

## 📝 License

This frontend is part of the EduLens project. All rights reserved.

---

## 💡 Tips & Best Practices

1. **Always test on mobile devices** - Most users will be on mobile
2. **Keep demo data** - Useful for development and offline testing
3. **Log activities** - Track user engagement for insights
4. **Optimize images** - Compress uploads to save bandwidth
5. **Cache API responses** - Reduce server load and improve speed
6. **Use progressive enhancement** - Start with basic functionality, enhance with features
7. **Handle errors gracefully** - Show friendly messages, don't crash
8. **Test offline behavior** - Ensure app degrades gracefully without internet

---

## 🎉 Quick Start Checklist

- [ ] Set up static file server
- [ ] Configure backend API endpoints
- [ ] Test image upload
- [ ] Test 3D model loading
- [ ] Test dashboard data loading
- [ ] Test quiz functionality
- [ ] Test on mobile device
- [ ] Customize theme colors
- [ ] Add your GLB models
- [ ] Deploy to production

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify backend API is running
3. Test with demo data
4. Review this documentation
5. Check network tab in browser DevTools

---

**Built with ❤️ for visual learning**
