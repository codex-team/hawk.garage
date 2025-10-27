<template>
  <transition name="popover-appearing">
    <div
      v-show="isOpened"
      class="popover-container"
      :style="popoverPositionStyle"
      @mouseleave="onMouseLeaveFromPopover"
      @mouseenter="onMouseEnterPopover"
    >
      <component
        :is="popoverComponent"
        v-bind="popoverComponentProps"
      />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, Component, markRaw } from 'vue';

export default defineComponent({
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
      popoverComponent: undefined as Component | undefined,
      /**
       * Popover child component props.
       */
      popoverComponentProps: undefined as Record<string, unknown> | undefined,
      /**
       * Popover position props.
       */
      popoverProps: {
        showBelowElement: undefined as Element | undefined,
      },
      /**
       * Provides some delay between mouse leave and hiding
       */
      hidingDelay: undefined as ReturnType<typeof setTimeout> | undefined,
    };
  },
  computed:{
    /**
     * Style Sheet for positioning the popover w.r.t. Body tag.
     */
    popoverPositionStyle(): Record<string, string|number> {
      if (!this.popoverProps.showBelowElement) {
        return {
          display: 'none',
        };
      }

      const targetElementRect = this.popoverProps.showBelowElement.getBoundingClientRect();
      const topMargin = 15;

      return {
        top: targetElementRect.top + targetElementRect.height + topMargin + 'px',
        left: targetElementRect.left + (targetElementRect.width / 2) + 'px',
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
    open(options): void {
      if (!options.component && !options.componentProps) {
        this.popoverComponent = undefined;
        this.popoverComponentProps = undefined;

        return;
      }

      this.popoverComponent = markRaw(options.component);
      this.popoverComponentProps = options.componentProps;
      this.popoverProps = options.popoverProps;
      this.isOpened = true;
    },

    /**
     * Hide popover
     */
    close(): void {
      if (!this.isMouseOver) {
        this.isOpened = false;
      }
    },

    /**
     * When mouse leaves from popover.
     */
    onMouseLeaveFromPopover(): void {
      this.hidingDelay = setTimeout(() => {
        this.isMouseOver = false;
        this.close();
      }, 200);
    },

    /**
     * When mouse enter on popover.
     */
    onMouseEnterPopover(): void {
      if (this.hidingDelay) {
        clearTimeout(this.hidingDelay);
      }

      window.requestAnimationFrame(() => {
        this.isMouseOver = true;
      });
    },
  },
});
</script>

<style>
.popover-container {
  position: absolute;
  z-index: 1;
  padding: 15px 14px;
  line-height: normal;
  background-color: var(--color-bg-second);
  border-radius: 7px;
  box-shadow: 0 10px 23px 0 rgba(0, 0, 0, 0.34);

  transform: var(--transform-offset);
  transition: opacity 0.1s ease-in;

  --arrow-right-margin: 20px;
  --arrow-size: 10px;
  --transform-offset: translateX(calc(-100% + var(--arrow-right-margin) + var(--arrow-size)));

  &::after {
    position: absolute;
    right: var(--arrow-right-margin);
    bottom: 100%;
    border-color: transparent transparent var(--color-bg-second) transparent;
    border-style: solid;
    border-width: var(--arrow-size);
    content: "";
  }
}

.popover-appearing-enter-active,
.popover-appearing-leave-active {
  transition: transform 150ms cubic-bezier(0.29, 0.97, 0.82, 1.43), opacity 150ms ease;
}

.popover-appearing-enter,
.popover-appearing-leave-to {
  transform: var(--transform-offset) scale(1.05) translateY(6px);
  opacity: 0;
}

.popover-appearing-enter-to,
.popover-appearing-leave {
  transform: var(--transform-offset);
  opacity: 1;
}
</style>
