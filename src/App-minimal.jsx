import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Simple test component
const TestComponent = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Application Test</h1>
      <p>If you can see this, the basic React app is working!</p>
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h3>✅ Working Components:</h3>
        <ul>
          <li>React Router</li>
          <li>Basic JSX rendering</li>
          <li>State management</li>
        </ul>
      </div>
      <button onClick={() => alert('Button works!')}>Test Button</button>
    </div>
  );
};

// Simple dashboard without database dependencies
const SimpleDashboard = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Simple Dashboard</h1>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <div style={{ marginTop: '20px' }}>
        <h3>Navigation Test:</h3>
        <a href="/test" style={{ marginRight: '10px' }}>Test Page</a>
        <a href="/clients" style={{ marginRight: '10px' }}>Clients</a>
        <a href="/vendors">Vendors</a>
      </div>
    </div>
  );
};

function MinimalApp() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f9f9f9' }}>
        <Routes>
          <Route path="/" element={<SimpleDashboard />} />
          <Route path="/test" element={<TestComponent />} />
          <Route path="*" element={
            <div style={{ padding: '20px' }}>
              <h1>404 - Page Not Found</h1>
              <a href="/">Go Home</a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default MinimalApp;
