import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`input-field-group ${error ? 'has-error' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="input-field-label">
            {label}
          </label>
        )}
        <div className="input-field-wrapper">
          {leftIcon && <span className="input-field-icon-left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`input-field-control ${leftIcon ? 'with-left-icon' : ''} ${
              rightElement ? 'with-right-element' : ''
            } ${className}`}
            {...props}
          />
          {rightElement && <div className="input-field-right-element">{rightElement}</div>}
        </div>
        {error && <span className="input-field-error-text">{error}</span>}
        {hint && !error && <span className="input-field-hint-text">{hint}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
