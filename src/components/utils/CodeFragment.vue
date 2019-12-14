<template>
  <div
    class="code-preview"
    ref="content"
  >
    <pre
      v-for="line in lines"
      :key="line.line"
      class="code-preview__line"
      :class="{'code-preview__line--current': isCurrentLine(line.line), [syntax]: true }"
    ><span class="code-preview__line-num" :data-line="line.line"></span><code>{{ line.content }}</code></pre>
  </div>
</template>

<script>
import hljs from 'highlight.js';

/**
 * This component is using to render some code fragment, for example in stack trace description
 * It requires the 'lines' property as array of {line: number, content: string}
 */
export default {
  name: 'CodeFragment',
  props: {
    /**
     * Array of code fragment lines
     * @type {{line: number, content: string}[]}
     */
    lines: {
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
  data() {
    return {
      /**
       * Highlighting syntax.
       * Can be overridden in some cases, {@link mounted}
       */
      syntax: null
    };
  },
  computed: {
    /**
     * Concatenated code lines
     * @return {string}
     */
    code() {
      return this.lines.map(line => line.content).join('\n');
    }
  },
  /**
   * Vue mounted hook. Used to render highlighting
   */
  mounted() {
    /**
     * Set highlight.js syntax name based on catcher language
     * @see https://github.com/highlightjs/highlight.js/tree/master/src/languages
     */
    this.syntax = this.lang;

    /**
     * Sometimes the JavaScript error can be triggered from inline scripts in HTML markup
     * We need to highlight such code fragments as 'html' syntax instead of 'javascript'
     */
    if (this.syntax === 'javascript' && this.isHtmlScope()) {
      this.syntax = 'html';
    }

    if (this.syntax !== 'plaintext') {
      /**
       * Timeout used to prevent Vue override 'hljs' class
       */
      setTimeout(() => {
        /**
         * We supposed to highlight each line separately because the code can be trimmed.
         * This looks more suitable than incorrect highlighting of a whole block;
         */
        this.$refs.content.querySelectorAll('pre').forEach(el => {
          hljs.highlightBlock(el);
        });
      });
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
      const code = this.lines.map(frame => frame.content).join('\n');
      const div = document.createElement('div');

      div.innerHTML = code;

      return div.children.length > 0;
    }
  }
};
</script>

<style>
  .code-preview {
    font-family: var(--font-monospace);
    background-color: var(--color-bg-code-fragment);
    border-radius: var(--border-radius);

    &__line {
      display: flex;
      font-size: 12px;
      line-height: 21px;

      &--current {
        background-color: var(--color-bg-code-fragment-line-highlighted);
      }

      &-num {
        display: inline-block;
        width: 35px;
        padding: 0 10px;
        font-size: 10px;
        vertical-align: bottom;
        color: var(--color-text-main);
        opacity: 0.4;

        &::before {
          content: attr(data-line)
        }
      }
    }
  }
</style>
