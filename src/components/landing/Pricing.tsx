import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingProps {
  onSignUp: () => void;
  onUpgrade: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onSignUp, onUpgrade }) => {
  const freePlan = {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started with task management',
    features: [
      'Unlimited tasks',
      'Basic Eisenhower Matrix',
      'Task filtering and search',
      'Local storage',
      'Export to CSV',
      'Mobile-friendly interface'
    ]
  };

  const proPlan = {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'Advanced features for power users and teams',
    features: [
      'Everything in Free plan',
      'Cloud synchronization',
      'Team collaboration',
      'Advanced analytics',
      'Smart reminders',
      'Priority support',
      'Multiple matrices',
      'Custom themes',
      'API access'
    ]
  };

  return (
    <div id="pricing" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that's right for you. Start for free and upgrade as you grow.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-3xl p-8 ring-1 ring-gray-200 lg:rounded-l-3xl lg:rounded-r-none">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">{freePlan.name}</h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-4xl font-bold tracking-tight text-gray-900">{freePlan.price}</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">forever</span>
            </p>
            <p className="mt-6 text-base leading-7 text-gray-600">{freePlan.description}</p>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              {freePlan.features.map((feature, index) => (
                <li key={index} className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-indigo-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={onSignUp}
              variant="outline"
              className="mt-8 w-full"
            >
              Get started
            </Button>
          </div>
          
          {/* Pro Plan */}
          <div className="rounded-3xl p-8 ring-1 ring-gray-200 bg-gray-900 lg:rounded-r-3xl lg:rounded-l-none">
            <h3 className="text-lg font-semibold leading-8 text-white">{proPlan.name}</h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-4xl font-bold tracking-tight text-white">{proPlan.price}</span>
              <span className="text-sm font-semibold leading-6 text-gray-400">{proPlan.period}</span>
            </p>
            <p className="mt-6 text-base leading-7 text-gray-300">{proPlan.description}</p>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
              {proPlan.features.map((feature, index) => (
                <li key={index} className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-indigo-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={onUpgrade}
              className="mt-8 w-full bg-white text-gray-900 hover:bg-gray-100"
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-base leading-7 text-gray-600">
            Need a custom plan for your enterprise? <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
