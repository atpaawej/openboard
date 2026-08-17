import React from 'react';
import { SectionCrosshair } from './GridBackground';

interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: 'section' | 'div' | 'article' | 'nav' | 'header' | 'footer';
  className?: string;
  withBorder?: boolean;
  withCrosshairs?: boolean;
  children: React.ReactNode;
  id?: string;
}

export function Container({
  size = 'lg',
  as: Component = 'div',
  className = '',
  withBorder = false,
  withCrosshairs = false,
  children,
  id,
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }[size];

  const borderClasses = withBorder
    ? 'border-x border-white/[0.07] relative'
    : 'relative';

  return (
    <Component id={id} className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses} ${borderClasses} ${className}`}>
      {withBorder && withCrosshairs && (
        <>
          <SectionCrosshair position="top-left" />
          <SectionCrosshair position="top-right" />
          <SectionCrosshair position="bottom-left" />
          <SectionCrosshair position="bottom-right" />
        </>
      )}
      {children}
    </Component>
  );
}
