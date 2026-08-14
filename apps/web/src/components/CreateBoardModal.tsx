import React, { useState, useEffect, useRef } from 'react';
import { IconClose } from './icons/Icons.js';
import { Button } from './ui/Button.js';

export interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

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
    const cleanName = name.trim() || 'Untitled Whiteboard';
    const cleanDesc = description.trim() || undefined;
    setError(null);

    try {
      await onCreate(cleanName, cleanDesc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create whiteboard');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container modal-size-md"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-create-title"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="modal-create-title" className="modal-title">
              New Whiteboard
            </h2>
            <p className="modal-subtitle">
              Create a local whiteboard canvas for diagrams and notes
            </p>
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
              <label htmlFor="create-board-name" className="form-label">
                Name
              </label>
              <input
                id="create-board-name"
                ref={inputRef}
                type="text"
                className="form-input"
                placeholder="e.g. Architecture Topology, API Specs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="create-board-desc" className="form-label">
                Description <span className="form-label-optional">(Optional)</span>
              </label>
              <textarea
                id="create-board-desc"
                className="form-textarea"
                placeholder="Brief description or context for this board..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={300}
                disabled={isSubmitting}
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
              id="btn-confirm-create-board"
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              Create Whiteboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
