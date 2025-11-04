<template>
  <DetailsBase
    class="details-suspected-commit"
    :expand-showed="commits.length > numberOfVisibleCommits"
    @expand-clicked="isMoreCommitsShown = !isMoreCommitsShown"
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
        <div class="details-suspected-commit__left">
          <div class="details-suspected-commit__left-title">
            {{ commit.title }}
          </div>
          <div>
            <EntityImage
              :id="commit.author.charCodeAt(0).toString(16)"
              class="details-suspected-commit__left-image"
              :name="commit.author"
              size="16"
            />
            <span class="details-suspected-commit__left-author">
              {{ commit.author }}
            </span>
            <span class="details-suspected-commit__left-relative-time">
              {{ $t("event.suspectedCommits.committed") }}
              {{ commit.date | prettyRelativeTimeStr }}
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
import { defineComponent } from 'vue';
import DetailsBase from './DetailsBase.vue';
import EntityImage from '../../utils/EntityImage.vue';
import { HawkEventCommit } from '@/types/events';

export default defineComponent({
  name: 'DetailsSuspectedCommits',
  components: {
    DetailsBase,
    EntityImage,
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
      numberOfVisibleCommits: 1,

    };
  },
  computed: {
    /**
     * Displayed commits items
     *
     * @returns { HawkEventCommit[] }
     */
    filteredCommits(): HawkEventCommit[] {
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
