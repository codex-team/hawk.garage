<template>
  <span
    class="badge"
    :class="'badge--' + type"
  >
    {{ content | abbreviateNumber }}
  </span>
</template>

<script>

export default {
  name: 'Badge',
  props: {
    /**
     * Badge content
     */
    content: {
      type: Number,
      required: true,
    },

    /**
     * Badge type (default, critical or medium)
     */
    type: {
      type: String,
      default: 'default',
    },
  },
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

    &--critical {
      background-color: var(--color-indicator-critical);
    }

    &--silent {
      color: var(--color-text-second);
      background-color: var(--color-bg-main);
    }
  }
</style>
