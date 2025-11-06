<template>
  <div class="project-releases">
    <div
      v-if="groupedReleases && Object.keys(groupedReleases).length"
      class="project-releases__content"
    >
      <div
        v-for="(items, key) in groupedReleases"
        :key="key"
        class="project-releases__group"
      >
        <div class="project-releases__date">
          {{ getDay(key) | prettyDate }}
        </div>
        <div
          v-for="release in items"
          :key="release.release"
          class="release-row"
          @click="openRelease(release.release)"
        >
          <div class="release-row__left">
            <div class="release-row__time">
              {{ formatTime(release.timestamp) }}
            </div>
            <Badge
              :content="release.newEventsCount"
              :type="release.newEventsCount === 0 ? 'silent' : undefined"
            />
            <div
              class="release-row__title"
              :title="release.release"
            >
              {{ release.release }}
            </div>
          </div>
          <div class="release-row__right">
            <div class="release-row__metric">
              <span class="release-row__metric-label">{{ $t('projects.releases.stats.commits') }}</span>
              <span class="release-row__metric-value">{{ release.commitsCount }}</span>
            </div>
            <div class="release-row__metric">
              <span class="release-row__metric-label">{{ $t('projects.releases.stats.files') }}</span>
              <span class="release-row__metric-value">{{ release.filesCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="project-releases__empty"
    >
      —
    </div>
    <router-view />
  </div>
</template>

<script>
import { fetchProjectReleases } from '@/api/projects';
import Badge from '@/components/utils/Badge.vue';

export default {
  name: 'ProjectReleases',
  components: {
    Badge,
  },
  data() {
    return {
      releases: [],
    };
  },
  computed: {
    projectId() {
      return this.$route.params.projectId;
    },

    groupedReleases() {
      if (!this.releases.length) {
        return {};
      }

      const groups = {};

      for (const release of this.releases) {
        const d = new Date(release.timestamp * 1000);

        d.setHours(0, 0, 0, 0);
        const groupingTimestamp = Math.floor(d.getTime() / 1000);
        const key = 'groupingTimestamp:' + groupingTimestamp;

        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(release);
      }

      return groups;
    },
  },
  async created() {
    const items = await fetchProjectReleases(this.projectId);

    this.releases = (items || []).sort((a, b) => b.timestamp - a.timestamp);
  },
  methods: {
    getDay(key) {
      return parseInt(key.replace('groupingTimestamp:', ''), 10);
    },

    formatTime(tsSec) {
      return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(tsSec * 1000));
    },

    openRelease(release) {
      this.$router.push({
        name: 'project-release',
        params: { projectId: this.projectId, release },
      });
    },
  },
};
</script>

<style>
.project-releases {
  padding-inline: var(--layout-padding-inline);
}

.project-releases__date {
  margin-top: 18px;
  margin-bottom: 8px;
  color: var(--color-text-second);
  font-size: 13px;
}

.release-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
  padding: 10px 12px;
  background-color: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.release-row:hover {
  background-color: var(--color-bg-main);
}

.release-row__left {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.release-row__time {
  flex-shrink: 0;
  width: 42px;
  color: var(--color-text-second);
  font-size: 12px;
}

.release-row__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-main);
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.release-row__right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.release-row__metric {
  color: var(--color-text-main);
  font-size: 13px;
}

.release-row__metric-label {
  margin-right: 6px;
  color: var(--color-text-main);
  font-weight: 600;
  font-size: 13px;
}

.release-row__metric-value {
  color: var(--color-text-main);
  font-weight: 600;
  font-size: 13px;
}

.project-releases__empty {
  padding: 24px;
  color: var(--color-text-second);
}
</style>


