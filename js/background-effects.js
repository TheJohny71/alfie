// background-effects.js
export class BackgroundEffects {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        if (!this.canvas) {
            this.createCanvas();
        }
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.animate();
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
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
    }

    animate = () => {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4B0082');
        gradient.addColorStop(1, '#663399');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize globally
window.Alfie = window.Alfie || {};
window.Alfie.BackgroundEffects = BackgroundEffects;
