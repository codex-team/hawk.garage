import type {
  BulkSelectionState,
  SyncSelectionWithVisibleRowsParams,
  ToggleRowSelectedParams,
  UseBulkSelection
} from '@/types/bulk';

/**
 * Factory with pure helpers for events bulk row selection.
 */
export function useBulkSelection(): UseBulkSelection {
  /**
   * Reset selection state.
   */
  function exitBulkSelect(): BulkSelectionState {
    return {
      selectedRepetitionIds: [],
      lastSelectedRepetitionId: null,
    };
  }

  /**
   * Handle Escape key press for bulk selection.
   * @param e Keyboard event from document listener
   * @param selectedCount Number of selected rows
   */
  function onDocumentEscape(e: KeyboardEvent, selectedCount: number): boolean {
    if (e.key !== 'Escape' || selectedCount === 0) {
      return false;
    }

    e.preventDefault();

    return true;
  }

  /**
   * Check if row is selected.
   * @param selectedRepetitionIds Current selected row ids
   * @param repetitionId Row id to check
   */
  function isRowSelected(selectedRepetitionIds: string[], repetitionId: string): boolean {
    return selectedRepetitionIds.includes(repetitionId);
  }

  /**
   * Toggle row selection with optional Shift-range mode.
   * @param params Current selection and click context
   */
  function toggleRowSelected(params: ToggleRowSelectedParams): BulkSelectionState {
    const {
      selectedRepetitionIds,
      lastSelectedRepetitionId,
      repetitionId,
      flatRepetitionIds,
      isShiftKey,
    } = params;
    const hasShiftAnchor = typeof lastSelectedRepetitionId === 'string' && lastSelectedRepetitionId.length > 0;
    const isShiftRange = Boolean(
      isShiftKey
      && hasShiftAnchor
      && lastSelectedRepetitionId !== repetitionId
    );

    if (isShiftRange) {
      const fromIndex = flatRepetitionIds.indexOf(lastSelectedRepetitionId as string);
      const toIndex = flatRepetitionIds.indexOf(repetitionId);

      if (fromIndex >= 0 && toIndex >= 0) {
        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        const selectedSet = new Set(selectedRepetitionIds);

        for (let i = start; i <= end; i++) {
          selectedSet.add(flatRepetitionIds[i]);
        }

        return {
          selectedRepetitionIds: flatRepetitionIds.filter(id => selectedSet.has(id)),
          lastSelectedRepetitionId: repetitionId,
        };
      }
    }

    const nextSelected = [...selectedRepetitionIds];
    const selectedIndex = nextSelected.indexOf(repetitionId);

    if (selectedIndex >= 0) {
      nextSelected.splice(selectedIndex, 1);
    } else {
      nextSelected.push(repetitionId);
    }

    return {
      selectedRepetitionIds: nextSelected,
      lastSelectedRepetitionId: nextSelected.length === 0 ? null : repetitionId,
    };
  }

  /**
   * Keep selection only for rows that are still visible.
   * @param params Current and visible row ids
   */
  function syncSelectionWithVisibleRows(params: SyncSelectionWithVisibleRowsParams): BulkSelectionState | null {
    const { selectedRepetitionIds, visibleRepetitionIds } = params;

    if (selectedRepetitionIds.length === 0) {
      return null;
    }

    const visibleSet = new Set(visibleRepetitionIds);
    const nextSelected = selectedRepetitionIds.filter(id => visibleSet.has(id));

    if (nextSelected.length === selectedRepetitionIds.length) {
      return null;
    }

    return {
      selectedRepetitionIds: nextSelected,
      lastSelectedRepetitionId: nextSelected.length > 0 ? nextSelected[nextSelected.length - 1] : null,
    };
  }

  return {
    exitBulkSelect,
    onDocumentEscape,
    isRowSelected,
    toggleRowSelected,
    syncSelectionWithVisibleRows,
  };
}
