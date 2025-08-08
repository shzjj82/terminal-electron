import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Servers from '@/pages/ssh/Servers';
import Keys from '@/pages/ssh/Keys';
import PortForwarding from '@/pages/ssh/PortForwarding';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Help from '@/pages/base/Help';
import Welcome from '@/pages/base/Welcome';
import Settings from '@/pages/base/Settings';
import Teams from '@/pages/team/Teams';
import TeamDetail from '@/pages/team/TeamDetail';
import Terminal from '@/components/terminal/Terminal';

import { DataContextProvider } from '@/components/data-context/DataContextProvider';
import { TeamPermissionProvider } from '@/contexts/TeamPermissionContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <DataContextProvider>
        <TeamPermissionProvider>
          <Routes>
          {/* 认证页面 - 不需要Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/welcome" element={<Welcome />} />
          
          {/* 主应用页面 - 需要Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="servers" element={<Servers />} />
            <Route path="keys" element={<Keys />} />
            <Route path="port-forwarding" element={<PortForwarding />} />
            <Route path="teams" element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } />
            <Route path="teams/:teamId" element={
              <ProtectedRoute>
                <TeamDetail />
              </ProtectedRoute>
            } />
            <Route path="help" element={<Help />} />
            <Route path="settings" element={<Settings />} />
            <Route path="terminal/:sessionId" element={<Terminal />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
        </TeamPermissionProvider>
      </DataContextProvider>
    </Router>
  );
}

export default App;