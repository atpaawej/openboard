import React, { forwardRef } from 'react';
import { IconSearch, IconClose } from '../icons/Icons.js';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
  onClear: () => void;
  shortcutHint?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, shortcutHint = '/', placeholder = 'Search...', className = '', ...props }, ref) => {
    return (
      <div className={`search-input-container ${className}`}>
        <span className="search-input-icon">
          <IconSearch size={15} />
        </span>
        <input
          ref={ref}
          type="text"
          className="search-input-element"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
        {value ? (
          <button
            type="button"
            className="search-input-clear-btn"
            onClick={onClear}
            aria-label="Clear search query"
            title="Clear search (Esc)"
          >
            <IconClose size={13} />
          </button>
        ) : (
          shortcutHint && <span className="search-input-shortcut-pill">{shortcutHint}</span>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
