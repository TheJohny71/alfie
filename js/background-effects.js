// Complete background-effects.js
class BackgroundEffect {
    constructor() {
        this.setupCanvas();
        this.particles = [];
        this.init();
    }

    setupCanvas() {
        this.canvas = document.getElementById('background-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'background-canvas';
            document.body.insertBefore(this.canvas, document.body.firstChild);
        }

        this.ctx = this.canvas.getContext('2d');
        
        // Style canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        this.resize();
    }

    resize = () => {
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        const numberOfParticles = Math.floor((this.width * this.height) / 8000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: Math.random() * 0.2 - 0.1,
                opacity: Math.random() * 0.5 + 0.3,
                hue: Math.random() * 30 - 15
            });
        }
    }

    init() {
        window.addEventListener('resize', this.resize);
        this.animate();
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#4B0082');
        gradient.addColorStop(1, '#6B46C1');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    moveAndDrawParticles(time) {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x > this.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.width;
            if (particle.y > this.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.height;

            // Calculate pulsing opacity
            const pulsingOpacity = particle.opacity * (0.7 + Math.sin(time / 1000) * 0.3);

            // Draw particle with glow effect
            this.ctx.beginPath();
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            
            const color = `hsla(270, 100%, ${75 + particle.hue}%, ${pulsingOpacity})`;
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw particle core
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${pulsingOpacity * 1.5})`;
            this.ctx.fill();
        });
    }

    animate = () => {
        const time = Date.now();
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawBackground();
        this.moveAndDrawParticles(time);
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundEffect();
});

// Reinitialize if needed
window.addEventListener('load', () => {
    if (!document.querySelector('#background-canvas')) {
        new BackgroundEffect();
    }
});
