import React from 'react';
import { Menu, X, CheckSquare, ArrowRight } from 'lucide-react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignUp: () => void;
  onUpgrade: () => void;
  isAuthenticated?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onSignUp, 
  onUpgrade,
  isAuthenticated = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-sm">
        <nav className="container mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Global">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center shadow-sm ring-1 ring-white/20">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <a href="#" className="text-xl font-semibold text-gray-700">
              Eisenhower
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium leading-6 text-gray-500 hover:text-indigo-600 transition-colors">
                {link.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            {isAuthenticated ? (
                <button onClick={onGetStarted} className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 text-white hover:text-slate-100 hover:bg-indigo-500 active:bg-indigo-800 active:text-indigo-100 focus-visible:outline-indigo-600 transition-all duration-300">
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
            ) : (
              <>
                <button onClick={onSignUp} className="text-sm font-semibold leading-6 text-gray-600 hover:text-indigo-600 transition-colors">
                  Log in
                </button>
                <button onClick={onGetStarted} className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 text-white hover:text-slate-100 hover:bg-indigo-500 active:bg-indigo-800 active:text-indigo-100 focus-visible:outline-indigo-600 transition-all duration-300">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>
        </nav>
        {/* Mobile menu, show/hide based on menu open state. */}
        {isMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Eisenhower Matrix</span>
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-white" />
                  </div>
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    {isAuthenticated ? (
                      <button onClick={onGetStarted} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Go to Dashboard
                      </button>
                    ) : (
                      <>
                        <button onClick={onSignUp} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          Log in
                        </button>
                        <button onClick={onGetStarted} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          Get started
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <Hero onGetStarted={onGetStarted} />
        <Features />
        <Testimonials />
        <Pricing onSignUp={onSignUp} onUpgrade={onUpgrade} />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
