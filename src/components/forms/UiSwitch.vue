<template>
  <div
    class="ui-switch"
    :class="{'ui-switch--checked': this.value}"
    @click="clicked"
  >
    <div class="ui-switch__slider" />
    <div
      v-if="label"
      class="ui-switch__label"
    >
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'UiSwitch',
  props: {
    label: {
      type: String,
      default: undefined,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clicked() {
      this.$emit('input', !this.value);
    },
  },
});
</script>

<style>
  .ui-switch {
    display: flex;
    cursor: pointer;
    user-select: none;

    &__slider {
      position: relative;
      width: 25px;
      height: 10px;
      margin-top: 3px;
      background-color: rgba(219, 230, 255, 0.25);
      border-radius: 10px;

      &::before {
        position: absolute;
        width: 16px;
        height: 16px;
        background-color: var(--color-text-main);
        border-radius: 50%;
        transform: translate3d(0, -3px, 0);
        transition: transform .1s linear, background-color .1s linear;
        content: '';
      }

      ^&--checked &::before {
        background-color: var(--color-indicator-medium);
        transform: translate3d(9px, -3px, 0);
      }
    }

    &__label {
      margin-left: 8px;
      color: var(--color-text-second);
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.18px;

      ^&--checked & {
        color: var(--color-text-main);
      }
    }
  }
</style>
