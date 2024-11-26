// quiz.js
const quizContent = {
    questions: [
        {
            question: "What is the primary purpose of a DDoS attack?",
            options: [
                "To steal data from servers",
                "To make a service unavailable to users",
                "To inject malicious code",
                "To gain administrative access"
            ],
            correct: 1,
            explanation: "DDoS attacks aim to overwhelm services and make them inaccessible to legitimate users."
        },
        {
            question: "Which attack type sends incomplete TCP connection requests?",
            options: [
                "UDP Flood",
                "HTTP Flood",
                "SYN Flood",
                "ICMP Flood"
            ],
            correct: 2,
            explanation: "SYN Flood attacks exploit the TCP handshake by sending many incomplete connection requests."
        },
        {
            question: "What is a volumetric DDoS attack?",
            options: [
                "An attack targeting application vulnerabilities",
                "An attack consuming bandwidth with huge traffic",
                "An attack targeting CPU resources",
                "An attack targeting database connections"
            ],
            correct: 1,
            explanation: "Volumetric attacks overwhelm targets by consuming all available bandwidth."
        },
        {
            question: "Which is NOT a common DDoS mitigation strategy?",
            options: [
                "Rate limiting",
                "Traffic filtering",
                "Storing all attack data",
                "Blackholing"
            ],
            correct: 2,
            explanation: "Storing attack data is not a mitigation strategy and would actually consume more resources."
        }
    ],
    achievements: {
        beginner: {
            title: "DDoS Novice",
            requirement: 1,
            icon: "🌟"
        },
        intermediate: {
            title: "DDoS Defender",
            requirement: 2,
            icon: "🛡️"
        },
        expert: {
            title: "DDoS Master",
            requirement: 4,
            icon: "👑"
        }
    }
};

class QuizSection {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.init();
    }

    init() {
        this.renderQuiz();
        this.attachEventListeners();
    }

    renderQuiz() {
        const container = document.querySelector('#quiz-container');
        container.innerHTML = this.createQuizHTML();
        this.updateProgressBar();
    }

    createQuizHTML() {
        const question = quizContent.questions[this.currentQuestion];
        return `
            <div class="quiz-header">
                <div class="quiz-progress-text">Question ${this.currentQuestion + 1}/${quizContent.questions.length}</div>
                <div class="quiz-score">Score: ${this.score}</div>
            </div>
            <div class="quiz-question">
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" data-index="${index}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    updateProgressBar() {
        const progress = ((this.currentQuestion + 1) / quizContent.questions.length) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;
    }

    attachEventListeners() {
        document.querySelector('#quiz-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('quiz-option')) {
                this.handleAnswer(parseInt(e.target.dataset.index));
            }
        });
    }

    handleAnswer(selectedIndex) {
        const currentQuestion = quizContent.questions[this.currentQuestion];
        const isCorrect = selectedIndex === currentQuestion.correct;
        
        if (isCorrect) this.score++;
        
        this.userAnswers.push({
            question: currentQuestion.question,
            selectedAnswer: currentQuestion.options[selectedIndex],
            correct: isCorrect,
            explanation: currentQuestion.explanation
        });

        if (this.currentQuestion < quizContent.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuiz();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const container = document.querySelector('#quiz-container');
        const achievement = this.getAchievement();
        
        container.innerHTML = `
            <div class="quiz-results">
                <h2>Quiz Complete!</h2>
                <div class="achievement">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-title">${achievement.title}</div>
                </div>
                <div class="final-score">Final Score: ${this.score}/${quizContent.questions.length}</div>
                <div class="answers-review">
                    ${this.createReviewHTML()}
                </div>
                <button class="restart-quiz">Try Again</button>
            </div>
        `;

        document.querySelector('.restart-quiz').addEventListener('click', () => {
            this.resetQuiz();
        });
    }

    createReviewHTML() {
        return this.userAnswers.map((answer, index) => `
            <div class="review-item ${answer.correct ? 'correct' : 'incorrect'}">
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-text">${answer.question}</div>
                <div class="answer-text">Your answer: ${answer.selectedAnswer}</div>
                <div class="explanation">${answer.explanation}</div>
            </div>
        `).join('');
    }

    getAchievement() {
        const achievements = Object.values(quizContent.achievements)
            .sort((a, b) => b.requirement - a.requirement);
        
        return achievements.find(a => this.score >= a.requirement) || achievements[0];
    }

    resetQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.renderQuiz();
    }
}

// Initialize quiz when tab is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizSection();
});