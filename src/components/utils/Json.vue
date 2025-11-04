<template>
  <VueJsonPretty
    :data="value"
    :expand-depth="2"
    :deep="2"
    copyable
    class="json-viewer-theme"
    theme="dark"
    show-icon
    :show-line="false"
  />
</template>

<script lang="ts">
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
  name: 'Json',
  components: {
    VueJsonPretty,
  },
  props: {
    /**
     * JS object to display
     */
    value: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
  .json-viewer-theme {
    width: 100%;
    padding: 10px 15px;
    overflow: auto;
    color: #525252;
    font-size: 12px;
    font-family: var(--font-monospace);
    white-space: nowrap;
    background: var(--color-bg-code-fragment);
    border-radius: 6px;

    .vjs-tree-node.dynamic-height .vjs-value {
      white-space: nowrap;
    }

    .vjs-toggle {
      display: none;
    }

    .vjs-node .vjs-node,
    .vjs-node.toggle {
      margin-left: 15px !important;
    }

    .vjs-ellipsis {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
      margin: 0 3px;
      font-size: 0;
      vertical-align: top;
      background-color: var(--color-indicator-medium);
      border-radius: 6px;
      cursor: pointer;
      user-select: none;

      &::before,
      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        width: 10px;
        height: 2px;
        background: var(--color-text-main);
        transform: translate(-50%, -50%);
        content: '';
      }

      &::after {
        width: 2px;
        height: 10px;
      }
    }

    .vjs-key {
      margin-right: 3px;
      color: #f600cc;
    }
    .vjs-boolean { color: #d6ec38 }
    .vjs-function { color: #067bca }
    .vjs-number { color: #75EA52 }
    .vjs-undefined { color: #e08331 }
    .vjs-string {
      display: inline-flex;
      color: #279fff;
      white-space: normal;
      word-break: break-word;
    }
    .vjs-code {
      padding: 0;
      overflow: visible
    }

    .vjs-object,
    .vjs-array,
    .vjs-node::after {
      color: var(--color-text-second);
    }

    .vjs-tooltip {
      top: 15px;
    }
  }
</style>
