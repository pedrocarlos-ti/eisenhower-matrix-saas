import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import ProBadge from './ProBadge';

interface UserProfileProps {
  name: string;
  email: string;
  plan: 'free' | 'pro';
  onClose: () => void;
  onLogout: () => void;
  onUpgrade: () => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, plan, onClose, onLogout, onUpgrade }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const handleUpgrade = async () => {
    if (plan === 'pro') return;
    
    setIsUpgrading(true);
    try {
      await onUpgrade();
    } finally {
      setIsUpgrading(false);
    }
  };
  


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{name}</h3>
              <p className="text-slate-600">{email}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-slate-900">Current Plan</h4>
              {plan === 'pro' ? (
                <ProBadge />
              ) : (
                <span className="text-sm bg-slate-200 text-slate-700 px-2 py-1 rounded-full">Free</span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-4">
              {plan === 'pro' 
                ? 'You have access to all premium features.' 
                : 'Upgrade to Pro to unlock all premium features.'}
            </p>
            
            {plan === 'free' && (
              <Button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isUpgrading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : '🚀 Upgrade to Pro'}
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Member since</span>
              <span className="font-medium text-slate-900">January 1, 2023</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Last login</span>
              <span className="font-medium text-slate-900">Today</span>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              onClick={onLogout}
              variant="outline"
              className="w-full"
            >
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
