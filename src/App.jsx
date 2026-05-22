import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- ACTIVE IMPORTS (Files we have already built) ---
import Home from './Pages/Home';
import ParentRegister from './Pages/auth/ParentRegister';
import ParentLogin from './Pages/auth/ParentLogin';
import ParentDashboard from './Pages/parent/ParentDashboard';

import FamilySetup from './Pages/parent/FamilySetup';
import AuditLog from './Pages/parent/AuditLog';
import ChildLogin from './Pages/auth/ChildLogin';
import ChildDashboard from './Pages/child/ChildDashboard';
import RewardStore from './Pages/child/RewardStore';

// Temporary placeholder for routes we haven't built yet
const Placeholder = ({ title }) => <div className="p-10 text-center text-2xl mt-20 font-bold text-gray-500">{title}</div>;

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-blue-50 text-gray-800 font-sans">
        <Routes>
          {/* 1. Public Entry & Parent Auth */}
          <Route path="/" element={<Home />} />
          <Route path="/parent-register" element={<ParentRegister />} />
          <Route path="/parent-login" element={<ParentLogin />} />

          {/* 2. Parent Routes */}
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/family-setup" element={<FamilySetup/>} />
          <Route path="/audit-log" element={<AuditLog/>} />

          {/* 3. Child Auth & Protected Routes */}
          <Route path="/child-login" element={<ChildLogin/>} />
          <Route path="/child-dashboard" element={<ChildDashboard/>} />
          <Route path="/reward-store" element={<RewardStore />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;