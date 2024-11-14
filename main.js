// Basic App component
function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#0D1117',
      color: '#FFFFFF'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to Alfie</h1>
        <p>Your PTO planning application</p>
      </div>
    </div>
  );
}

// Create root and render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
