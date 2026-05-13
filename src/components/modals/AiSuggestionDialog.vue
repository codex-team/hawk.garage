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
            >
              <div class="text-ui-base" v-html="renderMarkdown(seg.text)" />
            </div>
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
import { defineComponent } from 'vue';

export default defineComponent({
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
    justify-content: center;
    padding: 20px;
  }

  &__suggestion {
    line-height: 1.6;
  }

  &__markdown {
    white-space: normal;

    p {
      font-size: inherit;
      margin: 0 0 6px;
    }

    li {
      list-style: inherit;
      padding-left: 0;
      margin: 0 0 6px;
    }

    li p {
      display: inline;
    }

    ul, ol {
      padding-left: 1.2em;
      list-style-position: outside;
      margin: 0 0 6px;
    }

    a {
      text-decoration: underline;
    }

    h1, h2, h3, h4, h5, h6 {
      margin: 8px 0 4px;
    }

    blockquote {
      margin: 0 0 6px;
      padding-left: 8px;
      color: var(--color-text-second);
      border-left: 3px solid var(--color-border);
    }

    code {
      border-radius: 4px;
      padding: 1px 4px;
      background: var(--color-bg-code-fragment);
      white-space: nowrap;
    }
  }

  &__code {
    margin: 0 0 8px;
  }

  &__error {
    color: var(--color-indicator-critical);
  }
}
</style>

<style lang="scss">
.ai-suggestion-dialog__text.ai-suggestion-dialog__markdown {
  @import '@codexteam/ui/styles';
}
</style>
