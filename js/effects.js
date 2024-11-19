// Premium Effects Manager
class EffectsManager {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollEffects();
        this.initMagneticEffects();
        this.initParallaxEffects();
        this.initTiltEffects();
        this.initHoverEffects();
        this.handleReducedMotion();
    }

    initScrollEffects() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (entry.target.classList.contains('features-grid')) {
                        this.staggerChildren(entry.target);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-fade-up, .features-grid').forEach(el => {
            observer.observe(el);
        });

        this.handleHeaderScroll();
    }

    initMagneticEffects() {
        const magneticButtons = document.querySelectorAll('[data-magnetic]');
        
        magneticButtons.forEach(button => {
            let bounds;
            let strength = 0.25;

            const handleMouseMove = (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            };

            const handleMouseLeave = () => {
                button.style.transform = 'translate(0px, 0px)';
            };

            button.addEventListener('mouseenter', () => {
                bounds = button.getBoundingClientRect();
                button.addEventListener('mousemove', handleMouseMove);
            });

            button.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallaxSpeed || 0.5;
                const offset = scrolled * speed;
                element.style.transform = `translateY(${offset}px)`;
            });
        }, { passive: true });
    }

    initTiltEffects() {
        if (typeof VanillaTilt !== 'undefined') {
            const tiltElements = document.querySelectorAll('[data-tilt]');
            
            tiltElements.forEach(element => {
                VanillaTilt.init(element, {
                    max: 5,
                    speed: 400,
                    glare: true,
                    'max-glare': 0.2,
                    scale: 1.02
                });
            });
        }
    }

    initHoverEffects() {
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

    handleHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    staggerChildren(parent) {
        const children = parent.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
            child.classList.add('visible');
        });
    }

    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            if (e.matches) {
                document.documentElement.classList.add('reduce-motion');
            } else {
                document.documentElement.classList.remove('reduce-motion');
            }
        };
        
        prefersReducedMotion.addEventListener('change', handleMotionPreference);
        handleMotionPreference(prefersReducedMotion);
    }
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const effects = new EffectsManager();
    
    // Remove loading state
    requestAnimationFrame(() => {
        document.body.classList.remove('loading');
    });
});
