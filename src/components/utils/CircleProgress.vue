<template>
  <svg
    class="progress-ring"
    :width="size"
    :height="size"
    :stroke-width="strokeWidth"
  >
    <circle
      class="progress-ring__back"
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      fill="transparent"
    />
    <circle
      :style="progressStyles"
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      fill="transparent"
    />
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';

/**
 * Progress styles
 */
export interface ProgressStyles {
  strokeDasharray: string;
  strokeDashoffset: number;
  stroke: string;
}

export default Vue.extend({
  name: 'CircleProgress',
  props: {
    /**
     * The current value
     */
    current: {
      type: Number,
      required: true,
    },

    /**
     * The max value
     */
    max: {
      type: Number,
      required: true,
    },

    /**
     * The size of circle
     */
    size: {
      type: Number,
      default: 28,
    },

    /**
     * The stroke of circle
     */
    strokeWidth: {
      type: Number,
      default: 2,
    },

    /**
     * The color of progress
     */
    color: {
      type: String,
      default: '#fff',
    },

    /**
     * The color of progress when critical.
     */
    criticalColor: {
      type: String,
      default: 'var(--color-indicator-critical)',
    },
  },
  computed: {
    /**
     * Progress styles
     */
    progressStyles(): ProgressStyles {
      const CIRCUMFERENCE: number = 2 * Math.PI * this.radius;
      const FRACTION: number = this.current / this.max;

      return {
        strokeDasharray: `${CIRCUMFERENCE} ${CIRCUMFERENCE}`,
        strokeDashoffset: CIRCUMFERENCE - FRACTION * CIRCUMFERENCE,
        stroke: FRACTION >= 0.9 ? this.criticalColor : this.color,
      };
    },

    /**
     * The radius of circle
     */
    radius(): number {
      return this.size / 2 - 2 * this.strokeWidth;
    },
  },
});
</script>

<style>
.progress-ring {
  &__back {
    stroke: var(--color-text-second);
  }
}
</style>