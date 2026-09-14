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
import { createStreamPacer, type StreamPacer } from '@/utils/streamPacer';
import { defineAsyncComponent, defineComponent, markRaw } from 'vue';
import { type Token as BlockToken } from 'marked';

export default defineComponent({
  name: 'AiSuggestionDialog',
  components: {
    PopupDialog,
    AiSuggestionSkeleton,
    Icon,

    /**
     * Loaded with the answer: the renderer and its table of character references are needed nowhere else.
     */
    MarkdownView: defineAsyncComponent(() => import('../utils/markdown/View.vue')),
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
      lex: null as ((source: string) => BlockToken[]) | null,
      streamAbortController: new AbortController(),
      streamPacer: null as StreamPacer | null,
    };
  },
  computed: {
    /**
     * Split AI answer into blocks to render.
     */
    blocks(): BlockToken[] {
      return this.lex ? this.lex(this.suggestion) : [];
    },
  },
  async created() {
    try {
      const marked = await import('marked');
      const pacer = createStreamPacer({
        onText: (text) => {
          this.suggestion += text;
          this.loading = false;
        },
      });

      this.lex = source => marked.lexer(source);
      this.streamPacer = markRaw(pacer);

      await aiApi.streamEventAiSuggestion(this.projectId, this.eventId, this.originalEventId, {
        signal: this.streamAbortController.signal,
        onTextDelta: delta => pacer.push(delta),
        onError: (message) => {
          /**
           * Drop the part of the answer the API withdrew.
           */
          pacer.stop();
          this.suggestion = '';
          this.error = message;
          this.loading = false;
        },
      });

      await pacer.drain();

      if (!this.suggestion && !this.error) {
        this.error = this.$t('event.ai.empty') as string;
      }
    } catch (error) {
      /**
       * Drop the rest of the failed stream.
       */
      this.streamPacer?.stop();

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
    this.streamPacer?.stop();
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
  }

  &__error {
    color: var(--color-indicator-critical);
  }
}
</style>
