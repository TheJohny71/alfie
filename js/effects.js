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

    // Scroll-based effects
    initScrollEffects() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Special handling for features grid
                    if (entry.target.classList.contains('features-grid')) {
                        this.staggerChildren(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.scroll-fade-up, .features-grid').forEach(el => {
            observer.observe(el);
        });

        // Header scroll effect
        this.handleHeaderScroll();
    }

    // Magnetic button effect
    initMagneticEffects() {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        magneticElements.forEach(element => {
            let bounds;
            let strength = element.dataset.magneticStrength || 0.5;

            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = bounds;
                const x = clientX - left;
                const y = clientY - top;
                
                const centerX = x - width / 2;
                const centerY = y - height / 2;
                
                const distance = Math.sqrt(centerX ** 2 + centerY ** 2);
                const power = Math.min(distance / width, 1);
                
                gsap.to(element, {
                    duration: 0.6,
                    x: centerX * strength * power,
                    y: centerY * strength * power,
                    ease: 'power2.out'
                });
            };

            const handleMouseEnter = () => {
                bounds = element.getBoundingClientRect();
                element.addEventListener('mousemove', handleMouseMove);
            };

            const handleMouseLeave = () => {
                element.removeEventListener('mousemove', handleMouseMove);
                gsap.to(element, {
                    duration: 0.6,
                    x: 0,
                    y: 0,
                    ease: 'elastic.out(1, 0.3)'
                });
            };

            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    // Parallax effects
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

    // Tilt effect for cards
    initTiltEffects() {
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

    // Premium hover effects
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

    // Handle header scroll effect
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

    // Stagger children animations
    staggerChildren(parent) {
        const children = parent.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
            child.classList.add('visible');
        });
    }

    // Handle reduced motion preference
    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            if (e.matches) {
                // Remove all animations and transitions
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
