<template>
  <div
    v-copyable="{
      selector: copyable ? '.code-block__content' : null,
      callback: onLinkCopied,
    }"
    class="code-block"
    :class="{
      'code-block--one-line': isSingleLine,
      'code-block--copyable': copyable,
    }"
  >
    <div
      ref="content"
      class="code-block__content"
      :class="{ [language]: true }"
    >
      <slot />
    </div>
    <div class="code-block__button-wrapper">
      <button
        v-if="copyable"
        class="button button--copy code-block__copy-button"
        type="button"
      >
        {{ $t("components.codeBlock.copy") }}
      </button>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js';
import notifier from 'codex-notifier';
import shell from 'highlight.js/lib/languages/shell';
import go from 'highlight.js/lib/languages/go';
import python from 'highlight.js/lib/languages/python';
import php from 'highlight.js/lib/languages/php';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';


hljs.registerLanguage('shell', shell);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('go', go);
hljs.registerLanguage('php', php);
hljs.registerLanguage('python', python);

export default {
  name: 'CodeBlock',
  props: {
    language: {
      type: String,
      default: null,
    },
    copyable: Boolean,
    oneLine: Boolean,
  },
  data() {
    return {
      linesNumber: 0,
    };
  },
  computed: {
    /**
     * Return true if there is a single line of a code
     *
     * @returns {boolean}
     */
    isSingleLine() {
      const hasLineBreak = this.$slots.default[0].text.includes('\n') === true;
      const hasBr = this.$slots.default[0].text.includes('<br>') === true;

      return !hasLineBreak && !hasBr;
    },
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
        time: 2000,
      });
    },
  },
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

  &__content {
    position: relative;
    width: 100%;
    line-height: 1.5em;
    @apply --hide-scrollbar;
  }

  &--one-line {
    ^&__content {
      @apply --hide-scrollbar;
      max-width: 93%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
    background-image: linear-gradient(
      to right,
      var(--color-bg-main-transparent),
      var(--color-bg-main) 20%
    );
  }
}
</style>
