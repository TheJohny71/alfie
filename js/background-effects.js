// Minimal background-effects.js
class BackgroundEffect {
    constructor() {
        this.setupCanvas();
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
        this.drawBackground();
    }

    init() {
        window.addEventListener('resize', this.resize);
        this.drawBackground();
    }

    drawGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#4B0082');    // Deep purple at top
        gradient.addColorStop(1, '#6B46C1');    // Lighter purple at bottom
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawStars() {
        const numberOfStars = Math.floor((this.width * this.height) / 20000); // Adjust density
        
        for (let i = 0; i < numberOfStars; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const radius = Math.random() * 1.5;
            const opacity = Math.random() * 0.2 + 0.1; // Very subtle stars
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
        }
    }

    drawBackground() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGradient();
        this.drawStars();
    }
}

// Initialize effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundEffect();
});
