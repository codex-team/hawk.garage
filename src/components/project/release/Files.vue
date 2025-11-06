<template>
  <div class="release-files">
    <div v-if="files.length > 0" class="release-files__toolbar">
      <div class="release-files__count">{{ normalizedFiltered.length }} {{ $t('projects.releases.stats.files') }}</div>
      <input
        v-model="search"
        class="release-files__search"
        :placeholder="$t('forms.searchField')"
        type="text"
      >
    </div>
    <div
      v-for="(item, idx) in normalizedFiltered"
      :key="idx"
      class="release-files__item"
      :title="item.primaryFullPath"
    >
      <span class="release-files__ext" :class="'release-files__ext--' + item.ext">{{ item.ext }}</span>
      <span class="release-files__name">{{ item.primaryName }}</span>
      <span
        v-if="item.mapName"
        class="release-files__map"
        :title="item.mapFullPath"
      >map: {{ item.mapName }}</span>
    </div>
    <EmptyState
      v-if="!this.files.length"
      icon="file"
      :title="$t('projects.releases.empty.filesTitle')"
      :description="$t('projects.releases.empty.filesDesc')"
      :action-text="$t('projects.releases.empty.learnMore')"
      :action-href="docLink"
    />
  </div>

</template>

<script>
import EmptyState from '../../utils/EmptyState.vue';

export default {
  name: 'ReleaseFiles',
  components: { EmptyState },
  props: {
    releaseDetails: {
      type: Object,
      required: true,
    },
  },
  computed: {
    projectId() { return this.$route.params.projectId; },
    release() { return this.$route.params.release; },
    docLink() {
      const locale = (this.$i18n && this.$i18n.locale) || 'en';
      return String(locale).startsWith('ru')
        ? 'https://docs.hawk-tracker.ru/releases'
        : 'https://docs.hawk.so/releases';
    },
    files() { return this.releaseDetails.files || []; },
    normalized() {
      // Normalize both string entries and object entries with mapFileName/originFileName
      return (this.files || []).map((entry) => {
        if (typeof entry === 'string') {
          const primaryFullPath = entry;
          const primaryName = primaryFullPath;
          const primaryDir = this.getDir(primaryFullPath);
          const ext = this.getExt(primaryFullPath);
          // If it's a .map, also compute derived origin name (best-effort)
          const isMap = ext === 'map';
          const originName = isMap ? primaryName.replace(/\.map$/,'') : null;
          return {
            primaryFullPath,
            primaryName,
            primaryDir,
            ext: isMap ? (this.getExt(originName) || 'map') : ext,
            mapName: isMap ? primaryName : null,
            mapFullPath: isMap ? primaryFullPath : null,
          };
        }

        // Object form: { mapFileName: string, originFileName: string }
        const mapFullPath = entry.mapFileName || '';
        const primaryFullPath = entry.originFileName || '';
        const primaryName = primaryFullPath;
        const primaryDir = this.getDir(primaryFullPath);
        const ext = this.getExt(primaryFullPath) || 'file';
        const mapName = mapFullPath ? this.getName(mapFullPath) : null;

        return {
          primaryFullPath,
          primaryName,
          primaryDir,
          ext,
          mapName,
          mapFullPath,
        };
      });
    },
    normalizedFiltered() {
      if (!this.search) {
        return this.normalized;
      }
      const q = this.search.toLowerCase();
      return this.normalized.filter(item =>
        (item.primaryFullPath && item.primaryFullPath.toLowerCase().includes(q))
        || (item.mapFullPath && item.mapFullPath.toLowerCase().includes(q))
      );
    },
  },
  data() {
    return {
      search: '',
    };
  },
  methods: {
    getExt(file) {
      const base = this.getName(file);
      const parts = base.split('.');
      if (parts.length < 2) return 'file';
      return parts.pop().toLowerCase();
    },
    getName(file) {
      if (typeof file !== 'string') return '';
      const slash = file.lastIndexOf('/')
        ;
      return slash >= 0 ? file.slice(slash + 1) : file;
    },
    getDir(file) {
      if (typeof file !== 'string') return '';
      const slash = file.lastIndexOf('/');
      return slash >= 0 ? file.slice(0, slash) : '';
    },
  },
};
</script>

<style>
.release-files {
  padding-inline: 12px 0;
  margin: 12px auto 0 auto;
  max-width: var(--width-event-center-container);
}

.release-files__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0 12px;
}

.release-files__count {
  color: var(--color-text-second);
  font-size: 14px;
  margin-left: 11px
}

.release-files__search {
  margin-left: auto;
  min-width: 180px;
  padding: 6px 10px;
  color: var(--color-text-main);
  font-size: 14px;
  background: var(--color-bg-main);
  border: 1px solid var(--color-bg-second);
  border-radius: 8px;
  outline: none;
}

.release-files__item {
  display: grid;
  grid-template-columns: min-content 1fr 1fr; /* ext | name | path | map */
  align-items: start;
  gap: 6px 20px;
  padding: 14px;
  color: var(--color-text-main);
  font-size: 14px;
  border-bottom: 1px solid var(--color-bg-second);
  border-radius: 8px;
}

.release-files__ext {
  display: inline-block;
  min-width: 48px;
  padding: 2px 6px;
  color: var(--color-text-main);
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  background: var(--color-bg-main);
  border: 1px solid var(--color-bg-second);
  border-radius: 6px;
  text-align: center;
}

.release-files__name {
  font-weight: 600;
  white-space: normal;
  overflow-wrap: anywhere;
}

.release-files__path {
  color: var(--color-text-second);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  white-space: normal;
  overflow-wrap: anywhere;
}

.release-files__map {
  margin-left: 12px;
  padding: 2px 8px;
  color: var(--color-text-main);
  font-size: 12px;
  background: var(--color-bg-main);
  border: 1px solid var(--color-bg-second);
  border-radius: 8px;
}

.release-files__empty { color: var(--color-text-second); padding: 16px 0; }
/* empty-state styles moved to shared component */

/* Accent colors for common extensions */
.release-files__ext--js, .release-files__ext--ts, .release-files__ext--tsx, .release-files__ext--jsx {
  background: rgba(255, 220, 0, 0.15);
}
.release-files__ext--json, .release-files__ext--yml, .release-files__ext--yaml {
  background: rgba(0, 170, 255, 0.12);
}
.release-files__ext--md, .release-files__ext--mdx {
  background: rgba(120, 120, 255, 0.12);
}
.release-files__ext--vue, .release-files__ext--html {
  background: rgba(0, 200, 120, 0.12);
}
.release-files__ext--css, .release-files__ext--scss, .release-files__ext--less {
  background: rgba(255, 140, 0, 0.12);
}
.release-files__ext--png, .release-files__ext--jpg, .release-files__ext--jpeg, .release-files__ext--gif, .release-files__ext--svg, .release-files__ext--webp {
  background: rgba(180, 180, 180, 0.15);
}
</style>

