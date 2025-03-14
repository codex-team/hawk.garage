<template>
  <ConsoleOutput v-if="isConsoleOutput" :logs="value" />
  <JsonViewer v-else :value="value" theme="json-viewer-theme" :expand-depth="2" copyable />
</template>

<script lang="ts">
import Vue from "vue";
import JsonViewer from "vue-json-viewer";
import ConsoleOutput from "./ConsoleOutput.vue"; // Import ConsoleOutput

export default Vue.extend({
  name: "Json",
  components: {
    JsonViewer,
    ConsoleOutput, // Register ConsoleOutput component
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
  computed: {
    /**
     * Detect if the provided object is console output logs
     */
    isConsoleOutput(): boolean {
      return Object.values(this.value).every(
        (log: any) => log && log.method && log.message && log.timestamp
      );
    },
  },
});
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

    /**
     * Copy button
     */
    .jv-button {
      box-sizing: content-box;
      height: 22px;
      padding: 0 13px;
      color: color-mod(var(--color-text-second) alpha(40%));
      font-size: 11px;
      line-height: 23px;
      letter-spacing: 0.14px;
      text-transform: uppercase;
      background-color: transparent;
      border: 1px solid color-mod(var(--color-text-second) alpha(10%));
      border-radius: 11.5px;
      outline: none;

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
      padding: 0;
      overflow: visible
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
