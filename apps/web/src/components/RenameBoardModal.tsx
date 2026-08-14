import React, { useState, useEffect, useRef } from 'react';
import { IconClose } from './icons/Icons.js';
import { Button } from './ui/Button.js';

export interface RenameBoardModalProps {
  isOpen: boolean;
  boardId: string;
  initialName: string;
  onClose: () => void;
  onRename: (boardId: string, newName: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const RenameBoardModal: React.FC<RenameBoardModalProps> = ({
  isOpen,
  boardId,
  initialName,
  onClose,
  onRename,
  isSubmitting = false,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError(null);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, initialName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Board name cannot be empty');
      return;
    }
    setError(null);

    try {
      await onRename(boardId, cleanName);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename whiteboard');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container modal-size-md"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-rename-title"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="modal-rename-title" className="modal-title">
              Rename Whiteboard
            </h2>
            <p className="modal-subtitle">Update whiteboard name</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <IconClose size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error-banner">{error}</div>}

            <div className="form-group">
              <label htmlFor="rename-board-name" className="form-label">
                Name
              </label>
              <input
                id="rename-board-name"
                ref={inputRef}
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              id="btn-confirm-rename-board"
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting || !name.trim()}
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
