<template>
  <span class="a-counter">
    <span
      v-if="prevValue !== null"
      class="a-counter__prev"
    >
      {{ prevValue }}
    </span>
    <span
      v-if="curValue !== null"
      class="a-counter__cur"
    >
      {{ curValue }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  /**
   * Passed value for animating
   */
  value: string | number;
}

const props = defineProps<Props>();

/**
 * Previous value to jump out
 */
const prevValue = ref<string | number | null>(null);

/**
 * Current value to jump in
 */
const curValue = ref<string | number | null>(props.value);

watch(() => props.value, (newValue, oldValue) => {
  prevValue.value = null;
  curValue.value = null;

  setTimeout(() => {
    prevValue.value = oldValue;
    curValue.value = newValue;
  }, 10);
});
</script>

<style>
  .a-counter {
    position: relative;
    display: inline-block;
    min-width: 7px;
    height: 1em;

    &__prev,
    &__cur {
      will-change: transform, opacity;
    }

    &__prev {
      position: absolute;
      animation: prev-out 500ms ease forwards;
    }

    &__cur {
      position: relative;
      display: inline-block;
      animation: cur-in 500ms ease forwards;
    }
  }

  @keyframes cur-in {
    from {
      transform: translateY(-5px);
      opacity: 0;
    }

    to {
      transform: none;
      opacity: 1;
    }
  }

  @keyframes prev-out {
    from {
      transform: none;
      opacity: 1;
    }

    to {
      transform: translateY(5px);
      opacity: 0;
    }
  }
</style>
