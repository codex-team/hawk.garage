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
        class="
          event-details__content-block
          details-suspected-commit__content-block
        "
        data-ripple
      >
        <div class="details-suspected-commit__left">
          <div class="details-suspected-commit__left-title">
            {{ commit.title }}
          </div>
          <div>
            <EntityImage
              class="details-suspected-commit__left-image"
              :name="commit.author"
              size="16"
            />
            <span class="details-suspected-commit__left-author">
              {{ commit.author }}
            </span>
            <span class="details-suspected-commit__left-relative-time">
              committed {{ commit.date | prettyRelativeTimeStr }}
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

<script lang="ts">
import DetailsBase from './DetailsBase.vue';
import EntityImage from '../../utils/EntityImage.vue';
import { HawkEventCommit} from '@/types/events';

export default {
  name: 'DetailsSuspectedCommits',
  components: {
    DetailsBase,
    EntityImage
  },
  props: {
    /**
     * Event commits to show
     */
    commits: {
      type: Array as () => HawkEventCommit[],
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
     * @returns {HawkEventCommit[]}
     */
    filteredCommits():HawkEventCommit[] {
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
    padding: 13px 15px;
    display: flex;
    flex-direction: row;
  }
  &__left > div {
    height: 16px;
  }
  &__left {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-weight: bold;
    line-height: normal;

    &-title {
      margin-bottom: 6px;
      color: var(--color-text-main);
      max-width: 600px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-image {
      display: inline-flex;
      margin-right: 5px;
    }

    &-author {
      color: var(--color-text-second);
      vertical-align: middle;
    }

    &-relative-time {
      color: var(--color-text-second);
      vertical-align: middle;
      font-weight: normal;
    }
  }

  &__right {
    display: flex;
    margin-left: auto;
    flex-direction: column;
    justify-content: space-around;

    &-hash-block {
      padding: 5px 10px;
      line-height: normal;
      border-radius: 5px;
      background-color: var(--color-bg-code-fragment);
    }

    &-hash {
      display: block;
      height: 14px;
      width: 42px;
      font-family: var(--font-monospace);
      font-size: 11px;
      line-height: normal;
      color: var(--color-text-second);
    }
  }
}
</style>
