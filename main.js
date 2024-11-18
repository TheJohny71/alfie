// Get React from global scope
const { createElement, useState, useEffect } = window.React;
const { createRoot } = window.ReactDOM;

// Import modal components
const { ModalProvider, ModalTriggers } = window.AlfieModals;

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [currentRegion, setCurrentRegion] = useState('UK');

  // Handle view transitions
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Region toggle handler
  const handleRegionToggle = () => {
    setCurrentRegion(prev => prev === 'UK' ? 'US' : 'UK');
  };

  return createElement(
    ModalProvider,
    null,
    createElement(
      'div',
      {
        className: 'app-container',
      },
      // Background Effects
      createElement('div', { className: 'background-effects' },
        createElement('div', { className: 'aurora-container' },
          createElement('div', { className: 'aurora-beam aurora-beam-1' }),
          createElement('div', { className: 'aurora-beam aurora-beam-2' }),
          createElement('div', { className: 'aurora-beam aurora-beam-3' })
        ),
        createElement('div', { className: 'mouse-gradient' })
      ),

      // Header with Region Toggle
      createElement('header', { className: 'header' },
        createElement('nav', { className: 'nav-container' },
          createElement('a', { href: '/', className: 'brand fade-in' }, 'alfie'),
          createElement('div', { className: 'region-toggle' },
            createElement('button', {
              className: `region-btn ${currentRegion === 'UK' ? 'active' : ''}`,
              onClick: () => setCurrentRegion('UK')
            }, 'UK'),
            createElement('button', {
              className: `region-btn ${currentRegion === 'US' ? 'active' : ''}`,
              onClick: () => setCurrentRegion('US')
            }, 'US')
          )
        )
      ),

      // Main Content
      createElement('main', null,
        // Welcome Section
        createElement('section', {
          id: 'welcome',
          className: 'hero',
          style: { display: currentView === 'welcome' ? 'block' : 'none' }
        },
          createElement('div', { className: 'content-wrapper' },
            createElement('div', { className: 'hero-content slide-up' },
              createElement('h1', { className: 'main-title' },
                createElement('span', { className: 'title-line' }, 'Make Time for'),
                createElement('span', { className: 'title-line' }, 'What Matters...')
              ),
              createElement('div', { className: 'hero-text fade-in-delayed' },
                createElement('p', { className: 'subtitle' }, 
                  'Because the best stories',
                  createElement('br'),
                  'unfold when you're living them'
                ),
                createElement('p', { className: 'tagline' }, 
                  'Your companion to a seamless year of leave'
                )
              ),
              createElement('div', { className: 'cta-wrapper fade-in-delayed-2' },
                createElement('button', {
                  className: 'cta-button',
                  onClick: () => handleViewChange('calendar')
                },
                  createElement('span', null, 'Start Planning'),
                  createElement('div', { className: 'button-glow' })
                )
              )
            )
          )
        ),

        // Calendar Section
        createElement('section', {
          id: 'calendar',
          className: 'calendar-section',
          style: { display: currentView === 'calendar' ? 'block' : 'none' }
        },
          createElement('div', { className: 'calendar-view' },
            // Calendar content is managed by calendar.js
          )
        )
      ),

      // Footer
      createElement('footer', { className: 'footer fade-in-delayed-2' },
        createElement('div', { className: 'footer-content' },
          createElement('nav', { className: 'footer-nav' },
            createElement('a', { href: '#', className: 'footer-link' }, 'Contact Us'),
            createElement('a', { href: '#', className: 'footer-link' }, 'Learn More'),
            createElement('a', { href: '#', className: 'footer-link' }, 'Privacy Policy')
          )
        )
      ),

      // Modal Triggers
      createElement(ModalTriggers, null)
    )
  );
}

// Initialize the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(createElement(App));

// Event Listeners for Background Effects
document.addEventListener('mousemove', (e) => {
  requestAnimationFrame(() => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.documentElement.style.setProperty('--mouse-x', `${x * 100}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y * 100}%`);

    const beams = document.querySelectorAll('.aurora-beam');
    beams.forEach((beam, index) => {
      const depth = (index + 1) * 0.03;
      const moveX = (x - 0.5) * depth * 100;
      const moveY = (y - 0.5) * depth * 100;
      beam.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${index * 120}deg)`;
    });
  });
});

// Responsive Handler
const handleResize = () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
};

window.addEventListener('resize', () => {
  requestAnimationFrame(handleResize);
});

// Initial calls
handleResize();

// Initialize particles on load
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });
});
