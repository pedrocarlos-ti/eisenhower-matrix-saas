import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

interface PricingProps {
  onSignUp: () => void;
  onUpgrade: () => void;
}

const PricingTier: React.FC<{ plan: any; onAction: () => void; isPopular?: boolean }> = ({ plan, onAction, isPopular = false }) => (
  <div className={`relative rounded-2xl border p-8 shadow-sm transition-all duration-300 ${isPopular ? 'bg-indigo-900 border-indigo-500/50 scale-105' : 'bg-white border-gray-100'}`}>
    {isPopular && (
      <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-x-2 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>Most Popular</span>
        </div>
      </div>
    )}
    <h3 className={`text-lg font-semibold ${isPopular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
    <p className={`mt-4 flex items-baseline gap-x-2 ${isPopular ? 'text-white' : 'text-gray-900'}`}>
      <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
      {plan.period && <span className="text-sm font-semibold text-gray-400">{plan.period}</span>}
      {!plan.period && <span className="text-sm font-semibold text-gray-500">forever</span>}
    </p>
    <p className={`mt-6 text-base leading-7 ${isPopular ? 'text-gray-300' : 'text-gray-600'}`}>{plan.description}</p>
    <ul role="list" className={`mt-8 space-y-3 text-sm leading-6 ${isPopular ? 'text-gray-300' : 'text-gray-600'}`}>
      {plan.features.map((feature: string, index: number) => (
        <li key={index} className="flex gap-x-3">
          <Check className={`h-6 w-5 flex-none ${isPopular ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button
      onClick={onAction}
      variant={isPopular ? 'default' : 'outline'}
      className={`mt-8 w-full ${isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}`}
    >
      {isPopular ? 'Upgrade to Pro' : 'Get started'}
    </Button>
  </div>
);

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
    <div id="pricing" className="py-24 sm:py-32 bg-gray-50/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that's right for you. Start for free and upgrade as you grow.
          </p>
        </div>
        
        <div className="isolate mx-auto mt-20 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          <PricingTier plan={freePlan} onAction={onSignUp} />
          <PricingTier plan={proPlan} onAction={onUpgrade} isPopular />
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-base leading-7 text-gray-600">
            Need a custom plan for your enterprise? <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
