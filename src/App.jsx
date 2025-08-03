import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            localStorage.getItem('adminToken') ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
