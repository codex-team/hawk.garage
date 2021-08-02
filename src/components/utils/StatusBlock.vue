<template>
  <span
    class="status"
    :class="{
      'status--bad': bad
    }"
  >
    {{ contentTrimmed }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'StatusBlock',
  components: {
  },
  props: {
    /**
     * Rule to display
     */
    content: {
      type: String,
      required: true,
    },

    /**
     * Pass true if you want to show content in bad status
     */
    bad: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * Trim long terms with maximum chars count
     */
    contentTrimmed(): string {
      /**
       * Maximum length of visible filter value
       */
      const maxLength = 30;

      if (this.content.length > maxLength) {
        return this.content.substr(0, maxLength) + '…';
      }

      return this.content;
    },
  },
});
</script>

<style>
  @import url('../../styles/custom-properties.css');

  .status {
    display: inline-block;
    height: 23px;
    margin: 3px;
    padding: 4px 8px;
    color: var(--color-indicator-positive);
    font-weight: normal;
    font-size: 13px;
    line-height: 1em;
    letter-spacing: 0.16px;
    white-space: nowrap;
    background: color-mod(var(--color-indicator-positive) alpha(20%));
    border: 1px solid color-mod(var(--color-indicator-positive) alpha(20%));
    border-radius: 6px;

    &--bad {
      color: var(--color-indicator-critical);
      background: color-mod(var(--color-indicator-critical) alpha(20%));
      border-color: color-mod(var(--color-indicator-critical) alpha(20%));
    }
  }
</style>
