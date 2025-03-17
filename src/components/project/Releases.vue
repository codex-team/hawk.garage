<template>
  <div class="project-releases">
    <div
      v-if="project"
      class="project-releases__content"
    >
      <div
        v-if="groupedReleases && Object.keys(groupedReleases).length"
        class="project-releases__list"
      >
        <div
          v-for="(dayReleases, day) in groupedReleases"
          :key="day"
          class="project-releases__day"
        >
          <div class="project-releases__day-header">{{ formatDayHeader(day) }}</div>
          <div
            v-for="(release, index) in dayReleases"
            :key="release.id"
            class="project-releases__item"
            :class="{ 'project-releases__item--expanded': expandedReleases[`${day}-${index}`] }"
            @click="toggleRelease(`${day}-${index}`)"
          >
            <div class="project-releases__item-header">
              <div class="project-releases__item-info">
                <div class="project-releases__time">{{ getTimestampFromReleaseName(release.releaseName) | prettyTime }}</div>
                <div class="project-releases__name">{{ release.id }}</div>
              </div>
              <div class="project-releases__files-count">
                {{ release.files ? release.files.length : 0 }} files
                <span v-if="release.files && release.files.length" class="project-releases__files-size">
                  ({{ formatTotalSize(release.files) }})
                </span>
              </div>
            </div>
            <div v-if="expandedReleases[`${day}-${index}`]" class="project-releases__details">
              <DetailsSuspectedCommits
                v-if="release.commits && release.commits.length"
                :commits="release.commits"
              />
              <div class="project-releases__files" v-if="release.files && release.files.length">
                <div class="project-releases__section-title">Source Maps</div>
                <div
                  v-for="(file, fileIndex) in release.files"
                  :key="fileIndex"
                  class="project-releases__file"
                >
                  <span class="project-releases__file-name">{{ file.originFileName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="project-releases__empty"
      >
        <div class="project-releases__empty-title">{{ $t('components.releases.empty.title') }}</div>
        <div class="project-releases__empty-description">
          {{ $t('components.releases.empty.description') }}
          <ul class="project-releases__empty-list">
            <li>{{ $t('components.releases.empty.benefits.commits') }}</li>
            <li>{{ $t('components.releases.empty.benefits.sourceMaps') }}</li>
            <li>{{ $t('components.releases.empty.benefits.identify') }}</li>
          </ul>
          <a href="https://docs.hawk.so/releases" target="_blank" class="project-releases__empty-link">
            {{ $t('components.releases.empty.learnMore') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FETCH_PROJECT_RELEASES } from '@/store/modules/projects/actionTypes';
import DetailsSuspectedCommits from '../event/details/DetailsSuspectedCommits.vue';

export default {
  name: 'ProjectReleases',
  components: {
    DetailsSuspectedCommits
  },
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      /**
       * Tracks which releases are expanded by index
       */
      expandedReleases: {},
    };
  },
  computed: {
    /**
     * Current viewed project
     */
    project() {
      return this.$store.getters.getProjectById(this.projectId);
    },

    /**
     * Project releases from Vuex store
     */
    releases() {
      return this.project?.releases || [];
    },

    /**
     * Group releases by day
     */
    groupedReleases() {
      const groups = {};
      
      if (!this.releases) return groups;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      this.releases.forEach(release => {
        const date = new Date(release.releaseName);
        const releaseDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        let day;

        if (releaseDay.getTime() === today.getTime()) {
          day = 'today';
        } else if (releaseDay.getTime() === yesterday.getTime()) {
          day = 'yesterday';
        } else {
          day = releaseDay.toISOString().split('T')[0];
        }
        
        if (!groups[day]) {
          groups[day] = [];
        }
        
        groups[day].push(release);
      });

      // Sort days in descending order
      const sortedGroups = {};
      Object.keys(groups)
        .sort((a, b) => {
          if (a === 'today') return -1;
          if (b === 'today') return 1;
          if (a === 'yesterday') return -1;
          if (b === 'yesterday') return 1;
          return b.localeCompare(a);
        })
        .forEach(key => {
          sortedGroups[key] = groups[key].sort((a, b) => 
            new Date(b.releaseName).getTime() - new Date(a.releaseName).getTime()
          );
        });

      return sortedGroups;
    }
  },
  async created() {
    try {
      await this.$store.dispatch(FETCH_PROJECT_RELEASES, this.projectId);
    } catch (error) {
      console.error('Error fetching releases:', error);
    }
  },
  methods: {
    /**
     * Format day header
     * @param {string} day - Day identifier ('today', 'yesterday', or YYYY-MM-DD)
     * @returns {string} Formatted day header
     */
    formatDayHeader(day) {
      if (day === 'today') {
        return 'Today';
      } else if (day === 'yesterday') {
        return 'Yesterday';
      } else {
        const date = new Date(day);
        return date.toLocaleDateString(undefined, { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    },

    /**
     * Toggle release expansion state
     * @param {string} releaseKey - Key of the release to toggle
     */
    toggleRelease(releaseKey) {
      const newState = { ...this.expandedReleases };
      newState[releaseKey] = !newState[releaseKey];
      this.expandedReleases = newState;
    },

    /**
     * Convert release name string to timestamp in seconds
     * @param {string} releaseName - Release name in ISO string format
     * @returns {number} Timestamp in seconds
     */
    getTimestampFromReleaseName(releaseName) {
      return Math.floor(new Date(releaseName).getTime() / 1000);
    },

    /**
     * Format total size of files in bytes to human readable format
     * @param {Array} files - Array of files with size property
     * @returns {string} Formatted size
     */
    formatTotalSize(files) {
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = totalSize;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return `${Math.round(size * 10) / 10} ${units[unitIndex]}`;
    }
  }
};
</script>

<style>
.project-releases {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__content {
    align-self: stretch;
    overflow-y: auto;
    padding: 0 15px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 20px 0;
  }

  &__day {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__day-header {
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0px;
    color: var(--color-text-second);
    padding: 0 15px;
  }

  &__item {
    background: var(--color-bg-second);
    border-radius: 9px;
    padding: 13px 11px 13px 15px;
    cursor: pointer;
    min-height: 46px;
    display: flex;
    flex-direction: column;

    &:hover {
      background-color: var(--color-bg-main);
    }

    &--expanded {
      background-color: var(--color-bg-main);
    }
  }

  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 20px;
  }

  &__item-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__time {
    min-width: 30px;
    color: var(--color-text-second);
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0px;
  }

  &__name {
    font-family: 'Roboto';
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0px;
    color: #DBE6FF;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__files-count {
    color: var(--color-text-second);
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0px;
  }

  &__files-size {
    margin-left: 5px;
    color: var(--color-text-second);
  }

  &__details {
    margin-top: 10px;
    padding-top: 0;
  }

  &__section-title {
    font-family: 'Roboto';
    font-weight: 500;
    font-size: 13px;
    line-height: 100%;
    letter-spacing: 0px;
    color: var(--color-text-second);
    margin-bottom: 10px;
  }

  &__files {
    margin-top: 15px;
  }

  &__file {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
  }

  &__file-icon {
    width: 14px;
    height: 14px;
    color: var(--color-text-second);
  }

  &__file-name {
    font-size: 14px;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--color-text-second);
    font-size: 14px;
    text-align: center;
    padding: 20px;

    &-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 15px;
      color: var(--color-text-main);
    }

    &-description {
      max-width: 400px;
    }

    &-list {
      text-align: left;
      margin: 10px 0;
      padding-left: 20px;
    }

    &-link {
      display: inline-block;
      margin-top: 10px;
      color: var(--color-indicator-success);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style> 