<template>
  <div class="ui-label">
    <Icon
      v-if="icon"
      :symbol="icon"
    />
    {{ text }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from './Icon.vue';

export default Vue.extend({
  name: 'UiLabel',
  components: {
    Icon,
  },
  props: {
    /**
     * Text on the label
     */
    text: {
      type: String,
      required: true,
    },
    /**
     * Name of icon to show
     */
    icon: {
      type: String,
      required: false,
      default: null,
    },
  },
})
</script>

<style scoped>
  .ui-label {
    display: inline-flex;
    padding: 5px 10px;
    background-color: var(--color-bg-second);
    border-radius: 4px;
    font-size: 13px;
    letter-spacing: 0.15px;
    line-height: 1em;
    color: var(--color-text-second);

    .icon {
      width: 7px;
      height: 12px;
      margin-right: 8px;
      vertical-align: middle;
    }
  }
</style>
