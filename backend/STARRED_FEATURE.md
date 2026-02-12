# Starred/Favorite Models Feature

## Overview

The Starred Models feature allows users to bookmark their favorite educational models for quick access. Users can star models they're interested in studying, and easily view their starred collection.

## Features

- **Star/Unstar Models**: Add or remove models from your favorites list
- **View Starred Collection**: Get a list of all your starred models
- **Check Star Status**: Verify if a specific model is starred
- **Dashboard Integration**: Starred models appear in the user dashboard

## API Endpoints

### 1. Get Starred Models

```http
GET /user/starred?user_id=default
```

**Response:**
```json
{
  "user_id": "default",
  "starred_items": [
    {
      "subject": "heart",
      "display_name": "Anatomical Heart",
      "starred_at": "2025-12-17T10:30:00Z",
      "category": "biology"
    }
  ]
}
```

### 2. Star a Model

```http
POST /user/starred/{subject}?user_id=default
```

**Example:**
```http
POST /user/starred/heart?user_id=default
```

**Response:**
```json
{
  "user_id": "default",
  "subject": "heart",
  "action": "starred",
  "success": true,
  "message": "Successfully starred Anatomical Heart"
}
```

### 3. Unstar a Model

```http
DELETE /user/starred/{subject}?user_id=default
```

**Example:**
```http
DELETE /user/starred/heart?user_id=default
```

**Response:**
```json
{
  "user_id": "default",
  "subject": "heart",
  "action": "unstarred",
  "success": true,
  "message": "Successfully unstarred heart"
}
```

### 4. Check if Model is Starred

```http
GET /user/starred/check/{subject}?user_id=default
```

**Example:**
```http
GET /user/starred/check/heart?user_id=default
```

**Response:**
```json
{
  "user_id": "default",
  "subject": "heart",
  "is_starred": true
}
```

### 5. Dashboard Integration

The dashboard endpoint now includes starred models:

```http
GET /user/dashboard?user_id=default
```

**Response includes:**
```json
{
  "streak": 4,
  "xp": 180,
  "level": 3,
  "starred_models": [
    {
      "subject": "heart",
      "display_name": "Anatomical Heart",
      "starred_at": "2025-12-17T10:30:00Z",
      "category": "biology"
    }
  ],
  ...
}
```

## Available Subjects

You can star any of the 20+ educational subjects available in the system:

### Biology
- heart, cell, dna, mitochondria, plant_cell, neuron
- circulation, skeleton, digestion, photosynthesis

### Chemistry
- water_molecule, atom, periodic_table, reaction

### Physics
- lever, circuit, pulley, motor, em_wave

### Astronomy
- solar_system

## Usage Examples

### Using cURL

```bash
# Star a model
curl -X POST "http://localhost:8000/user/starred/heart?user_id=student1"

# Get all starred models
curl "http://localhost:8000/user/starred?user_id=student1"

# Check if model is starred
curl "http://localhost:8000/user/starred/check/heart?user_id=student1"

# Unstar a model
curl -X DELETE "http://localhost:8000/user/starred/heart?user_id=student1"
```

### Using JavaScript/Fetch

```javascript
// Star a model
async function starModel(subject) {
  const response = await fetch(
    `http://localhost:8000/user/starred/${subject}?user_id=default`,
    { method: 'POST' }
  );
  const data = await response.json();
  console.log(data.message);
}

// Get starred models
async function getStarredModels() {
  const response = await fetch(
    'http://localhost:8000/user/starred?user_id=default'
  );
  const data = await response.json();
  return data.starred_items;
}

// Check if starred
async function isStarred(subject) {
  const response = await fetch(
    `http://localhost:8000/user/starred/check/${subject}?user_id=default`
  );
  const data = await response.json();
  return data.is_starred;
}

// Unstar a model
async function unstarModel(subject) {
  const response = await fetch(
    `http://localhost:8000/user/starred/${subject}?user_id=default`,
    { method: 'DELETE' }
  );
  const data = await response.json();
  console.log(data.message);
}
```

## Data Storage

Starred models are stored in `/backend/app/data/starred.json`:

```json
{
  "default": {
    "starred_models": [
      {
        "subject": "heart",
        "display_name": "Anatomical Heart",
        "starred_at": "2025-12-17T10:30:00.123456",
        "category": "biology"
      }
    ]
  }
}
```

## Implementation Details

### Files Added

- `backend/app/routes/starred.py` - API routes for starred functionality
- `backend/app/services/starred_service.py` - Business logic for managing starred models
- `backend/app/schemas/starred.py` - Pydantic schemas for validation
- `backend/app/data/starred.json` - Data storage for starred models

### Files Modified

- `backend/app/main.py` - Added starred router and updated features list
- `backend/app/routes/dashboard.py` - Added starred models to dashboard
- `backend/app/schemas/dashboard.py` - Added starred_models field to dashboard response

## Frontend Integration (Example)

Here's how you might integrate this into a frontend:

```html
<!-- Star button -->
<button id="star-btn" onclick="toggleStar('heart')">
  ⭐ Star this model
</button>

<script>
async function toggleStar(subject) {
  const isStarred = await checkIfStarred(subject);
  
  if (isStarred) {
    await unstarModel(subject);
    updateStarButton(false);
  } else {
    await starModel(subject);
    updateStarButton(true);
  }
}

function updateStarButton(starred) {
  const btn = document.getElementById('star-btn');
  btn.textContent = starred ? '⭐ Starred' : '☆ Star this model';
  btn.classList.toggle('starred', starred);
}
</script>
```

## Benefits

1. **Quick Access**: Users can quickly find their favorite models
2. **Personalization**: Each user has their own starred collection
3. **Study Planning**: Users can star models they want to study later
4. **Progress Tracking**: Starred models help track learning interests
5. **Dashboard Integration**: Starred models are easily accessible from the dashboard

## Future Enhancements

Potential improvements for the starred feature:

- Add categories/tags for organizing starred items
- Add notes to starred models
- Share starred collections with others
- Sort starred items by date, category, or custom order
- Export starred list
- Starred items statistics and analytics
