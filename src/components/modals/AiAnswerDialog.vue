<template>
  <PopupDialog @close="$emit('close')">
    <div class="ai-answer-dialog">
      <div class="ai-answer-dialog__header">
        {{ $t('event.ai.title') }}
      </div>
      <div class="ai-answer-dialog__content">
        <Spinner v-if="loading" />
        <div
          v-else-if="error"
          class="ai-answer-dialog__error"
        >
          {{ $t('event.ai.error') }}
        </div>
        <div
          v-else
          class="ai-answer-dialog__answer"
        >
          <template v-for="(seg, idx) in segments">
            <CodeFragment
              v-if="seg.type === 'code'"
              :key="'code-' + idx"
              class="ai-answer-dialog__code"
              :lines="seg.lines"
              :lang="seg.lang || 'plaintext'"
              :lines-highlighted="[]"
              :copyable="true"
            />
            <div
              v-else
              :key="'text-' + idx"
              class="ai-answer-dialog__text ai-answer-dialog__markdown"
              v-html="renderMarkdown(seg.text)"
            />
          </template>
        </div>
      </div>
    </div>
  </PopupDialog>
</template>

<script>
import PopupDialog from '../utils/PopupDialog.vue';
import Spinner from '../utils/Spinner.vue';
import CodeFragment from '../utils/CodeFragment';
import * as eventsApi from '@/api/events';
import { renderMarkdownAsync, splitTextAndCodeSegments } from '@/utils/markdown';

export default {
  name: 'AiAnswerDialog',
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
      answer: '',
      error: '',
    };
  },
  computed: {
    /**
     * Split AI answer into text and code segments.
     * Code segments are fenced with ```lang ... ```
     */
    segments() {
      return splitTextAndCodeSegments(this.answer);
    },
  },
  async created() {
    try {
      const result = await eventsApi.fetchEventAskAi(this.projectId, this.eventId, this.originalEventId);

      /**
       * API wrapper might return string or object depending on backend response/version.
       * Support both cases here.
       */
      this.answer = result;

      if (!this.answer) {
        this.error = this.$t('event.ai.empty');
      }
    } catch (e) {
      this.error = this.$t('event.ai.error');
    } finally {
      this.loading = false;
    }
  },
  async mounted() {
    this.renderMarkdown = await renderMarkdownAsync();
  },
};
</script>

<style>
.ai-answer-dialog {
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

  &__answer {
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
