<template>
  <svg
    class="progress-ring"
    :width="width"
    :height="height"
    :stroke-width="strokeWidth"
  >
    <circle
      class="progress-ring__back"
      :cx="width / 2"
      :cy="height / 2"
      :r="radius"
      fill="transparent"
    />
    <circle
      :style="progressStyles"
      :cx="width / 2"
      :cy="height / 2"
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
     * The width of circle
     */
    width: {
      type: Number,
      default: 28,
    },

    /**
     * The height of circle
     */
    height: {
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
      const PERCENT: number = this.current / this.max;

      return {
        strokeDasharray: `${CIRCUMFERENCE} ${CIRCUMFERENCE}`,
        strokeDashoffset: CIRCUMFERENCE - PERCENT * CIRCUMFERENCE,
        stroke: PERCENT > 0.8 ? this.criticalColor : this.color,
      };
    },

    /**
     * The radius of circle
     */
    radius(): number {
      return this.width / 2 - 2 * this.strokeWidth;
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