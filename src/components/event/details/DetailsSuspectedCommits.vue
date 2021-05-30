<template>
  <DetailsBase
    class="details-suspected-commit"
    :expandShowed="commits.length > numberOfVisibleCommits"
    @expandClicked="isMoreCommitsShown = !isMoreCommitsShown"
  >
    <template #header> {{ $t("event.suspectedCommits") }} </template>
    <template #content>
      <div
        v-for="(commit, index) in filteredCommits"
        :key="index"
        class="event-details__content-block details-suspected-commit__content-block"
        data-ripple
      >
        <div class="details-suspected-commit__left">
          <div class="details-suspected-commit__left-title">
            {{ commit.title }}
          </div>
          <div>
            <span class="details-suspected-commit__left-author">
              {{ commit.author }}
            </span>
            <span class="details-suspected-commit__left-relative-time">
              {{ getRelativeTime(commit.date) }}
            </span>
          </div>
        </div>
        <div class="details-suspected-commit__right">
          <div class="details-suspected-commit__right-hash-block">
            <span class="details-suspected-commit__right-hash">
              {{ commit.hash.substr(0, 7) }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template #expandButton>
      {{
        isMoreCommitsShown
          ? "Hide"
          : `${
              commits.length - numberOfVisibleCommits
            } more commits in this release`
      }}
    </template>
  </DetailsBase>
</template>

<script>
import DetailsBase from './DetailsBase';

export default {
  name: 'DetailsSuspectedCommits',
  components: {
    DetailsBase,
  },
  props: {
    /**
     * Event commits to show
     */
    commits: {
      type: Array,
      required: true,
    },
    
  },
  data() {
    return {
      /**
       * Is block expanded.
       */
      isMoreCommitsShown: false,
      /**
       * Number of Visible Commits
       */
      numberOfVisibleCommits : 1,
    
    };
  },
  computed: {
    /**
     * Displayed commits items
     */
    filteredCommits() {
      return this.commits.length <= this.numberOfVisibleCommits ||
        this.isMoreCommitsShown
        ? this.commits
        : this.commits.slice(0, this.numberOfVisibleCommits);
    },
  },
  methods: {
    /**
     * Return string represent the relative time string.
     *
     * @param {string} date - commit date
     * @returns {string} relative time from today
     */
    getRelativeTime(date) {
      let currentTime = new Date();
      let commitTime = new Date(date);
      let diffInSeconds = Math.abs(currentTime - commitTime) / 1000;

      let numberOfYears = Math.floor(diffInSeconds / (60 * 60 * 24 * 365));
      if (numberOfYears) {
        return `committed ${
          numberOfYears === 1 ? 'a' : ''
        } ${numberOfYears} years ago`;
      }

      let numberOfMonths = Math.floor(diffInSeconds / (60 * 60 * 24 * 30));
      if (numberOfMonths) {
        return `committed ${
          numberOfMonths === 1 ? 'a' : ''
        } ${numberOfMonths} months ago`;
      }

      let numberOfDays = Math.floor(diffInSeconds / (60 * 60 * 24));
      if (numberOfDays) {
        return `committed ${
          numberOfDays === 1 ? 'a' : ''
        } ${numberOfDays} days ago`;
      }

      let numberOfHours = Math.floor(diffInSeconds / (60 * 60));
      if (numberOfHours) {
        return `committed ${
          numberOfHours === 1 ? 'a' : ''
        } ${numberOfHours} hours ago`;
      }

      let numberOfMinutes = Math.floor(diffInSeconds / 60);
      if (numberOfMinutes) {
        return `committed ${
          numberOfMinutes === 1 ? 'a' : ''
        } ${numberOfMinutes} minutes ago`;
      }

      return `committed few seconds ago`;
    },
  },
};
</script>

<style>
.details-suspected-commit {
  &__content-block {
    padding: 15px;
    display: flex;
    flex-direction: row;
  }

  &__left {
    display: flex;
    flex-direction: column;
    padding: 5px;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    &-title {
      margin-bottom: 6px;
      color: #dbe6ff;
      max-width: 600px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-author {
      color: rgba(219, 230, 255, 0.6);
    }
    &-relative-time {
      color: rgba(219, 230, 255, 0.6);
      font-weight: normal;
    }
  }

  &__right {
    display: flex;
    margin-left: auto;
    flex-direction: column;
    justify-content: space-around;
    &-hash-block {
      padding: 0px 15px;
      border-radius: 5px;
      background-color: #171920;
    }
    &-hash {
      font-family: Consolas;
      font-size: 11px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(219, 230, 255, 0.6);
    }
  }
}
</style>
