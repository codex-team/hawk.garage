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
      default: 26,
    },

    /**
     * The height of circle
     */
    height: {
      type: Number,
      default: 26,
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
  },
  computed: {
    /**
     * Progress styles
     */
    progressStyles(): ProgressStyles {
      const circumference: number = 2 * Math.PI * this.radius;
      const percent: number = this.current / this.max;

      return {
        strokeDasharray: `${circumference} ${circumference}`,
        strokeDashoffset: circumference - percent * circumference,
        stroke: percent > 0.8 ? 'var(--color-indicator-critical)' : '#fff',
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
   display: flex;

   &__back {
     stroke: var(--color-text-second);
   }
 }
</style>
