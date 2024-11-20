// background-effects.js
class AuroraEffect {
    constructor() {
        this.canvas = document.getElementById('aurora-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.particles = [];
        this.numberOfParticles = 50;
        this.init();
    }

    init() {
        // Create aurora particles
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 1,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
        });

        this.animate();
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        this.ctx.fill();
    }

    moveParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;

        // Random movement
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;

        // Limit velocity
        const maxVel = 2;
        const vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (vel > maxVel) {
            particle.vx = (particle.vx / vel) * maxVel;
            particle.vy = (particle.vy / vel) * maxVel;
        }

        // Pulsate opacity
        particle.alpha += (Math.random() - 0.5) * 0.01;
        particle.alpha = Math.max(0.1, Math.min(0.7, particle.alpha));
    }

    animate = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw connecting lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Update and draw particles
        this.particles.forEach(particle => {
            this.moveParticle(particle);
            this.drawParticle(particle);
        });

        requestAnimationFrame(this.animate);
    }
}

// Initialize effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const aurora = new AuroraEffect();
});
