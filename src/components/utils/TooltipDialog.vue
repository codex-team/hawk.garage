<template>
  <div class="events-limit-indicator">
    <slot name=""></slot>
    <div class="events-limit-indicator__tooltip-dialog">
      <slot name=""></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'TooltipDialog',
});
</script>

<style>
.events-limit-indicator {
  position: relative;
  margin-left: auto;
  line-height: 0px;

  &__tooltip-dialog {
    position: absolute;
    z-index: 1;
    top: 140%;
    right: -170%;
    background-color: var(--color-bg-second);
    box-shadow: 0 10px 23px 0 rgba(0, 0, 0, 0.34);
    border-radius: 10px;
    opacity: 0;
    line-height: normal;
    padding: 15px;
    transition: opacity 0.1s ease-in;
    pointer-events: none;

    &::after {
      position: absolute;
      bottom: 100%;
      left: 70%;
      margin-left: -14px;
      border-color: transparent transparent var(--color-bg-second) transparent;
      border-style: solid;
      border-width: 10px;
      content: " ";
    }
  }

  &:hover &__tooltip-dialog {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
