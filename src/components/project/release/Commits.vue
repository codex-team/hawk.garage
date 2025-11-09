<template>
  <div class="release-commits">
    <div
      v-for="(commit, idx) in commits"
      :key="idx"
      class="release-commits__item"
    >
      <CommitItem :commit="commit" />
    </div>
    <EmptyState
      v-if="!commits.length"
      icon="commit"
      :title="$t('projects.releases.empty.commitsTitle')"
      :description="$t('projects.releases.empty.commitsDesc')"
      :action-text="$t('projects.releases.empty.learnMore')"
      :action-href="docLink"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CommitItem from '../../utils/CommitItem.vue';
import EmptyState from '../../utils/EmptyState.vue';

export default defineComponent({
  name: 'ReleaseCommits',
  components: { CommitItem,
    EmptyState },
  props: {
    releaseDetails: {
      type: Object,
      required: true,
    },
  },
  computed: {
    projectId() {
      return this.$route.params.projectId;
    },
    release() {
      return this.$route.params.release;
    },
    docLink() {
      const locale = (this.$i18n && this.$i18n.locale) || 'en';

      return String(locale).startsWith('ru')
        ? 'https://docs.hawk-tracker.ru/releases'
        : 'https://docs.hawk.so/releases';
    },
    commits() {
      return this.releaseDetails.commits || [];
    },
  },
});
</script>

<style>
.release-commits {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: var(--width-event-center-container);
  margin: 0 auto;
}

.release-commits__empty { padding: 16px 0;
  color: var(--color-text-second);
}

.release-commits__item {
  padding: 6px 0;
  padding: 13px 15px;
  background: var(--color-bg-main);
  border-bottom: 1px solid var(--color-bg-second);
  border-radius: 10px;
}

.release-commits__item:first-child {
  margin-top: 16px;
}
</style>
