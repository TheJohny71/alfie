// effects.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize existing effects
    initializeParallaxEffect();
    initializeFeatureCards();
    initializeSmoothScroll();
    initializeCTAEffects();
    
    // Initialize new AI and enterprise effects
    initializeAIEffects();
    initializeCalendarEffects();
    initializeEnterpriseSync();
});

function initializeParallaxEffect() {
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
}

function initializeFeatureCards() {
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
}

function initializeAIEffects() {
    // AI suggestion animation
    const suggestionsContainer = document.querySelector('.ai-suggestions');
    if (suggestionsContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('suggestions-visible');
                }
            });
        }, { threshold: 0.5 });

        observer.observe(suggestionsContainer);
    }

    // Smart planning pulse effect
    const smartPlanningBtn = document.querySelector('.smart-planning-btn');
    if (smartPlanningBtn) {
        smartPlanningBtn.addEventListener('click', () => {
            smartPlanningBtn.classList.add('pulse');
            setTimeout(() => {
                smartPlanningBtn.classList.remove('pulse');
            }, 500);
        });
    }
}

function initializeCalendarEffects() {
    // Calendar day hover effect
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.addEventListener('mouseenter', () => {
            if (!day.classList.contains('padding')) {
                const coverage = day.getAttribute('data-coverage');
                if (coverage) {
                    showCoverageTooltip(day, coverage);
                }
            }
        });

        day.addEventListener('mouseleave', () => {
            hideCoverageTooltip();
        });
    });

    // Calendar navigation effects
    const calendarNav = document.querySelectorAll('.calendar-nav-btn');
    calendarNav.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.add('nav-clicked');
            setTimeout(() => {
                btn.classList.remove('nav-clicked');
            }, 200);
        });
    });
}

function initializeEnterpriseSync() {
    // Sync status indicator
    const syncIndicator = document.createElement('div');
    syncIndicator.className = 'sync-indicator';
    document.body.appendChild(syncIndicator);

    // Listen for sync events
    window.addEventListener('syncStarted', () => {
        syncIndicator.classList.add('syncing');
    });

    window.addEventListener('syncCompleted', () => {
        syncIndicator.classList.remove('syncing');
        syncIndicator.classList.add('sync-success');
        setTimeout(() => {
            syncIndicator.classList.remove('sync-success');
        }, 2000);
    });

    window.addEventListener('syncError', () => {
        syncIndicator.classList.remove('syncing');
        syncIndicator.classList.add('sync-error');
        setTimeout(() => {
            syncIndicator.classList.remove('sync-error');
        }, 2000);
    });
}

function showCoverageTooltip(element, coverage) {
    const tooltip = document.createElement('div');
    tooltip.className = 'coverage-tooltip';
    tooltip.textContent = `Team Coverage: ${coverage}%`;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 30}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    
    document.body.appendChild(tooltip);
}

function hideCoverageTooltip() {
    const tooltip = document.querySelector('.coverage-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function initializeSmoothScroll() {
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
}

function initializeCTAEffects() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                button.style.setProperty('--x', `${x}px`);
                button.style.setProperty('--y', `${y}px`);
            }
        });
    });
}

// New notification system
class NotificationManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-enter`;
        
        const icon = this.getIcon(type);
        const content = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
        `;
        
        notification.innerHTML = content;
        this.container.appendChild(notification);

        // Trigger enter animation
        setTimeout(() => {
            notification.classList.remove('notification-enter');
        }, 10);

        // Set up exit
        setTimeout(() => {
            notification.classList.add('notification-exit');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    getIcon(type) {
        switch (type) {
            case 'success':
                return '<i class="fas fa-check-circle"></i>';
            case 'error':
                return '<i class="fas fa-exclamation-circle"></i>';
            case 'warning':
                return '<i class="fas fa-exclamation-triangle"></i>';
            default:
                return '<i class="fas fa-info-circle"></i>';
        }
    }
}

// AI Loading Effects
class AILoadingEffect {
    constructor(container) {
        this.container = container;
        this.dots = 3;
        this.element = null;
    }

    start() {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.className = 'ai-loading';
            this.element.innerHTML = this.createDots();
            this.container.appendChild(this.element);
            this.animate();
        }
    }

    stop() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    createDots() {
        return Array(this.dots).fill('').map(() => 
            '<div class="ai-loading-dot"></div>'
        ).join('');
    }

    animate() {
        if (!this.element) return;
        const dots = this.element.querySelectorAll('.ai-loading-dot');
        dots.forEach((dot, i) => {
            dot.style.animationDelay = `${i * 0.2}s`;
        });
    }
}

// Enterprise Sync Animation
class EnterpriseSyncAnimation {
    constructor() {
        this.createElements();
        this.isAnimating = false;
    }

    createElements() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'sync-overlay';
        
        this.spinner = document.createElement('div');
        this.spinner.className = 'sync-spinner';
        
        this.status = document.createElement('div');
        this.status.className = 'sync-status';
        
        this.overlay.appendChild(this.spinner);
        this.overlay.appendChild(this.status);
    }

    start(message = 'Syncing with enterprise systems...') {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.status.textContent = message;
        document.body.appendChild(this.overlay);
        
        return new Promise(resolve => {
            this.resolveAnimation = resolve;
        });
    }

    update(message) {
        if (this.isAnimating) {
            this.status.textContent = message;
        }
    }

    finish(success = true, message = '') {
        if (!this.isAnimating) return;
        
        this.status.textContent = message || (success ? 'Sync completed!' : 'Sync failed');
        this.overlay.classList.add(success ? 'sync-success' : 'sync-error');
        
        setTimeout(() => {
            this.overlay.remove();
            this.isAnimating = false;
            if (this.resolveAnimation) {
                this.resolveAnimation(success);
                this.resolveAnimation = null;
            }
        }, 1500);
    }
}

// Initialize global instances
window.notificationManager = new NotificationManager();
window.enterpriseSync = new EnterpriseSyncAnimation();

// Performance optimization
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
    } else {
        document.body.classList.remove('reduce-motion');
    }
};

prefersReducedMotion.addEventListener('change', handleReducedMotion);
handleReducedMotion(prefersReducedMotion);
