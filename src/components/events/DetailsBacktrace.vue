<template>
  <div class="event-details">
    <h2 class="event-details__header">
      BACKTRACE
    </h2>
    <div class="event-details__content-container">
      <div
        v-for="bt in backtrace"
        :key="bt.file + bt.line"
        class="event-details__content-block"
      >
        {{ bt.file }}
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
