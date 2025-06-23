import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

enum AuthView {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
}

const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>(AuthView.LOGIN);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <a
              href="/"
              className="text-lg font-semibold leading-6 text-gray-900"
            >
              Eisenhower Matrix
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a
              href="/#features"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Features
            </a>
            <a
              href="/#pricing"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Pricing
            </a>
            <a
              href="/#testimonials"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Testimonials
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative overflow-hidden bg-white py-24 sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative mx-auto max-w-2xl px-6 lg:px-8">
          {currentView === AuthView.LOGIN && (
            <LoginForm
              onToggleForm={() => setCurrentView(AuthView.REGISTER)}
              onForgotPassword={() => setCurrentView(AuthView.FORGOT_PASSWORD)}
            />
          )}

          {currentView === AuthView.REGISTER && (
            <RegisterForm onToggleForm={() => setCurrentView(AuthView.LOGIN)} />
          )}

          {currentView === AuthView.FORGOT_PASSWORD && (
            <ForgotPasswordForm onBack={() => setCurrentView(AuthView.LOGIN)} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
