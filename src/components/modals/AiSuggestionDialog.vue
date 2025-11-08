<template>
  <PopupDialog @close="$emit('close')">
    <div class="ai-suggestion-dialog">
      <div class="ai-suggestion-dialog__header">
        {{ $t('event.ai.ask') }}
      </div>
      <div class="ai-suggestion-dialog__content">
        <Spinner v-if="loading" />
        <div
          v-else-if="error"
          class="ai-suggestion-dialog__error"
        >
          {{ $t('event.ai.error') }}
        </div>
        <div
          v-else
          class="ai-suggestion-dialog__suggestion"
        >
          <template v-for="(seg, idx) in segments">
            <CodeFragment
              v-if="seg.type === 'code'"
              :key="'code-' + idx"
              class="ai-suggestion-dialog__code"
              :lines="seg.lines"
              :lang="seg.lang || 'plaintext'"
              :lines-highlighted="[]"
              :copyable="true"
            />
            <div
              v-else
              :key="'text-' + idx"
              class="ai-suggestion-dialog__text ai-suggestion-dialog__markdown"
              v-html="renderMarkdown(seg.text)"
            />
          </template>
        </div>
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import PopupDialog from '../utils/PopupDialog.vue';
import Spinner from '../utils/Spinner.vue';
import CodeFragment from '../utils/CodeFragment.vue';
import * as eventsApi from '@/api/events';
import { getMarkdownRenderer, splitTextAndCodeSegments } from '@/utils/markdown';
import Vue from 'vue';

export default Vue.extend({
  name: 'AiSuggestionDialog',
  components: {
    PopupDialog,
    Spinner,
    CodeFragment,
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
  },
  data() {
    return {
      loading: true,
      suggestion: '',
      error: '',
      renderMarkdown: (text: string) => text,
    };
  },
  computed: {
    /**
     * Split AI answer into text and code segments.
     * Code segments are fenced with ```lang ... ```
     */
    segments() {
      return splitTextAndCodeSegments((this as unknown as { suggestion: string }).suggestion);
    },
  },
  async created() {
    try {
      this.renderMarkdown = await getMarkdownRenderer();
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
  max-width: 720px;
  padding: 20px;

  &__header {
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 18px;
  }

  &__content {
    padding: 10px 0;
  }

  &__suggestion {
    line-height: 1.6;
    white-space: pre-wrap;
  }

  &__text {
    white-space: pre-wrap;
  }

  &__markdown {
    white-space: normal;

    h1, h2, h3, h4, h5, h6 {
      margin: 12px 0 6px;
      font-weight: 600;
      line-height: 1.3;
    }

    p {
      margin: 8px 0;
    }

    ul, ol {
      margin: 8px 0 8px 20px;
    }

    blockquote {
      margin: 8px 0;
      padding-left: 12px;
      color: var(--color-text-secondary);
      border-left: 3px solid var(--color-border);
    }

    code {
      padding: 1px 4px;
      font-size: 90%;
      font-family: var(--font-monospace);
      background: var(--color-bg-code-fragment);
      border-radius: 3px;
    }

    a {
      color: var(--color-link);
      text-decoration: underline;
    }
  }

  &__code {
    margin: 10px 0;
  }

  &__error {
    color: var(--color-indicator-critical);
  }
}
</style>
