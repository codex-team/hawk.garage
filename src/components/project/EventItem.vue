<template>
  <div
    class="event-item"
    :class="{
      'event-item--visited': isVisited,
      [`event-item--${mark}-label`]: true,
    }"
    data-ripple
    @click="$emit('showEventOverview')"
  >
    <EventMark :mark="mark" />
    <div class="event-item__time">
      {{ lastOccurrenceTimestamp | prettyTime }}
    </div>
    <div class="event-item__badge-container">
      <Badge
        :content="count"
        :type="isVisited ? 'silent' : 'default'"
        class="event-item__count"
      />
    </div>
    <div class="event-item__info">
      {{ event.payload.title }}
    </div>
    <Icon
      symbol="assignee"
      class="event-item__assignee-icon"
      @click.native.stop="$emit('onAssigneeIconClick', $event)"
    />
  </div>
</template>

<script>
import Badge from '../utils/Badge';
import Icon from '../utils/Icon';
import EventMark from './EventMark';

export default {
  name: 'EventItem',
  components: {
    EventMark,
    Badge,
    Icon,
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
     * @type {Number} - timestamp of the last event
     */
    lastOccurrenceTimestamp: {
      type: Number,
      required: true,
    },
    /**
     * @type {Number} - number of events per day
     */
    count: {
      type: [String, Number],
      default: '',
    },
  },
  computed: {
    /**
     * Return true if user visited current event
     *
     * @return {boolean}
     */
    isVisited() {
      const { visitedBy } = this.event;

      if (!visitedBy) {
        return false;
      }

      return visitedBy.map(user => user.id).includes(this.$store.state.user.data.id);
    },

    /**
     * Get mark with the highest priority
     *
     *  @return {string}
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
      min-width: 45px;
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

    }

    &__assignee-icon {
      width: 26px;
      min-width: 26px;
      height: 26px;
      min-height: 26px;
      margin-left: 10px;
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
