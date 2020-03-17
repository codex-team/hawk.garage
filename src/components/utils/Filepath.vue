<template>
  <span>
    <span class="filepath__path">{{ path | prettyPath }}</span>
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
    location: {
      type: String,
      default: '',
    },
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
