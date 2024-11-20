// Fixed background-effects.js with prominent stars
class BackgroundEffect {
    constructor() {
        console.log('Initializing background effect');  // Debug log
        this.setupCanvas();
        this.stars = [];
        this.init();
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
        
        // Ensure canvas is inserted at the start of body
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas styles
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '-1',
            pointerEvents: 'none'
        });

        this.resize();
        console.log('Canvas setup complete');  // Debug log
    }

    resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Set canvas size accounting for DPI
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        
        // Store actual dimensions
        this.width = width;
        this.height = height;
        
        // Scale context for DPI
        this.ctx.scale(dpr, dpr);
        
        this.createStars();
        console.log(`Resize complete. Stars created: ${this.stars.length}`);  // Debug log
    }

    createStars() {
        this.stars = [];
        // More stars, increased minimum size
        const numberOfStars = Math.floor((this.width * this.height) / 6000);
        
        for (let i = 0; i < numberOfStars; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1.5,  // Increased minimum size
                speedX: (Math.random() - 0.5) * 0.2,  // Slower movement
                speedY: (Math.random() - 0.5) * 0.2,  // Slower movement
                brightness: Math.random() * 0.5 + 0.5,  // Increased brightness
                pulseSpeed: Math.random() * 0.01,  // Individual pulse speed
                pulseOffset: Math.random() * Math.PI * 2  // Random pulse start
            });
        }
    }

    init() {
        window.addEventListener('resize', () => {
            this.resize();
        });
        this.animate();
        console.log('Animation started');  // Debug log
    }

    drawGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#4B0082');  // Deep purple at top
        gradient.addColorStop(1, '#6B46C1');  // Lighter purple at bottom
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawStars(time) {
        this.stars.forEach(star => {
            // Update position with wrapping
            star.x += star.speedX;
            star.y += star.speedY;
            
            // Wrap around edges
            if (star.x < 0) star.x = this.width;
            if (star.x > this.width) star.x = 0;
            if (star.y < 0) star.y = this.height;
            if (star.y > this.height) star.y = 0;

            // Calculate pulsing effect
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

    animate = () => {
        const time = Date.now() / 1000;  // Convert to seconds for easier math
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background and stars
        this.drawGradient();
        this.drawStars(time);
        
        // Continue animation
        requestAnimationFrame(this.animate);
    }
}

// Ensure the effect is initialized when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating background effect');  // Debug log
    window.backgroundEffect = new BackgroundEffect();
});

// Backup initialization
window.addEventListener('load', () => {
    if (!window.backgroundEffect) {
        console.log('Backup initialization of background effect');  // Debug log
        window.backgroundEffect = new BackgroundEffect();
    }
});
