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
      {{ event.payload.title }} {{ showAssigners }}
    </div>
    <div
      v-click-outside="closeAssignersList"
      class="event-item__assignee-container"
      @click="showAssigners = true"
    >
      <AssignersList
        v-if="showAssigners"
        class="event-item__assignee"
      />
      <Icon
        symbol="assignee"
        class="event-item__assignee-icon"
      />
    </div>
  </div>
</template>

<script>
import Badge from '../utils/Badge';
import AssignersList from './AssignersList';
import Icon from '../utils/Icon';

export default {
  name: 'EventItem',
  components: {
    Badge,
    Icon,
    AssignersList
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
  },
  data() {
    return {
      showAssigners: false
    };
  },
  methods: {
    closeAssignersList() {
      console.log('close');
      this.showAssigners = false;
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
      position: absolute;
      left: 0;
      transform: translateX(-100%);
    }

    &__assignee-container {
      position: relative;
    }

    &__assignee-icon {
      width: 26px;
      height: 26px;
      margin-left: 10px;
    }

    &:hover {
      background-color: var(--color-bg-main);
    }
  }
</style>
