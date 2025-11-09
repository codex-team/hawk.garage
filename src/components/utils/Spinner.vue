<template>
  <div
    class="spinner"
    :class="[`spinner--${size}`]"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type SpinnerSize = 'small' | 'medium' | 'large';

export default defineComponent({
  name: 'Spinner',
  props: {
    /**
     * Size of the spinner
     */
    size: {
      type: String as PropType<SpinnerSize>,
      default: 'medium' as SpinnerSize,
      validator: (value: string): boolean => {
        return ['small', 'medium', 'large'].includes(value);
      },
    },
  },
});
</script>

<style>
.spinner {
  --size: 40px;
  width: var(--size);
  height: var(--size);
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-indicator-medium);
  border-radius: 50%;
  animation: spinner-keyframes 0.8s linear infinite;
}

.spinner--small {
  --size: 24px;
}

.spinner--medium {
  --size: 40px;
}

.spinner--large {
  --size: 56px;
}

@keyframes spinner-keyframes {
  to {
    transform: rotate(360deg);
  }
}
</style>
