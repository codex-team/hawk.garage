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
              {{ commit.date | getRelativeTime }}
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
