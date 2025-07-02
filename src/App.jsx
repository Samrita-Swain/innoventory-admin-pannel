import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout/Layout';
// import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
// import { initializeDebugUtils } from './utils/debugUtils';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Clients from './pages/Clients';
import TypeOfWork from './pages/TypeOfWork';
import TypeOfWorkView from './pages/TypeOfWorkView';
import TypeOfWorkEdit from './pages/TypeOfWorkEdit';
import Orders from './pages/Orders';
import Audit from './pages/Audit';
import SubAdmins from './pages/SubAdmins';
import SubAdminView from './pages/SubAdminView';
import SubAdminEdit from './pages/SubAdminEdit';
import Settings from './pages/Settings';
import OrderView from './pages/OrderView';
import OrderEdit from './pages/OrderEdit';
import OrderPrint from './pages/OrderPrint';
import ClientView from './pages/ClientView';
import ClientEdit from './pages/ClientEdit';
import VendorView from './pages/VendorView';
import VendorEdit from './pages/VendorEdit';
import NotFound from './components/NotFound';
import { initApp } from './utils/initDatabase';

function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🔄 Initializing application...');

        // Initialize debug utilities
        // const cleanupDebug = initializeDebugUtils();

        // Skip database initialization for now to test the UI
        console.log('⚠️ Skipping database initialization for testing');
        setIsDbInitialized(false);

        console.log('✅ Application ready!');
      } catch (err) {
        console.error('❌ App initialization error:', err);
        setError(`Initialization failed: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initializing Application</h2>
          <p className="text-gray-600">Setting up database connection...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initialization Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show warning if database is not initialized, but continue
  const showDbWarning = !isDbInitialized;

  // Simple test component to check if React is working
  const TestComponent = () => (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '800px', margin: '0 auto' }}>
        <h1>🚀 Innoventory Admin Panel</h1>
        <div style={{ background: showDbWarning ? '#fef3cd' : '#d1ecf1', padding: '15px', borderRadius: '4px', margin: '20px 0' }}>
          <h3>{showDbWarning ? '⚠️ Database Warning' : '✅ System Status'}</h3>
          <p>{showDbWarning ? 'Database connection failed. Running in demo mode.' : 'All systems operational.'}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '20px 0' }}>
          <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
            <h4>📊 Dashboard</h4>
            <a href="/dashboard" style={{ color: '#1976d2', textDecoration: 'none' }}>Go to Dashboard</a>
          </div>
          <div style={{ background: '#f3e5f5', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
            <h4>🏢 Vendors</h4>
            <a href="/vendors" style={{ color: '#7b1fa2', textDecoration: 'none' }}>Manage Vendors</a>
          </div>
          <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
            <h4>👥 Clients</h4>
            <a href="/clients" style={{ color: '#388e3c', textDecoration: 'none' }}>Manage Clients</a>
          </div>
          <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
            <h4>⚙️ Settings</h4>
            <a href="/settings" style={{ color: '#f57c00', textDecoration: 'none' }}>App Settings</a>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>🧪 Test Links:</h3>
          <ul>
            <li><a href="/test.html">Basic System Test</a></li>
            <li><a href="/test-location-service.html">Location Service Test</a></li>
          </ul>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
          <h4>📋 System Info:</h4>
          <p><strong>React:</strong> ✅ Working</p>
          <p><strong>Router:</strong> ✅ Working</p>
          <p><strong>Database:</strong> {showDbWarning ? '❌ Disconnected' : '✅ Connected'}</p>
          <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Test route */}
        <Route path="/test-react" element={<TestComponent />} />

        {/* Main app routes with layout */}
        <Route path="/" element={<TestComponent />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/vendors" element={<Layout><Vendors /></Layout>} />
        <Route path="/vendors/:id" element={<Layout><VendorView /></Layout>} />
        <Route path="/vendors/:id/edit" element={<Layout><VendorEdit /></Layout>} />
        <Route path="/clients" element={<Layout><Clients /></Layout>} />
        <Route path="/clients/:id" element={<Layout><ClientView /></Layout>} />
        <Route path="/clients/:id/edit" element={<Layout><ClientEdit /></Layout>} />
        <Route path="/type-of-work" element={<Layout><TypeOfWork /></Layout>} />
        <Route path="/type-of-work/view/:id" element={<Layout><TypeOfWorkView /></Layout>} />
        <Route path="/type-of-work/edit/:id" element={<Layout><TypeOfWorkEdit /></Layout>} />
        <Route path="/orders" element={<Layout><Orders /></Layout>} />
        <Route path="/orders/:id" element={<Layout><OrderView /></Layout>} />
        <Route path="/orders/:id/edit" element={<Layout><OrderEdit /></Layout>} />
        <Route path="/orders/:id/print" element={<OrderPrint />} />
        <Route path="/audit" element={<Layout><Audit /></Layout>} />
        <Route path="/sub-admins" element={<Layout><SubAdmins /></Layout>} />
        <Route path="/sub-admins/:id" element={<Layout><SubAdminView /></Layout>} />
        <Route path="/sub-admins/:id/edit" element={<Layout><SubAdminEdit /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />

        {/* 404 page without layout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
