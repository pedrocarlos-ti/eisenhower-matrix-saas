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
      <Card className="max-w-md w-full bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl rounded-2xl">
        <CardHeader className="pb-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-900">Your Profile</CardTitle>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{name}</h3>
              <p className="text-gray-600 text-sm">{email}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-900">Current Plan</h4>
              {plan === 'pro' ? (
                <ProBadge />
              ) : (
                <span className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">Free</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {plan === 'pro' 
                ? 'You have access to all premium features.' 
                : 'Upgrade to Pro to unlock all premium features.'}
            </p>
            
            {plan === 'free' && (
              <Button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
              >
                {isUpgrading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : '✨ Upgrade to Pro'}
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Member since</span>
              <span className="font-medium text-gray-900">January 1, 2023</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last login</span>
              <span className="font-medium text-gray-900">Today</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={onLogout}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl"
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
