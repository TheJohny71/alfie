// In the showPanel() method:
showPanel() {
    document.getElementById('modalBackdrop').classList.add('active');
    this.panel.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// In the hidePanel() method:
hidePanel() {
    document.getElementById('modalBackdrop').classList.remove('active');
    this.panel.classList.remove('active');
    document.body.style.overflow = '';
}

// Add touch support for mobile
setupTouchEvents() {
    let startY;
    this.panel.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
    });
    
    this.panel.addEventListener('touchmove', e => {
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 50) {
            this.hidePanel();
        }
    });
}
