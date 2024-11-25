// main.js
import { BackgroundEffects } from './js/background-effects.js';
import { Calendar } from './js/calendar.js';
import { RegionManager } from './js/region-context.js';

class App {
    constructor() {
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Initialize core components
            const background = new BackgroundEffects();
            const calendar = new Calendar();
            const regionManager = new RegionManager();

            window.Alfie = {
                ...window.Alfie,
                background,
                calendar,
                regionManager
            };

            // Initialize components
            await calendar.initialize();
            this.initializeFeatureCards();
            this.initializeMagneticButtons();
            this.initializeScrollEffects();

            // Remove loading state
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');

        } catch (error) {
            console.error('Initialization error:', error);
            document.body.classList.add('loaded');
        }
    }

    initializeFeatureCards() {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach(card => {
            if (window.VanillaTilt) {
                window.VanillaTilt.init(card, {
                    max: 5,
                    speed: 400,
                    glare: true,
                    'max-glare': 0.2,
                    scale: 1.02
                });
            }
        });
    }

    initializeMagneticButtons() {
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
    }

    initializeScrollEffects() {
        const header = document.querySelector('.header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        });
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.message);
});
