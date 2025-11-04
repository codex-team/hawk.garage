<template>
  <div
    class="skeleton-bar"
    :class="[`skeleton-bar--${size}`, { 'skeleton-bar--rounded': rounded }]"
    :style="{ width: width, height: height }"
  />
</template>

<script>
/**
 * Reusable skeleton bar component with animated gradient
 */
export default {
  name: 'SkeletonBar',
  props: {
    /**
     * Predefined size variant
     *
     * @type {'small' | 'medium' | 'large'}
     */
    size: {
      type: String,
      default: 'medium',
      validator: (value) => {
        return [ 'small', 'medium', 'large' ].includes(value);
      },
    },

    /**
     * Custom width
     *
     * @type {string}
     */
    width: {
      type: String,
      default: null,
    },

    /**
     * Custom height
     *
     * @type {string}
     */
    height: {
      type: String,
      default: null,
    },

    /**
     * Whether to use rounded corners
     *
     * @type {boolean}
     */
    rounded: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
@import '../../styles/custom-properties.css';

.skeleton-bar {
  @apply --skeleton-base;
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

