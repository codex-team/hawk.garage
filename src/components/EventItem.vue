<template>
  <div class="event-item">
    <div class="event-item__time">
      {{event.time}}
    </div>
    <div class="event-item__badge-container">
      <Badge
        :content="event.count"
        class="event-item__count"
      ></Badge>
    </div>
    <div class="event-item__info">
      {{event.info}}
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
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 46px;
    padding: 13px 11px 13px 15px;
    border-radius: 9px;

    &__time {
      font-size: 12px;
      min-width: 30px;
      color: var(--color-text-second);
    }

    &__count {
      display: inline-block;
    }

    &__badge-container {
      min-width: 45px;
      margin-left: 19px;
    }

    &__info {
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: auto;

    }

    &__assignee {
      margin-left: 10px;
      min-width: 26px;
      min-height: 26px;
      background-color: var(--color-bg-main);
    }

    &:hover {
      background-color: var(--color-bg-main);
    }
  }
</style>
