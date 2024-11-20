// Fixed timing for background-effects.js
let backgroundEffect = null;

class BackgroundEffect {
    constructor() {
        // Immediate initialization
        this.setupCanvas();
        this.stars = [];
        this.init();
        // Force first render
        this.forceRender();
    }

    setupCanvas() {
        // Remove any existing canvas
        const existingCanvas = document.getElementById('background-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        // Create fresh canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'background-canvas';
        
        // Force canvas to take full size immediately
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '-1',
            pointerEvents: 'none',
            display: 'block' // Ensure canvas is displayed
        });
        
        // Insert canvas at the very start of body
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d', { alpha: false }); // Disable alpha for performance
        this.resize();
    }

    resize = () => {
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.createStars();
        // Force render after resize
        this.forceRender();
    }

    createStars() {
        this.stars = [];
        const numberOfStars = Math.floor((this.width * this.height) / 6000);
        
        for (let i = 0; i < numberOfStars; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1.5,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                brightness: Math.random() * 0.5 + 0.5,
                pulseSpeed: Math.random() * 0.01,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }

    init() {
        // Add resize listener
        window.addEventListener('resize', this.resize, false);
        // Start animation loop
        this.animate();
    }

    drawGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#4B0082');
        gradient.addColorStop(1, '#6B46C1');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawStars(time) {
        this.stars.forEach(star => {
            star.x += star.speedX;
            star.y += star.speedY;
            
            if (star.x < 0) star.x = this.width;
            if (star.x > this.width) star.x = 0;
            if (star.y < 0) star.y = this.height;
            if (star.y > this.height) star.y = 0;

            const pulse = Math.sin(time * star.pulseSpeed + star.pulseOffset);
            const opacity = star.brightness * (0.7 + pulse * 0.3);

            // Draw star glow
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size * 2
            );
            
            gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.beginPath();
            this.ctx.fillStyle = gradient;
            this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw star core
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 1.5})`;
            this.ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    forceRender() {
        // Force an immediate render
        this.drawGradient();
        this.drawStars(Date.now() / 1000);
    }

    animate = () => {
        const time = Date.now() / 1000;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGradient();
        this.drawStars(time);
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize immediately if document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (!backgroundEffect) {
        backgroundEffect = new BackgroundEffect();
    }
} else {
    // Otherwise wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        if (!backgroundEffect) {
            backgroundEffect = new BackgroundEffect();
        }
    });
}

// Backup initialization
window.addEventListener('load', () => {
    if (!backgroundEffect) {
        backgroundEffect = new BackgroundEffect();
    }
});

// Make sure background is visible when returning to the page
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && backgroundEffect) {
        backgroundEffect.forceRender();
    }
});
