<template>
  <div class="event-overview__header">
    <div class="event-overview__container">
      <div class="event-overview__error">
        <Icon
          class="event-overview__flash__icon"
          symbol="flash"
        />
        <span class="event-overview__error-text">
          Uncaught TypeError
        </span>
      </div>
      <h1
        class="event-overview__title"
      >
        {{ (!loading) ? event.payload.title : 'Loading' }}
      </h1>
      <div class="event-overview__location">
        <span class="event-overview__path">{{ path | prettyPath }}</span>
        <span class="event-overview__filename"> {{ file }} </span>
      </div>
      <div class="event-overview__buttons">
        <UIButton
          class="event-overview__button"
          content="Resolve"
          icon="check-mark"
        />
        <UIButton
          class="event-overview__button"
          content="Star"
          icon="star-inactive"
        />
        <UIButton
          class="event-overview__button"
          content="Ignore"
          icon="hided"
        />
        <UIButton
          class="event-overview__button"
          content="Create issue"
          icon="shape"
        />
      </div>
      <div class="event-overview__information">
        <EventNavigation
          :event="event"
          @toggleItem="toggleItem($event)"
        />
        <div class="event-overview__users">
          <Icon
            class="event-overview__eye-icon"
            symbol="eye"
          />
          <div class="event-overview__users-avatar" />
          <div class="event-overview__users-avatar" />
          <div class="event-overview__users-avatar" />
          <span class="event-overview__users-count">+17</span>
          <span class="event-overview__assignee-text">Assignee</span>
          <div class="event-overview__assignee-icons-bg">
            <div class="event-overview__assignee-icon-bg">
              <Icon
                class="event-overview__assignee-icon"
                symbol="assignee"
              />
            </div>
            <Icon
              class="event-overview__assignee-arrow-down"
              symbol="arrow-down"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EventNavigation from './EventNavigation.vue';
import UIButton from '../utils/UIButton.vue';
import Icon from '../utils/Icon.vue';
import { HawkEventBacktraceFrame } from '@/types/events';

export default Vue.extend({
  name: 'EventHeader',
  components: {
    EventNavigation,
    UIButton,
    Icon,
  },
  props: {
    event: {
      type: Object,
      default: null,
      validator: prop => typeof prop === 'object' || prop === null,
    },
  },
  data() {
    const loading = !this.event;

    return {
      loading,
    };
  },
  computed: {
    /**
     * Event location got from the first backtrace frame
     *
     * @return {string}
     */
    location(): string {
      const unknownLocation = 'Unknown location';

      if (!this.event) {
        return unknownLocation;
      }

      const trace: HawkEventBacktraceFrame[] = this.event.payload.backtrace;

      if (!trace) {
        return unknownLocation;
      }
      const firstWithFile = trace.find(frame => !!frame.file);

      if (firstWithFile) {
        return firstWithFile.file;
      }

      return unknownLocation;
    },

    /**
     * Event path got from the first backtrace frame
     *
     * @return {string}
     */
    path(): string {
      return this.location !== 'Unknown location' ? this.location.split('/')
        .slice(0, -1)
        .join('/') + '/' : this.location;
    },

    /**
     * Event file got from the first backtrace frame
     *
     * @return {string}
     */
    file(): string {
      return this.location !== 'Unknown location' ? this.location.split('/')
        .slice(-1)[0] : '';
    },
  },
  watch: {
    /**
     * When event is changed
     */
    event() {
      this.loading = false;
    },
  },
  methods: {
    /**
     * Emit for active item
     * @param {string} item - active item
     */
    toggleItem(item) {
      this.$emit('toggleItem', item);
    },
  },
});
</script>

<style>
  .event-overview {

    &__header {
      padding: 35px 20px 0 20px;
      background-color: #121419;
      color: var(--color-text-main);
    }

    &__error {
      display: inline-flex;
      background-color: var(--color-bg-second);
      padding: 4px 10px;
      border-radius: 4px;
    }

    &__error-text {
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.05px;
      align-items: center;
      opacity: 0.6;
    }

    &__flash__icon {
      margin-right: 10px;
      opacity: 0.6;
      width: 7px;
      height: 12px;
    }

    &__title {
      font-size: 18px;
      line-height: 1.67;
    }

    &__location {
      margin-bottom: 30px;
      font-size: 14px;
      letter-spacing: 0.1px;
    }

    &__path {
      opacity: 0.6;
    }

    &__filename {
      color: var(--color-indicator-critical);
    }

    &__buttons {
      display: flex;
      margin-bottom: 13px;
    }

    &__button {
      margin-right: 5px;
      border: solid 1px var(--color-bg-main);
    }

    &__information {
      display: flex;
      justify-content: space-between;
      height: 50px;
    }

    &__users {
      display: flex;
      align-items: center;
      font-weight: 500;

      &-avatar {
        width: 14px;
        height: 14px;
        border-radius: 5px;
        background-color: grey;
        margin-right: 6px;
      }

      &-count {
        margin-right: 30px;
        font-size: 12px;
        opacity: 0.6;
      }
    }

    &__eye-icon {
      width: 12px;
      height: 8px;
      margin-right: 6px;
      opacity: 0.6;
    }

    &__assignee {

      &-icons-bg {
        display: flex;
        align-items: center;
        padding: 4px 9px 4px 4px;
        border-radius: 7px;
        background-color: var(--color-bg-main);
      }

      &-icon-bg {
        width: 16px;
        height: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        margin-right: 5px;
        background-color: var(--color-bg-second);
      }

      &-text {
        font-size: 14px;
        margin-right: 10px;
        opacity: 0.6;
      }

      &-icon {
        width: 14px;
        height: 14px;
        opacity: 0.6;
      }

      &-arrow-down {
        width: 12px;
        height: 12px;
        opacity: 0.6;
      }
    }
  }
</style>
