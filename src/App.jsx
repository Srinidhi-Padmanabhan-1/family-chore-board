import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import ParentRegister from './Pages/auth/ParentRegister';
import ParentLogin from './Pages/auth/ParentLogin';
import ParentDashboard from './Pages/parent/ParentDashboard'; // <--- NEW IMPORT

// Temporary placeholders for future components
const Placeholder = ({ title }) => <div className="p-10 text-center text-2xl mt-20">{title}</div>;

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-blue-50 text-gray-800 font-sans">
        <Routes>
          {/* Component 1 */}
          <Route path="/" element={<Home />} />

          {/* Component 2 */}
          <Route path="/parent-register" element={<ParentRegister />} />
          <Route path="/parent-login" element={<ParentLogin />} />

          {/* Component 4 */}
          <Route path="/parent-dashboard" element={<ParentDashboard />} />

          {/* Upcoming Components */}
          <Route path="/child-login" element={<Placeholder title="Child Login (Component 3) Coming Next..." />} />
          <Route path="/family-setup" element={<Placeholder title="Family Setup (Component 5) Coming Next..." />} />
          <Route path="/audit-log" element={<Placeholder title="Audit Log (Component 8) Coming Next..." />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;