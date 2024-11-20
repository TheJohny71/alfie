// Enhanced background-effects.js
class AuroraEffect {
    constructor() {
        this.setupCanvas();
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.gradientColors = ['#4B0082', '#6B46C1', '#36005F'];
        this.init();
        this.addEventListeners();
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
        this.createParticles();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        this.particles = [];
        const density = Math.min(this.width, this.height) * 0.1;
        const numberOfParticles = Math.floor(density);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 1,
                baseX: Math.random() * this.width,
                baseY: Math.random() * this.height,
                density: (Math.random() * 30) + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', this.resize);
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        });
    }

    drawGradientBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        const time = Date.now() * 0.001;
        
        this.gradientColors.forEach((color, index) => {
            const offset = (Math.sin(time + index) + 1) / 2;
            gradient.addColorStop(offset, color);
        });
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    animate = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawGradientBackground();

        this.particles.forEach(particle => {
            let dx = this.mouse.x - particle.x;
            let dy = this.mouse.y - particle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            const maxDistance = this.mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * particle.density;
            const directionY = forceDirectionY * force * particle.density;

            if (distance < this.mouse.radius) {
                particle.x -= directionX;
                particle.y -= directionY;
            } else {
                if (particle.x !== particle.baseX) {
                    dx = particle.x - particle.baseX;
                    particle.x -= dx/10;
                }
                if (particle.y !== particle.baseY) {
                    dy = particle.y - particle.baseY;
                    particle.y -= dy/10;
                }
            }

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
            this.ctx.fill();
        });

        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuroraEffect();
});
