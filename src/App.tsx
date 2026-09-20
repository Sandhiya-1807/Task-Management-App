import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CheckSquare, Loader2 } from 'lucide-react';

function AppContent() {
  const { currentUser, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Loading screen while checking Firebase Auth session
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md mb-4 ring-8 ring-indigo-50">
          <CheckSquare className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Connecting to Task Management System...</span>
        </div>
      </div>
    );
  }

  // Protected route: If authenticated, render Dashboard
  if (currentUser) {
    return <DashboardPage />;
  }

  // Unauthenticated view: Login or Register
  if (authView === 'register') {
    return <RegisterPage onNavigateToLogin={() => setAuthView('login')} />;
  }

  return <LoginPage onNavigateToRegister={() => setAuthView('register')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
