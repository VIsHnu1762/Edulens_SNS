/**
 * EduLens - Recent Activity Component
 * Displays user's recent learning activities
 */

class ActivityManager {
    constructor() {
        this.activityFeed = document.getElementById('activityFeed');
        this.activities = [];
    }

    async loadActivities() {
        try {
            const response = await fetch('/user/dashboard');
            if (!response.ok) throw new Error('Failed to fetch activities');
            
            const data = await response.json();
            this.activities = data.recent_activity || this.getDemoActivities();
            this.renderActivities();
        } catch (error) {
            console.error('Error loading activities:', error);
            this.activities = this.getDemoActivities();
            this.renderActivities();
        }
    }

    getDemoActivities() {
        return [
            {
                type: 'model_view',
                description: 'Viewed 3D model: Heart',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                icon: '🎯'
            },
            {
                type: 'quiz_complete',
                description: 'Completed daily quiz (5/5)',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                icon: '✅'
            },
            {
                type: 'image_upload',
                description: 'Uploaded image for classification',
                timestamp: new Date(Date.now() - 10800000).toISOString(),
                icon: '📸'
            },
            {
                type: 'badge_earned',
                description: 'Earned "3-Day Streak" badge',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                icon: '🏆'
            },
            {
                type: 'level_up',
                description: 'Reached Level 2',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                icon: '⚡'
            }
        ];
    }

    renderActivities() {
        if (this.activities.length === 0) {
            this.activityFeed.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                    <p>No recent activities. Start learning to see your progress here!</p>
                </div>
            `;
            return;
        }

        this.activityFeed.innerHTML = '';
        
        this.activities.forEach(activity => {
            const item = this.createActivityItem(activity);
            this.activityFeed.appendChild(item);
        });
    }

    createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const icon = document.createElement('div');
        icon.className = 'activity-icon';
        icon.textContent = activity.icon || '📝';
        
        const info = document.createElement('div');
        info.className = 'activity-info';
        
        const description = document.createElement('div');
        description.className = 'activity-description';
        description.textContent = activity.description;
        
        const time = document.createElement('div');
        time.className = 'activity-time';
        time.textContent = this.formatTimeAgo(activity.timestamp);
        
        info.appendChild(description);
        info.appendChild(time);
        
        item.appendChild(icon);
        item.appendChild(info);
        
        return item;
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return past.toLocaleDateString();
    }

    async addActivity(type, description, icon) {
        const activity = {
            type,
            description,
            icon,
            timestamp: new Date().toISOString()
        };
        
        // Add to local list
        this.activities.unshift(activity);
        
        // Keep only last 10 activities
        if (this.activities.length > 10) {
            this.activities.pop();
        }
        
        // Re-render
        this.renderActivities();
        
        // Log to backend
        try {
            await fetch('/user/activity/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(activity)
            });
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }
}

// Export for use in dashboard
window.ActivityManager = ActivityManager;
