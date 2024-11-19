document.addEventListener('DOMContentLoaded', () => {
    // Create aurora beams
    const aurora = document.querySelector('.background-effects');
    if (aurora) {
        aurora.innerHTML = `
            <div class="aurora-beam aurora-beam-1"></div>
            <div class="aurora-beam aurora-beam-2"></div>
            <div class="aurora-beam aurora-beam-3"></div>
            <div class="gradient-overlay"></div>
        `;
    }

    // Mouse movement effect
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
});
