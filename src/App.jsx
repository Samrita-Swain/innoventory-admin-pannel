import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Clients from './pages/Clients';
import TypeOfWork from './pages/TypeOfWork';
import Orders from './pages/Orders';
import Audit from './pages/Audit';
import SubAdmins from './pages/SubAdmins';
import SubAdminView from './pages/SubAdminView';
import SubAdminEdit from './pages/SubAdminEdit';
import Settings from './pages/Settings';
import OrderView from './pages/OrderView';
import OrderEdit from './pages/OrderEdit';
import ClientView from './pages/ClientView';
import ClientEdit from './pages/ClientEdit';
import VendorView from './pages/VendorView';
import VendorEdit from './pages/VendorEdit';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main app routes with layout */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/vendors" element={<Layout><Vendors /></Layout>} />
        <Route path="/vendors/:id" element={<Layout><VendorView /></Layout>} />
        <Route path="/vendors/:id/edit" element={<Layout><VendorEdit /></Layout>} />
        <Route path="/clients" element={<Layout><Clients /></Layout>} />
        <Route path="/clients/:id" element={<Layout><ClientView /></Layout>} />
        <Route path="/clients/:id/edit" element={<Layout><ClientEdit /></Layout>} />
        <Route path="/type-of-work" element={<Layout><TypeOfWork /></Layout>} />
        <Route path="/orders" element={<Layout><Orders /></Layout>} />
        <Route path="/orders/:id" element={<Layout><OrderView /></Layout>} />
        <Route path="/orders/:id/edit" element={<Layout><OrderEdit /></Layout>} />
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
