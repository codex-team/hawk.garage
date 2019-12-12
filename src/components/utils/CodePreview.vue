<template>
  <div
    ref="content"
    class="code-preview"
    :class="lang"
  >
    <pre
      v-for="frame in frames"
      :key="frame.line"
      class="code-preview__line"
      :class="{'code-preview__line--current': isCurrentLine(frame.line)}"
    ><span class="code-preview__line-num">{{ frame.line }}</span>{{ frame.content }}</pre>
  </div>
</template>

<script>
import hljs from 'highlight.js';

export default {
  name: 'CodePreview',
  props: {
    /**
     * Array fo stack frames
     * @type {{line: number, content: string}[]}
     */
    frames: {
      type: Array,
      default() {
        return [];
      }
    },

    /**
     * Array of line numbers that should be highlighted
     * @type {number[]}
     */
    linesHighlighted: {
      type: Array,
      default: null
    },

    /**
     * Code language
     */
    lang: {
      type: String,
      default: 'plaintext'
    }
  },
  /**
   * Vue mounted hook. Used to render highlighting
   */
  mounted() {
    if (this.lang !== 'plaintext') {
      hljs.highlightBlock(this.$refs.content);
    }
  },
  methods: {
    /**
     * Check if passed line should be highlighted
     * @param {number} line - line to check
     * @return {boolean}
     */
    isCurrentLine(line) {
      return this.linesHighlighted.includes(line);
    }
  }
};
</script>

<style>
  @import "../../styles/custom-properties.css";

  .code-preview {
    font-family: var(--font-monospace);
    background-color: #171920;
    border-radius: var(--border-radius);

    &__line {
      display: flex;
      font-size: 12px;
      line-height: 21px;

      &--current {
        background-color: rgba(255, 115, 212, 0.18);
      }

      &-num {
        display: inline-block;
        width: 35px;
        padding: 0 10px;
        font-size: 10px;
        vertical-align: bottom;
      }
    }
  }

</style>
