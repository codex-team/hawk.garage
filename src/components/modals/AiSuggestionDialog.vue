<template>
  <PopupDialog @close="$emit('close')">
    <div class="ai-suggestion-dialog">
      <div class="ai-suggestion-dialog__header">
        <Icon
          class="ai-suggestion-dialog__header-icon"
          symbol="ai"
        />
        {{ $t('event.ai.titlePrefix') }}:&nbsp;{{ title }}
      </div>
      <div class="ai-suggestion-dialog__content">
        <AiSuggestionSkeleton v-if="loading" />
        <div
          v-else-if="error"
          class="ai-suggestion-dialog__error"
        >
          {{ error }}
        </div>
        <div
          v-else
          class="ai-suggestion-dialog__suggestion"
        >
          <TransitionGroup name="ai-suggestion-dialog__node">
            <template
              v-for="seg in segments"
              :key="seg.key"
            >
              <CodeFragment
                v-if="seg.type === 'code'"
                class="ai-suggestion-dialog__code"
                :lines="seg.lines"
                :lang="seg.lang || 'plaintext'"
                :lines-highlighted="[]"
                :copyable="true"
              />
              <div
                v-else
                class="ai-suggestion-dialog__text ai-suggestion-dialog__markdown"
                v-html="seg.html"
              />
            </template>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import PopupDialog from '../utils/PopupDialog.vue';
import AiSuggestionSkeleton from './AiSuggestionSkeleton.vue';
import CodeFragment from '../utils/CodeFragment.vue';
import Icon from '../utils/Icon.vue';
import * as aiApi from '@/api/ai';
import { getMarkdownStreamRenderer, type MarkdownNode } from '@/utils/markdown';
import { isAbortError } from '@/utils/errors';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AiSuggestionDialog',
  components: {
    PopupDialog,
    AiSuggestionSkeleton,
    CodeFragment,
    Icon,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    originalEventId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: true,
      suggestion: '',
      error: '',
      segments: [] as MarkdownNode[],
      streamAbortController: new AbortController(),
    };
  },
  async created() {
    try {
      const markdownStreamRenderer = await getMarkdownStreamRenderer();

      await aiApi.streamEventAiSuggestion(this.projectId, this.eventId, this.originalEventId, {
        signal: this.streamAbortController.signal,
        onTextDelta: (delta) => {
          this.suggestion += delta;
          // TODO: Batch updates per animation frame when deltas outpace rendering.
          this.segments = markdownStreamRenderer.append(delta);
          this.loading = false;
        },
        onError: (message) => {
          /**
           * What arrived so far belongs to an answer the API withdrew, so it goes
           * rather than staying on screen beside the error.
           */
          this.suggestion = '';
          this.segments = [];
          this.error = message;
          this.loading = false;
        },
      });

      if (!this.error) {
        this.segments = markdownStreamRenderer.finish();
      }

      if (!this.suggestion && !this.error) {
        this.error = this.$t('event.ai.empty') as string;
      }
    } catch (error) {
      if (!isAbortError(error)) {
        this.error = this.$t('event.ai.error') as string;
        console.error(error);
      }
    } finally {
      if (!this.streamAbortController.signal.aborted) {
        this.loading = false;
      }
    }
  },
  beforeUnmount() {
    this.streamAbortController.abort();
  },
});
</script>

<style>
.ai-suggestion-dialog {
  width: 720px;
  min-height: 400px;

  &__header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-l) var(--spacing-xl);
    color: var(--base--text-secondary);
    font-weight: 600;
    font-size: 1rem;
    background-color: var(--base--bg-secondary-hover);
  }

  &__header-icon {
    width: 17px;
    height: 17px;
    color: var(--color-indicator-ai);
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
    padding: var(--spacing-l) var(--spacing-xl);
  }

  &__suggestion {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    color: var(--base--text);
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.45;

    > * {
      margin-block: 0;
    }

    > * + * {
      margin-block-start: var(--spacing-ml);
    }
  }

  &__node-enter-active {
    transition: opacity 350ms ease-out, filter 200ms linear;
  }

  &__node-enter-from {
    opacity: 0;
    filter: blur(5px);
  }

  &__markdown {
    overflow-wrap: break-word;

    > :first-child {
      margin-block-start: 0;
    }

    > :last-child {
      margin-block-end: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      margin: var(--spacing-l) 0 var(--spacing-ml);
      color: var(--base--text);
      font-weight: 600;
      line-height: 1.25;
    }

    h1, h2 {
      padding-block-end: var(--spacing-s);
      border-block-end: var(--delimiter-height) solid var(--base--border);
    }

    h1 {
      font-size: 1.8rem;
    }

    h2 {
      font-size: 1.4rem;
    }

    h3 {
      font-size: 1.2rem;
    }

    h4, h5, h6 {
      font-size: 1rem;
    }

    h6 {
      color: var(--base--text-secondary);
    }

    p, blockquote, ul, ol, table, pre, hr {
      margin-block: 0 var(--spacing-ml);
    }

    a {
      color: var(--accent--solid);
      text-decoration: underline;
      text-underline-offset: 0.2rem;

      &:hover {
        color: var(--accent--solid-hover);
      }
    }

    strong {
      font-weight: 600;
    }

    img {
      max-width: 100%;
    }

    mark {
      color: var(--base--text);
      background-color: var(--accent--bg-secondary);
    }

    blockquote {
      padding: 0 0 0 var(--spacing-l);
      color: var(--base--text-secondary);
      border-inline-start: 3px solid var(--accent--solid);

      > :first-child {
        margin-block-start: 0;
      }

      > :last-child {
        margin-block-end: 0;
      }
    }

    ul, ol {
      padding-inline-start: var(--spacing-xl);
    }

    li {
      list-style-position: outside;
    }

    ul ul, ul ol, ol ul, ol ol {
      margin-block: var(--spacing-xxs) 0;
    }

    ul > li {
      list-style-type: disc;
    }

    ol > li {
      list-style-type: decimal;
    }

    ol ol > li, ul ol > li {
      list-style-type: lower-roman;
    }

    ul ul ol > li, ul ol ol > li, ol ul ol > li, ol ol ol > li {
      list-style-type: lower-alpha;
    }

    li + li {
      margin-block-start: var(--spacing-xxs);
    }

    li > p {
      margin-block: var(--spacing-s) 0;
    }

    li > p:first-child {
      margin-block-start: 0;
    }

    table {
      display: block;
      width: max-content;
      max-width: 100%;
      overflow: auto;
      word-break: normal;
      border-spacing: 0;
      border-collapse: collapse;
      font-variant-numeric: tabular-nums;
    }

    tr {
      background-color: var(--base--bg-primary);
      border-top: var(--delimiter-height) solid var(--base--border);

      &:nth-child(2n) {
        background-color: var(--base--bg-secondary);
      }
    }

    th, td {
      padding: var(--spacing-xs) var(--spacing-m);
      text-align: start;
      vertical-align: top;
      border: var(--delimiter-height) solid var(--base--border);
    }

    th {
      font-weight: 600;
    }

    hr {
      height: var(--spacing-xxs);
      background-color: var(--base--border);
      border: 0;
    }

    code, pre {
      font-family: var(--font-monospace);
    }

    code {
      margin: 0;
      padding: 0.15em 0.4em;
      color: var(--base--text);
      font-size: 85%;
      white-space: break-spaces;
      background-color: var(--base--bg-secondary);
      border: var(--delimiter-height) solid var(--base--border);
      border-radius: var(--radius-s);
    }

    pre {
      max-width: 100%;
      padding: var(--spacing-ml);
      overflow: auto;
      color: var(--base--text);
      font-size: 0.866rem;
      line-height: 1.45;
      background-color: var(--base--bg-secondary);
      border: var(--delimiter-height) solid var(--base--border);
      border-radius: var(--radius-m);

      code {
        padding: 0;
        color: inherit;
        font-size: inherit;
        white-space: pre;
        background: transparent;
        border: 0;
      }
    }
  }

  &__error {
    color: var(--color-indicator-critical);
  }
}
</style>
