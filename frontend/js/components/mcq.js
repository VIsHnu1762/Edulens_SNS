/**
 * EduLens - MCQ Component
 * Manages Multiple Choice Quiz functionality
 */

class MCQManager {
    constructor(dashboardManager) {
        this.dashboard = dashboardManager;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.startTime = null;
        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        this.modal = document.getElementById('mcqModal');
        this.resultModal = document.getElementById('resultModal');
        this.startBtn = document.getElementById('startQuizBtn');
        this.questionNumber = document.getElementById('questionNumber');
        this.totalQuestions = document.getElementById('totalQuestions');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.prevBtn = document.getElementById('prevQuestionBtn');
        this.nextBtn = document.getElementById('nextQuestionBtn');
        this.submitBtn = document.getElementById('submitQuizBtn');
        this.closeResultBtn = document.getElementById('closeResultBtn');
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.submitBtn.addEventListener('click', () => this.submitQuiz());
        this.closeResultBtn.addEventListener('click', () => this.closeResult());
        
        // Close modal on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeQuiz();
            }
        });
    }

    async startQuiz() {
        try {
            // Fetch quiz questions from backend
            const response = await fetch('/user/mcq/daily');
            if (!response.ok) throw new Error('Failed to fetch quiz');
            
            const data = await response.json();
            this.questions = data.questions || this.getDemoQuestions();
            this.currentQuestionIndex = 0;
            this.answers = new Array(this.questions.length).fill(null);
            this.startTime = Date.now();
            
            this.totalQuestions.textContent = this.questions.length;
            this.modal.classList.remove('hidden');
            this.showQuestion(0);
        } catch (error) {
            console.error('Error starting quiz:', error);
            // Use demo questions as fallback
            this.questions = this.getDemoQuestions();
            this.currentQuestionIndex = 0;
            this.answers = new Array(this.questions.length).fill(null);
            this.startTime = Date.now();
            this.totalQuestions.textContent = this.questions.length;
            this.modal.classList.remove('hidden');
            this.showQuestion(0);
        }
    }

    getDemoQuestions() {
        return [
            {
                id: 'q1',
                question: 'What are the four chambers of the human heart?',
                options: [
                    'Left atrium, right atrium, left ventricle, right ventricle',
                    'Upper chamber, lower chamber, left side, right side',
                    'Aorta, vena cava, pulmonary artery, pulmonary vein',
                    'Mitral valve, tricuspid valve, aortic valve, pulmonary valve'
                ],
                correct: 0
            },
            {
                id: 'q2',
                question: 'Which side of the heart pumps oxygenated blood to the body?',
                options: [
                    'Right side',
                    'Left side',
                    'Both sides equally',
                    'Neither side'
                ],
                correct: 1
            },
            {
                id: 'q3',
                question: 'What is the largest artery in the human body?',
                options: [
                    'Pulmonary artery',
                    'Carotid artery',
                    'Aorta',
                    'Femoral artery'
                ],
                correct: 2
            },
            {
                id: 'q4',
                question: 'How many times does the average human heart beat per minute at rest?',
                options: [
                    '40-50 beats',
                    '60-100 beats',
                    '120-140 beats',
                    '160-180 beats'
                ],
                correct: 1
            },
            {
                id: 'q5',
                question: 'What prevents blood from flowing backward in the heart?',
                options: [
                    'Muscles',
                    'Arteries',
                    'Valves',
                    'Chambers'
                ],
                correct: 2
            }
        ];
    }

    showQuestion(index) {
        const question = this.questions[index];
        this.currentQuestionIndex = index;
        
        // Update progress
        this.questionNumber.textContent = index + 1;
        
        // Update question text
        this.questionText.textContent = question.question;
        
        // Clear and populate options
        this.optionsContainer.innerHTML = '';
        question.options.forEach((option, optionIndex) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.dataset.index = optionIndex;
            
            // Highlight if already answered
            if (this.answers[index] === optionIndex) {
                btn.classList.add('selected');
            }
            
            btn.addEventListener('click', () => this.selectOption(optionIndex));
            this.optionsContainer.appendChild(btn);
        });
        
        // Update navigation buttons
        this.prevBtn.disabled = index === 0;
        
        if (index === this.questions.length - 1) {
            this.nextBtn.classList.add('hidden');
            this.submitBtn.classList.remove('hidden');
        } else {
            this.nextBtn.classList.remove('hidden');
            this.submitBtn.classList.add('hidden');
        }
        
        // Enable next button if question is answered
        this.nextBtn.disabled = this.answers[index] === null;
        this.submitBtn.disabled = this.answers.includes(null);
    }

    selectOption(optionIndex) {
        this.answers[this.currentQuestionIndex] = optionIndex;
        
        // Update UI
        const buttons = this.optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach((btn, idx) => {
            if (idx === optionIndex) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
        
        // Enable next/submit button
        this.nextBtn.disabled = false;
        this.submitBtn.disabled = this.answers.includes(null);
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.showQuestion(this.currentQuestionIndex - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.showQuestion(this.currentQuestionIndex + 1);
        }
    }

    async submitQuiz() {
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - this.startTime) / 1000);
        
        // Calculate score
        let correctAnswers = 0;
        this.questions.forEach((q, idx) => {
            if (this.answers[idx] === q.correct) {
                correctAnswers++;
            }
        });
        
        const score = correctAnswers;
        const total = this.questions.length;
        const percentage = (score / total) * 100;
        
        // Calculate XP (10 XP per correct answer)
        const earnedXP = correctAnswers * 10;
        
        try {
            // Submit to backend
            await fetch('/user/mcq/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    answers: this.answers,
                    score: score,
                    total: total,
                    time_taken: timeTaken,
                    xp_earned: earnedXP
                })
            });
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
        
        // Show results
        this.showResults(score, total, earnedXP, timeTaken);
        
        // Mark streak as complete
        if (this.dashboard.streakManager) {
            this.dashboard.streakManager.markDayComplete();
        }
    }

    showResults(score, total, earnedXP, timeTaken) {
        // Hide quiz modal
        this.modal.classList.add('hidden');
        
        // Update result modal
        const percentage = (score / total) * 100;
        
        // Set result icon and title based on performance
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');
        
        if (percentage === 100) {
            resultIcon.textContent = '🎉';
            resultTitle.textContent = 'Perfect Score!';
        } else if (percentage >= 80) {
            resultIcon.textContent = '🌟';
            resultTitle.textContent = 'Excellent Work!';
        } else if (percentage >= 60) {
            resultIcon.textContent = '👍';
            resultTitle.textContent = 'Good Job!';
        } else {
            resultIcon.textContent = '💪';
            resultTitle.textContent = 'Keep Trying!';
        }
        
        // Update score display
        document.getElementById('scoreValue').textContent = score;
        document.getElementById('scoreTotal').textContent = total;
        document.getElementById('earnedXP').textContent = earnedXP;
        document.getElementById('correctAnswers').textContent = score;
        document.getElementById('timeTaken').textContent = timeTaken;
        
        // Animate score circle
        const circle = document.getElementById('scoreCircle');
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        
        // Show result modal
        this.resultModal.classList.remove('hidden');
    }

    closeResult() {
        this.resultModal.classList.add('hidden');
        
        // Reload dashboard data
        if (this.dashboard) {
            this.dashboard.loadDashboardData();
        }
    }

    closeQuiz() {
        if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
            this.modal.classList.add('hidden');
        }
    }
}

// Export for use in dashboard
window.MCQManager = MCQManager;
