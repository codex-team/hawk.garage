<template>
  <PopupDialog @close="$emit('close')">
    <div class="ai-suggestion-dialog">
      <div class="ai-suggestion-dialog__header">
        {{ $t('event.ai.title') }}
      </div>
      <div class="ai-suggestion-dialog__content">
        <AiSuggestionSkeleton v-if="loading" />
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
import AiSuggestionSkeleton from './AiSuggestionSkeleton.vue';
import CodeFragment from '../utils/CodeFragment.vue';
import * as eventsApi from '@/api/events';
import { getMarkdownRenderer, splitTextAndCodeSegments } from '@/utils/markdown';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AiSuggestionDialog',
  components: {
    PopupDialog,
    AiSuggestionSkeleton,
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
  width: 720px;

  &__header {
    padding: 20px;
    font-weight: 600;
    font-size: 18px;
    color: var(--color-text-second);
    background-color: #121419;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
    padding: 20px;
  }

  &__suggestion {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    /* .text-p */
    font-size: 1rem;
    line-height: 145%;
    font-weight: 400;
  }

  &__code {
    margin: 0 0 var(--spacing-s) 0;
  }

  &__markdown {
    word-break: break-word;

    h1, h2, h3, h4, h5, h6 {
      margin: var(--spacing-xl) 0 var(--spacing-ml) 0;

      &:first-child {
        margin-top: 0;
      }
    }

    a {
      text-decoration: underline;
    }

    .text-p {
      margin: 0 0 var(--spacing-s) 0;
    }

    ul, ol {
      margin: 0 0 var(--spacing-s) 0;
      padding-left: calc(var(--spacing-l) + var(--spacing-xs));
    }

    li {
      list-style-position: outside;
      margin-bottom: var(--spacing-s);
      padding-left: var(--spacing-xs);
    }

    ul > li {
      list-style-type: disc;
    }

    ol > li {
      list-style-type: decimal;
    }

    li > ul,
    li > ol {
      margin-top: var(--spacing-s);
    }

    li .text-p {
      margin: 0 0 var(--spacing-s) 0;
    }

    li .text-p:last-child {
      margin-bottom: 0;
    }

    blockquote {
      margin: 0 0 var(--spacing-s) 0;
    }

    pre {
      max-width: 100%;
      overflow-x: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    code {
      background: var(--color-bg-third);
      border-radius: 4px;
      padding: 0 var(--spacing-xs);
    }

    table {
      width: 100%;
      margin: 0 0 var(--spacing-s) 0;
      border-collapse: collapse;
    }

    th, td {
      padding: var(--spacing-ms) var(--spacing-ms);
      vertical-align: middle;
      border: 1px solid var(--color-delimiter-line);
    }

    th {
      text-align: left;
      font-weight: 600;
      background-color: var(--color-bg-main);
    }
  }

  &__error {
    color: var(--color-indicator-critical);
  }
}
</style>
