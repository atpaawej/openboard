import React from 'react';

interface GridBackgroundProps {
  variant?: 'grid' | 'dense' | 'dots' | 'crosshairs';
  className?: string;
  children?: React.ReactNode;
  showFade?: boolean;
}

export function GridBackground({
  variant = 'grid',
  className = '',
  children,
  showFade = true
}: GridBackgroundProps) {
  const getPatternClass = () => {
    switch (variant) {
      case 'dense':
        return 'bg-grid-dense';
      case 'dots':
        return 'bg-dot-matrix';
      case 'crosshairs':
      case 'grid':
      default:
        return 'bg-grid-lines';
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background line grid */}
      <div 
        className={`absolute inset-0 pointer-events-none ${getPatternClass()}`} 
        aria-hidden="true"
      />
      
      {/* Optional edge fade masks to blend seamlessly into solid sections */}
      {showFade && (
        <div 
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,transparent_20%,#090a0f_100%)]" 
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function SectionCrosshair({ position = 'top-left' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const posClasses = {
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
  }[position];

  return (
    <span 
      className={`absolute ${posClasses} w-3 h-3 text-zinc-500 font-mono text-xs flex items-center justify-center pointer-events-none select-none`}
      aria-hidden="true"
    >
      +
    </span>
  );
}
