// === Main Application JavaScript ===

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all main functionality
    initializeApp();
});

function initializeApp() {
    // Remove loading state
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);

    // Initialize components
    initializeFeatureCards();
    initializeNavigation();
    initializeMagneticButtons();
    initializeScrollEffects();
}

// === Feature Cards Initialization ===
function initializeFeatureCards() {
    // Initialize tilt effect on feature cards
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

        // Add intersection observer for animation
        observeElement(card, () => {
            card.classList.add('visible');
        });
    });
}

// === Navigation System ===
function initializeNavigation() {
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section[id]');

    // Update active dot based on scroll position
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
            }
        });
    });

    // Add click handlers to dots
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
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
function observeElement(element, callback) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback();
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(element);
}

// === Performance Optimization ===
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
    // You can add error reporting service here
});
