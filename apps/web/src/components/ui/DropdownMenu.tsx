import React, { useEffect, useRef } from 'react';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  onClick: () => void;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items?: (DropdownMenuItem | 'divider')[];
  children?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  items,
  children,
  align = 'right',
  className = '',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`dropdown-menu align-${align} ${className}`}
      role="menu"
      onClick={(e) => e.stopPropagation()}
    >
      {items
        ? items.map((item, idx) => {
            if (item === 'divider') {
              return <div key={`divider-${idx}`} className="dropdown-divider" role="separator" />;
            }
            return (
              <button
                key={item.id}
                type="button"
                className={`dropdown-item ${item.variant === 'danger' ? 'is-danger' : ''}`}
                role="menuitem"
                onClick={() => {
                  onClose();
                  item.onClick();
                }}
                disabled={item.disabled}
              >
                {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
                <span className="dropdown-item-label">{item.label}</span>
              </button>
            );
          })
        : children}
    </div>
  );
};
