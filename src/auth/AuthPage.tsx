import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

enum AuthView {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}

const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>(AuthView.LOGIN);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Eisenhower Matrix</h1>
              <p className="text-slate-600 text-sm font-medium">Master your productivity with the proven decision framework</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="w-full max-w-md">
          {currentView === AuthView.LOGIN && (
            <LoginForm 
              onToggleForm={() => setCurrentView(AuthView.REGISTER)}
              onForgotPassword={() => setCurrentView(AuthView.FORGOT_PASSWORD)}
            />
          )}
          
          {currentView === AuthView.REGISTER && (
            <RegisterForm 
              onToggleForm={() => setCurrentView(AuthView.LOGIN)}
            />
          )}
          
          {currentView === AuthView.FORGOT_PASSWORD && (
            <ForgotPasswordForm 
              onBack={() => setCurrentView(AuthView.LOGIN)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-slate-600">
                &copy; {new Date().getFullYear()} Eisenhower Matrix. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-600 hover:text-slate-900 text-sm">Terms</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 text-sm">Privacy</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 text-sm">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
