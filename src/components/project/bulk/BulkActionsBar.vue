<template>
  <div class="events-list__bulk-slot">
    <div
      v-show="selectionModeActive"
      class="events-list__bulk-bar"
    >
      <div class="events-list__bulk-meta">
        <button
          type="button"
          class="ui-button ui-button--small ui-button--secondary events-list__bulk-cancel-combo"
          @click="emit('exit-bulk-select')"
        >
          <span class="ui-button-text">{{ $t('components.confirmationWindow.cancel') }} {{ $t('common.escKey') }}</span>
        </button>
        <span class="events-list__bulk-count">{{ $t('common.selected') }}: {{ selectedCount }}</span>
      </div>
      <div class="events-list__bulk-actions">
        <UiButton
          :content="''"
          :title="bulkResolveLabel"
          :aria-label="bulkResolveLabel"
          :icon="bulkResolveIcon"
          class="events-list__bulk-action-button"
          small
          :disabled="isMarkDisabled('resolved')"
          @click="onMarkClick('resolved')"
        />
        <UiButton
          :content="''"
          :title="bulkStarLabel"
          :aria-label="bulkStarLabel"
          :icon="bulkStarIcon"
          class="events-list__bulk-action-button"
          small
          :disabled="isMarkDisabled('starred')"
          @click="onMarkClick('starred')"
        />
        <UiButton
          :content="''"
          :title="bulkIgnoreLabel"
          :aria-label="bulkIgnoreLabel"
          :icon="bulkIgnoreIcon"
          class="events-list__bulk-action-button"
          small
          :disabled="isMarkDisabled('ignored')"
          @click="onMarkClick('ignored')"
        />
        <UiButton
          :content="''"
          :title="$t('event.viewedBy.assignee')"
          :aria-label="$t('event.viewedBy.assignee')"
          icon="assignee"
          class="events-list__bulk-action-button"
          small
          :disabled="selectedCount === 0"
          @click="onBulkAssignButtonClick"
        />
        <UiButton
          :content="''"
          :title="$t('event.bulk.moreActions')"
          :aria-label="$t('event.bulk.moreActions')"
          icon="dots-vertical"
          class="events-list__bulk-action-button events-list__bulk-more-trigger"
          small
          :disabled="selectedCount === 0"
          @click="onBulkMoreMenuButtonClick"
        />
      </div>
      <AssigneesList
        v-if="isBulkAssigneesShowed"
        v-click-outside="hideBulkAssigneesList"
        :style="bulkAssigneesListPosition"
        :project-id="projectId"
        :can-unassign="hasAssigneeInSelection"
        triangle="top"
        class="events-list__assignees-list events-list__assignees-list--bulk"
        @hide="hideBulkAssigneesList"
        @pick-user="onBulkPickAssignee"
        @unassign="onBulkClearAssignees"
      />
      <div
        v-if="isBulkMoreMenuShowed"
        v-click-outside="hideBulkMoreMenu"
        :style="bulkMoreMenuPosition"
        class="events-list__bulk-more-menu"
      >
        <UiContextList :items="bulkMoreMenuItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import notifier from 'codex-notifier';
import type {
  BulkAssigneeUser,
  BulkPosition,
  BulkSelectedEvent,
  BulkViewportHandler,
  MarkAction
} from '@/types/bulk';
import UiButton from '../../utils/UiButton.vue';
import UiContextList from '../../utils/UiContextList.vue';
import AssigneesList from '../../event/AssigneesList.vue';
import {
  BULK_ACTION_TYPES,
  executeBulkAction,
  refreshEventsByOriginalIds
} from './bulkEventOperations';

/**
 * Props contract for bulk actions toolbar.
 */
const props = withDefaults(defineProps<{
  projectId?: string;
  selectionModeActive?: boolean;
  selectedCount?: number;
  selectedEventIds?: string[];
}>(), {
  projectId: '',
  selectionModeActive: false,
  selectedCount: 0,
  selectedEventIds: () => [] as string[],
});

const { t } = useI18n();
const store = useStore();
const emit = defineEmits<{ (e: 'exit-bulk-select'): void }>();

/**
 * Mark action currently in progress.
 */
const activeMarkAction = ref('');
/**
 * Assignees popover visibility state.
 */
const isBulkAssigneesShowed = ref(false);
/**
 * Inline style for assignees popover position.
 */
const bulkAssigneesListPosition = ref<BulkPosition>({
  top: 0,
  left: 0,
});
const bulkAssignAnchorEl = ref<HTMLElement | null>(null);
const bulkAssignOnViewportChange = ref<BulkViewportHandler>(null);
/**
 * More-actions menu visibility state.
 */
const isBulkMoreMenuShowed = ref(false);
/**
 * Inline style for more-actions menu position.
 */
const bulkMoreMenuPosition = ref<BulkPosition>({
  top: 0,
  left: 0,
});
const bulkMoreMenuAnchorEl = ref<HTMLElement | null>(null);
const bulkMoreMenuOnViewportChange = ref<BulkViewportHandler>(null);

const selectedEvents = computed<BulkSelectedEvent[]>(() => {
  if (!props.projectId) {
    return [];
  }

  return props.selectedEventIds
    .map(eventId => store.getters.getProjectEventById(String(props.projectId), String(eventId)))
    .filter(Boolean);
});

/**
 * True when every selected event is already ignored.
 */
const areAllSelectedIgnored = computed(() => {
  return selectedEvents.value.length > 0 && selectedEvents.value.every(event => event.marks?.ignored);
});
const areAllSelectedResolved = computed(() => {
  return selectedEvents.value.length > 0 && selectedEvents.value.every(event => event.marks?.resolved);
});
const areAllSelectedStarred = computed(() => {
  return selectedEvents.value.length > 0 && selectedEvents.value.every(event => event.marks?.starred);
});
const bulkIgnoreLabel = computed(() => {
  return areAllSelectedIgnored.value ? t('event.bulk.unignore') : t('event.ignore');
});
const bulkResolveLabel = computed(() => {
  return areAllSelectedResolved.value ? t('event.bulk.unresolve') : t('event.resolve');
});
const bulkResolveIcon = computed(() => {
  return areAllSelectedResolved.value ? 'close-circle' : 'checkmark';
});
const bulkStarLabel = computed(() => {
  return areAllSelectedStarred.value ? t('event.bulk.unstar') : t('event.star');
});
const bulkIgnoreIcon = computed(() => {
  return areAllSelectedIgnored.value ? 'eye' : 'hided';
});
const bulkStarIcon = computed(() => {
  return areAllSelectedStarred.value ? 'star-outline' : 'star';
});
const hasAssigneeInSelection = computed(() => {
  return selectedEvents.value.some(event => !!event.assignee);
});
const bulkMoreMenuItems = computed(() => [
  {
    label: t('event.bulk.markViewed'),
    icon: 'eye',
    isActive: false,
    onActivate: () => {
      void onBulkMarkViewedClick();
    },
  },
]);

/**
 * Build deduplicated selected original event ids.
 */
function getSelectedOriginalIds(): string[] {
  const byOriginalId = new Set<string>();

  for (const event of selectedEvents.value) {
    if (!event?.originalEventId) {
      continue;
    }

    byOriginalId.add(String(event.originalEventId));
  }

  return Array.from(byOriginalId.values());
}

/**
 * Disable mark button when there is no selection
 * or when same mark action is already running.
 *
 * @param action Action currently checked for disabled state
 */
function isMarkDisabled(action: MarkAction): boolean {
  if (props.selectedCount === 0) {
    return true;
  }

  return activeMarkAction.value === action;
}

/**
 * Compute next explicit state for selected mark.
 *
 * @param action Mark action
 */
function resolveMarkEnabled(action: MarkAction): boolean {
  if (action === 'ignored') {
    return !areAllSelectedIgnored.value;
  }

  if (action === 'resolved') {
    return !areAllSelectedResolved.value;
  }

  return !areAllSelectedStarred.value;
}

/**
 * Build shared context for bulk operation helpers.
 */
function getBulkActionsContext() {
  const dispatch = store.dispatch.bind(store);

  return {
    dispatch,
    projectId: String(props.projectId || ''),
    t,
    notify: payload => notifier.show(payload),
    refreshByOriginalIds: (originalIds: string[]) => {
      return refreshEventsByOriginalIds({
        dispatch,
        projectId: String(props.projectId || ''),
        selectedEvents: selectedEvents.value,
      }, originalIds);
    },
  };
}

/**
 * Handle mark action click with in-flight guard.
 *
 * @param action Action clicked in bulk toolbar
 */
async function onMarkClick(action: MarkAction): Promise<void> {
  if (activeMarkAction.value) {
    return;
  }

  hideBulkAssigneesList();
  hideBulkMoreMenu();
  activeMarkAction.value = action;

  try {
    const targetOriginalIds = getSelectedOriginalIds();
    const enabled = resolveMarkEnabled(action);

    if (targetOriginalIds.length === 0) {
      return;
    }

    await executeBulkAction(getBulkActionsContext(), BULK_ACTION_TYPES.setMarks, {
      mark: action,
      enabled,
    }, targetOriginalIds);
  } finally {
    activeMarkAction.value = '';
  }
}

/**
 * Toggle assignees popover near assign button.
 *
 * @param evt Click event from assign button
 */
function onBulkAssignButtonClick(evt: MouseEvent): void {
  evt?.stopPropagation?.();
  hideBulkMoreMenu();

  const el = evt.currentTarget as HTMLElement | null;

  if (!el) {
    return;
  }

  if (isBulkAssigneesShowed.value && bulkAssignAnchorEl.value === el) {
    hideBulkAssigneesList();

    return;
  }

  hideBulkAssigneesList();
  bulkAssignAnchorEl.value = el;
  isBulkAssigneesShowed.value = true;
  setBulkAssigneesPosition();
  bulkAssignOnViewportChange.value = setBulkAssigneesPosition.bind(null);
  window.addEventListener('resize', bulkAssignOnViewportChange.value);
  window.addEventListener('scroll', bulkAssignOnViewportChange.value, true);
}

/**
 * Toggle "more actions" context menu.
 *
 * @param evt Click event from more-actions button
 */
function onBulkMoreMenuButtonClick(evt: MouseEvent): void {
  evt?.stopPropagation?.();
  hideBulkAssigneesList();

  const el = evt.currentTarget as HTMLElement | null;

  if (!el) {
    return;
  }

  if (isBulkMoreMenuShowed.value && bulkMoreMenuAnchorEl.value === el) {
    hideBulkMoreMenu();

    return;
  }

  hideBulkMoreMenu();
  bulkMoreMenuAnchorEl.value = el;
  isBulkMoreMenuShowed.value = true;
  setBulkMoreMenuPosition();
  bulkMoreMenuOnViewportChange.value = setBulkMoreMenuPosition.bind(null);
  window.addEventListener('resize', bulkMoreMenuOnViewportChange.value);
  window.addEventListener('scroll', bulkMoreMenuOnViewportChange.value, true);
}

/**
 * Recalculate assignees popover position.
 */
function setBulkAssigneesPosition(): void {
  if (!bulkAssignAnchorEl.value) {
    return;
  }

  const rect = bulkAssignAnchorEl.value.getBoundingClientRect();
  const LIST_WIDTH = 210;
  const ARROW_X_FROM_LEFT = 174;
  const OFFSET_X = 8;
  const viewportWidth = window.innerWidth;
  const leftPadding = 8;
  const anchorX = rect.left + rect.width / 2;
  const desiredLeft = anchorX - ARROW_X_FROM_LEFT + OFFSET_X;
  const clampedLeft = Math.min(
    Math.max(desiredLeft, leftPadding),
    Math.max(leftPadding, viewportWidth - LIST_WIDTH - leftPadding)
  );

  bulkAssigneesListPosition.value = {
    top: `${rect.bottom + 8}px`,
    left: `${clampedLeft}px`,
  };
}

/**
 * Recalculate "more actions" menu position.
 */
function setBulkMoreMenuPosition(): void {
  if (!bulkMoreMenuAnchorEl.value) {
    return;
  }

  const rect = bulkMoreMenuAnchorEl.value.getBoundingClientRect();
  const OFFSET_X = 0;
  const MENU_WIDTH = 260;
  const viewportWidth = window.innerWidth;
  const leftPadding = 8;
  const desiredRight = rect.right + OFFSET_X;
  const clampedRight = Math.min(
    Math.max(desiredRight, MENU_WIDTH + leftPadding),
    Math.max(MENU_WIDTH + leftPadding, viewportWidth - leftPadding)
  );

  bulkMoreMenuPosition.value = {
    top: `${rect.bottom + 8}px`,
    left: `${clampedRight}px`,
  };
}

/**
 * Hide assignees popover and detach listeners.
 */
function hideBulkAssigneesList(): void {
  isBulkAssigneesShowed.value = false;
  bulkAssignAnchorEl.value = null;

  if (typeof bulkAssignOnViewportChange.value === 'function') {
    window.removeEventListener('resize', bulkAssignOnViewportChange.value);
    window.removeEventListener('scroll', bulkAssignOnViewportChange.value, true);
    bulkAssignOnViewportChange.value = null;
  }
}

/**
 * Hide "more actions" menu and detach listeners.
 */
function hideBulkMoreMenu(): void {
  isBulkMoreMenuShowed.value = false;
  bulkMoreMenuAnchorEl.value = null;

  if (typeof bulkMoreMenuOnViewportChange.value === 'function') {
    window.removeEventListener('resize', bulkMoreMenuOnViewportChange.value);
    window.removeEventListener('scroll', bulkMoreMenuOnViewportChange.value, true);
    bulkMoreMenuOnViewportChange.value = null;
  }
}

/**
 * Forward assignee selection to parent bulk handler.
 *
 * @param user User picked in assignees list
 */
async function onBulkPickAssignee(user: BulkAssigneeUser): Promise<void> {
  hideBulkAssigneesList();

  if (!user || props.selectedCount === 0) {
    return;
  }

  const targetOriginalIds = getSelectedOriginalIds();

  if (targetOriginalIds.length === 0) {
    return;
  }

  await executeBulkAction(getBulkActionsContext(), BULK_ACTION_TYPES.updateAssignee, {
    assignee: user,
  }, targetOriginalIds);
}

/**
 * Forward unassign action to parent bulk handler.
 */
async function onBulkClearAssignees(): Promise<void> {
  hideBulkAssigneesList();

  if (props.selectedCount === 0) {
    return;
  }

  const targetOriginalIds = getSelectedOriginalIds();

  if (targetOriginalIds.length === 0) {
    return;
  }

  await executeBulkAction(getBulkActionsContext(), BULK_ACTION_TYPES.updateAssignee, {
    assignee: null,
  }, targetOriginalIds);
}

/**
 * Forward "mark viewed" action to parent bulk handler.
 */
async function onBulkMarkViewedClick(): Promise<void> {
  hideBulkAssigneesList();
  hideBulkMoreMenu();

  if (props.selectedCount === 0) {
    return;
  }

  const targetOriginalIds = getSelectedOriginalIds();

  if (targetOriginalIds.length === 0) {
    return;
  }

  await executeBulkAction(getBulkActionsContext(), BULK_ACTION_TYPES.visit, {}, targetOriginalIds);
}

/**
 * Close bulk popovers when selection mode is switched off
 * (e.g. Escape key or external clear-selection action).
 */
watch(() => props.selectionModeActive, (newVal) => {
  if (!newVal) {
    hideBulkAssigneesList();
    hideBulkMoreMenu();
  }
});

onBeforeUnmount(() => {
  hideBulkAssigneesList();
  hideBulkMoreMenu();
});
</script>

<style>
.events-list {
  &__bulk-slot {
    flex-shrink: 0;
    box-sizing: border-box;
    min-height: 40px;
    margin-block: 18px 0;
  }

  &__bulk-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    align-items: center;
    justify-content: space-between;
  }

  &__bulk-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 16px;
    margin-left: 11px;
  }

  &__bulk-cancel-combo {
    display: inline-flex;
    align-items: center;
    font: inherit;
    white-space: nowrap;
    cursor: pointer;
  }

  &__bulk-cancel-combo .ui-button-text {
    line-height: 14px;
  }

  &__bulk-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  &__bulk-action-button,
  &__bulk-action-button .ui-button-text,
  &__bulk-action-button .ui-button-icon {
    white-space: nowrap;
  }

  &__bulk-action-button .ui-button-icon-assignee {
    width: 16px;
    height: 16px;
  }

  &__bulk-more-trigger.ui-button {
    padding-inline: 8px;
    background-color: transparent;
    border: 0;
  }

  &__bulk-count {
    color: var(--color-text-main);
    font-size: 13px;
    font-weight: 500;
    line-height: 14px;
    white-space: nowrap;
  }

  &__assignees-list--bulk {
    transform: none;
  }

  &__bulk-more-menu {
    position: fixed;
    z-index: 210;
    transform: translateX(-100%);

    .ui-context-list {
      background-color: var(--color-bg-main);
      border: 1px solid var(--color-border);
      box-shadow: 0 11px 13px -4px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
