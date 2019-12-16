<template>
  <div
    ref="content"
    class="code-preview"
  >
    <pre
      v-for="row in lines"
      :key="row.line"
      class="code-preview__line"
      :class="{'code-preview__line--current': isCurrentLine(row.line), [syntax]: true }"
    ><span
      class="code-preview__line-num"
     :data-line="row.line"
    /><code v-html="contentWithPointer(row)" /></pre>

<!--        <pre-->
<!--          class="code-preview__content"-->
<!--          :class="{[syntax]: true }"-->
<!--        >{{ checkComment(code)}}</pre>-->
  </div>
</template>

<script>
import hljs from 'highlight.js';
import * as _ from './../../utils';

/**
 * This component is using to render some code fragment, for example in stack trace description
 * It requires the 'lines' property as array of {line: number, content: string}
 *
 * @typedef {object} codeRow
 * @property {number} line - line number
 * @property {string} content - line content
 */
export default {
  name: 'CodeFragment',
  props: {
    /**
     * Array of code fragment lines
     * @type {codeRow[]}
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
    },

    /**
     * In what column of highlighted line we should set a pointer
     */
    columnPointer: {
      type: Number,
      default: null
    },

    /**
     * Source code filename,
     * sometimes it can be helpful to determine syntax overrides
     */
    filename: {
      type: String,
      default: ''
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

    /**
     * Sometimes error can be triggered from a JS-bundle, but source code is written on TS.
     * If we've extracted real filenames from the source-map, we can detect TS scope by a filename
     */
    if (this.isTypeScriptScope()) {
      this.syntax = 'typescript';
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
    },

    /**
     * Check if current code fragment is a TypeScript code
     */
    isTypeScriptScope() {
      return this.filename.split('.').pop() === 'ts';
    },

    /**
     * Prepare and return code row with the column pointer for current line
     * @param {codeRow} row - one row of a code
     * @return {string}
     */
    contentWithPointer(row) {
      if (!this.isCurrentLine(row.line)) {
        return _.escape(row.content);
      }

      if (this.columnPointer) {
        const contentEscaped = _.escape(row.content);
        const leftPartEscaped = _.escape(row.content.substr(0, this.columnPointer), true);

        /**
         * If there are some escaping symbols added before the column-pointer,
         * we need to increase real column for this number of symbols.
         * Also, do -1 decrement, because of the line-break char, so real position starts from 1 instead of 0
         */
        const columnWithEscapedCharsLength = leftPartEscaped.count === 0 ? this.columnPointer : this.columnPointer + leftPartEscaped.length - 1;

        return _.strReplaceAt(contentEscaped, columnWithEscapedCharsLength, `<span class="column-pointer">${contentEscaped[columnWithEscapedCharsLength]}</span>`);
      }
      return row.content;
    }

    // checkComment(code){
    //   let lines = code.split('\n').map(line => line.trim());
    //
    //   console.log('lines', lines);
    //
    //   if (lines && lines[0].substr(0, 1) === '*'){
    //     return code.replace(/\s?\*/, '/* ...');
    //   }
    //   return code;
    // }
  }
};
</script>

<style>
  .code-preview {
    font-family: var(--font-monospace);
    background-color: var(--color-bg-code-fragment);
    border-radius: var(--border-radius);

    &__content {
      font-size: 12px;
      line-height: 21px;
    }

    &__line {
      display: flex;
      overflow: visible;
      font-size: 12px;
      line-height: 21px;

      &--current {
        background-color: var(--color-bg-code-fragment-line-highlighted);
      }

      &-num {
        display: inline-block;
        width: 35px;
        padding: 0 10px;
        color: var(--color-text-main);
        font-size: 10px;
        vertical-align: bottom;
        opacity: 0.4;

        &::before {
          content: attr(data-line)
        }
      }

      .column-pointer {
        position: relative;

        &::after {
          position: absolute;
          top: calc(100% + 3px);
          left: 1px;
          width: 6px;
          height: 6px;
          border: 2px solid var(--color-code-pointer);
          border-width: 2px 2px 0 0;
          box-shadow: 1px -1px 4px color-mod(var(--color-code-pointer) alpha(40%));
          transform: rotate(-45deg);
          content: '';
        }
      }
    }
  }
</style>
