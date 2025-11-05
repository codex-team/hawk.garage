<template>
  <div class="release-files">
    <div
      v-for="(file, idx) in files"
      :key="idx"
      class="release-files__item"
      :title="file"
    >
      {{ file }}
    </div>
    <div v-if="!files.length" class="release-files__empty">—</div>
  </div>
  
</template>

<script>
import { fetchProjectReleaseDetails } from '@/api/projects';

export default {
  name: 'ReleaseFiles',
  data() { return { files: [] }; },
  computed: {
    projectId() { return this.$route.params.projectId; },
    release() { return this.$route.params.release; },
  },
  async created() {
    const details = await fetchProjectReleaseDetails(this.projectId, this.release);
    this.files = details.files || [];
  },
};
</script>

<style>
.release-files__item { padding: 8px 0; color: var(--color-text-main); font-size: 13px; border-bottom: 1px solid var(--color-bg-second); }
.release-files__empty { color: var(--color-text-second); padding: 16px 0; }
</style>

<template>
  <div class="release-files">
    <div
      v-for="(file, idx) in files"
      :key="idx"
      class="release-files__item"
      :title="file"
    >
      {{ file }}
    </div>
    <div v-if="!files.length" class="release-files__empty">—</div>
  </div>

</template>

<script>
import { fetchProjectReleaseDetails } from '@/api/projects';

export default {
  name: 'ReleaseFiles',
  data() { return { files: [] }; },
  computed: {
    projectId() { return this.$route.params.projectId; },
    release() { return this.$route.params.release; },
  },
  async created() {
    const details = await fetchProjectReleaseDetails(this.projectId, this.release);
    this.files = details.files || [];
  },
};
</script>

<style>
.release-files__item { padding: 8px 0; color: var(--color-text-main); font-size: 13px; border-bottom: 1px solid var(--color-bg-second); }
.release-files__empty { color: var(--color-text-second); padding: 16px 0; }
</style>



