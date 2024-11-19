// Wait for React to be available
document.addEventListener('DOMContentLoaded', () => {
    // Initialize background effects
    const initBackgroundEffects = () => {
        const aurora = document.querySelector('.background-effects');
        if (aurora) {
            document.addEventListener('mousemove', (e) => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                const beams = document.querySelectorAll('.aurora-beam');
                beams.forEach((beam, index) => {
                    const depth = (index + 1) * 0.05;
                    const moveX = (x - 0.5) * depth * 100;
                    const moveY = (y - 0.5) * depth * 100;
                    
                    beam.style.transform = `
                        translate(${moveX}px, ${moveY}px) 
                        rotate(${index * 120}deg)
                    `;
                });
            });
        }
    };

    // Initialize button effects
    const initButtonEffects = () => {
        const button = document.querySelector('.cta-button');
        if (button) {
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

            button.addEventListener('click', () => {
                // Add your navigation logic here
                console.log('Start Planning clicked');
            });
        }
    };

    // Initialize all effects
    initBackgroundEffects();
    initButtonEffects();
});
