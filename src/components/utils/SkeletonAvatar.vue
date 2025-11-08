<template>
  <div
    class="skeleton-avatar"
    :class="[`skeleton-avatar--${size}`]"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type SkeletonAvatarSize = 'xxs' | 'small' | 'medium' | 'large';

/**
 * Reusable skeleton avatar component with animated gradient
 */
export default defineComponent({
  name: 'SkeletonAvatar',
  props: {
    /**
     * Size of the avatar skeleton
     */
    size: {
      type: String as PropType<SkeletonAvatarSize>,
      default: 'medium' as SkeletonAvatarSize,
      validator: (value: string): boolean => {
        return ['xxs', 'small', 'medium', 'large'].includes(value);
      },
    },
  },
});
</script>

<style>
  @import "../../styles/custom-properties.css";

  .skeleton-avatar {
  @mixin skeleton-base;

  --size: 26px;
  width: var(--size);
  height: var(--size);
  border-radius: calc(var(--size) / 3.8);

  &--xxs {
    --size: 16px;
  }

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

