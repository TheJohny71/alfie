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

            // Store instances globally
            window.Alfie = {
                ...window.Alfie,
                background,
                calendar,
                regionManager
            };

            // Initialize calendar after region manager
            await calendar.initialize();

            // Remove loading state
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');

        } catch (error) {
            console.error('Initialization error:', error);
            document.body.classList.add('loaded');
        }
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
} else {
    new App();
}
