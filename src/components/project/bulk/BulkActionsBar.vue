<template>
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
  refreshEventsByOriginalIds,
  runBulkAssigneeAction,
  runBulkMarkAction,
  runBulkViewedAction
} from './bulkEventOperations';

/**
 * Props contract for bulk actions toolbar.
 */
const props = withDefaults(defineProps<{
  projectId?: string;
  currentUserId?: string;
  selectionModeActive?: boolean;
  selectedCount?: number;
  selectedEvents?: BulkSelectedEvent[];
}>(), {
  projectId: '',
  currentUserId: '',
  selectionModeActive: false,
  selectedCount: 0,
  selectedEvents: () => [] as BulkSelectedEvent[],
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

/**
 * True when every selected event is already ignored.
 */
const areAllSelectedIgnored = computed(() => {
  return props.selectedEvents.length > 0 && props.selectedEvents.every(event => event.marks?.ignored);
});
const areAllSelectedResolved = computed(() => {
  return props.selectedEvents.length > 0 && props.selectedEvents.every(event => event.marks?.resolved);
});
const areAllSelectedStarred = computed(() => {
  return props.selectedEvents.length > 0 && props.selectedEvents.every(event => event.marks?.starred);
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
  return props.selectedEvents.some(event => !!event.assignee);
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

  for (const event of props.selectedEvents) {
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
 * Resolve explicit next state for selected mark.
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
        selectedEvents: props.selectedEvents,
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

    await runBulkMarkAction(getBulkActionsContext(), action, targetOriginalIds, enabled);
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

  await runBulkAssigneeAction(getBulkActionsContext(), user, targetOriginalIds);
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

  await runBulkAssigneeAction(getBulkActionsContext(), null, targetOriginalIds);
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

  await runBulkViewedAction(getBulkActionsContext(), targetOriginalIds);
}

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
