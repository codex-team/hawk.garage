<template>
  <div
    v-copyable="{selector: copyable? '.code-block__content' : null, callback: onLinkCopied}"
    class="code-block"
    :class="{'code-block--one-line': oneLine, 'code-block--copyable': copyable}"
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
      :class="{[language]: language}"
    >
      <slot />
    </div>
    <div class="code-block__button-wrapper">
      <button
        v-if="copyable"
        class="button button--copy code-block__copy-button"
        type="button"
      >
        {{ $t('workspaces.settings.team.copyButton') }}
      </button>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js';
import notifier from 'codex-notifier';

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
    copyable: Boolean,
    showLinesNumbers: Boolean,
    oneLine: Boolean
  },
  data() {
    return {
      linesNumber: 0
    };
  },
  /**
   * Vue mounted hook. Used to render highlighting
   */
  mounted() {
    if (this.language !== 'plaintext') {
      hljs.highlightBlock(this.$refs.content);
    }
    this.linesNumber = this.$refs.content.innerText.split('\n').length;
  },
  methods: {
    onLinkCopied() {
      notifier.show({
        message: this.$t('common.copiedNotification'),
        style: 'success',
        time: 2000
      });
    }
  }
};
</script>

<style>
  @import "../../styles/custom-properties.css";

  .code-block {
    position: relative;
    display: flex;
    align-items: center;
    padding: 14.2px 15px;
    font-family: var(--font-monospace);
    background: var(--color-bg-main);
    border: solid 1px rgba(0, 0, 0, 0.18);
    border-radius: 6px;

    &__line-numbers-container {
      margin-right: 7px;
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
      position: relative;
      width: 100%;

      @apply --hide-scrollbar;
    }

    &--one-line {
      ^&__content {
        overflow: hidden;
        white-space: nowrap;
        @apply --hide-scrollbar;
      }

      ^&__button-wrapper {
        top: 50%;
        transform: translateY(-50%);
      }
    }

    &__button-wrapper {
      position: absolute;
      top: 10px;
      right: 0;
      padding-right: 15px;
      padding-left: 30px;
      background-image: linear-gradient(to right, rgba(36, 39, 50, 0), var(--color-bg-main) 20%)
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
