/**
 * EduLens - Dashboard Manager
 * Main controller for the student dashboard
 */

class DashboardManager {
    constructor() {
        this.userData = null;
        this.initComponents();
        this.initEventListeners();
        this.loadDashboardData();
    }

    initComponents() {
        // Initialize all component managers
        this.streakManager = new StreakManager();
        this.activityManager = new ActivityManager();
        this.rewardsManager = new RewardsManager();
        this.mcqManager = new MCQManager(this);
    }

    initEventListeners() {
        // Continue learning button
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.continueLearning());
        }

        // Subject buttons
        document.querySelectorAll('.subject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const subject = e.currentTarget.dataset.subject;
                this.exploreSubject(subject);
            });
        });

        // Upload new image button
        const uploadNewBtn = document.getElementById('uploadNewBtn');
        if (uploadNewBtn) {
            uploadNewBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }

    async loadDashboardData() {
        try {
            // Show loading state (optional)
            this.showLoadingState();

            // Fetch dashboard data from backend
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DASHBOARD);
            
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();
            this.userData = data;
            
            // Update all dashboard components
            this.updateDashboard(data);
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
            
            // Load demo data as fallback
            const demoData = this.getDemoData();
            this.updateDashboard(demoData);
        } finally {
            this.hideLoadingState();
        }
    }

    getDemoData() {
        return {
            user_name: 'Student',
            streak: 4,
            completedToday: false,
            xp: 120,
            level: 2,
            xp_for_next_level: 200,
            total_badges: 2,
            models_viewed: 8,
            recent_activity: this.activityManager.getDemoActivities(),
            badges: this.rewardsManager.getDemoBadges(),
            recommended_topics: this.rewardsManager.getDemoRecommendations(),
            daily_mcqs: {
                count: 5,
                reward: 50
            },
            last_topic: 'Human Heart'
        };
    }

    updateDashboard(data) {
        // Update welcome section
        this.updateWelcomeSection(data);
        
        // Update streak
        this.streakManager.updateDisplay(data.streak || 0, data.completedToday || false);
        
        // Update XP and level
        this.updateLevelProgress(data);
        
        // Update MCQ info
        this.updateMCQInfo(data.daily_mcqs || {});
        
        // Load activities
        this.activityManager.activities = data.recent_activity || [];
        this.activityManager.renderActivities();
        
        // Load rewards
        this.rewardsManager.badges = data.badges || [];
        this.rewardsManager.recommendations = data.recommended_topics || [];
        this.rewardsManager.renderAchievements();
        this.rewardsManager.renderRecommendations();
        
        // Update quick start
        this.updateQuickStart(data);
    }

    updateWelcomeSection(data) {
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = data.user_name || 'Student';
        }

        const totalXP = document.getElementById('totalXP');
        if (totalXP) {
            this.animateNumber(totalXP, 0, data.xp || 0, 1000);
        }

        const totalBadges = document.getElementById('totalBadges');
        if (totalBadges) {
            const unlockedBadges = (data.badges || []).filter(b => b.unlocked).length;
            this.animateNumber(totalBadges, 0, unlockedBadges, 1000);
        }

        const modelsViewed = document.getElementById('modelsViewed');
        if (modelsViewed) {
            this.animateNumber(modelsViewed, 0, data.models_viewed || 0, 1000);
        }
    }

    updateLevelProgress(data) {
        const currentLevel = document.getElementById('currentLevel');
        const currentXP = document.getElementById('currentXP');
        const requiredXP = document.getElementById('requiredXP');
        const xpToNext = document.getElementById('xpToNext');
        const xpProgressFill = document.getElementById('xpProgressFill');

        const level = data.level || 1;
        const xp = data.xp || 0;
        const xpForNextLevel = data.xp_for_next_level || 100;
        const xpInCurrentLevel = xp % 100; // Simplified calculation
        const xpNeeded = xpForNextLevel - xp;

        if (currentLevel) currentLevel.textContent = level;
        if (currentXP) currentXP.textContent = xpInCurrentLevel;
        if (requiredXP) requiredXP.textContent = xpForNextLevel;
        if (xpToNext) xpToNext.textContent = xpNeeded;

        if (xpProgressFill) {
            const progress = (xpInCurrentLevel / xpForNextLevel) * 100;
            xpProgressFill.style.width = `${progress}%`;
        }
    }

    updateMCQInfo(mcqData) {
        const mcqCount = document.getElementById('mcqCount');
        const mcqReward = document.getElementById('mcqReward');

        if (mcqCount) mcqCount.textContent = mcqData.count || 5;
        if (mcqReward) mcqReward.textContent = mcqData.reward || 50;
    }

    updateQuickStart(data) {
        const lastTopic = document.getElementById('lastTopic');
        if (lastTopic && data.last_topic) {
            lastTopic.textContent = data.last_topic;
        } else if (lastTopic) {
            lastTopic.textContent = 'Start your first lesson';
        }
    }

    continueLearning() {
        if (this.userData && this.userData.last_topic) {
            console.log('Continuing:', this.userData.last_topic);
            // Navigate to specific topic or open last viewed model
            // For now, redirect to viewer with stored model
            window.location.href = 'viewer.html';
        } else {
            // No previous topic, go to upload page
            window.location.href = 'index.html';
        }
    }

    exploreSubject(subject) {
        console.log('Exploring subject:', subject);
        
        // Log activity
        this.activityManager.addActivity(
            'subject_explore',
            `Exploring ${subject}`,
            this.getSubjectIcon(subject)
        );
        
        // Could navigate to subject-specific page or show subject models
        alert(`Exploring ${subject}! This feature will show ${subject}-related models and lessons.`);
    }

    getSubjectIcon(subject) {
        const icons = {
            biology: '🧬',
            chemistry: '⚗️',
            physics: '⚛️'
        };
        return icons[subject] || '📚';
    }

    animateNumber(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = Math.round(end);
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    showLoadingState() {
        // Optional: Show skeleton screens or loading indicators
        console.log('Loading dashboard data...');
    }

    hideLoadingState() {
        // Optional: Hide loading indicators
        console.log('Dashboard data loaded');
    }

    // Public method to refresh dashboard after activities
    async refresh() {
        await this.loadDashboardData();
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardManager();
});
