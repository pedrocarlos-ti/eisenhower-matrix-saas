import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignUp: () => void;
  onUpgrade: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onSignUp, 
  onUpgrade 
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-4 lg:px-8 bg-white/85 backdrop-blur-xl border-b border-gray-100/50 shadow-sm" aria-label="Global">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10 transition-transform duration-200 hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <a href="#" className="text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300">
              Eisenhower Matrix
            </a>
          </div>
          <div className="flex lg:hidden">
            <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-2">
            <a href="#features" className="relative text-sm font-semibold leading-6 text-gray-700 hover:text-indigo-600 transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 group">
              Features
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
            <a href="#pricing" className="relative text-sm font-semibold leading-6 text-gray-700 hover:text-indigo-600 transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 group">
              Pricing
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
            <a href="#testimonials" className="relative text-sm font-semibold leading-6 text-gray-700 hover:text-indigo-600 transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 group">
              Testimonials
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
            <a href="#" className="relative text-sm font-semibold leading-6 text-gray-700 hover:text-indigo-600 transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 group">
              Blog
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
            <button 
              onClick={onSignUp}
              className="text-sm font-semibold leading-6 text-gray-700 hover:text-indigo-600 transition-all duration-200 px-5 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 border border-transparent hover:border-gray-200"
            >
              Log in
            </button>
            <button 
              onClick={onGetStarted}
              className="relative rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ring-1 ring-white/10"
            >
              <span className="relative z-10">Get started</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <Hero onGetStarted={onGetStarted} />
      
      {/* Features Section */}
      <Features />
      
      {/* Testimonials Section */}
      <div id="testimonials">
        <Testimonials />
      </div>
      
      {/* Pricing Section */}
      <Pricing onSignUp={onSignUp} onUpgrade={onUpgrade} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
