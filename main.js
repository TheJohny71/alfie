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
      createElement('h1', null, 'Welcome to Alfie'),
      createElement('p', null, 'Your PTO planning application')
    )
  );
}

// Initialize the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(createElement(App));
