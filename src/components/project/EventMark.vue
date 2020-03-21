<template>
  <Icon
    v-if="mark !== DEFAULT_MARK_VALUE"
    class="event-mark event-mark--icon"
    :class="`event-mark--${mark}`"
    :symbol="icons[mark]"
  />
  <div
    v-else
    class="event-mark event-mark--none"
  />
</template>

<script>
import Icon from '../utils/Icon';

const DEFAULT_MARK_VALUE = 'none';

export default {
  name: 'EventMark',
  components: { Icon },
  props: {
    mark: {
      type: String,
      default: DEFAULT_MARK_VALUE,
    },
  },
  data() {
    return {
      DEFAULT_MARK_VALUE,
      icons: {
        resolved: 'checkmark',
        starred: 'star',
        ignored: 'hided',
      },
    };
  },
};
</script>

<style>
  .event-mark {
    position: relative;
    width: 14px;
    min-width: 14px;
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
        top: 50%;
        left: 50%;
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
