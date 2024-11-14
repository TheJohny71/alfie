const { createElement, useState, useEffect } = React;
const { createRoot } = ReactDOM;

// Basic App component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate some loading time
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return createElement(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0D1117',
        color: '#FFFFFF'
      }
    },
    createElement(
      'div',
      { style: { textAlign: 'center' } },
      createElement('h1', null, 'Welcome to Alfie'),
      createElement('p', null, 'Your PTO planning application'),
      isLoading && createElement('img', {
        src: './assets/loading-spinner.svg',
        alt: 'Loading',
        width: 40,
        height: 40
      })
    )
  );
};

// Create root and render
const root = createRoot(document.getElementById('root'));
root.render(createElement(React.StrictMode, null, createElement(App)));
