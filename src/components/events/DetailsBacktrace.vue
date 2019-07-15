<template>
  <div class="event-details details-backtrace">
    <h2 class="event-details__header">
      BACKTRACE
    </h2>
    <div class="event-details__content-container">
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
      <div
        v-if="backtrace.length > 3"
        class="event-details__expand"
        @click="isMoreFilesShown = !isMoreFilesShown"
      >
        <Icon
          class="event-details__expand-icon"
          symbol="dots"
        />
        {{ isMoreFilesShown? 'hide':`${backtrace.length - 3} more files` }}
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../utils/Icon';

export default {
  name: 'DetailsBacktrace',
  components: {
    Icon
  },
  props: {
    backtrace: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isMoreFilesShown: this.backtrace.length === 4
    };
  },
  computed: {
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
