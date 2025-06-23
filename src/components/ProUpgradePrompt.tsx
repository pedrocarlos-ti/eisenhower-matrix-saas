import React, { useState } from 'react';

interface ProUpgradePromptProps {
  onClose?: () => void;
  variant?: 'banner' | 'modal' | 'inline';
  feature?: string;
}

const ProUpgradePrompt: React.FC<ProUpgradePromptProps> = ({ 
  onClose, 
  variant = 'banner',
  feature 
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      title: 'Cloud Sync',
      description: 'Access your tasks from any device'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Team Collaboration',
      description: 'Share matrices with your team'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Advanced Analytics',
      description: 'Deeper insights and reporting'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Smart Reminders',
      description: 'AI-powered task notifications'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Priority Support',
      description: '24/7 email and chat support'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Unlimited Tasks',
      description: 'No limits on tasks or projects'
    }
  ];

  if (variant === 'banner') {
    return (
      <div className="glass-effect border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-900 font-semibold">
                  Upgrade to Priority Matrix Pro
                </p>
                <p className="text-slate-600 text-sm">
                  {feature ? `Unlock ${feature} and more premium features` : 'Get cloud sync, team collaboration, and advanced analytics'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-primary text-sm">
                Upgrade Now
              </button>
              <button 
                onClick={handleClose}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="card p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Ready for more powerful productivity?
            </h3>
            <p className="text-slate-600 mb-4">
              {feature ? `${feature} is a Pro feature. ` : ''}
              Upgrade to unlock cloud sync, team collaboration, and advanced analytics.
            </p>
            <button className="btn-primary">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal variant
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Upgrade to Priority Matrix Pro
            </h2>
            <p className="text-slate-600 text-lg">
              Supercharge your productivity with premium features
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                $9<span className="text-lg text-slate-600">/month</span>
              </div>
              <p className="text-slate-600 mb-4">
                Or $89/year (save 17%)
              </p>
              <button className="btn-primary w-full mb-3">
                Start Your Pro Trial
              </button>
              <p className="text-xs text-slate-500">
                14-day free trial • Cancel anytime • No credit card required
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleClose}
              className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProUpgradePrompt;