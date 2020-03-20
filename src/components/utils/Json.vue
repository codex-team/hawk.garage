<template>
  <JsonViewer
    :value="value"
    theme="json-viewer-theme"
    :expand-depth="2"
    copyable
  />
</template>

<script lang="ts">
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'Json',
  components: {
    JsonViewer,
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
    overflow: auto;
    color: #525252;
    font-size: 12px;
    font-family: var(--font-monospace);
    white-space: nowrap;
    background: var(--color-bg-code-fragment);
    padding: 10px 15px;
    border-radius: 6px;

    .jv-toggle {
      display: none;
    }

    .jv-node .jv-node,
    .jv-node.toggle {
      margin-left: 15px !important;
    }

    .jv-ellipsis {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
      margin: 0 3px;
      background-color: var(--color-indicator-medium);
      font-size: 0;
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
      vertical-align: top;

      &::before,
      &::after {
        content: '';
        display: block;
        width: 10px;
        height: 2px;
        background: var(--color-text-main);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      &::after {
        width: 2px;
        height: 10px;
      }
    }

    /**
     * Copy button
     */
    .jv-button {
      height: 22px;
      padding: 0 13px;
      color: color-mod(var(--color-text-second) alpha(40%));
      font-size: 11px;
      line-height: 23px;
      letter-spacing: 0.14px;
      background-color: transparent;
      border: 1px solid color-mod(var(--color-text-second) alpha(10%));
      border-radius: 11.5px;
      box-sizing: content-box;
      outline: none;
      text-transform: uppercase;

      &:hover {
        color: color-mod(var(--color-text-second) alpha(60%));
        border: 1px solid color-mod(var(--color-text-second) alpha(40%));
      }
    }

    .jv-key {
      margin-right: 3px;
      color: #f600cc;
    }
    .jv-boolean { color: #d6ec38 }
    .jv-function { color: #067bca }
    .jv-number { color: #75EA52 }
    .jv-undefined { color: #e08331 }
    .jv-string {
      display: inline-flex;
      color: #279fff;
      white-space: normal;
      word-break: break-word;
    }
    .jv-code {
      overflow: visible;
      padding: 0
    }

    .jv-object,
    .jv-array,
    .jv-node::after {
      color: var(--color-text-second);
    }

    .jv-tooltip {
      top: 15px;
    }
  }
</style>
