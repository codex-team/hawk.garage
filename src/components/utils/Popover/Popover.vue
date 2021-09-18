<template>
  <div
    v-if="isOpened"
    class="popover-container"
    :style="[popoverPositionStyle, showPopOver]"
  >
    <component :is="popOverComponent" v-bind="popOverComponentProps" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export interface PopoverPositionStyle {
  top: string;
  bottom: string;
  left: string;
  right: string;
}
export default Vue.extend({
  name: 'Popover',
  data() {
    return {
      isOpened: false,
      popOverComponent: null,
      popOverComponentProps: null,
      popOverProps: {
        top:'unset',
        left:'unset',
        right:'unset',
        bottom:'unset'
      },
    };
  },
  computed:{
    popoverPositionStyle():PopoverPositionStyle {
      return {
        top: this.popOverProps?.top ?? 'unset',
        bottom: this.popOverProps?.bottom ?? 'unset',
        left: this.popOverProps?.left ?? 'unset',
        right: this.popOverProps?.right ?? 'unset',
      };
    },
    showPopOver() {
      return {
        opacity: 1,
        pointerEvents: 'auto',
      };
    },
  },
  methods: {
    open(options) {
      if (!options.componentName) {
        this.popOverComponent = null;

        return;
      }
      this.popOverComponentProps = options.componentProps;
      console.log(JSON.stringify(options.componentProps));
      this.popOverComponent = options.componentName;
      this.popOverProps = options.popOverProps;
      this.isOpened = true;
    },
    /**
     * Hide popover
     */
    close() {
      this.isOpened = false;
    },
  },
});
</script>

<style>
.popover-container {
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
</style>
