import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[3px] border-t-cyan-400 animate-spin"></div>
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-b-[3px] border-b-fuchsia-500 animate-spin-reverse"></div>
    </div>
  );
};

export default LoadingSpinner;
