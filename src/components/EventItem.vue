<template>
  <div class="event-item">
    <div class="event-item__time">
      {{ event.payload.timestamp | prettyTime }}
    </div>
    <div class="event-item__badge-container">
      <Badge
        :content="count"
        class="event-item__count"
      />
    </div>
    <div class="event-item__info">
      {{ event.payload.title }}
    </div>
    <div class="event-item__assignee" />
  </div>
</template>

<script>
import Badge from './utils/Badge';

export default {
  name: 'EventItem',
  components: {
    Badge
  },
  props: {
    event: {
      type: Object,
      required: true
    },
    count: {
      type: [String, Number],
      default: ''
    }
  }
};
</script>

<style>
  .event-item {
    display: flex;
    align-items: center;
    height: 46px;
    padding: 13px 11px 13px 15px;
    border-radius: 9px;

    &__time {
      min-width: 30px;
      color: var(--color-text-second);
      font-size: 12px;
    }

    &__badge-container {
      min-width: 45px;
      margin-left: 19px;
    }

    &__info {
      margin-right: auto;
      margin-left: 10px;
      overflow: hidden;
      font-weight: bold;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;

    }

    &__assignee {
      min-width: 26px;
      min-height: 26px;
      margin-left: 10px;
      background-color: var(--color-bg-main);
    }

    &:hover {
      background-color: var(--color-bg-main);
    }
  }
</style>
