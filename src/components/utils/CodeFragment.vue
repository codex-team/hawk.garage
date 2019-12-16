<template>
  <div
    ref="content"
    class="code-preview"
  >
    <div class="code-preview__lines">
      <span
        v-for="row in lines"
        :key="row.line"
        :data-line="row.line"
      />
    </div>
    <pre
      class="code-preview__content"
      :class="{[syntax]: true }"
      v-html="escapedCodeWithPointer"
    ></pre>
  </div>
</template>

<script>
import hljs from 'highlight.js';
import * as _ from './../../utils';

/**
 * This component is using to render some code fragment, for example in stack trace description
 * It requires the 'lines' property as array of {line: number, content: string}
 *
 * @typedef {object} CodeRow
 * @property {number} line - line number
 * @property {string} content - line content
 */
export default {
  name: 'CodeFragment',
  props: {
    /**
     * Array of code fragment lines
     * @type {CodeRow[]}
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
    },

    /**
     * Prepare and return html-escaped code with the column pointer for highlighted line
     * @return {string}
     */
    escapedCodeWithPointer(){
      const code = this.fixUnclosedComment(this.code);

      /**
       * Add column pointer to the specific line and column
       */
      const lineIndex = this.lines.map(row => row.line).indexOf(this.linesHighlighted[0]);
      const offset = _.findOffsetByLineAndCol(code, lineIndex, this.columnPointer);

      if (offset) {
        return this.addColumnPointerToStringEscaped(code, offset);
      }

      return _.escape(code);
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
     * Adds column pointer to the string with escaping-chars offset support
     *
     * @param {string} string - unescaped string
     * @param {number} position - original column number, before escape
     * @return {string}
     */
    addColumnPointerToStringEscaped(string, position) {
      const contentEscaped = _.escape(string);
      const leftPartEscaped = _.escape(string.substr(0, position), true);

      /**
       * If there are some escaping symbols added before the column-pointer,
       * we need to increase real column for this number of symbols.
       */
      const newColumnPosition = leftPartEscaped.count === 0 ? position : position + leftPartEscaped.length;

      return _.strReplaceAt(
        contentEscaped,
        newColumnPosition,
        `<span class="column-pointer">${contentEscaped[newColumnPosition]}</span>`
      );
    },

    /**
     * If the code fragment start with trimmed comment,
     * add opening comment chars to prevent breaking of highlighting.
     *
     * @param {string} code
     */
    fixUnclosedComment(code){
      const lines = code.split('\n').map(line => line.trim());
      const firstLine = lines.shift();

      /**
       * If code fragment starts with "* /" we need to add opening comment and the second *
       */
      if (firstLine.substr(0, 2) === '*/'){
        code = code.replace(/\s?\*/, '/* … *');
        /**
         * Case when the fragment start with *
         */
      } else if (firstLine.substr(0, 1) === '*'){
        code = code.replace(/\s?\*/, '/* … ');
      }

      return code;
    }
  }
};
</script>

<style>
  .code-preview {
    display: flex;
    font-family: var(--font-monospace);
    background-color: var(--color-bg-code-fragment);
    border-radius: var(--border-radius);

    &__content {
      flex-grow: 2;
      font-size: 12px;
      line-height: 21px;
    }

    &__lines {
      display: flex;
      flex-direction: column;
      width: 35px;

      span {
        flex-grow: 1;
        display: flex;
        line-height: 21px;
        align-items: center;
        padding: 0 10px;
        color: var(--color-text-main);
        font-size: 10px;
        vertical-align: bottom;
        opacity: 0.4;

        &::before {
          content: attr(data-line)
        }
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

    &__line {
      display: flex;
      overflow: visible;
      font-size: 12px;
      line-height: 21px;

      &--current {
        background-color: var(--color-bg-code-fragment-line-highlighted);
      }
    }
  }
</style>
