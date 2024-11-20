class EffectsManager {
    constructor() {
        this.init();
    }

    init() {
        this.initTiltEffects();
        this.initButtonEffects();
        this.handleReducedMotion();
        this.removeLoading();
    }

    initTiltEffects() {
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll('.feature-card'), {
                max: 5,
                speed: 400,
                glare: true,
                'max-glare': 0.2,
                scale: 1.02
            });
        }
    }

    initButtonEffects() {
        const buttons = document.querySelectorAll('.cta-button');
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                button.style.setProperty('--mouse-x', `${x}px`);
                button.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    handleReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('reduce-motion');
        }
    }

    removeLoading() {
        requestAnimationFrame(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EffectsManager();
});
