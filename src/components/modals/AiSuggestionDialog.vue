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
      <div
        ref="content"
        class="ai-suggestion-dialog__content"
      >
        <AiSuggestionSkeleton v-if="loading" />
        <div
          v-else-if="error"
          class="ai-suggestion-dialog__error"
        >
          {{ error }}
        </div>
        <MarkdownView
          v-else
          class="ai-suggestion-dialog__suggestion"
          :blocks="blocks"
        />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import PopupDialog from '../utils/PopupDialog.vue';
import AiSuggestionSkeleton from './AiSuggestionSkeleton.vue';
import Icon from '../utils/Icon.vue';
import * as aiApi from '@/api/ai';
import { isAbortError } from '@/utils/errors';
import { loadAsyncComponent } from '@/utils/loadAsyncComponent';
import { defineAsyncComponent, defineComponent } from 'vue';
import type { Token } from 'marked';

const loadMarkdownView = loadAsyncComponent(() => import('../utils/markdown/View.vue'));

/**
 * Splits an answer into the blocks the view renders.
 */
type MarkdownLexer = (source: string) => Token[];

/**
 * Distance from the end of the answer that still counts as reading it.
 */
const FOLLOW_DISTANCE = 32;

export default defineComponent({
  name: 'AiSuggestionDialog',
  components: {
    PopupDialog,
    AiSuggestionSkeleton,
    Icon,

    /**
     * Loaded with the answer: the renderer and its table of character references are needed nowhere else.
     */
    MarkdownView: defineAsyncComponent({
      loader: loadMarkdownView,
      loadingComponent: AiSuggestionSkeleton,
    }),
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
      pendingText: '',
      streamAnimationFrame: null as number | null,
      error: '',
      markdownLexer: null as MarkdownLexer | null,
      streamAbortController: new AbortController(),
    };
  },
  computed: {
    /**
     * Split AI answer into blocks to render.
     */
    blocks(): Token[] {
      return this.markdownLexer ? this.markdownLexer(this.suggestion) : [];
    },
  },
  watch: {
    blocks: {
      /**
       * Keep the end of the suggestion in sight while reader is there.
       */
      handler(): void {
        const content = this.$refs.content as HTMLElement;
        const readAt = content.scrollTop;

        if (content.scrollHeight - readAt - content.clientHeight > FOLLOW_DISTANCE) {
          return;
        }

        void this.$nextTick(() => {
          if (content.scrollTop === readAt) {
            content.scrollTop = content.scrollHeight;
          }
        });
      },
      flush: 'pre',
    },
  },
  async created() {
    try {
      const rendererReady = Promise.all([import('marked'), loadMarkdownView()]).then(([marked]) => {
        if (this.streamAbortController.signal.aborted) {
          return;
        }

        this.markdownLexer = source => marked.lexer(source);

        if (this.suggestion || this.error) {
          this.loading = !this.markdownLexer;
        }
      });

      await Promise.all([rendererReady, aiApi.streamEventAiSuggestion(this.projectId, this.eventId, this.originalEventId, {
        signal: this.streamAbortController.signal,
        onTextDelta: (delta) => {
          this.pendingText += delta;
          this.streamAnimationFrame ??= requestAnimationFrame(() => this.flushText());
        },
        onError: (message) => {
          /**
           * Drop the part of the answer the API withdrew.
           */
          this.pendingText = '';
          this.flushText();
          this.suggestion = '';
          this.error = message;
          this.loading = !this.markdownLexer;
        },
      })]);

      this.flushText();

      if (!this.suggestion && !this.error) {
        this.error = this.$t('event.ai.empty') as string;
      }
    } catch (error) {
      if (!isAbortError(error)) {
        this.error = this.$t('event.ai.error') as string;
        this.streamAbortController.abort();
        this.loading = false;
        console.error(error);
      }
    } finally {
      this.flushText();

      if (!this.streamAbortController.signal.aborted) {
        this.loading = false;
      }
    }
  },
  beforeUnmount() {
    this.streamAbortController.abort();
    this.pendingText = '';
    this.flushText();
  },
  methods: {
    /**
     * Publish buffered deltas together and cancel the pending frame.
     */
    flushText(): void {
      if (this.streamAnimationFrame !== null) {
        cancelAnimationFrame(this.streamAnimationFrame);
        this.streamAnimationFrame = null;
      }

      if (this.pendingText) {
        this.suggestion += this.pendingText;
        this.pendingText = '';
        this.loading = !this.markdownLexer;
      }
    },
  },
});
</script>

<style>
.ai-suggestion-dialog {
  display: flex;
  flex-direction: column;
  width: 720px;
  height: min(600px, calc(100vh - var(--popup-dialog-gutter) * 2));

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
    flex-grow: 1;
    align-items: center;
    min-width: 0;
    min-height: 0;
    padding: var(--spacing-l) var(--spacing-xl);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  &__suggestion {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  &__error {
    color: var(--color-indicator-critical);
  }
}
</style>
