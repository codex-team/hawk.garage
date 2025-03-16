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
            :key="release._id"
            class="project-releases__item"
            :class="{ 'project-releases__item--expanded': expandedReleases[`${day}-${index}`] }"
            @click="toggleRelease(`${day}-${index}`)"
          >
            <div class="project-releases__item-header">
              <div class="project-releases__item-info">
                <div class="project-releases__time">{{ formatTime(release.release) }}</div>
                <div class="project-releases__name">{{ release._id }}</div>
              </div>
              <div class="project-releases__files-count">
                {{ release.files ? release.files.length : 0 }} files
              </div>
            </div>
            <div v-if="expandedReleases[`${day}-${index}`]" class="project-releases__details">
              <div class="project-releases__commits" v-if="release.commits && release.commits.length">
                <div class="project-releases__section-title">Commits</div>
                <div
                  v-for="(commit, commitIndex) in release.commits"
                  :key="commitIndex"
                  class="project-releases__commit"
                >
                  <div class="project-releases__commit-header">
                    <span class="project-releases__commit-icon">📝</span>
                    <span class="project-releases__commit-hash">{{ commit.hash.substring(0, 7) }}</span>
                    <span class="project-releases__commit-author">{{ commit.author }}</span>
                    <span class="project-releases__commit-date">{{ commit.date | prettyDate }}</span>
                  </div>
                  <div class="project-releases__commit-title">{{ commit.title }}</div>
                </div>
              </div>
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
        {{ $t('projects.noReleases') }}
      </div>
    </div>
  </div>
</template>

<script>
import { FETCH_PROJECT_RELEASES } from '@/store/modules/projects/actionTypes';

export default {
  name: 'ProjectReleases',
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

      // Get current date at start of day
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      this.releases.forEach(release => {
        const date = new Date(release.release);
        const releaseDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        let day;

        // Compare with today and yesterday
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
            new Date(b.release).getTime() - new Date(a.release).getTime()
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
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    /**
     * Format date string to show only time
     * @param {string} dateStr - Date string to format
     * @returns {string} Formatted time
     */
    formatTime(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

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

  &__commits {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  &__commit {
    padding: 10px;
    background: var(--color-bg-main);
    border-radius: 6px;
  }

  &__commit-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    color: var(--color-text-second);
    font-size: 13px;
  }

  &__commit-icon {
    width: 14px;
    height: 14px;
    color: var(--color-text-second);
  }

  &__commit-hash {
    font-family: monospace;
  }

  &__commit-author {
    margin-left: auto;
  }

  &__commit-title {
    color: var(--color-text-main);
    font-size: 14px;
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
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--color-text-second);
    font-size: 14px;
  }
}
</style> 