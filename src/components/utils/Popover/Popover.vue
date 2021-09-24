<template>
  <div
    v-if="isOpened"
    class="popover-container"
    :style="[popoverPositionStyle, showPopover]"
    @mouseleave="onMouseLeaveFromPopover"
    @mouseenter="onMouseOverPopover"
  >
    <component
      :is="popoverComponent"
      v-bind="popoverComponentProps"
    />
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
      /**
       * Is popover open.
       */
      isOpened: false,
      /**
       * Is Mouse on popover.
       */
      isMouseOver: false,
      /**
       * Popover child component need be display.
       */
      popoverComponent: null,
      /**
       * Popover child component props.
       */
      popoverComponentProps: null,
      /**
       * Popover position props.
       */
      popoverProps: {
        top:'unset',
        left:'unset',
        right:'unset',
        bottom:'unset',
      },
    };
  },
  computed:{
    /**
     * Style Sheet for positioning the popover w.r.t. Body tag.
     */
    popoverPositionStyle():PopoverPositionStyle {
      return {
        top: this.popoverProps?.top ?? 'unset',
        bottom: this.popoverProps?.bottom ?? 'unset',
        left: this.popoverProps?.left ?? 'unset',
        right: this.popoverProps?.right ?? 'unset',
      };
    },
    /**
     * Style Sheet for making popover visible.
     */
    showPopover() {
      return {
        opacity: 1,
        pointerEvents: 'auto',
      };
    },
  },
  methods: {
    // eslint-disable-next-line jsdoc/require-param
    /**
     *
     * Open Popover.
     *
     * @param options - Displaying component information.
     * @param options.component - component which need to be displayed.
     * @param options.componentProps - component props for passed component.
     * @param options.popoverProps - popover props.
     */
    open(options) {
      if (!options.component && !options.componentProps) {
        this.popoverComponent = null;
        this.popoverComponentProps = null;

        return;
      }
      this.popoverComponent = options.component;
      this.popoverComponentProps = options.componentProps;
      this.popoverProps = options.popoverProps;
      this.isOpened = true;
    },
    /**
     * Hide popover
     */
    close() {
      if (!this.isMouseOver) {
        this.isOpened = false;
      }
    },
    /**
     * When mouse leaves from popover.
     */
    onMouseLeaveFromPopover() {
      this.isMouseOver = false;
      if (this.isOpened) {
        this.close();
      }
    },
    /**
     * When mouse enter on popover.
     */
    onMouseOverPopover() {
      this.isMouseOver = true;
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
