/**
 * EduLens - Rewards Component
 * Manages badges, achievements, and recommendations
 */

class RewardsManager {
    constructor() {
        this.achievementsGrid = document.getElementById('achievementsGrid');
        this.recommendationsList = document.getElementById('recommendationsList');
        this.badgeModal = document.getElementById('badgeModal');
        this.badges = [];
        this.recommendations = [];
        this.initEventListeners();
    }

    initEventListeners() {
        // Close badge modal
        document.getElementById('closeBadgeBtn').addEventListener('click', () => {
            this.badgeModal.classList.add('hidden');
        });
        
        this.badgeModal.addEventListener('click', (e) => {
            if (e.target === this.badgeModal) {
                this.badgeModal.classList.add('hidden');
            }
        });
    }

    async loadRewards() {
        try {
            const response = await fetch('/user/dashboard');
            if (!response.ok) throw new Error('Failed to fetch rewards');
            
            const data = await response.json();
            this.badges = data.badges || this.getDemoBadges();
            this.recommendations = data.recommended_topics || this.getDemoRecommendations();
            
            this.renderAchievements();
            this.renderRecommendations();
        } catch (error) {
            console.error('Error loading rewards:', error);
            this.badges = this.getDemoBadges();
            this.recommendations = this.getDemoRecommendations();
            this.renderAchievements();
            this.renderRecommendations();
        }
    }

    getDemoBadges() {
        return [
            {
                id: 'beginner',
                name: 'Beginner Explorer',
                description: 'View your first 3D model',
                icon: '🌟',
                unlocked: true,
                progress: 1,
                total: 1
            },
            {
                id: 'streak_3',
                name: '3-Day Streak',
                description: 'Maintain a 3-day learning streak',
                icon: '🔥',
                unlocked: true,
                progress: 3,
                total: 3
            },
            {
                id: 'perfect_score',
                name: 'Perfect Score',
                description: 'Get 100% on a quiz',
                icon: '💯',
                unlocked: false,
                progress: 0,
                total: 1
            },
            {
                id: 'scientist',
                name: 'Young Scientist',
                description: 'Upload 10 images',
                icon: '🔬',
                unlocked: false,
                progress: 3,
                total: 10
            },
            {
                id: 'explorer',
                name: 'Model Explorer',
                description: 'View 20 different models',
                icon: '🎯',
                unlocked: false,
                progress: 5,
                total: 20
            },
            {
                id: 'quiz_master',
                name: 'Quiz Master',
                description: 'Complete 25 quizzes',
                icon: '📚',
                unlocked: false,
                progress: 8,
                total: 25
            }
        ];
    }

    getDemoRecommendations() {
        return [
            {
                id: 'rec1',
                title: 'Blood Vessels',
                description: 'You studied the heart - explore how blood vessels work',
                subject: 'biology',
                icon: '🧬'
            },
            {
                id: 'rec2',
                title: 'Circulatory System',
                description: 'Complete your understanding of blood circulation',
                subject: 'biology',
                icon: '🧬'
            },
            {
                id: 'rec3',
                title: 'Cell Structure',
                description: 'Learn about the building blocks of life',
                subject: 'biology',
                icon: '🧬'
            }
        ];
    }

    renderAchievements() {
        this.achievementsGrid.innerHTML = '';
        
        // Show first 6 badges
        const displayBadges = this.badges.slice(0, 6);
        
        displayBadges.forEach(badge => {
            const badgeElement = this.createBadgeElement(badge);
            this.achievementsGrid.appendChild(badgeElement);
        });
    }

    createBadgeElement(badge) {
        const element = document.createElement('div');
        element.className = `achievement-badge ${badge.unlocked ? 'unlocked' : 'locked'}`;
        
        const icon = document.createElement('div');
        icon.className = 'achievement-icon';
        icon.textContent = badge.icon;
        
        const name = document.createElement('div');
        name.className = 'achievement-name';
        name.textContent = badge.name;
        
        element.appendChild(icon);
        element.appendChild(name);
        
        // Click to show details
        element.addEventListener('click', () => this.showBadgeDetail(badge));
        
        return element;
    }

    showBadgeDetail(badge) {
        const iconLarge = document.getElementById('badgeIconLarge');
        const name = document.getElementById('badgeName');
        const description = document.getElementById('badgeDescription');
        const progressContainer = document.getElementById('badgeProgressContainer');
        
        iconLarge.textContent = badge.icon;
        name.textContent = badge.name;
        description.textContent = badge.description;
        
        // Show progress if not unlocked
        if (!badge.unlocked && badge.progress !== undefined) {
            const progressPercent = (badge.progress / badge.total) * 100;
            progressContainer.innerHTML = `
                <div style="margin-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                        <span>Progress</span>
                        <span>${badge.progress} / ${badge.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            `;
        } else if (badge.unlocked) {
            progressContainer.innerHTML = `
                <div style="margin-top: 1rem; text-align: center; color: var(--success-color); font-weight: 600;">
                    ✓ Unlocked
                </div>
            `;
        } else {
            progressContainer.innerHTML = '';
        }
        
        this.badgeModal.classList.remove('hidden');
    }

    renderRecommendations() {
        this.recommendationsList.innerHTML = '';
        
        if (this.recommendations.length === 0) {
            this.recommendationsList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                    <p>Keep learning to get personalized recommendations!</p>
                </div>
            `;
            return;
        }
        
        this.recommendations.forEach(rec => {
            const recElement = this.createRecommendationElement(rec);
            this.recommendationsList.appendChild(recElement);
        });
    }

    createRecommendationElement(rec) {
        const element = document.createElement('div');
        element.className = 'recommendation-item';
        
        const title = document.createElement('div');
        title.className = 'recommendation-title';
        title.textContent = `${rec.icon || '💡'} ${rec.title}`;
        
        const description = document.createElement('div');
        description.className = 'recommendation-description';
        description.textContent = rec.description;
        
        element.appendChild(title);
        element.appendChild(description);
        
        // Click to explore topic
        element.addEventListener('click', () => {
            console.log('Exploring topic:', rec.title);
            // Could navigate to a specific learning page or search
        });
        
        return element;
    }

    async unlockBadge(badgeId) {
        const badge = this.badges.find(b => b.id === badgeId);
        if (badge && !badge.unlocked) {
            badge.unlocked = true;
            badge.progress = badge.total;
            
            // Show notification
            this.showBadgeUnlocked(badge);
            
            // Update display
            this.renderAchievements();
            
            // Notify backend
            try {
                await fetch('/user/badges/unlock', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ badge_id: badgeId })
                });
            } catch (error) {
                console.error('Error unlocking badge:', error);
            }
        }
    }

    showBadgeUnlocked(badge) {
        // Create a floating notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            animation: slideIn 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 2rem;">${badge.icon}</div>
                <div>
                    <div style="font-weight: 700;">Badge Unlocked!</div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">${badge.name}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for use in dashboard
window.RewardsManager = RewardsManager;
