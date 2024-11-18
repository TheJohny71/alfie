// Import React and ReactDOM
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ModalProvider, ModalTriggers } from './components/modals';

// App Component
function App() {
  return (
    <ModalProvider>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#0D1117',
          color: '#FFFFFF',
          fontFamily: 'SF Pro Display, Inter, sans-serif'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '2rem'
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              marginBottom: '1rem'
            }}
          >
            Welcome to Alfie
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              opacity: 0.9
            }}
          >
            Your PTO planning application
          </p>
          <img
            src="./assets/alfie-icon.png"
            alt="Alfie Icon"
            style={{
              width: '64px',
              height: '64px',
              marginTop: '2rem'
            }}
          />
        </div>
        
        {/* Add the Modal Triggers */}
        <ModalTriggers />
        
        {/* Aurora Background Effect */}
        <div className="aurora-container">
          <div className="aurora-beam aurora-beam-1"></div>
          <div className="aurora-beam aurora-beam-2"></div>
          <div className="aurora-beam aurora-beam-3"></div>
          <div className="mouse-gradient"></div>
        </div>
        
        {/* Particles Container */}
        <div id="particles-container"></div>
      </div>
    </ModalProvider>
  );
}

// Initialize the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

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
  
  // Initialize particles
  const particlesContainer = document.getElementById('particles-container');
  if (particlesContainer) {
    initParticles();
  }
});

// Particle system initialization
function initParticles() {
  const container = document.getElementById('particles-container');
  const particleCount = Math.min(50, Math.floor(window.innerWidth / 20)); // Responsive particle count
  
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle();
    container.appendChild(particle);
  }
}

function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 2 + 1;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;
  particle.style.opacity = Math.random() * 0.5 + 0.2;
  
  const duration = Math.random() * 10 + 15;
  const delay = Math.random() * 5;
  
  particle.style.animation = `float ${duration}s ${delay}s infinite linear`;
  
  return particle;
}

// Reset particles on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const container = document.getElementById('particles-container');
    if (container) {
      container.innerHTML = '';
      initParticles();
    }
  }, 250);
});
