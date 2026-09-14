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
import MarkdownView from '../utils/markdown/View.vue';
import * as eventsApi from '@/api/events';
import { defineComponent } from 'vue';
import { type Token as BlockToken } from 'marked';

export default defineComponent({
  name: 'AiSuggestionDialog',
  components: {
    PopupDialog,
    AiSuggestionSkeleton,
    Icon,
    MarkdownView,
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

      this.lex = source => marked.lexer(source);
      this.suggestion = await eventsApi.fetchEventAiSuggestion(this.projectId, this.eventId, this.originalEventId);

      if (!this.suggestion) {
        this.error = this.$t('event.ai.empty') as string;
      }
    } catch (e) {
      this.error = this.$t('event.ai.error') as string;
      console.error(e);
    } finally {
      this.loading = false;
    }
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
