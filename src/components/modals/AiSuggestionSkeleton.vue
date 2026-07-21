<template>
  <div class="ai-suggestion-skeleton">
    <div class="ai-suggestion-skeleton__block">
      <SkeletonBar
        class="ai-suggestion-skeleton__heading"
        size="large"
        width="45%"
      />
      <SkeletonBar
        v-for="i in 4"
        :key="`line-${i}`"
        class="ai-suggestion-skeleton__line"
        size="medium"
      />
      <SkeletonBar
        class="ai-suggestion-skeleton__line ai-suggestion-skeleton__line--short"
        size="medium"
        width="60%"
      />
    </div>
  </div>
</template>

<script lang="ts">
import SkeletonBar from '../utils/SkeletonBar.vue';
import { defineComponent } from 'vue';

/**
 * Skeleton loader for AI suggestion dialog text content
 */
export default defineComponent({
  name: 'AiSuggestionSkeleton',
  components: {
    SkeletonBar,
  },
});
</script>

<style>
.ai-suggestion-skeleton {
  width: 100%;
  padding: var(--spacing-s) 0;

  &__block {
    margin-bottom: var(--spacing-l);

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__heading {
    margin-bottom: var(--spacing-ml);
  }

  &__line {
    width: 100%;
    margin-bottom: var(--spacing-s);

    &--short {
      width: 60%;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
