<template>
  <div class="event-details details-backtrace">
    <h2 class="event-details__header">
      BACKTRACE
    </h2>
    <div class="event-details__content-container clearfix">
      <div
        v-for="bt in backtrace"
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailsBacktrace',
  props: {
    backtrace: {
      type: Array,
      required: true
    }
  }
};
</script>

<style>
  .details-backtrace {
    &__filename, &__line {
      color: var(--color-text-second);
      font-family: Monaco, sans-serif;
    }

    &__filename {
      letter-spacing: -0.3px;
    }

    &__line {
      margin-left: auto;
    }
  }
</style>
