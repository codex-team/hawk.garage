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
              {{ release.timestamp | prettyTime }}
            </div>
            <span>
              <Badge
                :content="release.newEventsCount"
                :type="release.newEventsCount === 0 ? 'silent' : undefined"
              />
            </span>
            <div
              class="release-row__title"
              :title="release.release"
            >
              {{ release.release }}
            </div>
          </div>
          <div class="release-row__right">
            <div v-if="release.commitsCount > 0" class="release-row__metric">
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
    <div v-else-if="isLoading" class="project-releases__loading">
      <div
        v-for="g in 2"
        :key="`skeleton-group-${g}`"
        class="project-releases__group"
      >
        <div class="project-releases__date">
          <SkeletonBar width="38px" size="small" />
        </div>
        <div
          v-for="i in 3"
          :key="`skeleton-item-${g}-${i}`"
          class="release-row release-row--skeleton"
        >
          <div class="release-row__left">
            <SkeletonBar width="100%" size="medium" />
            <SkeletonBar width="100%" size="medium" />
            <SkeletonBar width="200px" size="medium" />
          </div>
          <div class="release-row__right">
            <div class="release-row__metric">
              <SkeletonBar width="80px" size="small" />
            </div>
            <div class="release-row__metric">
              <SkeletonBar width="60px" size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="project-releases__empty"
    >
      <EmptyState
        icon="tag"
        :title="$t('projects.releases.empty.releasesTitle')"
        :description="$t('projects.releases.empty.releasesDesc')"
        :action-text="$t('projects.releases.empty.learnMore')"
        :action-href="docLink"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import { fetchProjectReleases } from '@/api/projects';
import Badge from '@/components/utils/Badge.vue';
import EmptyState from '../utils/EmptyState.vue';
import SkeletonBar from '../utils/SkeletonBar.vue';

export default {
  name: 'ProjectReleases',
  components: {
    Badge,
    EmptyState,
    SkeletonBar,
  },
  data() {
    return {
      releases: [],
      isLoading: false,
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


    docLink() {
      const locale = (this.$i18n && this.$i18n.locale) || 'en';

      return String(locale).startsWith('ru')
        ? 'https://docs.hawk-tracker.ru/releases'
        : 'https://docs.hawk.so/releases';
    },
  },
  async created() {
    this.isLoading = true;
    try {
      const items = await fetchProjectReleases(this.projectId);

      this.releases = (items || []).sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    getDay(key) {
      return parseInt(key.replace('groupingTimestamp:', ''), 10);
    },

    openRelease(release) {
      this.$router.push({
        name: 'project-release',
        params: { projectId: this.projectId,
          release },
      });
    },
  },
};
</script>

<style>
.project-releases {
  padding-inline: var(--layout-padding-inline);

  &__group {
    margin-top: 25px;
  }

  &__date {
    margin: 0 0 20px 11px;
    color: var(--color-text-second);
    font-size: 14px;
  }
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

.release-row.release-row--skeleton:hover {
  background-color: unset;
}


.release-row__left {
  display: grid;
  grid-template-columns: 30px 40px auto;
  column-gap: 10px;
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


