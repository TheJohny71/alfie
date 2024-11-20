// Ensure single instance
let backgroundEffect = null;

class BackgroundEffect {
    constructor() {
        // Only create new instance if one doesn't exist
        if (backgroundEffect) {
            return backgroundEffect;
        }
        backgroundEffect = this;
        
        // Immediate initialization
        this.setupCanvas();
        this.stars = [];
        this.init();
        
        // Force first render
        requestAnimationFrame(() => {
            this.forceRender();
        });
    }

    setupCanvas() {
        // Get existing canvas or create new one
        this.canvas = document.getElementById('background-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'background-canvas';
        }
        
        // Ensure canvas has correct styles
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '-1',
            pointerEvents: 'none',
            display: 'block'
        });
        
        // Only append if not already in document
        if (!this.canvas.parentElement) {
            document.body.insertBefore(this.canvas, document.body.firstChild);
        }
        
        this.ctx = this.canvas.getContext('2d', { alpha: false });
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
        // Add resize listener with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
            }, 150);
        }, false);
        
        // Start animation loop
        this.animate();
    }

    drawGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#4B0082');  // Deep Purple at top
        gradient.addColorStop(1, '#6B46C1');  // Lighter Purple at bottom
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawStars(time) {
        this.ctx.save();
        
        this.stars.forEach(star => {
            // Update position
            star.x += star.speedX;
            star.y += star.speedY;
            
            // Wrap around edges
            if (star.x < 0) star.x = this.width;
            if (star.x > this.width) star.x = 0;
            if (star.y < 0) star.y = this.height;
            if (star.y > this.height) star.y = 0;

            // Calculate pulse effect
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
        
        this.ctx.restore();
    }

    forceRender() {
        if (!this.ctx) return;
        
        // Force an immediate render
        this.drawGradient();
        this.drawStars(Date.now() / 1000);
    }

    animate = () => {
        if (!this.ctx) return;
        
        const time = Date.now() / 1000;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGradient();
        this.drawStars(time);
        
        requestAnimationFrame(this.animate);
    }

    // Cleanup method
    destroy() {
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
        backgroundEffect = null;
    }
}

// Immediate initialization attempt
const initBackground = () => {
    if (!backgroundEffect) {
        try {
            backgroundEffect = new BackgroundEffect();
        } catch (error) {
            console.error('Failed to initialize background effect:', error);
        }
    }
};

// Multiple initialization points to ensure the effect starts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
} else {
    initBackground();
}

window.addEventListener('load', initBackground);

// Ensure effect runs when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && backgroundEffect) {
        backgroundEffect.forceRender();
    }
});

// Handle page errors gracefully
window.addEventListener('error', (event) => {
    if (backgroundEffect) {
        backgroundEffect.forceRender();
    }
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundEffect;
}
