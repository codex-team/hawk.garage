import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue';
import type { UseBulkSelectionReturn } from '@/types/bulk';

/**
 * Vue composable for bulk row selection in the events list.
 * Owns reactive selection state, Escape key handler, and all selection logic.
 * Must be called inside component `setup()`.
 * @param flatRepetitionIds - reactive list of all visible row ids in display order
 */
export function useBulkSelection(flatRepetitionIds: Ref<string[]>): UseBulkSelectionReturn {
  const selectedRepetitionIds = ref<string[]>([]);
  const lastSelectedRepetitionId = ref<string | null>(null);

  const selectionModeActive = computed(() => selectedRepetitionIds.value.length > 0);
  const selectedCount = computed(() => selectedRepetitionIds.value.length);

  /** Reset selection state and Shift-range anchor. */
  function exitBulkSelect(): void {
    selectedRepetitionIds.value = [];
    lastSelectedRepetitionId.value = null;
  }

  /**
   * Whether the given row id is currently selected.
   * @param repetitionId - row id to check
   */
  function isRowSelected(repetitionId: string): boolean {
    return selectedRepetitionIds.value.includes(repetitionId);
  }

  /**
   * Toggle one row, with optional Shift-range expansion.
   * @param repetitionId - row id that was clicked
   * @param evt - optional mouse event for Shift key detection
   */
  function toggleRowSelected(repetitionId: string, evt?: MouseEvent): void {
    const isShiftKey = Boolean(evt?.shiftKey);
    const currentSelected = selectedRepetitionIds.value;
    const lastId = lastSelectedRepetitionId.value;
    const hasShiftAnchor = typeof lastId === 'string' && lastId.length > 0;

    if (isShiftKey && hasShiftAnchor && lastId !== repetitionId) {
      const flat = flatRepetitionIds.value;
      const fromIndex = flat.indexOf(lastId);
      const toIndex = flat.indexOf(repetitionId);

      if (fromIndex >= 0 && toIndex >= 0) {
        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        const selectedSet = new Set(currentSelected);

        for (let i = start; i <= end; i++) {
          selectedSet.add(flat[i]);
        }

        selectedRepetitionIds.value = flat.filter(id => selectedSet.has(id));
        lastSelectedRepetitionId.value = repetitionId;

        return;
      }
    }

    const nextSelected = [...currentSelected];
    const selectedIndex = nextSelected.indexOf(repetitionId);

    if (selectedIndex >= 0) {
      nextSelected.splice(selectedIndex, 1);
    } else {
      nextSelected.push(repetitionId);
    }

    selectedRepetitionIds.value = nextSelected;
    lastSelectedRepetitionId.value = nextSelected.length === 0 ? null : repetitionId;
  }

  /** Remove selected rows that are no longer in the visible list. */
  function syncSelectionWithVisibleRows(): void {
    if (selectedRepetitionIds.value.length === 0) {
      return;
    }

    const visibleSet = new Set(flatRepetitionIds.value);
    const nextSelected = selectedRepetitionIds.value.filter(id => visibleSet.has(id));

    if (nextSelected.length === selectedRepetitionIds.value.length) {
      return;
    }

    selectedRepetitionIds.value = nextSelected;
    lastSelectedRepetitionId.value = nextSelected.length > 0 ? nextSelected[nextSelected.length - 1] : null;
  }

  /**
   * Handle Escape key to exit bulk selection mode.
   * @param e - keyboard event from document listener
   */
  function onDocumentEscape(e: KeyboardEvent): void {
    if (e.key === 'Escape' && selectedRepetitionIds.value.length > 0) {
      e.preventDefault();
      exitBulkSelect();
    }
  }

  onMounted(() => window.addEventListener('keydown', onDocumentEscape));
  onBeforeUnmount(() => window.removeEventListener('keydown', onDocumentEscape));

  return {
    selectedRepetitionIds,
    selectionModeActive,
    selectedCount,
    exitBulkSelect,
    isRowSelected,
    toggleRowSelected,
    syncSelectionWithVisibleRows,
  };
}
