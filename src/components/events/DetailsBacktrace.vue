<template>
  <DetailsBase
    :expand-showed="backtrace.length !== 4 && backtrace.length > 3"
    @expandClicked="isMoreFilesShown = !isMoreFilesShown"
  >
    <template #header>
      BACKTRACE
    </template>
    <template #content>
      <div
        v-for="bt in filteredBacktrace"
        :key="bt.file + bt.line"
        class="event-details__content-block"
      >
        <div class="details-backtrace__filename">
          {{ bt.file }}
        </div>
        <div class="details-backtrace__line">
          line {{ bt.line }}
        </div>
      </div>
    </template>
    <template #expandButton>
      {{ isMoreFilesShown? 'Hide':`${backtrace.length - 3} more files` }}
    </template>
  </DetailsBase>
</template>

<script>
import DetailsBase from './DetailsBase';

export default {
  name: 'DetailsBacktrace',
  components: {
    DetailsBase
  },
  props: {
    backtrace: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      /**
       * Is block expanded.
       */
      isMoreFilesShown: false
    };
  },
  computed: {
    /**
     * Displayed backtrace items
     */
    filteredBacktrace() {
      return this.backtrace.length === 4 || this.isMoreFilesShown ? this.backtrace : this.backtrace.slice(0, 3);
    }
  }
};
</script>

<style>
  .details-backtrace {
    &__filename, &__line {
      color: var(--color-text-second);
      font-size: 12px;
      font-family: var(--font-monospace);
    }

    &__filename {
      letter-spacing: -0.3px;
    }

    &__line {
      margin-left: auto;
    }
  }
</style>
