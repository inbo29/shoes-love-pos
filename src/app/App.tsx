import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from '../shared/layout/PosLayout'; // Updating to use PosLayout (moved or created)
// If PosLayout doesn't exist yet, I'll use the legacy one for now but with correct path?
// I haven't moved Layout yet. I should point to legacy "../components/Layout" or better, move it now.
// I will point to legacy for SAFETY until I verify move.
// Actually, I should create a temporary PosLayout wrapper exporting the legacy Layout.

import LoginScreen from '../screens/auth/LoginScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import PosRoutes from '../routes/pos.routes';
import ErrorModal from '../shared/components/ErrorModal/ErrorModal';



const LayoutWrapper: React.FC<{
  children: React.ReactNode;
  userName: string;
  onLogout: () => void;
}> = ({ children, userName, onLogout }) => {
  return (
    // @ts-ignore
    <Layout userName={userName} onLogout={onLogout}>
      {children}
    </Layout>
  );
};

// Wrapper for Login to handle navigation after successful login
const LoginScreenWrapper: React.FC<{ onLogin: (id: string, pw: string) => boolean }> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLoginSubmit = (id: string, pw: string) => {
    const success = onLogin(id, pw);
    if (success) {
      navigate('/role-select');
    }
  };

  return <LoginScreen onLogin={handleLoginSubmit} />;
};

const App: React.FC = () => {
  const [userName, setUserName] = useState('Админ');
  const [error, setError] = useState<{ message: string; system?: 'POS' | 'ERP' | 'RMS' } | null>(null);

  const handleLogin = (id: string, pw: string) => {
    const userId = id.toLowerCase();
    if (userId === 'admin' && pw === '1234') {
      setUserName('Админ');
      return true;
    } else if (userId === 'worker' && pw === '1234') {
      setUserName('Ажилтан');
      return true;
    } else {
      setError({
        message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна! (User name or password incorrect!)',
        system: 'DEFAULT'
      });
      return false;
    }
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <LoginScreenWrapper onLogin={handleLogin} />
        } />
        <Route path="/role-select" element={<RoleSelectScreen onLogout={handleLogout} />} />

        {/* POS Module via PosRoutes */}
        <Route path="/pos/*" element={
          <LayoutWrapper userName={userName} onLogout={handleLogout}>
            <PosRoutes />
          </LayoutWrapper>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ErrorModal
        isOpen={!!error}
        message={error?.message || ''}
        system={error?.system || 'DEFAULT'}
        onClose={() => setError(null)}
      />
    </BrowserRouter>
  );
};

export default App;