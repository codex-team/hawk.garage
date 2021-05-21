<template>
  <DetailsBase
    class="details-backtrace"
    :expand-showed="backtrace.length !== 4 && backtrace.length > 3"
    @expandClicked="isMoreFilesShown = !isMoreFilesShown"
  >
    <template #header>
      SUSPECTED COMMITS
    </template>
    <template #content>
      <div
        v-for="(frame, index) in filteredBacktrace"
        :key="index"
        class="event-details__content-block details-backtrace__content-block"
        data-ripple
      >
        <div class="details-backtrace__header-row">
          <div class="details-backtrace__left">
            <span v-if="frame.function">
              Merge
            </span>
            <span v-else class="details-backtrace__left-anonymous-function">
              (anonymous function)
            </span>
          </div>
          <div class="details-backtrace__right">
            {{ commits[0].commitHash }}
          </div>
        </div>
        <div>
          Hi
        </div>
      </div>
    </template>
    <template #expandButton>
      {{ isMoreFilesShown ? "Hide" : `${backtrace.length - 3} more files` }}
    </template>
  </DetailsBase>
</template>

<script>
import DetailsBase from "./DetailsBase";
import Filepath from "../../utils/Filepath";

export default {
  name: "DetailsSuspectedCommits",
  components: {
    DetailsBase,
    Filepath
  },
  props: {
    /**
     * Event backtrace to show
     */
    backtrace: {
      type: Array,
      required: true
    },
    commits: {
      type: Array,
      required: true
    },

    /**
     * Error environment language
     */
    lang: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      /**
       * Is block expanded.
       */
      isMoreFilesShown: false,

      /**
       * Indexes of opened frames
       */
      openedFrames: []
    };
  },
  computed: {
    /**
     * Displayed backtrace items
     */
    filteredBacktrace() {
      return this.backtrace.length === 4 || this.isMoreFilesShown
        ? this.backtrace
        : this.backtrace.slice(0, 3);
    }
  },
  mounted() {
    /**
     * By default, open first frame that has a source code
     */
    this.openedFrames.push(
      this.backtrace.findIndex(frame => !!frame.sourceCode)
    );
  },
  methods: {}
};
</script>

<style>
.details-backtrace {
  &__source-code {
    padding: 3px 9px;
    font-size: 12px;
    line-height: 21px;
    background-color: #171920;
    border: none;
    border-radius: var(--border-radius);
  }

  &__arrow-down {
    width: 12px;
    height: 12px;
    margin: 0 4px 0 11px;

    &--opened {
      transform: rotate(180deg);
    }
  }

  &__header-row {
    position: relative;
    display: flex;
    align-items: center;
    padding: 7px;
    font-size: 13px;
    letter-spacing: 0.15px;
    cursor: pointer;
  }

  &__content-block {
    display: flex;
    flex-direction: column;
    padding: 5px;
  }

  &__filename,
  &__line {
    color: var(--color-text-second);
    font-size: 12px;
    font-family: var(--font-monospace);
  }

  &__left {
    &-anonymous-function {
      opacity: 0.3;
    }
  }

  &__right {
    display: flex;
    margin-left: auto;

    &-file {
      max-width: 600px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-line {
      margin-left: 10px;
    }
  }
}
</style>
