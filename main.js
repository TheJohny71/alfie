// Get React and ReactDOM from the global scope
const { createElement } = React;
const { createRoot } = ReactDOM;

// Simple App component
function App() {
  return createElement(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0D1117',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif'
      }
    },
    createElement(
      'div',
      {
        style: {
          textAlign: 'center',
          padding: '2rem'
        }
      },
      createElement('h1', {
        style: {
          fontSize: '2.5rem',
          marginBottom: '1rem'
        }
      }, 'Welcome to Alfie'),
      createElement('p', {
        style: {
          fontSize: '1.25rem',
          opacity: 0.9
        }
      }, 'Your PTO planning application'),
      createElement('img', {
        src: './assets/alfie-icon.png',
        alt: 'Alfie Icon',
        style: {
          width: '64px',
          height: '64px',
          marginTop: '2rem'
        }
      })
    )
  );
}

// Initialize the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(createElement(App));
