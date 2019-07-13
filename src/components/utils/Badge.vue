<template>
  <span
    class="badge"
    :class="{'badge--empty': !content}"
  >
    {{ content | spacedNumber }}
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
      type: [String, Number],
      required: true
    }
  }
};
</script>

<style>
  .badge {
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
  }
</style>
