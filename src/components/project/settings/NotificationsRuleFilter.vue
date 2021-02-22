<template>
  <span
    class="n-filter"
    :class="{
      'n-filter--e': excluding
    }"
  >
    {{ contentTrimmed }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ProjectSettingsNotificationsRuleFilter',
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
     * Pass true if filter should be coloured with red
     */
    excluding: {
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
  @import url('../../../styles/custom-properties.css');

  .n-filter {
    display: inline-block;
    height: 23px;
    margin: 3px;
    padding: 5px 8px;
    color: var(--color-indicator-positive);
    line-height: 1em;
    white-space: nowrap;
    background: color-mod(var(--color-indicator-positive) alpha(20%));
    border: 1px solid color-mod(var(--color-indicator-positive) alpha(20%));
    border-radius: 6px;
    font-size: 13px;
    letter-spacing: 0.16px;

    &--e {
      color: var(--color-indicator-critical);
      background: color-mod(var(--color-indicator-critical) alpha(20%));
      border-color: color-mod(var(--color-indicator-critical) alpha(20%));
    }
  }
</style>
