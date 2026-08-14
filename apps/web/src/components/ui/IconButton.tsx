import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  active?: boolean;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  active = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`icon-btn icon-btn-${variant} icon-btn-${size} ${active ? 'is-active' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
