/**
 * EduLens - Streak Component
 * Manages daily streak display and status
 */

class StreakManager {
    constructor() {
        this.streakNumber = document.getElementById('streakNumber');
        this.statusIcon = document.getElementById('statusIcon');
        this.statusText = document.getElementById('statusText');
        this.streakData = null;
    }

    async loadStreak() {
        try {
            const response = await fetch('/user/dashboard');
            if (!response.ok) throw new Error('Failed to fetch dashboard data');
            
            const data = await response.json();
            this.streakData = data;
            this.updateDisplay(data.streak, data.completedToday);
        } catch (error) {
            console.error('Error loading streak:', error);
            this.updateDisplay(0, false);
        }
    }

    updateDisplay(streak, completedToday) {
        // Update streak number
        this.streakNumber.textContent = streak;
        
        // Animate number change
        this.animateNumber(this.streakNumber, 0, streak, 1000);
        
        // Update status
        if (completedToday) {
            this.statusIcon.textContent = '✅';
            this.statusText.textContent = 'Great! You completed today\'s challenge!';
        } else {
            this.statusIcon.textContent = '⏰';
            this.statusText.textContent = 'Complete today\'s quiz to maintain streak';
        }
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

    async markDayComplete() {
        try {
            await fetch('/user/streak/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    timestamp: new Date().toISOString()
                })
            });
            
            // Reload streak data
            await this.loadStreak();
        } catch (error) {
            console.error('Error marking day complete:', error);
        }
    }
}

// Export for use in dashboard
window.StreakManager = StreakManager;
