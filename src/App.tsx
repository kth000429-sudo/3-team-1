import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import InputPage from './pages/InputPage';
import ReviewPage from './pages/ReviewPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const location = useLocation();

  if (!userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

const AppContent = () => {
  const { userId } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {userId && !isLoginPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={userId ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <InputPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review"
            element={
              <ProtectedRoute>
                <ReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {userId && !isLoginPage && (
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} ABC Ad Banner Creator. All rights reserved.</p>
            <p className="mt-1">For support, contact support@abc-internal.com</p>
          </div>
        </footer>
      )}
    </>
  );
};

export default App;
