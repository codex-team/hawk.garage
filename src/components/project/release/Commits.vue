<template>
  <div class="release-commits">
    <div
      v-for="(commit, idx) in commits"
      :key="idx"
      class="release-commits__item"
    >
      <div class="commit__hash" :title="commit.hash">{{ short(commit.hash) }}</div>
      <div class="commit__title" :title="commit.title">{{ commit.title }}</div>
      <div class="commit__meta">
        <span class="commit__author" :title="commit.author">{{ commit.author }}</span>
        <span class="commit__date">{{ commit.date | prettyRelativeTimeStr }}</span>
      </div>
    </div>
    <div v-if="!commits.length" class="release-commits__empty">—</div>
  </div>
</template>

<script>
import { fetchProjectReleaseDetails } from '@/api/projects';

export default {
  name: 'ReleaseCommits',
  data() { return { commits: [] }; },
  computed: {
    projectId() { return this.$route.params.projectId; },
    release() { return this.$route.params.release; },
  },
  async created() {
    const details = await fetchProjectReleaseDetails(this.projectId, this.release);
    this.commits = details.commits || [];
  },
  methods: {
    short(hash) { return hash ? hash.slice(0, 7) : ''; },
  },
};
</script>

<style>
.release-commits__item { padding: 10px 0; border-bottom: 1px solid var(--color-bg-second); }
.commit__hash { color: var(--color-text-second); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
.commit__title { color: var(--color-text-main); font-weight: 600; margin: 4px 0; }
.commit__meta { color: var(--color-text-second); font-size: 12px; display: flex; gap: 8px; }
.release-commits__empty { color: var(--color-text-second); padding: 16px 0; }
</style>

<template>
  <div class="release-commits">
    <div
      v-for="(commit, idx) in commits"
      :key="idx"
      class="release-commits__item"
    >
      <div class="commit__hash" :title="commit.hash">{{ short(commit.hash) }}</div>
      <div class="commit__title" :title="commit.title">{{ commit.title }}</div>
      <div class="commit__meta">
        <span class="commit__author" :title="commit.author">{{ commit.author }}</span>
        <span class="commit__date">{{ commit.date | prettyRelativeTimeStr }}</span>
      </div>
    </div>
    <div v-if="!commits.length" class="release-commits__empty">—</div>
  </div>
</template>

<script>
import { fetchProjectReleaseDetails } from '@/api/projects';

export default {
  name: 'ReleaseCommits',
  data() { return { commits: [] }; },
  computed: {
    projectId() { return this.$route.params.projectId; },
    release() { return this.$route.params.release; },
  },
  async created() {
    const details = await fetchProjectReleaseDetails(this.projectId, this.release);
    this.commits = details.commits || [];
  },
  methods: {
    short(hash) { return hash ? hash.slice(0, 7) : ''; },
  },
};
</script>

<style>
.release-commits__item { padding: 10px 0; border-bottom: 1px solid var(--color-bg-second); }
.commit__hash { color: var(--color-text-second); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
.commit__title { color: var(--color-text-main); font-weight: 600; margin: 4px 0; }
.commit__meta { color: var(--color-text-second); font-size: 12px; display: flex; gap: 8px; }
.release-commits__empty { color: var(--color-text-second); padding: 16px 0; }
</style>



