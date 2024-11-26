// Constants for attack types with enhanced visual properties
const ATTACK_TYPES = {
    udp: {
        color: '#3498db',
        name: 'UDP Flood',
        particleEffect: 'circle',
        explanation: 'UDP Flood: Overwhelms the target with UDP packets. Like sending countless letters without waiting for confirmation.'
    },
    syn: {
        color: '#e74c3c',
        name: 'SYN Flood',
        particleEffect: 'triangle',
        explanation: 'SYN Flood: Sends many connection requests without completing them, like knocking on a door repeatedly and running away.'
    },
    http: {
        color: '#2ecc71',
        name: 'HTTP Flood',
        particleEffect: 'square',
        explanation: 'HTTP Flood: Overwhelms web servers with numerous page requests, similar to constantly refreshing a webpage thousands of times.'
    },
    icmp: {
        color: '#9b59b6',
        name: 'ICMP Flood',
        particleEffect: 'diamond',
        explanation: 'ICMP Flood: Sends massive amounts of ping requests, like repeatedly asking "are you there?" until the server cant respond.'
    }
};

let canvas, ctx, animationId;
let packets = [];
let isRunning = false;
let lastFrameTime = 0;
let packetCount = 0;

function initializeVisualizer() {
    canvas = document.getElementById('visualizer');
    ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Event listeners
    document.getElementById('startStop').addEventListener('click', toggleAnimation);
    document.getElementById('attackType').addEventListener('change', updateExplanation);
    document.getElementById('intensity').addEventListener('input', updateIntensityDisplay);
    
    updateExplanation();
}

function animate(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const deltaTime = timestamp - lastFrameTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const intensity = document.getElementById('intensity').value;
    const attackType = document.getElementById('attackType').value;
    
    // Generate new packets based on intensity
    if (Math.random() < intensity / 50) {
        packets.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            speed: Math.random() * 2 + 1,
            type: attackType,
            size: Math.random() * 2 + 2
        });
        packetCount++;
    }
    
    // Update and draw packets
    packets = packets.filter(packet => {
        packet.y -= packet.speed * (deltaTime / 16);
        drawPacket(packet);
        return packet.y > 0;
    });
    
    updateServerStatus(intensity);
    
    if (isRunning) {
        animationId = requestAnimationFrame(animate);
    }
    
    lastFrameTime = timestamp;
}

function drawPacket(packet) {
    ctx.fillStyle = ATTACK_TYPES[packet.type].color;
    ctx.beginPath();
    
    switch (ATTACK_TYPES[packet.type].particleEffect) {
        case 'triangle':
            drawTriangle(packet.x, packet.y, packet.size);
            break;
        case 'square':
            drawSquare(packet.x, packet.y, packet.size);
            break;
        case 'diamond':
            drawDiamond(packet.x, packet.y, packet.size);
            break;
        default:
            ctx.arc(packet.x, packet.y, packet.size, 0, Math.PI * 2);
    }
    
    ctx.fill();
}

function toggleAnimation() {
    isRunning = !isRunning;
    const button = document.getElementById('startStop');
    
    if (isRunning) {
        animate(performance.now());
        button.textContent = 'Stop Attack';
        button.classList.add('active');
    } else {
        cancelAnimationFrame(animationId);
        button.textContent = 'Start Attack';
        button.classList.remove('active');
    }
}

function updateServerStatus(intensity) {
    const serverStatus = document.getElementById('server-status');
    const statusText = intensity < 30 ? 'Normal' : 
                      intensity < 70 ? 'Under Stress' : 
                      'Overwhelmed';
    
    serverStatus.textContent = statusText;
    serverStatus.className = `status-${statusText.toLowerCase().replace(' ', '-')}`;
}

function updateExplanation() {
    const attackType = document.getElementById('attackType').value;
    document.getElementById('explanation').textContent = ATTACK_TYPES[attackType].explanation;
}

function updateIntensityDisplay() {
    const value = document.getElementById('intensity').value;
    document.getElementById('intensityValue').textContent = `${value}%`;
}

// Helper functions for different particle shapes
function drawTriangle(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
}

function drawSquare(x, y, size) {
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
}

function drawDiamond(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeVisualizer);

// Quiz functionality
const quizQuestions = [
    {
        question: "What is a common DDoS attack type that floods with UDP packets?",
        options: ["UDP Flood", "SYN Flood", "HTTP Flood", "ICMP Flood"],
        answer: 0
    },
    {
        question: "Which attack sends many SYN requests without establishing a connection?",
        options: ["UDP Flood", "SYN Flood", "HTTP Flood", "ICMP Flood"],
        answer: 1
    },
    {
        question: "Which type of flood targets web server resources?",
        options: ["UDP Flood", "SYN Flood", "HTTP Flood", "ICMP Flood"],
        answer: 2
    },
    {
        question: "Which protocols does ICMP use for flooding?",
        options: ["TCP", "UDP", "ICMP", "HTTP"],
        answer: 2
    }
][1];

function initializeQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    let currentQuestion = 0;
    let score = 0;

    function displayQuestion() {
        const question = quizQuestions[currentQuestion];
        const optionsHtml = question.options
            .map((option, index) => `
                <button class="quiz-option" data-index="${index}">
                    ${option}
                </button>
            `).join('');

        quizContainer.innerHTML = `
            <div class="question">${question.question}</div>
            <div class="options">${optionsHtml}</div>
        `;

        // Add click handlers to options
        document.querySelectorAll('.quiz-option').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    }

    function handleAnswer(e) {
        const selectedAnswer = parseInt(e.target.dataset.index);
        const correct = selectedAnswer === quizQuestions[currentQuestion].answer;
        
        if (correct) score++;
        
        currentQuestion++;
        
        if (currentQuestion < quizQuestions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        quizContainer.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <p>Your score: ${score}/${quizQuestions.length}</p>
                <button onclick="initializeQuiz()">Try Again</button>
            </div>
        `;
    }

    displayQuestion();
}

// Resources section
const resources = {
    'DDoS Attack Basics': 'https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/',
    'DDoS Mitigation Strategies': 'https://www.imperva.com/learn/ddos/ddos-mitigation-strategies/',
    'OWASP DDoS Prevention': 'https://owasp.org/www-community/OWASP_DDoS_Prevention_Cheat_Sheet',
    'Network Security Basics': 'https://www.cisco.com/c/en/us/products/security/what-is-network-security.html',
    'Understanding UDP Flood': 'https://www.comparitech.com/blog/vpn-privacy/what-is-a-udp-flood-attack/'
}[2];

function initializeResources() {
    const resourcesContainer = document.getElementById('resources-container');
    resourcesContainer.innerHTML = Object.entries(resources)
        .map(([title, url]) => `
            <div class="resource-card">
                <h3>${title}</h3>
                <a href="${url}" target="_blank" rel="noopener noreferrer">Learn More</a>
            </div>
        `).join('');
}

// Tab switching functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and content
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const contentId = `${tab.dataset.tab}-tab`;
            document.getElementById(contentId).classList.add('active');
        });
    });
}

// Call this in your main initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeVisualizer();
    initializeTabs();
    initializeQuiz();
    initializeResources();
});

function initializeTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    document.body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    updateThemeButton(prefersDark);
    
    themeSwitch.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        document.body.classList.remove(isDark ? 'dark-theme' : 'light-theme');
        document.body.classList.add(isDark ? 'light-theme' : 'dark-theme');
        updateThemeButton(!isDark);
    });
}

function updateThemeButton(isDark) {
    const themeSwitch = document.getElementById('themeSwitch');
    themeSwitch.innerHTML = isDark ? 
        '<i class="fas fa-sun"></i> Light Mode' : 
        '<i class="fas fa-moon"></i> Dark Mode';
}

// Add to your existing initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeVisualizer();
    initializeTabs();
    initializeQuiz();
    initializeResources();
    initializeTheme();
});