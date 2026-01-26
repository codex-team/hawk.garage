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
import { defineComponent } from 'vue';
import { createAsyncComponent } from '../../utils';

const VueJsonPretty = createAsyncComponent(async () => {
  const [component] = await Promise.all([
    import('vue-json-pretty'),
    import('vue-json-pretty/lib/styles.css'),
  ]);

  return component;
});

export default defineComponent({
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
});
</script>

<style>
body  .json-viewer-theme {
    width: 100%;
    padding: 10px 15px;
    overflow: auto;
    color: var(--color-text-second);
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

    .vjs-tree-node.dark:hover {
      background-color: var(--color-bg-third);
    }

    .vjs-key {
      margin-right: 3px;

      color: #fa80fa;
    }
    .vjs-value-boolean {
      color: #70b5ff;
    }
    .vjs-function {
      color: #27a4ef;
    }
    .vjs-value-number {
      color: #ff9e65;
      color: #82f0a5;

    }
    .vjs-undefined {
      color: #f5d50e;
    }
    .vjs-string,
    .vjs-value-string {
      display: inline-flex;
      color: #bd7ffb;
      white-space: normal;
      word-break: break-word;
    }
    .vjs-code {
      padding: 0;
      overflow: visible
    }
    .vjs-tree-brackets {
      color: var(--color-text-second);
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
