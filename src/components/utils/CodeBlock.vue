<template>
  <div
    class="code-block"
  >
    <div
      v-if="showLinesNumbers"
      class="code-block__line-numbers-container"
    >
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
    hljs.highlightBlock(this.$refs.content);
    this.linesNumber = this.$refs.content.innerText.split('\n').length;
  }
};
</script>
<style>
  @import "../../styles/custom-properties.css";

  .code-block {
    position: relative;
    display: flex;
    padding: 9px;
    line-height: 21px;
    background: var(--color-bg-main);
    border-radius: 6px;

    &__line-numbers-container {
      color: var(--color-text-second);
      font-size: 10px;
      font-family: var(--font-monospace);
      text-align: right;
    }

    &__line-number {
      &--highlighted {
        &::before {
          position: absolute;
          right: 0;
          left: 0;
          display: block;
          height: 21px;
          background-color: rgba(255, 115, 212, 0.18);
          transform: translateY(-1px);
          content: '';
          pointer-events: none;
        }
      }
    }

    &__content {
      width: 100%;
      margin-left: 7px;
    }

    &--one-line {
      overflow: hidden;
      white-space: nowrap;

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
