<template>
  <span class="filepath">
    {{ prettyPath }}
    <span
      v-if="isHighlight && location"
      class="filepath__filename"
    >
      {{ file }}
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Filepath',
  props: {
    /**
     * Event location got from the first backtrace frame
     *
     * @type {string}
     */
    location: {
      type: String,
      default: '',
    },

    /**
     * Highlight filename
     *
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
     * @returns {string}
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
     * @returns {string}
     */
    file(): string {
      const parts = this.location.split('/');
      const lastPart = parts[parts.length - 1];

      return this.removeGetParams(lastPart);
    },

    /**
     * Removes unwanted parts of a path:
     * - protocols
     * - GET parameters
     * Then, add spaces around slashes
     *
     * @returns {string}
     */
    prettyPath(): string {
      let path = this.path;

      path = this.removeProtocol(path);
      path = this.removeGetParams(path);

      /**
       * Replace '/' with ' / '
       */
      return path.replace(/\//g, ' / ');
    },
  },
  methods: {
    /**
     * Removes everything after "?"
     *
     * @param path - where to remove
     */
    removeGetParams(path: string): string {
      return path.replace(/\?.*/, '');
    },

    /**
     * Removes protocols like 'webpack://' or 'file://'
     *
     * @param path - where to remove
     */
    removeProtocol(path: string): string {
      return path.replace(/^(.*?)\/{2,3}/, '');
    },
  },
});
</script>

<style>
 .filepath {
   &__filename {
     color: var(--color-indicator-critical);
   }
 }
</style>
