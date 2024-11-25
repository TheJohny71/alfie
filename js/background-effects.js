// background-effects.js
export class BackgroundEffects {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        if (!this.canvas) {
            this.createCanvas();
        }
        
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.stars = [];
        this.resize();
        this.createStars();
        this.setupEventListeners();
        requestAnimationFrame(() => this.animate());
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'background-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        `;
        document.body.appendChild(this.canvas);
    }

    resize = () => {
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
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

    setupEventListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createStars();
            }, 150);
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.animate();
            }
        });
    }

    drawGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#1E1E1E');
        gradient.addColorStop(1, '#2D2D2D');
        
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

            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size * 2
            );
            
            gradient.addColorStop(0, `rgba(107, 70, 193, ${opacity})`);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.beginPath();
            this.ctx.fillStyle = gradient;
            this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(107, 70, 193, ${opacity * 1.5})`;
            this.ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate = () => {
        if (document.hidden) return;
        
        const time = Date.now() / 1000;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGradient();
        this.drawStars(time);
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize globally
window.Alfie = window.Alfie || {};
window.Alfie.BackgroundEffects = BackgroundEffects;
