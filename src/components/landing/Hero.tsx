import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MoveRight } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-purple-100/50 to-indigo-100/50 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 h-[40rem] w-[40rem] translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tl from-indigo-100/50 to-blue-100/50 blur-3xl opacity-40"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center rounded-full bg-white/80 border border-indigo-200/50 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm">
              <span className="mr-2">🚀</span> The productivity framework trusted by millions
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl leading-tight">
            Master Your Priorities with the 
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent mt-2">
              Eisenhower Matrix
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            The proven decision framework used by successful leaders to focus on what truly matters. 
            Organize tasks based on urgency and importance to maximize productivity.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 text-white hover:text-slate-100 hover:bg-indigo-500 active:bg-indigo-800 active:text-indigo-100 focus-visible:outline-indigo-600 transition-all duration-300"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="link" className="group text-base font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
              <span>Learn more</span>
              <MoveRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
        
        <div className="mt-16 sm:mt-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img
              src="/app-screenshot.svg"
              alt="Eisenhower Matrix App Dashboard"
              width={2432}
              height={1442}
              className="relative rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
