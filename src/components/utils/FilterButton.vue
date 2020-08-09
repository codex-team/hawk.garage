<template>
  <button
    class="filter-button"
    :class="{
      'filter-button--active': active,
    }"
    @click="$emit('click', $event)"
  >
    <span class="filter-button__text">
      {{ content }}
    </span>
  </button>
</template>

<script lang="ts">
export default {
  name: 'FlatButton',
  props: {
    /**
     * If true, displays button in active mode
     */
    active: {
      type: Boolean,
      default: false,
    },
    /**
     * Button content
     */
    content: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
  .filter-button {
    display: inline-flex;
    align-items: center;
    padding: 6px 7px;
    color: var(--color-text-second);

    letter-spacing: 0.1px;
    background: transparent;
    border: none;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    user-select: none;

    &:hover,
    &--active {
      color: var(--color-text-main);
      background: var(--color-bg-third);
    }

    &__text {
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
    }

  }
</style>
