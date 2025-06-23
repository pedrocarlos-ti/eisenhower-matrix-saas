import React from 'react';

interface ProBadgeProps {
  variant?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const ProBadge: React.FC<ProBadgeProps> = ({ 
  variant = 'small', 
  showText = false,
  className = ''
}) => {
  const sizes = {
    small: 'w-4 h-4 text-xs',
    medium: 'w-5 h-5 text-sm',
    large: 'w-6 h-6 text-base'
  };

  if (showText) {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm ${className}`}>
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        PRO
      </span>
    );
  }

  return (
    <div className={`${sizes[variant]} bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-sm ${className}`}>
      <svg className={`${variant === 'small' ? 'w-2 h-2' : variant === 'medium' ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  );
};

export default ProBadge;