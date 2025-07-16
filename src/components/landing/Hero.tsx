import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-24 sm:py-32">
      {/* Enhanced background with subtle patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.6),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-purple-50/20 to-blue-50/20"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-10">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 px-6 py-3 text-sm font-semibold text-indigo-700 backdrop-blur-sm">
              🚀 The productivity framework trusted by millions
            </div>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl leading-tight mb-8">
            Master Your Priorities with the 
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mt-4">
              Eisenhower Matrix
            </span>
          </h1>
          
          <p className="text-xl leading-8 text-gray-600 max-w-3xl mx-auto mb-12">
            The proven decision framework used by successful leaders to focus on what truly matters. 
            Organize tasks based on urgency and importance to maximize productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              onClick={onGetStarted}
              className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
            >
              Get Started for Free
            </Button>
            <a href="#features" className="text-lg font-semibold text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-2 group">
              <span>Learn more</span>
              <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        
        <div className="mt-20 flow-root">
          <div className="relative rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm p-4 ring-1 ring-gray-900/5 shadow-2xl lg:-m-4 lg:rounded-3xl lg:p-6">
            <div className="rounded-xl bg-white/60 backdrop-blur-sm p-2 shadow-inner">
              <img
                src="/app-screenshot.svg"
                alt="Eisenhower Matrix App Dashboard"
                width={1200}
                height={800}
                className="rounded-lg shadow-lg ring-1 ring-gray-900/10 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
