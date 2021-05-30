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
        <div class="details-suspected-commit__header-row">
          <div class="details-suspected-commit__left">
            <div class="details-suspected-commit__left-title">
              {{ commit.title }}
            </div>
          </div>
          <div class="details-suspected-commit__right">
            <div class="details-suspected-commit__right_block">
              <span class="details-suspected-commit__right_block-commitHash">
                {{ commit.hash.substr(0, 7) }}
              </span>
            </div>
          </div>
        </div>
        <div class="details-suspected-commit__author-details">
          <span>
            {{ commit.author }}
          </span>
          <span class="details-suspected-commit__author-details_relative-time">
            {{ getRelativeTime(commit.date) }}
          </span>
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
  &__header-row {
    position: relative;
    display: flex;
    align-items: center;
    padding: 6px;
    font-size: 13px;
    letter-spacing: 0.15px;
    cursor: pointer;
  }

  &__content-block {
    display: flex;
    flex-direction: column;
    padding: 5px;
  }

  &__left {
    &-title {
      font-family: Roboto;
      font-size: 14px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #dbe6ff;
      max-width: 600px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  &__right {
    display: flex;
    margin-left: auto;
    &_block {
      padding: 0px 10px;
      border-radius: 5px;
      background-color: #171920;
      &-commitHash {
        font-family: JetBrainsMono;
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
  &__author-details {
    padding: 0px 0px 6px 6px;
    letter-spacing: 0.15px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(219, 230, 255, 0.6);
    &_relative-time {
      font-weight: normal;
    }
  }
}
</style>
