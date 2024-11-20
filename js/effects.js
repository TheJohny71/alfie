// Enhanced effects.js
document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        window.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                const mouseX = e.clientX / window.innerWidth - 0.5;
                const mouseY = e.clientY / window.innerHeight - 0.5;
                
                requestAnimationFrame(() => {
                    heroContent.style.transform = `
                        translate(${mouseX * 20}px, ${mouseY * 20}px)
                        scale(1.01)
                    `;
                });
            }
        });
    }

    // Intersection Observer for feature cards
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    };

    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('feature-visible');
                featureObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        featureObserver.observe(card);
        
        // Enhanced hover effect
        card.addEventListener('mouseenter', () => {
            if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                const icon = card.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) translateY(-5px)';
                }
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'none';
            }
        });
    });

    // Smooth scroll for navigation
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

    // CTA Button effect
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                const rect = ctaButton.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ctaButton.style.setProperty('--x', `${x}px`);
                ctaButton.style.setProperty('--y', `${y}px`);
            }
        });
    }

    // Performance optimizations
    let frameId;
    const throttle = (callback, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                callback.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotion = (e) => {
        if (e.matches) {
            document.body.classList.add('reduce-motion');
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        } else {
            document.body.classList.remove('reduce-motion');
        }
    };
    
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
    handleReducedMotion(prefersReducedMotion);
});
