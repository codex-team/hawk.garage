<template>
  <div
    :class="{'event-badge--visited': isVisited}"
    class="event-badge"
  >
    <span class="event-badge__count">
      {{ eventCount | abbreviateNumber }}
    </span>
    <div
      v-if="affectedUsersCount !== null && affectedUsersCount > 0"
      class="event-badge__affected-users"
    >
      <Icon
        symbol="user-small"
        class="event-badge__affected-users-icon"
      />
      {{ affectedUsersCount | abbreviateNumber }}
    </div>
  </div>
</template>

<script>
import Icon from '../utils/Icon.vue';

export default {
  name: 'EventBadge',
  components: {
    Icon,
  },
  props: {
    /**
     * @type {number} - number of events
     */
    eventCount: {
      type: Number,
      required: true,
    },

    /**
     * @type {number | null} - event affected users count, null for old events, when affected users count was not calculated
     */
    affectedUsersCount: {
      type: [Number, null],
      default: null,
    },

    /**
     * @type {boolean} - true if user visited current event
     */
    isVisited: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.event-badge {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 5px 5px;
  color: var(--color-text-main);
  line-height: 9px;
  white-space: nowrap;
  background-color: var(--color-indicator-medium);
  border-radius: 6px;

  &__affected-users {
    display: flex;
    align-items: center;
    margin-left: 10px;
    font-size: 10px;

    &-icon {
      display: block;
      width: 10px;
      height: 10px;
      margin-right: 2px;
    }
  }

  &__count {
    font-weight: bold;
    font-size: 12px;
  }

  &--visited {
    color: var(--color-text-second);
    background-color: var(--color-bg-main);
  }
}
</style>
