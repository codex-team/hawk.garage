import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue';
import type { UseBulkSelectionReturn } from '@/types/bulk';

/**
 * Vue composable for list selection.
 * Owns reactive selection state, Escape key handler, and Shift-range logic.
 * Must be called inside component `setup()`.
 * @param visibleIds - reactive list of currently visible ids in display order
 */
export function useBulkSelection(visibleIds: Ref<string[]>): UseBulkSelectionReturn {
  const selectedIds = ref<string[]>([]);
  const lastSelectedId = ref<string | null>(null);

  const selectionModeActive = computed(() => selectedIds.value.length > 0);
  const selectedCount = computed(() => selectedIds.value.length);

  /** Reset selection state and Shift-range anchor. */
  function exitBulkSelect(): void {
    selectedIds.value = [];
    lastSelectedId.value = null;
  }

  /**
   * Whether id is currently selected.
   * @param id - id to check
   */
  function isSelected(id: string): boolean {
    return selectedIds.value.includes(id);
  }

  /**
   * Toggle one id, with optional Shift-range expansion.
   * @param id - id that was clicked
   * @param evt - optional mouse event for Shift key detection
   */
  function toggleSelected(id: string, evt?: MouseEvent): void {
    const isShiftKey = Boolean(evt?.shiftKey);
    const currentSelected = selectedIds.value;
    const lastId = lastSelectedId.value;
    const hasShiftAnchor = typeof lastId === 'string' && lastId.length > 0;

    if (isShiftKey && hasShiftAnchor && lastId !== id) {
      const fromIndex = visibleIds.value.indexOf(lastId);
      const toIndex = visibleIds.value.indexOf(id);

      if (fromIndex >= 0 && toIndex >= 0) {
        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);
        const selectedSet = new Set(currentSelected);

        for (let i = start; i <= end; i++) {
          selectedSet.add(visibleIds.value[i]);
        }

        selectedIds.value = visibleIds.value.filter(itemId => selectedSet.has(itemId));
        lastSelectedId.value = id;

        return;
      }
    }

    const nextSelected = [...currentSelected];
    const selectedIndex = nextSelected.indexOf(id);

    if (selectedIndex >= 0) {
      nextSelected.splice(selectedIndex, 1);
    } else {
      nextSelected.push(id);
    }

    selectedIds.value = nextSelected;
    lastSelectedId.value = nextSelected.length === 0 ? null : id;
  }

  /**
   * Keep selection consistent when list content changes due to
   * pagination/filter/search updates and previously selected ids disappear.
   */
  function syncSelectionWithVisibleIds(): void {
    if (selectedIds.value.length === 0) {
      return;
    }

    const visibleSet = new Set(visibleIds.value);
    const nextSelected = selectedIds.value.filter(id => visibleSet.has(id));

    if (nextSelected.length === selectedIds.value.length) {
      return;
    }

    selectedIds.value = nextSelected;
    lastSelectedId.value = nextSelected.length > 0 ? nextSelected[nextSelected.length - 1] : null;
  }

  /**
   * Handle Escape key to exit bulk selection mode.
   * @param e - keyboard event from document listener
   */
  function onDocumentEscape(e: KeyboardEvent): void {
    if (e.key === 'Escape' && selectedIds.value.length > 0) {
      e.preventDefault();
      exitBulkSelect();
    }
  }

  onMounted(() => window.addEventListener('keydown', onDocumentEscape));
  onBeforeUnmount(() => window.removeEventListener('keydown', onDocumentEscape));

  return {
    selectedIds,
    selectionModeActive,
    selectedCount,
    exitBulkSelect,
    isSelected,
    toggleSelected,
    syncSelectionWithVisibleIds,
  };
}
