<template>
  <span>
    <span class="filepath__path">{{ prettyPath }}</span>
    <span
      v-if="isHighlight && location"
      class="filepath__filename"
    >
      {{ file }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Filepath',
  props: {
    /**
     * Event location got from the first backtrace frame
     * @type {string}
     */
    location: {
      type: String,
      default: '',
    },

    /**
     * Highlight filename
     * @type {boolean}
     */
    isHighlight: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * Event file path
     *
     * @return {string}
     */
    path(): string {
      if (!this.location) {
        return 'Unknown location';
      }

      return this.isHighlight ? this.location.replace(/[^/]+$/, '') : this.location;
    },

    /**
     * Event file name
     *
     * @return {string}
     */
    file(): string {
      return /[^/]+$/.exec(this.location)![0];
    },

    /**
     * Pretty file path
     *
     * @return {string}
     */
    prettyPath(): string {
      return this.path
        .replace(/^(.*?)\/{2,3}/, '')
        .replace(/\//g, ' / ')
        .replace(/\?.*/, '');
    },
  },
});
</script>

<style>
 .filepath {
   &__path {
     opacity: 0.6;
   }

   &__filename {
     color: var(--color-indicator-critical);
   }
 }
</style>
