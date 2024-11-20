class BackgroundEffect {
    constructor() {
        this.canvas = document.getElementById('aurora-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.lastTime = 0;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    setupCanvas() {
        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = window.innerWidth * dpr;
            this.canvas.height = window.innerHeight * dpr;
            this.ctx.scale(dpr, dpr);
            this.canvas.style.width = `${window.innerWidth}px`;
            this.canvas.style.height = `${window.innerHeight}px`;
        };

        handleResize();
        window.addEventListener('resize', handleResize);
    }

    createParticles() {
        const particleCount = this.isReducedMotion ? 50 : 80;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                life: Math.random() * 100,
                opacity: Math.random() * 0.5 + 0.2,
                depth: Math.random() * 3 + 1
            });
        }
    }

    addEventListeners() {
        let mouseMoveTimeout;
        window.addEventListener('mousemove', (e) => {
            if (mouseMoveTimeout) return;
            mouseMoveTimeout = setTimeout(() => {
                const rect = this.canvas.getBoundingClientRect();
                const prevX = this.mousePosition.x;
                const prevY = this.mousePosition.y;
                
                this.mousePosition = {
                    x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
                    y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
                };
                
                this.velocity = {
                    x: (this.mousePosition.x - prevX) * 0.5,
                    y: (this.mousePosition.y - prevY) * 0.5
                };
                
                mouseMoveTimeout = null;
            }, 16);
        });

        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            this.particles = [];
            this.createParticles();
        });
    }

    updateParticles(deltaTime) {
        this.particles.forEach(particle => {
            particle.x += particle.speedX * deltaTime * particle.depth;
            particle.y += particle.speedY * deltaTime * particle.depth;

            if (!this.isReducedMotion) {
                const dx = this.mousePosition.x - particle.x;
                const dy = this.mousePosition.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200;

                if (distance < maxDistance) {
                    const force = (1 - distance / maxDistance) * 0.3;
                    particle.x -= dx * force;
                    particle.y -= dy * force;
                }
            }

            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;

            particle.life -= 0.1;
            if (particle.life <= 0) {
                particle.life = 100;
                particle.opacity = Math.random() * 0.5 + 0.2;
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();

            if (!this.isReducedMotion) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            }
        });
    }

    animate(currentTime = 0) {
        const deltaTime = (currentTime - this.lastTime) / 16;
        this.lastTime = currentTime;

        if (!document.hidden) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.updateParticles(deltaTime);
            this.drawParticles();
        }

        requestAnimationFrame(this.animate.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BackgroundEffect();
});
