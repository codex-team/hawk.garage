<template>
  <div
    v-show="selectionModeActive"
    class="events-list__bulk-bar"
  >
    <div class="events-list__bulk-meta">
      <button
        type="button"
        class="ui-button ui-button--small ui-button--secondary events-list__bulk-cancel-combo"
        @click="$emit('exit-bulk-select')"
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

<script>
import UiButton from '../utils/UiButton.vue';
import UiContextList from '../utils/UiContextList.vue';
import AssigneesList from '../event/AssigneesList.vue';

export default {
  name: 'BulkActionsBar',
  components: {
    UiButton,
    UiContextList,
    AssigneesList,
  },
  props: {
    projectId: {
      type: String,
      default: '',
    },
    currentUserId: {
      type: String,
      default: '',
    },
    selectionModeActive: {
      type: Boolean,
      default: false,
    },
    selectedCount: {
      type: Number,
      default: 0,
    },
    selectedEvents: {
      type: Array,
      default: () => [],
    },
    onBulkMark: {
      type: Function,
      required: true,
    },
    onBulkAssign: {
      type: Function,
      required: true,
    },
    onBulkUnassign: {
      type: Function,
      required: true,
    },
    onBulkMarkViewed: {
      type: Function,
      required: true,
    },
  },
  emits: [
    'exit-bulk-select',
  ],
  data() {
    return {
      activeMarkAction: '',
      isBulkAssigneesShowed: false,
      bulkAssigneesListPosition: {
        top: 0,
        left: 0,
      },
      bulkAssignAnchorEl: null,
      bulkAssignOnViewportChange: null,
      isBulkMoreMenuShowed: false,
      bulkMoreMenuPosition: {
        top: 0,
        left: 0,
      },
      bulkMoreMenuAnchorEl: null,
      bulkMoreMenuOnViewportChange: null,
    };
  },
  computed: {
    areAllSelectedIgnored() {
      return this.selectedEvents.length > 0 && this.selectedEvents.every(event => event.marks?.ignored);
    },
    areAllSelectedResolved() {
      return this.selectedEvents.length > 0 && this.selectedEvents.every(event => event.marks?.resolved);
    },
    areAllSelectedStarred() {
      return this.selectedEvents.length > 0 && this.selectedEvents.every(event => event.marks?.starred);
    },
    bulkIgnoreLabel() {
      return this.areAllSelectedIgnored
        ? this.$t('event.bulk.unignore')
        : this.$t('event.ignore');
    },
    bulkResolveLabel() {
      return this.areAllSelectedResolved
        ? this.$t('event.bulk.unresolve')
        : this.$t('event.resolve');
    },
    bulkResolveIcon() {
      return this.areAllSelectedResolved ? 'close-circle' : 'checkmark';
    },
    bulkStarLabel() {
      return this.areAllSelectedStarred
        ? this.$t('event.bulk.unstar')
        : this.$t('event.star');
    },
    bulkIgnoreIcon() {
      return this.areAllSelectedIgnored ? 'eye' : 'hided';
    },
    bulkStarIcon() {
      return this.areAllSelectedStarred ? 'star-outline' : 'star';
    },
    hasAssigneeInSelection() {
      return this.selectedEvents.some(event => !!event.assignee);
    },
    bulkMoreMenuItems() {
      return [
        {
          label: this.$t('event.bulk.markViewed'),
          icon: 'eye',
          isActive: false,
          onActivate: () => {
            void this.onBulkMarkViewedClick();
          },
        },
      ];
    },
  },
  methods: {
    /**
     * Selected original events deduplicated by original id.
     *
     * @returns {{ originalEventId: string; event: object }[]}
     */
    getSelectedOriginalEvents() {
      const byOriginalId = new Map();

      for (const event of this.selectedEvents) {
        if (!event || !event.originalEventId) {
          continue;
        }

        const originalEventId = String(event.originalEventId);

        if (!byOriginalId.has(originalEventId)) {
          byOriginalId.set(originalEventId, event);
        }
      }

      return Array.from(byOriginalId.entries()).map(([originalEventId, event]) => ({
        originalEventId,
        event,
      }));
    },
    /**
     * Resolve target ids for bulk mark click.
     * If all selected have mark -> unmark all selected.
     * Else -> mark only those without mark.
     *
     * @param {'resolved'|'ignored'|'starred'} action
     * @returns {string[]}
     */
    getTargetOriginalIdsForMark(action) {
      const selected = this.getSelectedOriginalEvents();

      if (selected.length === 0) {
        return [];
      }

      const allHaveMark = selected.every(({ event }) => Boolean(event.marks && event.marks[action]));

      if (allHaveMark) {
        return selected.map(({ originalEventId }) => originalEventId);
      }

      return selected
        .filter(({ event }) => !(event.marks && event.marks[action]))
        .map(({ originalEventId }) => originalEventId);
    },
    /**
     * Resolve target ids for assignee bulk action.
     *
     * @param {string|null} assigneeId
     * @returns {string[]}
     */
    getTargetOriginalIdsForAssignee(assigneeId) {
      const selected = this.getSelectedOriginalEvents();
      const targetAssigneeId = assigneeId ? String(assigneeId) : '';

      return selected
        .filter(({ event }) => {
          const currentAssigneeId = event.assignee ? String(event.assignee.id || '') : '';

          return currentAssigneeId !== targetAssigneeId;
        })
        .map(({ originalEventId }) => originalEventId);
    },
    /**
     * Resolve target ids for "mark viewed" bulk action.
     *
     * @returns {string[]}
     */
    getTargetOriginalIdsForViewed() {
      const selected = this.getSelectedOriginalEvents();
      const currentUserId = String(this.currentUserId || '');

      if (!currentUserId) {
        return selected.map(({ originalEventId }) => originalEventId);
      }

      return selected
        .filter(({ event }) => {
          const visitedBy = Array.isArray(event.visitedBy) ? event.visitedBy : [];

          return !visitedBy.some(visitor => String(visitor && visitor.id) === currentUserId);
        })
        .map(({ originalEventId }) => originalEventId);
    },
    isMarkDisabled(action) {
      if (this.selectedCount === 0) {
        return true;
      }

      return this.activeMarkAction === action;
    },
    async onMarkClick(action) {
      if (this.activeMarkAction) {
        return;
      }

      this.hideBulkAssigneesList();
      this.hideBulkMoreMenu();
      this.activeMarkAction = action;

      try {
        const targetOriginalIds = this.getTargetOriginalIdsForMark(action);

        if (targetOriginalIds.length === 0) {
          return;
        }

        await this.onBulkMark(action, targetOriginalIds);
      } finally {
        this.activeMarkAction = '';
      }
    },
    onBulkAssignButtonClick(evt) {
      if (evt && typeof evt.stopPropagation === 'function') {
        evt.stopPropagation();
      }

      this.hideBulkMoreMenu();

      const el = evt && evt.currentTarget ? evt.currentTarget : null;

      if (!el) {
        return;
      }

      if (this.isBulkAssigneesShowed && this.bulkAssignAnchorEl === el) {
        this.hideBulkAssigneesList();

        return;
      }

      this.hideBulkAssigneesList();
      this.bulkAssignAnchorEl = el;
      this.isBulkAssigneesShowed = true;
      this.setBulkAssigneesPosition();
      this.bulkAssignOnViewportChange = this.setBulkAssigneesPosition.bind(this);
      window.addEventListener('resize', this.bulkAssignOnViewportChange);
      window.addEventListener('scroll', this.bulkAssignOnViewportChange, true);
    },
    onBulkMoreMenuButtonClick(evt) {
      if (evt && typeof evt.stopPropagation === 'function') {
        evt.stopPropagation();
      }

      this.hideBulkAssigneesList();
      const el = evt && evt.currentTarget ? evt.currentTarget : null;

      if (!el) {
        return;
      }

      if (this.isBulkMoreMenuShowed && this.bulkMoreMenuAnchorEl === el) {
        this.hideBulkMoreMenu();

        return;
      }

      this.hideBulkMoreMenu();
      this.bulkMoreMenuAnchorEl = el;
      this.isBulkMoreMenuShowed = true;
      this.setBulkMoreMenuPosition();
      this.bulkMoreMenuOnViewportChange = this.setBulkMoreMenuPosition.bind(this);
      window.addEventListener('resize', this.bulkMoreMenuOnViewportChange);
      window.addEventListener('scroll', this.bulkMoreMenuOnViewportChange, true);
    },
    setBulkAssigneesPosition() {
      if (!this.bulkAssignAnchorEl) {
        return;
      }

      const rect = this.bulkAssignAnchorEl.getBoundingClientRect();
      const LIST_WIDTH = 210;
      const ARROW_X_FROM_LEFT = 174; // AssigneesList top triangle: right: 36px => 210 - 36
      const OFFSET_X = 8;
      const viewportWidth = window.innerWidth;
      const leftPadding = 8;
      const anchorX = rect.left + rect.width / 2;
      const desiredLeft = anchorX - ARROW_X_FROM_LEFT + OFFSET_X;
      const clampedLeft = Math.min(
        Math.max(desiredLeft, leftPadding),
        Math.max(leftPadding, viewportWidth - LIST_WIDTH - leftPadding)
      );

      this.bulkAssigneesListPosition = {
        top: `${rect.bottom + 8}px`,
        left: `${clampedLeft}px`,
      };
    },
    setBulkMoreMenuPosition() {
      if (!this.bulkMoreMenuAnchorEl) {
        return;
      }

      const rect = this.bulkMoreMenuAnchorEl.getBoundingClientRect();
      const OFFSET_X = 0;
      const MENU_WIDTH = 260;
      const viewportWidth = window.innerWidth;
      const leftPadding = 8;
      const desiredRight = rect.right + OFFSET_X;
      const clampedRight = Math.min(
        Math.max(desiredRight, MENU_WIDTH + leftPadding),
        Math.max(MENU_WIDTH + leftPadding, viewportWidth - leftPadding)
      );

      this.bulkMoreMenuPosition = {
        top: `${rect.bottom + 8}px`,
        left: `${clampedRight}px`,
      };
    },
    hideBulkAssigneesList() {
      this.isBulkAssigneesShowed = false;
      this.bulkAssignAnchorEl = null;

      if (typeof this.bulkAssignOnViewportChange === 'function') {
        window.removeEventListener('resize', this.bulkAssignOnViewportChange);
        window.removeEventListener('scroll', this.bulkAssignOnViewportChange, true);
        this.bulkAssignOnViewportChange = null;
      }
    },
    hideBulkMoreMenu() {
      this.isBulkMoreMenuShowed = false;
      this.bulkMoreMenuAnchorEl = null;

      if (typeof this.bulkMoreMenuOnViewportChange === 'function') {
        window.removeEventListener('resize', this.bulkMoreMenuOnViewportChange);
        window.removeEventListener('scroll', this.bulkMoreMenuOnViewportChange, true);
        this.bulkMoreMenuOnViewportChange = null;
      }
    },
    async onBulkPickAssignee(user) {
      this.hideBulkAssigneesList();

      if (!user || this.selectedCount === 0) {
        return;
      }

      const targetOriginalIds = this.getTargetOriginalIdsForAssignee(user.id);

      if (targetOriginalIds.length === 0) {
        return;
      }

      await this.onBulkAssign(user, targetOriginalIds);
    },
    async onBulkClearAssignees() {
      this.hideBulkAssigneesList();

      if (this.selectedCount === 0) {
        return;
      }

      const targetOriginalIds = this.getTargetOriginalIdsForAssignee(null);

      if (targetOriginalIds.length === 0) {
        return;
      }

      await this.onBulkUnassign(targetOriginalIds);
    },
    async onBulkMarkViewedClick() {
      this.hideBulkAssigneesList();
      this.hideBulkMoreMenu();

      if (this.selectedCount === 0) {
        return;
      }

      const targetOriginalIds = this.getTargetOriginalIdsForViewed();

      if (targetOriginalIds.length === 0) {
        return;
      }

      await this.onBulkMarkViewed(targetOriginalIds);
    },
  },
  // eslint-disable-next-line vue/order-in-components
  watch: {
    selectionModeActive(newVal) {
      if (!newVal) {
        this.hideBulkAssigneesList();
        this.hideBulkMoreMenu();
      }
    },
  },
  // eslint-disable-next-line vue/order-in-components
  beforeUnmount() {
    this.hideBulkAssigneesList();
    this.hideBulkMoreMenu();
  },
};
</script>
