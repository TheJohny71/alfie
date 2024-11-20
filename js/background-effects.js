// Immediately Invoked Function Expression (IIFE) to avoid global scope pollution
(function() {
    class BackgroundEffect {
        constructor() {
            this.canvas = document.getElementById('background-canvas');
            if (!this.canvas) {
                console.error('Background canvas not found');
                return;
            }
            
            this.ctx = this.canvas.getContext('2d', { alpha: false });
            this.stars = [];
            
            // Initialize immediately
            this.resize();
            this.createStars();
            this.setupEventListeners();
            
            // Start animation immediately
            requestAnimationFrame(() => this.animate());
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

                this.ctx.beginPath();
                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 1.5})`;
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

    // Start the effect when DOM is ready
    function init() {
        new BackgroundEffect();
    }

    // Initialize immediately if document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
