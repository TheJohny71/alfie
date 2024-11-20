// Refined background-effects.js with slower, more subtle motion
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

    createParticles() {
        this.particles = [];
        // Reduced number of particles for more subtle effect
        const density = Math.min(this.width, this.height) * 0.05;
        const numberOfParticles = Math.floor(density);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 1.5 + 0.5, // Smaller particles
                baseX: Math.random() * this.width,
                baseY: Math.random() * this.height,
                density: (Math.random() * 20) + 1,
                alpha: Math.random() * 0.3 + 0.1 // Reduced opacity
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
        const time = Date.now() * 0.0002; // Slowed down gradient shift
        
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
            // Slower particle movement
            let dx = this.mouse.x - particle.x;
            let dy = this.mouse.y - particle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            const maxDistance = this.mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            
            // Reduced movement speed
            const directionX = forceDirectionX * force * particle.density * 0.3;
            const directionY = forceDirectionY * force * particle.density * 0.3;

            if (distance < this.mouse.radius) {
                particle.x -= directionX;
                particle.y -= directionY;
            } else {
                if (particle.x !== particle.baseX) {
                    dx = particle.x - particle.baseX;
                    particle.x -= dx * 0.05; // Slower return to position
                }
                if (particle.y !== particle.baseY) {
                    dy = particle.y - particle.baseY;
                    particle.y -= dy * 0.05; // Slower return to position
                }
            }

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
            this.ctx.fill();
        });

        requestAnimationFrame(this.animate);
    }

    init() {
        this.createParticles();
        this.animate();
    }
}

// Initialize effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuroraEffect();
});
