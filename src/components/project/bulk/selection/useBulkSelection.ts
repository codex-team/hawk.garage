type BulkSelectionState = {
  selectedRepetitionIds: string[];
  lastSelectedRepetitionId: string | null;
};

type ToggleRowSelectedParams = {
  selectedRepetitionIds: string[];
  lastSelectedRepetitionId: string | null;
  repetitionId: string;
  flatRepetitionIds: string[];
  isShiftKey: boolean;
};

type SyncSelectionWithVisibleRowsParams = {
  selectedRepetitionIds: string[];
  visibleRepetitionIds: string[];
};

export function useBulkSelection(): {
  exitBulkSelect: () => BulkSelectionState;
  onDocumentEscape: (e: KeyboardEvent, selectedCount: number) => boolean;
  isRowSelected: (selectedRepetitionIds: string[], repetitionId: string) => boolean;
  toggleRowSelected: (params: ToggleRowSelectedParams) => BulkSelectionState;
  syncSelectionWithVisibleRows: (params: SyncSelectionWithVisibleRowsParams) => BulkSelectionState | null;
} {
  function exitBulkSelect(): BulkSelectionState {
    return {
      selectedRepetitionIds: [],
      lastSelectedRepetitionId: null,
    };
  }

  function onDocumentEscape(e: KeyboardEvent, selectedCount: number): boolean {
    if (e.key !== 'Escape' || selectedCount === 0) {
      return false;
    }

    e.preventDefault();

    return true;
  }

  function isRowSelected(selectedRepetitionIds: string[], repetitionId: string): boolean {
    return selectedRepetitionIds.includes(repetitionId);
  }

  function toggleRowSelected({
    selectedRepetitionIds,
    lastSelectedRepetitionId,
    repetitionId,
    flatRepetitionIds,
    isShiftKey,
  }: ToggleRowSelectedParams): BulkSelectionState {
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

  function syncSelectionWithVisibleRows({
    selectedRepetitionIds,
    visibleRepetitionIds,
  }: SyncSelectionWithVisibleRowsParams): BulkSelectionState | null {
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
