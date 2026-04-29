import type { Ref, ComputedRef } from 'vue';

/**
 * Common mark actions used by bulk operations.
 */
export type MarkAction = 'resolved' | 'ignored' | 'starred';

/**
 * Public contract for the bulk selection composable.
 */
export interface UseBulkSelectionReturn {
  /** Currently selected row ids (repetition ids). */
  selectedRepetitionIds: Ref<string[]>;
  /** True when at least one row is selected. */
  selectionModeActive: ComputedRef<boolean>;
  /** Number of selected rows. */
  selectedCount: ComputedRef<number>;
  /** Clear all selection. */
  exitBulkSelect: () => void;
  /** Whether a given row id is in the selection. */
  isRowSelected: (repetitionId: string) => boolean;
  /**
   * Toggle one row, with optional Shift-range expansion.
   * @param repetitionId - row id clicked
   * @param evt - optional mouse event (for Shift key detection)
   */
  toggleRowSelected: (repetitionId: string, evt?: MouseEvent) => void;
  /** Remove selected rows that are no longer in the visible list. */
  syncSelectionWithVisibleRows: () => void;
}

/**
 * Event shape required by bulk toolbar logic.
 */
export type BulkSelectedEvent = {
  id?: string | null;
  originalEventId?: string;
  assignee?: { id?: string | null } | null;
  marks?: Partial<Record<MarkAction, boolean>>;
  visitedBy?: Array<{ id?: string | null }>;
};

/**
 * Position object used for inline popover/menu styles.
 */
export type BulkPosition = {
  top: string | number;
  left: string | number;
};

/**
 * Viewport listener function reference.
 */
export type BulkViewportHandler = (() => void) | null;

/**
 * Minimal assignee shape used by bulk assign handlers.
 */
export type BulkAssigneeUser = { id?: string | null } | null;

/**
 * Generic response shape for bulk event mutations.
 */
export interface BulkEventsMutationResult {
  success: boolean;
  modifiedCount: number;
}

/**
 * Result returned by a bulk store action.
 */
export type BulkActionResult = {
  modifiedCount: number;
  targetEventIds?: string[];
} | null;

/**
 * Payload for showing a notification from bulk operations.
 */
export type BulkNotifyPayload = {
  message: string;
  style: string;
  time: number;
};

/**
 * Generic Vuex dispatch wrapper used in bulk operation context.
 */
export type BulkDispatch = <TResult = unknown>(
  actionType: string,
  payload: Record<string, unknown>
) => Promise<TResult>;

/**
 * Shared context passed into bulk action helpers.
 */
export type BulkActionContext = {
  dispatch: BulkDispatch;
  projectId: string;
  t: (key: string, params?: Record<string, unknown>) => string;
  notify: (payload: BulkNotifyPayload) => void;
  refreshByOriginalIds: (targetOriginalIds: string[]) => Promise<void>;
};

/**
 * Context for refreshing stale events after a failed or partial bulk operation.
 */
export type RefreshEventsContext = {
  dispatch: BulkDispatch;
  projectId: string;
  selectedEvents: BulkSelectedEvent[];
};
