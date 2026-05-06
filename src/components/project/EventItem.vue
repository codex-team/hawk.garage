<template>
  <div
    class="event-item"
    :class="{
      'event-item--visited': isVisited,
      [`event-item--${mark}-label`]: true,
      'event-item--ignored-label': isIgnored,
      'event-item--selection-mode': isSelectionModeActive,
      'event-item--row-selected': isRowSelected,
    }"
    data-ripple
    @click="handleRowClick"
  >
    <EventMark :mark="mark" />
    <div class="event-item__time">
      {{ formattedTime }}
    </div>
    <div class="event-item__badge-container">
      <EventBadge
        :event-count="count"
        :affected-users-count="affectedUsersCount"
        :is-visited="isVisited"
      />
    </div>
    <div
      class="event-item__info"
      :class="{ 'event-item__info--blurred': isEventBlurred }"
    >
      {{ event.payload.title }}
    </div>
    <UiButton
      v-if="event.taskManagerItem"
      class="event-item__issue-button"
      :content="`#${event.taskManagerItem.number}`"
      icon="github"
      extrasmall
      @click.stop="openIssueUrl"
    />
    <div
      class="event-item__bulk-checkbox"
      @click.stop
      @pointerdown.stop
    >
      <UiCheckbox
        :model-value="isRowSelected"
        class="event-item__checkbox"
        @pointerdown.stop
        @pointerup.stop
        @click.stop="$emit('toggle-row-select', $event)"
      />
    </div>
    <Icon
      v-if="!event.assignee"
      symbol="assignee"
      class="event-item__assignee event-item__assignee--icon"
      @click.stop="$emit('on-assignee-icon-click', $event)"
    />
    <EntityImage
      v-else
      :id="event.assignee.id"
      class="event-item__assignee event-item__assignee--image"
      :image="event.assignee.image"
      :name="event.assignee.name || event.assignee.email"
      :title="event.assignee.name || event.assignee.email"
      size="20"
      @click.stop="$emit('on-assignee-icon-click', $event)"
    />
  </div>
</template>

<script>
import Icon from '../utils/Icon';
import EventMark from './EventMark';
import EntityImage from '../utils/EntityImage';
import EventBadge from './EventBadge.vue';
import UiButton from '../utils/UiButton.vue';
import UiCheckbox from '../forms/UiCheckbox.vue';
import { prettyTime } from '@/utils/filters';
import { isEventAfterSubscriptionExpiry } from '@/components/utils/events/subscriptionExpiry';
import { SET_MODAL_DIALOG } from '@/store/modules/modalDialog/actionTypes';

export default {
  name: 'EventItem',
  components: {
    EventMark,
    EventBadge,
    Icon,
    EntityImage,
    UiButton,
    UiCheckbox,
  },
  props: {
    /**
     * True when at least one row is selected (all rows show checkboxes)
     */
    isSelectionModeActive: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether this row is selected in Event List via bulk selection
     */
    isRowSelected: {
      type: Boolean,
      default: false,
    },
    /**
     * @type {GroupedEvent} - event to display
     */
    event: {
      type: Object,
      required: true,
    },

    /**
     * @type {number} - timestamp of the last event
     */
    lastOccurrenceTimestamp: {
      type: Number,
      required: true,
    },

    /**
     * @type {number} - number of events per day
     */
    count: {
      type: [String, Number],
      default: '',
    },

    /**
     * @type {number | null} - event affected users count, null for old events, when affected users count was not calculated
     */
    affectedUsersCount: {
      type: [Number, null],
      default: null,
    },
  },
  emits: ['show-event-overview', 'toggle-row-select', 'on-assignee-icon-click'],
  computed: {
    /**
     * Return true if user visited current event
     *
     * @returns {boolean}
     */
    isVisited() {
      const { visitedBy } = this.event;

      if (!visitedBy) {
        return false;
      }

      return !!visitedBy.find(user => user.id === this.$store.state.user.data.id);
    },

    /**
     * Get mark with the highest priority
     *
     *  @returns {string}
     */
    mark() {
      const { marks } = this.event;
      const priority = ['resolved', 'starred', 'ignored'];
      const mark = priority.find(_mark => marks[_mark]);

      if (!mark) {
        return 'none';
      }

      return mark;
    },
    /**
     * Whether event has ignored mark (used only for row muting style)
     *
     * @returns {boolean}
     */
    isIgnored() {
      return !!(this.event.marks && this.event.marks.ignored);
    },

    /**
     * Returns project id from the route
     */
    projectId() {
      return this.$route.params.projectId;
    },

    /**
     * The project that owns the event
     */
    project() {
      return this.$store.getters.getProjectById(this.projectId);
    },

    /**
     * The workspace that owns the event
     */
    workspace() {
      return this.$store.getters.getWorkspaceByProjectId(this.projectId);
    },

    /**
     * Check if workspace is blocked
     */
    isWorkspaceBlocked() {
      return this.workspace?.isBlocked;
    },

    /**
     * Check if event was received after subscription expiration
     *
     * @returns {boolean}
     */
    isEventAfterExpiry() {
      return isEventAfterSubscriptionExpiry(
        this.lastOccurrenceTimestamp,
        this.workspace.lastChargeDate
      );
    },

    /**
     * Check if event is blurred
     *
     * @returns {boolean}
     */
    isEventBlurred() {
      return this.isEventAfterExpiry && this.isWorkspaceBlocked;
    },

    /**
     * Computed property that returns formatted time for last occurrence
     */
    formattedTime() {
      return prettyTime(this.lastOccurrenceTimestamp);
    },
  },
  methods: {
    /**
     * Open event or limit modal
     *
     * @param {MouseEvent} [evt] - row click event (used for Shift multi-select)
     * @returns {void}
     */
    handleRowClick(evt) {
      if (this.isSelectionModeActive && !this.isWorkspaceBlocked) {
        this.$emit('toggle-row-select', evt);

        return;
      }

      if (this.isEventBlurred) {
        this.$store.dispatch(SET_MODAL_DIALOG, {
          component: 'EventLimitModal',
          data: {
            workspaceId: this.workspace.id,
          },
        });

        return;
      }

      this.$emit('show-event-overview');
    },

    /**
     * Open GitHub issue URL in new tab
     */
    openIssueUrl() {
      if (this.event && this.event.taskManagerItem && this.event.taskManagerItem.url) {
        window.open(this.event.taskManagerItem.url, '_blank', 'noopener');
      }
    },
  },
};
</script>

<style>
  .event-item {
    display: flex;
    align-items: center;
    height: 46px;
    padding: 13px 11px 13px 15px;
    border-radius: 9px;

    &__time {
      min-width: 30px;
      margin-left: 10px;
      color: var(--color-text-second);
      font-size: 12px;
    }

    &__badge-container {
      min-width: 92px;
      margin-left: 19px;
    }

    &__info {
      margin-right: auto;
      margin-left: 10px;
      overflow: hidden;
      font-weight: bold;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;

      &--blurred {
        filter: blur(4px);
        user-select: none;
        pointer-events: none;
      }
    }

    &__issue-button {
      margin-left: 8px;
      flex-shrink: 0;
    }

    &__bulk-checkbox {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 0;
      min-width: 0;
      margin-left: 8px;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.12s ease, min-width 0.12s ease, width 0.12s ease;
    }

    /* Smaller than default UiCheckbox (28px) */
    &__checkbox.ui-checkbox {
      flex-shrink: 0;
      width: 20px;
      min-width: 20px;
      height: 20px;
      min-height: 20px;

      .icon {
        width: 14px;
        height: 14px;
        padding: 2px;
      }
    }

    &__assignee {
      margin-left: 10px;

      &--icon {
        width: 20px;
        min-width: 20px;
        height: 20px;
        min-height: 20px;
      }
    }

    &:hover {
      background-color: var(--color-bg-main);
    }

    /* Same fill as UiCheckbox:hover — row bg is also --color-bg-main, so this reads clearly */
    &:hover .event-item__bulk-checkbox .ui-checkbox:not(.ui-checkbox--disabled) {
      background-color: var(--color-bg-sidebar);
    }

    &--row-selected .event-item__bulk-checkbox .ui-checkbox:not(.ui-checkbox--disabled) {
      background-color: var(--color-bg-sidebar);
    }

    &:hover .event-item__bulk-checkbox,
    &--selection-mode .event-item__bulk-checkbox,
    &--row-selected .event-item__bulk-checkbox {
      width: 22px;
      min-width: 22px;
      opacity: 1;
      pointer-events: auto;
      overflow: visible;
    }

    &--ignored-label {
      opacity: 0.2;
    }
  }

  /* Devices without hover: always show checkbox hit target */
  @media (hover: none) {
    .event-item .event-item__bulk-checkbox {
      width: 22px;
      min-width: 22px;
      opacity: 1;
      pointer-events: auto;
      overflow: visible;
    }
  }

  .event-item--visited .event-item__info {
    color: var(--color-text-second);
  }

  .event-item.event-item--row-selected:not(:hover) {
    background-color: var(--color-bg-darken);
  }

  .event-item.event-item--row-selected.event-item--ignored-label {
    opacity: 1;
  }

  .event-item.event-item--row-selected + .event-item.event-item--row-selected {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  @supports selector(.event-item:has(+ .event-item)) {
    .event-item.event-item--row-selected:has(+ .event-item.event-item--row-selected) {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
</style>
