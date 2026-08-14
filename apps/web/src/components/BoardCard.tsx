import React, { useState, useRef, useEffect } from 'react';
import type { BoardSummary } from '@openboard/shared';

export interface BoardCardProps {
  board: BoardSummary;
  isTrash?: boolean;
  onOpen: (id: string) => void;
  onRename: (board: BoardSummary) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (board: BoardSummary) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (board: BoardSummary) => void;
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Recently';
    }
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 0 || diffSeconds < 60) {
      return 'Just now';
    }
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recently';
  }
}

export const BoardCard: React.FC<BoardCardProps> = ({
  board,
  isTrash = false,
  onOpen,
  onRename,
  onDuplicate,
  onToggleFavorite,
  onDelete,
  onRestore,
  onPermanentDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Close context menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('.card-action-btn') ||
      (e.target as HTMLElement).closest('.card-context-menu')
    ) {
      return;
    }
    if (!isTrash) {
      onOpen(board.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(board.id);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  return (
    <div
      id={`board-card-${board.id}`}
      className={`board-card ${isTrash ? 'board-card-trash' : ''}`}
      onClick={handleCardClick}
    >
      {/* Thumbnail area */}
      <div className="board-card-thumbnail-wrapper">
        {board.thumbnail ? (
          <img
            src={board.thumbnail}
            alt={`${board.name} preview`}
            className="board-card-thumbnail-img"
            loading="lazy"
          />
        ) : (
          <div className="board-card-thumbnail-placeholder">
            <div className="thumbnail-grid-lines" />
            <span className="thumbnail-placeholder-icon">▦</span>
          </div>
        )}

        {!isTrash && (
          <button
            type="button"
            className={`card-action-btn card-favorite-btn ${board.favorite ? 'is-favorited' : ''}`}
            onClick={handleFavoriteClick}
            title={board.favorite ? 'Remove from Favorites' : 'Mark as Favorite'}
            aria-label={board.favorite ? 'Remove from Favorites' : 'Mark as Favorite'}
          >
            ★
          </button>
        )}

        <div className="card-menu-container">
          <button
            ref={menuBtnRef}
            type="button"
            className="card-action-btn card-more-btn"
            onClick={handleMenuToggle}
            title="Board actions"
            aria-label="Board options"
            aria-expanded={menuOpen}
          >
            •••
          </button>

          {menuOpen && (
            <div ref={menuRef} className="card-context-menu" role="menu">
              {!isTrash ? (
                <>
                  <button
                    type="button"
                    className="menu-item"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onOpen(board.id);
                    }}
                  >
                    <span className="menu-icon">↗</span>
                    <span>Open Whiteboard</span>
                  </button>
                  <button
                    type="button"
                    className="menu-item"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onRename(board);
                    }}
                  >
                    <span className="menu-icon">✎</span>
                    <span>Rename</span>
                  </button>
                  <button
                    type="button"
                    className="menu-item"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDuplicate(board.id);
                    }}
                  >
                    <span className="menu-icon">⎘</span>
                    <span>Duplicate</span>
                  </button>
                  <button
                    type="button"
                    className="menu-item"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onToggleFavorite(board.id);
                    }}
                  >
                    <span className="menu-icon">★</span>
                    <span>{board.favorite ? 'Unfavorite' : 'Favorite'}</span>
                  </button>
                  <div className="menu-divider" />
                  <button
                    type="button"
                    className="menu-item menu-item-danger"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDelete(board);
                    }}
                  >
                    <span className="menu-icon">🗑</span>
                    <span>Move to Trash</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="menu-item"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onRestore?.(board.id);
                    }}
                  >
                    <span className="menu-icon">↺</span>
                    <span>Restore Board</span>
                  </button>
                  <div className="menu-divider" />
                  <button
                    type="button"
                    className="menu-item menu-item-danger"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onPermanentDelete?.(board);
                    }}
                  >
                    <span className="menu-icon">✕</span>
                    <span>Delete Permanently</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Info Details */}
      <div className="board-card-details">
        <div className="board-card-title-row">
          <h3 className="board-card-title" title={board.name}>
            {board.name}
          </h3>
        </div>

        {board.description && (
          <p className="board-card-desc" title={board.description}>
            {board.description}
          </p>
        )}

        <div className="board-card-meta">
          <span className="board-card-time">Updated {formatRelativeTime(board.updatedAt)}</span>
          {isTrash && onRestore && (
            <button
              type="button"
              className="btn-trash-quick-restore"
              onClick={(e) => {
                e.stopPropagation();
                onRestore(board.id);
              }}
              title="Restore board"
            >
              Restore
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
