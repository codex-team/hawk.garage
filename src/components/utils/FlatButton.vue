<template>
  <UiButton
    v-bind="$attrs"
    class="flat-button"
    :class="{'flat-button--active': active}"
    @click="$emit('click')"
  />
</template>

<script lang="ts">
import UiButton from './UiButton.vue';

export default {
  name: 'FlatButton',
  components: {
    UiButton,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
  .flat-button {
    color: var(--color-text-second);
    font-size: 13px;
    letter-spacing: 0.1px;
    border: none;
  }

  .flat-button:hover,
  .flat-button--active {
    color: var(--color-text-main);
    background: var(--color-bg-third);
  }
</style>
