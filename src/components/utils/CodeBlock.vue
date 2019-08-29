<template>
  <div
    class="code-block"
  >
    <div class="code-block__line-numbers-container">
      <div
        v-for="lineNumber in linesNumber"
        :key="lineNumber"
        class="code-block__line-number"
        :class="{'code-block__line-number--highlighted': highlightLines === linesFrom + lineNumber - 1}"
      >
        {{ linesFrom + lineNumber - 1 }}
      </div>
    </div>
    <div
      ref="content"
      class="code-block__content"
      :class="{[language]: language, 'code-block--one-line': oneLine}"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js';

export default {
  name: 'CodeBlock',
  props: {
    language: {
      type: String,
      default: null
    },
    linesFrom: {
      type: Number,
      default: 0
    },
    highlightLines: {
      type: [Number, Array],
      default: null
    },
    showLinesNumbers: Boolean,
    oneLine: Boolean
  },
  data() {
    return {
      linesNumber: 0
    };
  },
  mounted() {
    console.log(this.highlightLines);
    hljs.highlightBlock(this.$refs.content);
    this.linesNumber = this.$refs.content.innerText.split('\n').length - 1;
  }
};
</script>
<style>
  @import "../../styles/custom-properties.css";

  .code-block {
    border-radius: 6px;
    background: var(--color-bg-main);
    display: flex;
    position: relative;
    padding: 9px;
    border: solid 1px rgba(0, 0, 0, 0.18);

    &__line-numbers-container {
      color: var(--color-text-second);
      line-height: 21px;
      height: 21px;
      font-family: var(--font-monospace);
      text-align: right;
    }

    &__line-number {
      &--highlighted {
        &::after {
          content: '';
          display: block;
          position: absolute;
          left: 0;
          transform: translateY(-100%);
          background-color: rgba(255, 115, 212, 0.18);
          right: 0;
          height: 21px;
        }
      }
    }

    &__content {
      width: 100%;
      margin-left: 7px;
    }

    &--one-line {
      white-space: nowrap;
      overflow: hidden;

      @apply --hide-scrollbar;
    }
  }

  .hljs {
    display: block;
    overflow-x: auto;
  }

  .hljs,
  .hljs-subst {
    color: var(--color-text-main);
  }

  .hljs-comment {
    color: #888888;
  }

  .hljs-keyword,
  .hljs-attribute,
  .hljs-selector-tag,
  .hljs-meta-keyword,
  .hljs-doctag,
  .hljs-name {
    font-weight: bold;
  }

  /* User color: hue: 0 */

  .hljs-type,
  .hljs-string,
  .hljs-number,
  .hljs-selector-id,
  .hljs-selector-class,
  .hljs-quote,
  .hljs-template-tag,
  .hljs-deletion {
    color: var(--color-text-second);
  }

  .hljs-title,
  .hljs-section {
    color: #880000;
    font-weight: bold;
  }

  .hljs-regexp,
  .hljs-symbol,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-link,
  .hljs-selector-attr,
  .hljs-selector-pseudo {
    color: #BC6060;
  }

  /* Language color: hue: 90; */

  .hljs-literal {
    color: #78A960;
  }

  .hljs-built_in,
  .hljs-bullet,
  .hljs-code,
  .hljs-addition {
    color: #397300;
  }

  /* Meta color: hue: 200 */

  .hljs-meta {
    color: #1f7199;
  }

  .hljs-meta-string {
    color: #4d99bf;
  }

  /* Misc effects */

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

</style>
