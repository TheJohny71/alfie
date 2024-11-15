// Interactive Light Trail Effect
class LightTrailEffect {
    constructor() {
        this.canvas = document.getElementById('interactiveCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.lastMouse = { x: 0, y: 0 };
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            this.addParticles();
        });
    }
    
    addParticles() {
        const deltaX = this.mouse.x - this.lastMouse.x;
        const deltaY = this.mouse.y - this.lastMouse.y;
        
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: this.mouse.x + (Math.random() - 0.5) * 20,
                y: this.mouse.y + (Math.random() - 0.5) * 20,
                size: Math.random() * 2 + 0.5,
                speedX: deltaX * (Math.random() * 0.2),
                speedY: deltaY * (Math.random() * 0.2),
                life: 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 0.02;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.life * 0.2})`;
            this.ctx.fill();
            
            return particle.life > 0;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.shapes = document.querySelectorAll('.parallax-shape');
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            this.shapes.forEach((shape, index) => {
                const depth = (index + 1) * 0.05;
                const moveX = (clientX - centerX) * depth;
                const moveY = (clientY - centerY) * depth;
                
                shape.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });
        });
    }
}

// Ambient Scene Transitions
class AmbientScenes {
    constructor() {
        this.scenes = document.querySelectorAll('.scene');
        this.currentScene = 0;
        this.startTransitions();
    }
    
    startTransitions() {
        setInterval(() => {
            this.scenes[this.currentScene].style.opacity = '0';
            this.currentScene = (this.currentScene + 1) % this.scenes.length;
            this.scenes[this.currentScene].style.opacity = '0.1';
        }, 5000);
    }
}

// Initialize Effects
document.addEventListener('DOMContentLoaded', () => {
    new LightTrailEffect();
    new ParallaxEffect();
    new AmbientScenes();
});

// Mouse-reactive Surface
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.documentElement.style.setProperty('--mouse-x', x.toString());
    document.documentElement.style.setProperty('--mouse-y', y.toString());
});
