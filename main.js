// Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize navigation dots
    initNavigationDots();
    
    // Remove loading state
    requestAnimationFrame(() => {
        document.body.classList.remove('loading');
    });
});

function initSmoothScroll() {
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

function initNavigationDots() {
    const sections = ['welcome', 'features'];
    const dots = document.querySelectorAll('.nav-dot');
    
    // Intersection Observer for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSection = entry.target.id;
                dots.forEach(dot => {
                    dot.classList.toggle('active', 
                        dot.dataset.section === currentSection);
                });
            }
        });
    }, { threshold: 0.5 });
    
    // Observe sections
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) observer.observe(element);
    });
    
    // Add click handlers to dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const section = document.getElementById(dot.dataset.section);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
