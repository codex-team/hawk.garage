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
    padding: 5px 8px;
    line-height: 1em;
    border-radius: 6px;
    color: var(--color-indicator-positive);
    background: color-mod(var(--color-indicator-positive) alpha(20%));
    border: 1px solid color-mod(var(--color-indicator-positive) alpha(20%));
    margin: 3px;
    white-space: nowrap;

    &--e {
      color: var(--color-indicator-critical);
      background: color-mod(var(--color-indicator-critical) alpha(20%));
      border-color: color-mod(var(--color-indicator-critical) alpha(20%));
    }
  }
</style>
