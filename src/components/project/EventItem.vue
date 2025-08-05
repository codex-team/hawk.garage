<template>
  <div
    class="event-item"
    :class="{
      'event-item--visited': isVisited,
      [`event-item--${mark}-label`]: true,
    }"
    data-ripple
    @click="handleClick"
  >
    <EventMark :mark="mark" />
    <div class="event-item__time">
      {{ lastOccurrenceTimestamp | prettyTime }}
    </div>
    <div class="event-item__badge-container">
      <EventBadge
        :event-count="count"
        :affected-users-count="affectedUsersCount"
        :is-visited="isVisited"
      />
    </div>
    <div class="event-item__info" :class="{ 'event-item__info--blurred': isEventBlurred }">
      {{ event.payload.title }}
    </div>
    <Icon
      v-if="!event.assignee"
      symbol="assignee"
      class="event-item__assignee event-item__assignee--icon"
      @click.native.stop="$emit('onAssigneeIconClick', $event)"
    />
    <EntityImage
      v-else
      :id="event.assignee.id"
      class="event-item__assignee event-item__assignee--image"
      :image="event.assignee.image"
      :name="event.assignee.name || event.assignee.email"
      :title="event.assignee.name || event.assignee.email"
      size="20"
      @click.native.stop="$emit('onAssigneeIconClick', $event)"
    />
  </div>
</template>

<script>
import Icon from '../utils/Icon';
import EventMark from './EventMark';
import EntityImage from '../utils/EntityImage';
import EventBadge from './EventBadge.vue';
import { isEventAfterSubscriptionExpiry } from '@/components/utils/events/subscriptionExpiry';
import { SET_MODAL_DIALOG } from '@/store/modules/modalDialog/actionTypes';

export default {
  name: 'EventItem',
  components: {
    EventMark,
    EventBadge,
    Icon,
    EntityImage,
  },
  props: {
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
  },
  beforeDestroy() {
    this.$root.$off('workspacePlanChanged');
  },
  methods: {
    /**
     * Handle click on event item
     */
    handleClick() {
      if (this.isEventBlurred) {
        this.$store.dispatch(SET_MODAL_DIALOG, {
          component: 'EventLimitModal',
          data: {
            workspaceId: this.workspace.id,
          },
        });
      } else {
        this.$emit('showEventOverview');
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

    &--visited {
      ^&__info {
        color: var(--color-text-second);
      }
    }

    &--ignored-label {
      opacity: 0.2;
    }
  }
</style>
