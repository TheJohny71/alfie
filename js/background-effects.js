// Enhanced Background Effects with performance optimization
class BackgroundEffect {
    constructor() {
        this.canvas = document.getElementById('aurora-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.lastMousePosition = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.lastTime = 0;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        // Set up canvas
        this.setupCanvas();
        // Create particles
        this.createParticles();
        // Add event listeners
        this.addEventListeners();
        // Start animation loop
        this.animate();

        // Initialize aurora beams
        this.initAuroraBeams();
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
        const particleCount = this.isReducedMotion ? 30 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                life: Math.random() * 100,
                opacity: Math.random() * 0.5 + 0.2,
                depth: Math.random() * 3 + 1
            });
        }
    }

    addEventListeners() {
        // Optimized mouse move handler
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
                
                // Calculate velocity
                this.velocity = {
                    x: this.mousePosition.x - prevX,
                    y: this.mousePosition.y - prevY
                };
                
                mouseMoveTimeout = null;
            }, 16); // ≈ 60fps
        });

        // Handle reduced motion preference
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            this.particles = [];
            this.createParticles();
        });
    }

    drawGradientBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2,
            this.canvas.height / 2,
            0,
            this.canvas.width / 2,
            this.canvas.height / 2,
            Math.max(this.canvas.width, this.canvas.height) / 1.5
        );

        gradient.addColorStop(0, '#4B0082');
        gradient.addColorStop(0.5, '#36005F');
        gradient.addColorStop(1, '#1E1E1E');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateParticles(deltaTime) {
        this.particles.forEach(particle => {
            // Update position with smooth movement
            particle.x += particle.speedX * deltaTime * particle.depth;
            particle.y += particle.speedY * deltaTime * particle.depth;

            // Mouse influence
            if (!this.isReducedMotion) {
                const dx = this.mousePosition.x - particle.x;
                const dy = this.mousePosition.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const force = (1 - distance / maxDistance) * 0.2;
                    particle.x -= dx * force;
                    particle.y -= dy * force;
                }
            }

            // Wrap around edges
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;

            // Update life and opacity
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

            // Optional: Add glow effect
            if (!this.isReducedMotion) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            }
        });
    }

    initAuroraBeams() {
        const beams = document.querySelectorAll('.aurora-beam');
        beams.forEach((beam, index) => {
            beam.style.transform = `rotate(${index * 120}deg)`;
        });
    }

    animate(currentTime = 0) {
        const deltaTime = (currentTime - this.lastTime) / 16; // Normalize to ~60fps
        this.lastTime = currentTime;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.drawGradientBackground();

        // Update and draw particles
        if (!document.hidden) {
            this.updateParticles(deltaTime);
            this.drawParticles();
        }

        // Request next frame
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create background effect
    const effect = new BackgroundEffect();

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize magnetic buttons
    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 0.25;
            button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0px, 0px)';
        });
    });

    // Remove loading class to trigger intro animation
    requestAnimationFrame(() => {
        document.body.classList.remove('loading');
    });
});
