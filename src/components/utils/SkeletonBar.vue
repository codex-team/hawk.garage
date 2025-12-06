<template>
  <div
    class="skeleton-bar"
    :class="[`skeleton-bar--${size}`, { 'skeleton-bar--rounded': rounded }]"
    :style="{ width: width, height: height }"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type SkeletonBarSize = 'small' | 'medium' | 'large';

/**
 * Reusable skeleton bar component with animated gradient
 */
export default defineComponent({
  name: 'SkeletonBar',
  props: {
    /**
     * Predefined size variant
     */
    size: {
      type: String as PropType<SkeletonBarSize>,
      default: 'medium' as SkeletonBarSize,
      validator: (value: string): boolean => {
        return ['small', 'medium', 'large'].includes(value);
      },
    },

    /**
     * Custom width
     */
    width: {
      type: String,
      default: null,
    },

    /**
     * Custom height
     */
    height: {
      type: String,
      default: null,
    },

    /**
     * Whether to use rounded corners
     */
    rounded: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style>
  @import "../../styles/custom-properties.css";

  .skeleton-bar {
  @mixin skeleton-base;
  border-radius: 9px;

  &--small {
    height: 12px;
  }

  &--medium {
    height: 14px;
  }

  &--large {
    height: 18px;
  }

  &--rounded {
    border-radius: 50%;
  }
}
</style>
