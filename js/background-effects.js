// Enhanced background-effects.js with more visible stars
class BackgroundEffect {
    constructor() {
        this.setupCanvas();
        this.stars = [];
        this.init();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100vh';
        this.canvas.style.zIndex = '-1';
        document.body.appendChild(this.canvas);
        this.resize();
    }

    resize = () => {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.createStars();
    }

    createStars() {
        this.stars = [];
        const numberOfStars = Math.floor((this.width * this.height) / 15000); // More stars
        
        for (let i = 0; i < numberOfStars; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 1.5 + 0.5, // Slightly larger stars
                opacity: Math.random() * 0.5 + 0.2, // More visible opacity
                pulse: Math.random() * Math.PI // Random start point for pulse
            });
        }
    }

    init() {
        window.addEventListener('resize', this.resize);
        this.animate();
    }

    drawGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#4B0082');    // Deep purple at top
        gradient.addColorStop(1, '#6B46C1');    // Lighter purple at bottom
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawStars(time) {
        this.stars.forEach(star => {
            // Create subtle pulsing effect
            const pulseOpacity = star.opacity + (Math.sin(star.pulse + time / 2000) * 0.15);
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
            this.ctx.fill();
        });
    }

    animate = () => {
        const time = Date.now();
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGradient();
        this.drawStars(time);
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundEffect();
});
