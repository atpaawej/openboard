import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { BoardSummary } from '@openboard/shared';
import { BoardCard } from '../components/BoardCard.js';
import { CreateBoardModal } from '../components/CreateBoardModal.js';
import { RenameBoardModal } from '../components/RenameBoardModal.js';
import { ConfirmDialog } from '../components/ConfirmDialog.js';
import { SearchInput } from '../components/ui/SearchInput.js';
import { Button } from '../components/ui/Button.js';
import { EmptyState } from '../components/ui/EmptyState.js';
import { BoardCardSkeleton } from '../components/ui/Skeleton.js';
import { useToast } from '../components/ui/ToastContext.js';
import {
  IconPlus,
  IconGrid,
  IconClock,
  IconStar,
  IconTrash,
  IconSearch,
} from '../components/icons/Icons.js';

type DashboardFilter = 'all' | 'recent' | 'favorites' | 'trash';
type SortOption = 'updatedAt:desc' | 'createdAt:desc' | 'name:asc' | 'name:desc';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const filter = (searchParams.get('filter') as DashboardFilter) || 'all';
  const isTrash = filter === 'trash';

  // Boards data state
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('updatedAt:desc');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [renameTarget, setRenameTarget] = useState<BoardSummary | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const [trashTarget, setTrashTarget] = useState<BoardSummary | null>(null);
  const [isTrashing, setIsTrashing] = useState(false);

  const [permDeleteTarget, setPermDeleteTarget] = useState<BoardSummary | null>(null);
  const [isPermDeleting, setIsPermDeleting] = useState(false);

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch boards from API
  const fetchBoards = useCallback(async () => {
    try {
      setErrorMessage(null);
      setLoading(true);

      const params = new URLSearchParams();
      params.set('filter', filter);

      if (debouncedQuery) {
        params.set('q', debouncedQuery);
      }

      const [sortBy, sortDirection] = sortOption.split(':');
      if (sortBy) params.set('sortBy', sortBy);
      if (sortDirection) params.set('sortDirection', sortDirection);

      const res = await fetch(`/api/boards?${params.toString()}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || `Server returned ${res.status}`);
      }

      const json = await res.json();
      setBoards(json.data || []);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to connect to OpenBoard server.',
      );
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedQuery, sortOption]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Listen for sidebar global create-modal event
  useEffect(() => {
    const handleOpenCreate = () => setIsCreateOpen(true);
    window.addEventListener('openboard:open-create-modal', handleOpenCreate);
    return () => window.removeEventListener('openboard:open-create-modal', handleOpenCreate);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal is open, let modal handle its own keys
      if (isCreateOpen || renameTarget || trashTarget || permDeleteTarget) {
        return;
      }

      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea';

      // "/" shortcut to focus search
      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // "Escape" to clear and blur search
      if (e.key === 'Escape' && isInputFocused) {
        if (searchQuery) {
          setSearchQuery('');
        } else {
          searchInputRef.current?.blur();
        }
        return;
      }

      // "N" or Cmd/Ctrl+N to create new board
      if (
        (e.key === 'n' || e.key === 'N') &&
        !isInputFocused &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setIsCreateOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateOpen, renameTarget, trashTarget, permDeleteTarget, searchQuery]);

  // Actions
  const handleCreateBoard = async (name: string, description?: string) => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || 'Failed to create whiteboard');
      }

      const json = await res.json();
      setIsCreateOpen(false);
      toast.success('Whiteboard created', `"${name}" is ready`);
      navigate(`/board/${json.data.metadata.id}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenameBoard = async (id: string, newName: string) => {
    setIsRenaming(true);
    try {
      const res = await fetch(`/api/boards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || 'Failed to rename whiteboard');
      }

      setBoards((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, name: newName, updatedAt: new Date().toISOString() } : b,
        ),
      );
      setRenameTarget(null);
      toast.success('Whiteboard renamed', `Updated to "${newName}"`);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDuplicateBoard = async (id: string) => {
    try {
      const res = await fetch(`/api/boards/${id}/duplicate`, {
        method: 'POST',
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || 'Failed to duplicate whiteboard');
      }

      toast.success('Whiteboard duplicated');
      fetchBoards();
    } catch (err) {
      toast.error('Failed to duplicate', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const current = boards.find((b) => b.id === id);
    if (!current) return;

    const nextFav = !current.favorite;

    // Optimistic UI update
    setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, favorite: nextFav } : b)));

    try {
      const res = await fetch(`/api/boards/${id}/favorite`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to update favorite status');
      }

      // If viewing favorites tab and we unfavorited, refetch to clean up list
      if (filter === 'favorites' && !nextFav) {
        setBoards((prev) => prev.filter((b) => b.id !== id));
      }
    } catch {
      // Revert optimistic update
      setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, favorite: !nextFav } : b)));
    }
  };

  const handleMoveToTrash = async () => {
    if (!trashTarget) return;
    setIsTrashing(true);
    try {
      const res = await fetch(`/api/boards/${trashTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || 'Failed to move board to trash');
      }

      setBoards((prev) => prev.filter((b) => b.id !== trashTarget.id));
      toast.warning('Moved to Trash', `"${trashTarget.name}" can be restored later`);
      setTrashTarget(null);
    } catch (err) {
      toast.error('Failed to move to trash', err instanceof Error ? err.message : undefined);
    } finally {
      setIsTrashing(false);
    }
  };

  const handleRestoreBoard = async (id: string) => {
    try {
      const res = await fetch(`/api/boards/${id}/restore`, {
        method: 'POST',
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || 'Failed to restore board');
      }

      setBoards((prev) => prev.filter((b) => b.id !== id));
      toast.success('Whiteboard restored', 'Restored to active workspace');
    } catch (err) {
      toast.error('Failed to restore board', err instanceof Error ? err.message : undefined);
    }
  };

  const handlePermanentDelete = async () => {
    if (!permDeleteTarget) return;
    setIsPermDeleting(true);
    try {
      const res = await fetch(`/api/boards/${permDeleteTarget.id}/permanent`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || 'Failed to permanently delete board');
      }

      setBoards((prev) => prev.filter((b) => b.id !== permDeleteTarget.id));
      toast.info('Permanently deleted', `"${permDeleteTarget.name}" erased from storage`);
      setPermDeleteTarget(null);
    } catch (err) {
      toast.error('Failed to delete permanently', err instanceof Error ? err.message : undefined);
    } finally {
      setIsPermDeleting(false);
    }
  };

  // View headings
  const getViewTitle = () => {
    switch (filter) {
      case 'recent':
        return 'Recent Whiteboards';
      case 'favorites':
        return 'Favorite Whiteboards';
      case 'trash':
        return 'Trash';
      default:
        return 'All Whiteboards';
    }
  };

  const getViewSubtitle = () => {
    switch (filter) {
      case 'recent':
        return 'Recently modified canvas diagrams and architecture layouts';
      case 'favorites':
        return 'Pinned whiteboards for fast, frequent access';
      case 'trash':
        return 'Deleted whiteboards can be restored or permanently erased';
      default:
        return 'Local-first personal whiteboard workspace for developers and external AI agents';
    }
  };

  return (
    <div className="view-container">
      {/* Top Header Bar */}
      <div className="dashboard-top-bar">
        <div className="dashboard-title-group">
          <h1>{getViewTitle()}</h1>
          <p>{getViewSubtitle()}</p>
        </div>

        {!isTrash && (
          <Button
            id="btn-create-board"
            variant="primary"
            size="md"
            icon={<IconPlus size={15} />}
            onClick={() => setIsCreateOpen(true)}
            title="Create new whiteboard (N)"
          >
            New Whiteboard
          </Button>
        )}
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="dashboard-toolbar">
        <div style={{ flex: 1, maxWidth: '480px' }}>
          <SearchInput
            id="input-search-boards"
            ref={searchInputRef}
            placeholder="Search whiteboards by name or description... (/ to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            shortcutHint="/"
          />
        </div>

        <div className="sort-selector-wrapper">
          <label htmlFor="select-sort-boards" className="sort-label">
            Sort:
          </label>
          <select
            id="select-sort-boards"
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="updatedAt:desc">Recently Updated</option>
            <option value="createdAt:desc">Recently Created</option>
            <option value="name:asc">Name (A–Z)</option>
            <option value="name:desc">Name (Z–A)</option>
          </select>
        </div>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="dashboard-error-banner">
          <span>{errorMessage}</span>
          <button className="btn-retry" onClick={fetchBoards}>
            Retry
          </button>
        </div>
      )}

      {/* Main Content State Rendering */}
      {loading ? (
        <div className="boards-grid">
          {Array.from({ length: 6 }).map((_, idx) => (
            <BoardCardSkeleton key={`skeleton-${idx}`} />
          ))}
        </div>
      ) : boards.length > 0 ? (
        <div className="boards-grid">
          {boards.map((b) => (
            <BoardCard
              key={b.id}
              board={b}
              isTrash={isTrash}
              onOpen={(id) => navigate(`/board/${id}`)}
              onRename={(board) => setRenameTarget(board)}
              onDuplicate={handleDuplicateBoard}
              onToggleFavorite={handleToggleFavorite}
              onDelete={(board) => setTrashTarget(board)}
              onRestore={handleRestoreBoard}
              onPermanentDelete={(board) => setPermDeleteTarget(board)}
            />
          ))}
        </div>
      ) : (
        /* Empty States */
        <div className="dashboard-empty-state">
          {debouncedQuery ? (
            <EmptyState
              icon={<IconSearch size={22} />}
              title="No matching whiteboards"
              description={`No boards match your search query "${debouncedQuery}".`}
              action={
                <Button variant="secondary" size="md" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              }
            />
          ) : filter === 'favorites' ? (
            <EmptyState
              icon={<IconStar size={22} />}
              title="No favorite whiteboards yet"
              description="Click the star icon on any whiteboard card to bookmark it here for quick access."
              action={
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setSearchParams({ filter: 'all' })}
                >
                  View All Boards
                </Button>
              }
            />
          ) : filter === 'recent' ? (
            <EmptyState
              icon={<IconClock size={22} />}
              title="No recent activity"
              description="Whiteboards you create or edit will appear here automatically."
              action={
                <Button
                  variant="primary"
                  size="md"
                  icon={<IconPlus size={15} />}
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create First Whiteboard
                </Button>
              }
            />
          ) : filter === 'trash' ? (
            <EmptyState
              icon={<IconTrash size={22} />}
              title="Trash is empty"
              description="Deleted whiteboards will be stored here and can be restored at any time."
            />
          ) : (
            <EmptyState
              icon={<IconGrid size={22} />}
              title="No whiteboards yet"
              description="Create your first whiteboard to start sketching diagrams, architecture concepts, and visual workflows."
              action={
                <Button
                  id="btn-create-first-board"
                  variant="primary"
                  size="md"
                  icon={<IconPlus size={15} />}
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create First Whiteboard
                </Button>
              }
            />
          )}
        </div>
      )}

      {/* Modals & Dialogs */}
      <CreateBoardModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateBoard}
        isSubmitting={isCreating}
      />

      <RenameBoardModal
        isOpen={Boolean(renameTarget)}
        boardId={renameTarget?.id || ''}
        initialName={renameTarget?.name || ''}
        onClose={() => setRenameTarget(null)}
        onRename={handleRenameBoard}
        isSubmitting={isRenaming}
      />

      <ConfirmDialog
        isOpen={Boolean(trashTarget)}
        title={`Move "${trashTarget?.name}" to Trash?`}
        message="This board will be removed from your active workspace and moved to Trash. You can restore it later if needed."
        confirmLabel="Move to Trash"
        variant="warning"
        onConfirm={handleMoveToTrash}
        onCancel={() => setTrashTarget(null)}
        isSubmitting={isTrashing}
      />

      <ConfirmDialog
        isOpen={Boolean(permDeleteTarget)}
        title={`Permanently delete "${permDeleteTarget?.name}"?`}
        message="This action is destructive and irreversible. The whiteboard canvas document and its history will be completely erased from local SQLite storage."
        confirmLabel="Delete Permanently"
        variant="danger"
        onConfirm={handlePermanentDelete}
        onCancel={() => setPermDeleteTarget(null)}
        isSubmitting={isPermDeleting}
      />
    </div>
  );
};
