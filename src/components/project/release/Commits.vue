<template>
  <div class="release-commits">
    <div
      v-for="(commit, idx) in commits"
      :key="idx"
      class="release-commits__item"
    >
      <CommitItem :commit="commit" />
    </div>
    <div v-if="!commits.length" class="release-commits__empty">—</div>
  </div>
</template>

<script>
import CommitItem from '../../utils/CommitItem.vue';
export default {
  name: 'ReleaseCommits',
  components: { CommitItem },
  props: {
    releaseDetails: {
      type: Object,
      required: true,
    },
  },
  computed: {
    projectId() { return this.$route.params.projectId; },
    release() { return this.$route.params.release; },
    commits() { return this.releaseDetails.commits || []; },
  },
  methods: {
    short(hash) { return hash ? hash.slice(0, 7) : ''; },
  },
};
</script>

<style>
.release-commits {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 12px auto 0 auto;
  max-width: var(--width-event-center-container);
}

.release-commits__empty {
  color: var(--color-text-second); padding: 16px 0;
}

.release-commits__item {
  padding: 6px 0;
  border-bottom: 1px solid var(--color-bg-second);
  background: var(--color-bg-main);
  padding: 13px 15px;
  border-radius: 10px;
}
</style>
