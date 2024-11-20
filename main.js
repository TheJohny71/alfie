// === Main Application JavaScript ===
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Remove loading state with slight delay
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }, 500);

    // Initialize components
    initializeFeatureCards();
    initializeMagneticButtons();
    initializeScrollEffects();
}

// === Feature Cards Initialization ===
function initializeFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        // Initialize vanilla-tilt
        VanillaTilt.init(card, {
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
            scale: 1.02
        });
    });
}

// === Magnetic Buttons ===
function initializeMagneticButtons() {
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

// === Scroll Effects ===
function initializeScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// === Utility Functions ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === Error Handling ===
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.message);
});
