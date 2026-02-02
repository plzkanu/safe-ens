import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatrolList from './pages/PatrolList';
import PatrolForm from './pages/PatrolForm';
import SAOList from './pages/SAOList';
import SAOForm from './pages/SAOForm';
import UserManagement from './pages/UserManagement';
import SiteManagement from './pages/SiteManagement';
import Statistics from './pages/Statistics';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* 순찰일지 */}
          <Route path="/patrol" element={<PatrolList />} />
          <Route path="/patrol/new" element={<PatrolForm />} />
          <Route path="/patrol/:id/edit" element={<PatrolForm />} />
          
          {/* SAO */}
          <Route path="/sao" element={<SAOList />} />
          <Route path="/sao/new" element={<SAOForm />} />
          <Route path="/sao/:id/edit" element={<SAOForm />} />
          
          {/* 통계 */}
          <Route path="/statistics" element={<Statistics />} />
          
          {/* 관리 (관리자만) */}
          <Route path="/users" element={<UserManagement />} />
          <Route path="/sites" element={<SiteManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
