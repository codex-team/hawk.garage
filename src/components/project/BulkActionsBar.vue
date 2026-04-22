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
        <span class="ui-button-text">{{ $t('components.confirmationWindow.cancel') }}</span>
        <span class="ui-button-text events-list__bulk-cancel-esc">{{ $t('common.escKey') }}</span>
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
        @click="$emit('bulk-assign-click', $event)"
      />
      <UiButton
        :content="''"
        :title="$t('event.bulk.moreActions')"
        :aria-label="$t('event.bulk.moreActions')"
        icon="dots-vertical"
        class="events-list__bulk-action-button events-list__bulk-more-trigger"
        small
        :disabled="selectedCount === 0"
        @click="$emit('bulk-more-menu-click', $event)"
      />
    </div>
  </div>
</template>

<script>
import UiButton from '../utils/UiButton.vue';

export default {
  name: 'BulkActionsBar',
  components: {
    UiButton,
  },
  props: {
    selectionModeActive: {
      type: Boolean,
      default: false,
    },
    selectedCount: {
      type: Number,
      default: 0,
    },
    onBulkMark: {
      type: Function,
      required: true,
    },
    bulkResolveLabel: {
      type: String,
      required: true,
    },
    bulkResolveIcon: {
      type: String,
      required: true,
    },
    bulkIgnoreLabel: {
      type: String,
      required: true,
    },
    bulkIgnoreIcon: {
      type: String,
      required: true,
    },
    bulkStarLabel: {
      type: String,
      required: true,
    },
    bulkStarIcon: {
      type: String,
      required: true,
    },
  },
  emits: [
    'exit-bulk-select',
    'bulk-assign-click',
    'bulk-more-menu-click',
  ],
  data() {
    return {
      activeMarkAction: '',
    };
  },
  methods: {
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

      this.activeMarkAction = action;

      try {
        await this.onBulkMark(action);
      } finally {
        this.activeMarkAction = '';
      }
    },
  },
};
</script>
