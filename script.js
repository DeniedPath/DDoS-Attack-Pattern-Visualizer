const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const attackTypeSelect = document.getElementById('attackType');
const intensitySlider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensityValue');
const startStopButton = document.getElementById('startStop');
const explanationDiv = document.getElementById('explanation');
const serverStatus = document.getElementById('server-status');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let animationId;
let isRunning = false;
let packets = [];

const attacks = {
    udp: {
        color: '#3498db',
        explanation: 'UDP Flood: Overwhelms the target with a large number of UDP packets. This attack exploits the stateless nature of UDP, flooding the target with packets that require processing. Mitigation strategies include implementing rate limiting, traffic filtering, and using specialized DDoS protection services.'
    },
    syn: {
        color: '#e74c3c',
        explanation: 'SYN Flood: Exploits TCP handshake by sending many SYN requests without completing the connection. This exhausts the target\'s resources for half-open connections. Mitigation includes using SYN cookies, increasing the backlog queue, and implementing connection timeout adjustments.'
    },
    http: {
        color: '#2ecc71',
        explanation: 'HTTP Flood: Overwhelms web servers with seemingly legitimate HTTP requests. This attack targets the application layer, making it harder to distinguish from normal traffic. Mitigation strategies involve implementing web application firewalls, using challenge-response tests (e.g., CAPTCHAs), and employing rate limiting based on IP addresses or session tokens.'
    }
};

function drawPacket(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const intensity = intensitySlider.value;
    const attackType = attackTypeSelect.value;

    if (Math.random() < intensity / 50) {
        packets.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            speed: Math.random() * 2 + 1,
            color: attacks[attackType].color
        });
    }

    packets.forEach((packet, index) => {
        packet.y -= packet.speed;
        drawPacket(packet.x, packet.y, packet.color);
        if (packet.y < 0) {
            packets.splice(index, 1);
        }
    });

    updateServerStatus(intensity);

    animationId = requestAnimationFrame(animate);
}

function updateServerStatus(intensity) {
    if (intensity < 30) {
        serverStatus.textContent = 'Normal';
        serverStatus.style.backgroundColor = '#2ecc71';
    } else if (intensity < 70) {
        serverStatus.textContent = 'Under Stress';
        serverStatus.style.backgroundColor = '#f39c12';
    } else {
        serverStatus.textContent = 'Overwhelmed';
        serverStatus.style.backgroundColor = '#e74c3c';
    }
}

function startStop() {
    if (isRunning) {
        cancelAnimationFrame(animationId);
        startStopButton.textContent = 'Start Attack';
        startStopButton.style.backgroundColor = '#e74c3c';
    } else {
        animate();
        startStopButton.textContent = 'Stop Attack';
        startStopButton.style.backgroundColor = '#c0392b';
    }
    isRunning = !isRunning;
}

function updateExplanation() {
    const attackType = attackTypeSelect.value;
    explanationDiv.textContent = attacks[attackType].explanation;
}

startStopButton.addEventListener('click', startStop);
attackTypeSelect.addEventListener('change', updateExplanation);
intensitySlider.addEventListener('input', () => {
    intensityValue.textContent = `${intensitySlider.value}%`;
});

updateExplanation();

// Responsive canvas
window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});