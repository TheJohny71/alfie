// Add subtle mouse movement effect to background
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.documentElement.style.setProperty('--mouse-x', `${x * 100}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y * 100}%`);
    
    // Subtle gradient shift based on mouse position
    const background = document.querySelector('.background-effects');
    if (background) {
        background.style.background = `linear-gradient(
            ${135 + (x - 0.5) * 10}deg,
            var(--color-primary),
            var(--color-secondary)
        )`;
    }
});
