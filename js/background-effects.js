function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 1 and 3 pixels
    const size = Math.random() * 2 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random starting position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    
    // Animation
    const duration = Math.random() * 10 + 15; // 15-25 seconds
    const delay = Math.random() * 5; // 0-5 seconds delay
    
    particle.style.animation = `float ${duration}s ${delay}s infinite linear`;
    
    return particle;
}

function initParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 50; // Adjust based on screen size
    
    for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        container.appendChild(particle);
    }
}

// Add floating animation keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes float {
        0% {
            transform: translate(0, 0);
            opacity: 0;
        }
        10% {
            opacity: var(--particle-opacity, 0.3);
        }
        90% {
            opacity: var(--particle-opacity, 0.3);
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, -1000px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// Initialize particles when the document is loaded
document.addEventListener('DOMContentLoaded', initParticles);

// Reinitialize particles when window is resized
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const container = document.getElementById('particles-container');
        container.innerHTML = '';
        initParticles();
    }, 250);
});
