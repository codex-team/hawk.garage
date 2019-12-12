<template>
  <div
    ref="content"
    class="code-preview"
    :class="syntax"
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
  data(){
    return {
      /**
       * Highlighting syntax.
       * Can be overridden in some cases, {@link mounted}
       */
      syntax: null
    };
  },
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
    this.syntax = this.lang;

    if (this.syntax !== 'plaintext') {
      hljs.highlightBlock(this.$refs.content);
    }

    /**
     * Sometimes the JavaScript error can be triggered from inline scripts in HTML markup
     * We need to highlight such code fragments as 'html' syntax instead of 'javascript'
     */
    if (this.syntax === 'javascript' && this.isHtmlScope()) {
      this.syntax = 'html';
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
    },

    /**
     * Check if current code is an HTML scope
     * Used to highlight inline JavaScript errors with 'html' syntax
     *
     * @return {boolean}
     */
    isHtmlScope() {
      const code = this.frames.map(frame => frame.content).join('\n');
      const div = document.createElement('div');

      div.innerHTML = code;

      console.log('div.children', div.children);

      return div.children.length > 0;
    }
  }
};
</script>

<style>
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
