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
import { defineComponent } from 'vue';
import Icon from './Icon.vue';

export default defineComponent({
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
      default: null,
    },
  },
});
</script>

<style>
  .ui-label {
    display: inline-flex;
    padding: 5px 10px;
    color: var(--color-text-second);
    font-size: 13px;
    line-height: 1em;
    letter-spacing: 0.15px;
    background-color: var(--color-bg-second);
    border-radius: 4px;

    .icon {
      width: 7px;
      height: 12px;
      margin-right: 8px;
      vertical-align: middle;
    }
  }
</style>
