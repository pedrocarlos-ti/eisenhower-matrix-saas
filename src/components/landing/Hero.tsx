import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Master Your Priorities with the 
            <span className="block text-primary mt-2">Eisenhower Matrix</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            The proven decision framework used by successful leaders to focus on what truly matters. 
            Organize tasks based on urgency and importance to maximize productivity.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={onGetStarted}
              className="px-8 py-6 text-lg bg-primary hover:bg-primary-hover shadow hover:shadow-md transition-all duration-300"
            >
              Get Started for Free
            </Button>
            <a href="#features" className="text-base font-semibold leading-7 text-gray-900 hover:text-indigo-600 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        
        <div className="mt-16 flow-root">
          <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <img
              src="/app-screenshot.svg"
              alt="App screenshot"
              width={1200}
              height={800}
              className="rounded-md shadow-lg ring-1 ring-gray-900/10 transition-all duration-300 hover:shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
