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
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <a href="#" className="text-lg font-semibold leading-6 text-gray-900">
              Eisenhower Matrix
            </a>
          </div>
          <div className="flex lg:hidden">
            <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">Features</a>
            <a href="#pricing" className="text-sm font-semibold leading-6 text-gray-900">Pricing</a>
            <a href="#testimonials" className="text-sm font-semibold leading-6 text-gray-900">Testimonials</a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Blog</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
            <button 
              onClick={onSignUp}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in
            </button>
            <button 
              onClick={onGetStarted}
              className="rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get started
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
