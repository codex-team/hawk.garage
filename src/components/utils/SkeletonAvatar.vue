<template>
  <div
    class="skeleton-avatar"
    :class="[`skeleton-avatar--${size}`]"
  />
</template>

<script>
/**
 * Reusable skeleton avatar component with animated gradient
 */
export default {
  name: 'SkeletonAvatar',
  props: {
    /**
     * Size of the avatar skeleton
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
  },
};
</script>

<style>
@import '../../styles/custom-properties.css';

.skeleton-avatar {
  @apply --skeleton-base;

  --size: 26px;
  width: var(--size);
  height: var(--size);
  border-radius: calc(var(--size) / 3.8);

  &--small {
    --size: 26px;
  }

  &--medium {
    --size: 36px;
  }

  &--large {
    --size: 56px;
  }
}
</style>

