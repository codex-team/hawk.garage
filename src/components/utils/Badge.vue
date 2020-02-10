<template>
  <span
    class="badge"
    :class="[
      { 'badge--empty': !content },
      `badge--${type}`
    ]"
  >
    <Icon
      v-if="withIcon"
      class="badge__icon"
      symbol="flash"
    />
    {{ content | spacedNumber }}
  </span>
</template>

<script>
import Icon from './Icon';

export default {
  name: 'Badge',
  components: {
    Icon
  },
  props: {
    /**
     * Badge content
     */
    content: {
      type: [String, Number],
      required: true
    },

    /**
     * Badge type (default, critical or medium)
     */
    type: {
      type: String,
      default: 'default'
    },

    /**
     * Will icon show or not
     */
    withIcon: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
  .badge {
    display: inline-flex;
    height: 20px;
    padding: 4px 7px 3px 7px;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 11px;
    line-height: 13px;
    white-space: nowrap;
    background-color: var(--color-indicator-medium);
    border-radius: 7px;

    &--empty {
      display: none;
    }

    &--critical {
      background-color: var(--color-indicator-critical);
    }

    &--visited {
      color: var(--color-text-second);
      background-color: var(--color-bg-main);
    }

    &__icon {
      display: inline;
      width: 7px;
      height: 100%;
      margin-right: 8px;
    }
  }
</style>
