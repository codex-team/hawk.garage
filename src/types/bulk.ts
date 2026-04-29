/**
 * Common mark actions used by bulk operations.
 */
export type MarkAction = 'resolved' | 'ignored' | 'starred';

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
 * Mutable bulk selection state used by the events list.
 */
export type BulkSelectionState = {
  /**
   * Selected row ids (repetition ids from grouped daily events).
   */
  selectedRepetitionIds: string[];
  /**
   * Last clicked row id used as Shift-range anchor.
   */
  lastSelectedRepetitionId: string | null;
};

/**
 * Input data for toggling a single row (with optional Shift-range support).
 */
export type ToggleRowSelectedParams = {
  /**
   * Current selected row ids.
   */
  selectedRepetitionIds: string[];
  /**
   * Last selected row id used as range anchor.
   */
  lastSelectedRepetitionId: string | null;
  /**
   * Row id user clicked.
   */
  repetitionId: string;
  /**
   * Visible row ids in list order.
   */
  flatRepetitionIds: string[];
  /**
   * True when selection should apply Shift-range behavior.
   */
  isShiftKey: boolean;
};

/**
 * Input data for syncing selection with currently visible rows.
 */
export type SyncSelectionWithVisibleRowsParams = {
  /**
   * Current selected row ids.
   */
  selectedRepetitionIds: string[];
  /**
   * Row ids currently rendered on screen.
   */
  visibleRepetitionIds: string[];
};

/**
 * Public contract for bulk selection helpers.
 */
export type UseBulkSelection = {
  /**
   * Clear selection and reset range anchor.
   */
  exitBulkSelect: () => BulkSelectionState;
  /**
   * Handle Escape key for bulk selection mode.
   */
  onDocumentEscape: (e: KeyboardEvent, selectedCount: number) => boolean;
  /**
   * Check if given row id is selected.
   */
  isRowSelected: (selectedRepetitionIds: string[], repetitionId: string) => boolean;
  /**
   * Toggle one row selection (with Shift-range support).
   */
  toggleRowSelected: (params: ToggleRowSelectedParams) => BulkSelectionState;
  /**
   * Remove selected rows that are no longer visible.
   */
  syncSelectionWithVisibleRows: (params: SyncSelectionWithVisibleRowsParams) => BulkSelectionState | null;
};

/**
 * Generic response shape for bulk event mutations.
 */
export interface BulkEventsMutationResult {
  success: boolean;
  modifiedCount: number;
}
