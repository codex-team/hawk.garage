<template>
  <div class="release-files">
    <div
      v-if="files.length > 0"
      class="release-files__toolbar"
    >
      <div class="release-files__count">
        {{ normalizedFiltered.length }} {{ $t('projects.releases.stats.files') }}
      </div>
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
    >
      <div>
        <span
          class="release-files__ext"
          :class="'release-files__ext--' + item.ext"
        >
          {{ item.ext }}
        </span>
      </div>
      <span
        class="release-files__name"
        :title="item.mapName"
      >
        {{ item.mapName }}
      </span>
      <span
        v-if="item.length != null"
        class="release-files__length"
      >
        {{ formatBytes(item.length) }}
      </span>
    </div>
    <EmptyState
      v-if="!files.length"
      icon="file"
      :title="$t('projects.releases.empty.filesTitle')"
      :description="$t('projects.releases.empty.filesDesc')"
      :action-text="$t('projects.releases.empty.learnMore')"
      :action-href="docLink"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ReleaseDetails } from '@/types/release';
import EmptyState from '../../utils/EmptyState.vue';

export default Vue.extend({
  name: 'ReleaseFiles',
  components: { EmptyState },
  props: {
    releaseDetails: {
      type: Object as PropType<ReleaseDetails>,
      required: true,
    },
  },
  data() {
    return {
      search: '',
    };
  },
  computed: {
    projectId(): string {
      return this.$route.params.projectId;
    },
    release(): string {
      return this.$route.params.release;
    },
    docLink(): string {
      const locale = (this.$i18n && this.$i18n.locale) || 'en';

      return String(locale).startsWith('ru')
        ? 'https://docs.hawk-tracker.ru/releases'
        : 'https://docs.hawk.so/releases';
    },
    files(): {
      mapFileName: string;
      originFileName: string;
      length: number | null;
    }[] {
      return this.releaseDetails.files || [];
    },
    normalized(): {
      primaryFullPath: string;
      primaryName: string;
      primaryDir: string;
      ext: string;
      mapName: string | null;
      mapFullPath: string;
      length: number | null;
    }[] {
      return (this.files || []).map((entry: { mapFileName: string;
        originFileName: string;
        length: number | null; }) => {
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
          length: entry.length,
        };
      });
    },
    normalizedFiltered(): {
      primaryFullPath: string;
      primaryName: string;
      primaryDir: string;
      ext: string;
      mapName: string | null;
      mapFullPath: string;
      length: number | null;
    }[] {
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
  methods: {
    formatBytes(bytes: number): string {
      if (typeof bytes !== 'number' || isNaN(bytes)) {
        return '—';
      }
      if (bytes < 1024) {
        return `${bytes} B`;
      }
      const units = ['KB', 'MB', 'GB', 'TB'];
      let value = bytes / 1024;
      let unitIndex = 0;

      while (value >= 1024 && unitIndex < units.length - 1) {
        value = value / 1024;
        unitIndex++;
      }
      const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;

      return `${rounded} ${units[unitIndex]}`;
    },
    getExt(file: string): string {
      const base = this.getName(file);
      const parts = base.split('.');

      if (parts.length < 2) {
        return 'file';
      }

      return parts?.pop()?.toLowerCase() || 'file';
    },
    getName(file: string): string {
      if (typeof file !== 'string') {
        return '';
      }
      const slash = file.lastIndexOf('/')
        ;

      return slash >= 0 ? file.slice(slash + 1) : file;
    },
    getDir(file: string): string {
      if (typeof file !== 'string') {
        return '';
      }
      const slash = file.lastIndexOf('/');

      return slash >= 0 ? file.slice(0, slash) : '';
    },
  },
});
</script>

<style>
.release-files {
  max-width: var(--width-event-center-container);
  margin: 12px auto 0 auto;
  padding-inline: 12px 0;
}

.release-files__toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 0 12px;
}

.release-files__count {
  color: var(--color-text-second);
  font-size: 14px;
}

.release-files__search {
  min-width: 180px;
  margin-left: auto;
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
  grid-template-columns: 40px auto 50px; /* ext | name | length */
  gap: 4px;
  align-items: start;
  padding: 8px 0;
  color: var(--color-text-main);
  font-size: 14px;
  border-bottom: 1px solid var(--color-bg-second);
  border-radius: 8px;
}

.release-files__ext {
  display: inline-block;
  padding: 3px 5px 2px;
  color: #fff;
  font-weight: 700;
  font-size: 11px;
  line-height: 11px;
  letter-spacing: 0.02em;
  text-align: center;
  text-transform: uppercase;
  background: var(--color-bg-main);
  border: 1px solid var(--color-bg-second);
  border-radius: 6px;
}

.release-files__name {
  font-weight: 500;
  white-space: normal;
  overflow-wrap: anywhere;
}

.release-files__path {
  color: var(--color-text-second);
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: normal;
  overflow-wrap: anywhere;
}

.release-files__length {
  justify-self: end;
  color: var(--color-text-second);
  font-size: 12px;
  text-align: right;
}

.release-files__empty { padding: 16px 0; color: var(--color-text-second); }

/* Accent colors for common extensions */
.release-files__ext--js, .release-files__ext--ts, .release-files__ext--tsx, .release-files__ext--jsx {
  background: rgb(106, 0, 255);
}
.release-files__ext--json, .release-files__ext--yml, .release-files__ext--yaml {
  background: rgb(218, 157, 1);
}
.release-files__ext--md, .release-files__ext--mdx {
  background: rgb(0, 183, 255);
}
.release-files__ext--vue, .release-files__ext--html {
  background: rgb(0, 189, 114);
}
.release-files__ext--css, .release-files__ext--scss, .release-files__ext--less {
  background: #ad3d97;
}
.release-files__ext--png, .release-files__ext--jpg, .release-files__ext--jpeg, .release-files__ext--gif, .release-files__ext--svg, .release-files__ext--webp {
  background: rgb(88, 74, 245);
}
</style>
