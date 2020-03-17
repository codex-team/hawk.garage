<template>
  <Icon
    v-if="label !== 'NONE'"
    class="event-label event-label--icon"
    :class="`event-label--${label.toLowerCase()}`"
    :symbol="icons[label]"
  />
  <div
    v-else
    class="event-label event-label--none"
  />
</template>

<script>
import Icon from '../utils/Icon';

export default {
  name: 'EventLabel',
  components: { Icon },
  props: {
    label: {
      type: String,
      default: 'NONE',
    },
  },
  data() {
    return {
      icons: {
        RESOLVED: 'check-mark',
        STARRED: 'star',
        IGNORED: 'hided',
      },
    };
  },
};
</script>

<style>
  .event-label {
    position: relative;
    width: 14px;
    height: 14px;

    border-radius: 50%;

    &--resolved {
      color: #2ccf6c;
      background-color: #fff;
    }

    &--starred {
      color: #eec71c;
    }

    &--ignored {
      padding: 1px;

      color: var(--color-text-main);
      background-color: #2ccf6c;
    }

    &--none {
      &::before {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 6px;
        height: 6px;
        margin: -3px 0 0 -3px;

        background-color: var(--color-text-second);

        border-radius: 50%;

        content: '';
      }
    }
  }
</style>
