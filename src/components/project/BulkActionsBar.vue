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
        :disabled="isActionDisabled('resolved')"
        @click="$emit('bulk-mark', 'resolved')"
      />
      <UiButton
        :content="''"
        :title="bulkIgnoreLabel"
        :aria-label="bulkIgnoreLabel"
        :icon="bulkIgnoreIcon"
        class="events-list__bulk-action-button"
        small
        :disabled="isActionDisabled('ignored')"
        @click="$emit('bulk-mark', 'ignored')"
      />
      <UiButton
        :content="''"
        :title="bulkStarLabel"
        :aria-label="bulkStarLabel"
        :icon="bulkStarIcon"
        class="events-list__bulk-action-button"
        small
        :disabled="isActionDisabled('starred')"
        @click="$emit('bulk-mark', 'starred')"
      />
      <UiButton
        :content="''"
        :title="$t('event.viewedBy.assignee')"
        :aria-label="$t('event.viewedBy.assignee')"
        icon="assignee"
        class="events-list__bulk-action-button"
        small
        :disabled="isActionDisabled('assign')"
        @click="$emit('bulk-assign-click', $event)"
      />
      <UiButton
        :content="''"
        :title="$t('event.bulk.moreActions')"
        :aria-label="$t('event.bulk.moreActions')"
        icon="dots-vertical"
        class="events-list__bulk-action-button events-list__bulk-more-trigger"
        small
        :disabled="isActionDisabled('more')"
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
    activeBulkAction: {
      type: String,
      default: '',
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
    'bulk-mark',
    'bulk-assign-click',
    'bulk-more-menu-click',
  ],
  computed: {
    isActionDisabled() {
      return (action) => {
        if (this.selectedCount === 0) {
          return true;
        }

        return this.activeBulkAction === action;
      };
    },
  },
};
</script>
