<template>
  <DetailsBase
    class="details-suspected-commit"
    :expand-showed="commits.length > numberOfVisibleCommits"
    @expandClicked="isMoreCommitsShown = !isMoreCommitsShown"
  >
    <template #header>
      {{ $t("event.suspectedCommits.header") }}
    </template>
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
        <CommitItem :commit="commit" />
      </div>
    </template>
    <template #expandButton>
      {{
        isMoreCommitsShown
          ? $t("event.suspectedCommits.hide")
          : $tc(
            "event.suspectedCommits.moreRelease",
            commits.length - numberOfVisibleCommits,
            {
              numberOfCommits: commits.length - numberOfVisibleCommits,
            }
          )
      }}
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import Vue from 'vue';
import DetailsBase from './DetailsBase.vue';
import CommitItem from '../../utils/CommitItem.vue';
import { ReleaseCommit } from '@/types/release';

export default Vue.extend({
  name: 'DetailsSuspectedCommits',
  components: {
    DetailsBase,
    CommitItem,
  },
  props: {
    /**
     * Event commits to show
     */
    commits: {
      type: Array as () => ReleaseCommit[],
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
      numberOfVisibleCommits: 1,

    };
  },
  computed: {
    /**
     * Displayed commits items
     *
     * @returns { ReleaseCommit[] }
     */
    filteredCommits(): ReleaseCommit[] {
      return this.commits.length <= this.numberOfVisibleCommits
        || this.isMoreCommitsShown
        ? this.commits
        : this.commits.slice(0, this.numberOfVisibleCommits);
    },
  },
});
</script>

<style>
.details-suspected-commit {
  &__content-block {
    display: flex;
    flex-direction: row;
    padding: 13px 15px;
  }
  &__left {
    display: flex;
    flex-direction: column;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;

    &-title {
      max-width: 600px;
      margin-bottom: 6px;
      overflow: hidden;
      color: var(--color-text-main);
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-image {
      display: inline-flex;
      margin-right: 5px;
    }

    &-author {
      display: inline-block;
      color: var(--color-text-second);
      vertical-align: middle;
    }

    &-relative-time {
      color: var(--color-text-second);
      font-weight: normal;
      vertical-align: middle;
    }
  }

  &__right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: auto;

    &-hash-block {
      padding: 5px 10px;
      line-height: normal;
      background-color: var(--color-bg-code-fragment);
      border-radius: 5px;
    }

    &-hash {
      display: block;
      color: var(--color-text-second);
      font-size: 11px;
      font-family: var(--font-monospace);
      line-height: 14px;
    }
  }
}
</style>
