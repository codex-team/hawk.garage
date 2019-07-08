<template>
  <div class="event-item">
    <div class="event-item__time">
      {{event.time}}
    </div>
    <div class="event-item__badge-container">
      <Badge
        content="365"
        class="event-item__count"
      ></Badge>
    </div>
    <div class="event-item__info">
      {{event.payload.title}}
    </div>
    <div class="event-item__assignee"></div>
  </div>
</template>

<script>
import Badge from './Badge';

export default {
  name: 'EventItem',
  props: [ 'event' ],
  components: {
    Badge
  }
};
</script>

<style>
  .event-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 46px;
    padding: 13px 11px 13px 15px;
    border-radius: 9px;

    &__time {
      min-width: 30px;
      color: var(--color-text-second);
      font-size: 12px;
    }

    &__count {
      display: inline-block;
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
