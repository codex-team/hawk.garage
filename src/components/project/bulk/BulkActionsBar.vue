<template>
  <div class="bulk-actions-bar">
    <div
      v-show="selectionModeActive"
      class="bulk-actions-bar__content"
    >
      <div class="bulk-actions-bar__meta">
        <button
          type="button"
          class="ui-button ui-button--small ui-button--secondary bulk-actions-bar__cancel-combo"
          @click="emit('exit-bulk-select')"
        >
          <span class="ui-button-text">{{ $t('components.confirmationWindow.cancel') }} {{ $t('common.escKey') }}</span>
        </button>
        <span class="bulk-actions-bar__count">{{ $t('common.selected') }}: {{ selectedCount }}</span>
      </div>
      <div class="bulk-actions-bar__actions">
        <UiButton
          :content="''"
          :title="bulkResolveLabel"
          :aria-label="bulkResolveLabel"
          :icon="bulkResolveIcon"
          class="bulk-actions-bar__action-button"
          small
          :disabled="isMarkDisabled()"
          @click="onMarkClick('resolved')"
        />
        <UiButton
          :content="''"
          :title="bulkStarLabel"
          :aria-label="bulkStarLabel"
          :icon="bulkStarIcon"
          class="bulk-actions-bar__action-button"
          small
          :disabled="isMarkDisabled()"
          @click="onMarkClick('starred')"
        />
        <UiButton
          :content="''"
          :title="bulkIgnoreLabel"
          :aria-label="bulkIgnoreLabel"
          :icon="bulkIgnoreIcon"
          class="bulk-actions-bar__action-button"
          small
          :disabled="isMarkDisabled()"
          @click="onMarkClick('ignored')"
        />
        <UiButton
          ref="bulkAssignButtonRef"
          :content="''"
          :title="$t('event.viewedBy.assignee')"
          :aria-label="$t('event.viewedBy.assignee')"
          icon="assignee"
          class="bulk-actions-bar__action-button"
          small
          :disabled="selectedCount === 0"
          @click="onBulkAssignButtonClick"
        />
        <UiButton
          :content="''"
          :title="$t('event.bulk.moreActions')"
          :aria-label="$t('event.bulk.moreActions')"
          icon="dots-vertical"
          class="bulk-actions-bar__action-button bulk-actions-bar__more-trigger"
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
        class="bulk-actions-bar__assignees-list--bulk"
        @hide="hideBulkAssigneesList"
        @pick-user="onBulkPickAssignee"
        @unassign="onBulkClearAssignees"
      />
      <div
        v-if="isBulkMoreMenuShowed"
        v-click-outside="hideBulkMoreMenu"
        :style="bulkMoreMenuPosition"
        class="bulk-actions-bar__more-menu"
      >
        <UiContextList :items="bulkMoreMenuItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type ComponentPublicInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import notifier from 'codex-notifier';
import type {
  BulkActionType,
  BulkActionContext,
  BulkAssigneeUser,
  BulkPosition,
  BulkSelectedEvent,
  BulkViewportHandler,
  MarkAction
} from '@/types/bulk';
import {
  BULK_SET_EVENT_MARKS,
  BULK_UPDATE_EVENT_ASSIGNEE,
  BULK_VISIT_EVENTS
} from '../../../store/modules/events/actionTypes';
import UiButton from '../../utils/UiButton.vue';
import UiContextList from '../../utils/UiContextList.vue';
import AssigneesList from '../../event/AssigneesList.vue';
import { useBulkEventOperations } from './useBulkEventOperations';

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
const {
  executeBulkAction,
  refreshEventsByOriginalIds,
} = useBulkEventOperations();

/**
 * Guards against concurrent bulk submissions.
 */
const isActionSubmitting = ref(false);
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
const bulkAssignButtonRef = ref<ComponentPublicInstance | null>(null);
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

const BULK_ACTION_TYPES = {
  setMarks: BULK_SET_EVENT_MARKS as BulkActionType,
  updateAssignee: BULK_UPDATE_EVENT_ASSIGNEE as BulkActionType,
  visit: BULK_VISIT_EVENTS as BulkActionType,
} as const;

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
 * or when a bulk action is already running.
 */
function isMarkDisabled(): boolean {
  if (props.selectedCount === 0) {
    return true;
  }

  return isActionSubmitting.value;
}

/**
 * Compute next explicit state for selected mark.
 *
 * @param action Mark action selected by user.
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
 * Store dispatch wrapper for bulk action helpers.
 *
 * @param actionType Vuex action name.
 * @param payload Vuex action payload.
 */
const dispatch = (actionType: string, payload: Record<string, unknown>) => {
  return store.dispatch(actionType, payload);
};

/**
 * Build shared context for bulk operation helpers.
 */
function getBulkActionsContext(): BulkActionContext {
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
  if (isActionSubmitting.value) {
    return;
  }

  hideBulkAssigneesList();
  hideBulkMoreMenu();
  isActionSubmitting.value = true;

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
    isActionSubmitting.value = false;
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

  const el = bulkAssignButtonRef.value?.$el as HTMLElement | null;

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
  const ARROW_RIGHT_OFFSET = 36;
  const ARROW_HALF_WIDTH = 6;
  const ARROW_X_FROM_LEFT = LIST_WIDTH - ARROW_RIGHT_OFFSET - ARROW_HALF_WIDTH;
  const viewportWidth = window.innerWidth;
  const leftPadding = 8;
  const anchorX = rect.left + rect.width / 2;
  const desiredLeft = anchorX - ARROW_X_FROM_LEFT;
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
.bulk-actions-bar {
  flex-shrink: 0;
  box-sizing: border-box;
  min-height: 40px;
  margin-block: 18px 0;
}

.bulk-actions-bar__content {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  align-items: center;
  justify-content: space-between;
}

.bulk-actions-bar__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  margin-left: 11px;
}

.bulk-actions-bar__cancel-combo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: pointer;
}

.bulk-actions-bar__cancel-combo .ui-button-text,
.bulk-actions-bar__count {
  font-size: 13px;
  font-weight: 500;
  line-height: 14px;
}

.bulk-actions-bar__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.bulk-actions-bar__action-button,
.bulk-actions-bar__action-button .ui-button-text,
.bulk-actions-bar__action-button .ui-button-icon {
  white-space: nowrap;
}

.bulk-actions-bar__action-button .ui-button-icon-assignee {
  width: 16px;
  height: 16px;
}

.bulk-actions-bar__more-trigger.ui-button {
  padding-inline: 8px;
  background-color: transparent;
  border: 0;
}

.bulk-actions-bar__count {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-main);
  white-space: nowrap;
}

.bulk-actions-bar__assignees-list--bulk {
  position: fixed;
  z-index: 210;
  transform: none;
}

.bulk-actions-bar__more-menu {
  position: fixed;
  z-index: 210;
  transform: translateX(-100%);

  .ui-context-list {
    background-color: var(--color-bg-main);
    border: 1px solid var(--color-border);
    box-shadow: 0 11px 13px -4px rgba(0, 0, 0, 0.5);
  }
}
</style>
