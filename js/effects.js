// Mouse Movement Handler
document.addEventListener('mousemove', (e) => {
    // Update CSS variables for mouse position
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.documentElement.style.setProperty('--mouse-x', `${x * 100}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y * 100}%`);

    // Update aurora beams subtly based on mouse position
    const beams = document.querySelectorAll('.aurora-beam');
    beams.forEach((beam, index) => {
        const depth = (index + 1) * 0.03;
        const moveX = (x - 0.5) * depth * 100;
        const moveY = (y - 0.5) * depth * 100;
        
        beam.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${index * 120}deg)`;
    });
});

// Button Glow Effect
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / button.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / button.clientHeight) * 100;
        
        const glow = button.querySelector('.button-glow');
        if (glow) {
            glow.style.setProperty('--x', `${x}%`);
            glow.style.setProperty('--y', `${y}%`);
        }
    });
});

// Performance Optimization
let rafId = null;
const optimizedMouseMove = (callback) => {
    return (e) => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(() => {
            callback(e);
            rafId = null;
        });
    };
};

// Responsive Handler
const handleResize = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
};

window.addEventListener('resize', optimizedMouseMove(handleResize));
handleResize(); // Initial call

// Page Load Animation Sequence
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });
});
