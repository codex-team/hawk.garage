<template>
  <div class="event-details details-backtrace">
    <h2 class="event-details__header">
      <slot name="header" />
    </h2>
    <div class="event-details__content-container">
      <slot name="content" />
      <div
        v-if="expandShowed"
        class="event-details__expand"
        @click="$emit('expandClicked')"
      >
        <Icon
          class="event-details__expand-icon"
          symbol="dots"
        />
        <slot name="expandButton" />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../utils/Icon';

export default {
  name: 'EventDetailsBase',
  components: {
    Icon
  },
  props: {
    expandShowed: {
      type: [Boolean, Number],
      default: false
    }
  }
};
</script>

<style>
  .event-details {
    &__header {
      margin: 0 0 10px 0;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.15px;
    }

    &__content-container {
      max-width: 100%;
      line-height: 1.91;
    }

    &__content-block, &__expand {
      display: flex;
      width: 100%;
      padding: 7px 10px;
      background-color: var(--color-bg-main);
      border-radius: 3px;
    }

    &__content-block {
      margin-bottom: 3px;

      &:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      &:last-child {
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
      }
    }

    &__expand {
      align-items: center;
      height: 36px;
      color: var(--color-text-second);
      font-size: 13px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      cursor: pointer;

      &:hover {
        color: var(--color-text-main);
      }
    }

    &__expand-icon {
      width: 15px;
      height: 3px;
      margin-right: 10px;
      margin-left: 5px;
    }

    &__key {
      min-width: 145px;
      max-width: 145px;
      font-weight: bold;
      font-size: 14px;
    }

    &__value {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      font-size: 11px;
      font-family: var(--font-monospace);
      word-wrap: break-word;
    }
  }

</style>
