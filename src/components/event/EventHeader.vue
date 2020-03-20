<template>
  <div class="event-header">
    <div class="event-layout__container">
      <div class="event-header__error">
        <Icon
          class="event-header__flash-icon"
          symbol="flash"
        />
        <span class="event-header__error-text">
          Uncaught TypeError
        </span>
      </div>
      <h1 class="event-header__title">
        {{ (!loading) ? event.payload.title : $t('event.loading') }}
      </h1>
      <Filepath
        class="event-header__location"
        :location="location"
        :is-highlight="true"
      />
      <div class="event-header__buttons">
        <UIButton
          class="event-header__button"
          :content="$t('event.resolve')"
          icon="checkmark"
        />
        <UIButton
          class="event-header__button"
          :content="$t('event.star')"
          icon="star"
        />
        <UIButton
          class="event-header__button"
          :content="$t('event.ignore')"
          icon="hided"
        />
        <UIButton
          class="event-header__button"
          :content="$t('event.issue')"
          icon="github"
        />
      </div>
      <div class="event-header__information">
        <EventHeaderNavigation
          :items="navigationItems"
          @tabChanged="tabChanged($event)"
        />

        <ViewedBy
          v-if="event && event.visitedBy && event.visitedBy.length"
          :users="event.visitedBy"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EventHeaderNavigation from './EventHeaderNavigation.vue';
import ViewedBy from '../utils/ViewedBy.vue';
import UIButton from '../utils/UIButton.vue';
import Filepath from '../utils/Filepath.vue';
import Icon from '../utils/Icon.vue';
import { HawkEvent, HawkEventBacktraceFrame } from '@/types/events';
import i18n from './../../i18n';

export default Vue.extend({
  name: 'EventHeader',
  components: {
    EventHeaderNavigation,
    ViewedBy,
    UIButton,
    Filepath,
    Icon,
  },
  props: {
    /**
     * Original (first) event data
     * @type {HawkEvent}
     */
    event: {
      type: Object as () => HawkEvent,
      default: null,
      validator: prop => typeof prop === 'object' || prop === null,
    },
  },
  data() {
    return {
      /**
       * Status of repetition-diff fetching
       * @type {boolean}
       */
      loading: !this.event,
    };
  },
  computed: {
    /**
     * Event location got from the first backtrace frame
     *
     * @return {string}
     */
    location(): string {
      if (!this.event) {
        return '';
      }

      const trace: HawkEventBacktraceFrame[] = this.event.payload.backtrace;

      if (!trace) {
        return '';
      }
      const firstWithFile = trace.find(frame => !!frame.file);

      if (firstWithFile) {
        return firstWithFile.file;
      }

      return '';
    },

    /**
     * Navigation items
     *
     * @return {Object[]}
     */
    navigationItems(): any[] {
      return [ {
        title: 'overview',
        link: 'event-overview',
        badge: null,
      }, {
        title: 'repetitions',
        link: 'event-overview-repetitions',
        badge: !this.loading ? this.event.totalCount : null,
      }, {
        title: 'daily',
        link: 'event-overview-daily',
        badge: 0,
      } ];
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
     * @param {Object} item - active item
     */
    tabChanged(item: any) {
      this.$emit('tabChanged', item);
    },
  },
});
</script>

<style>
  .event-header {
    padding: 35px 20px 0 20px;
    color: var(--color-text-main);
    background-color: #121419;

    &__error {
      display: inline-flex;
      padding: 4px 10px;
      background-color: var(--color-bg-second);
      border-radius: 4px;

      &-text {
        align-items: center;
        font-weight: 500;
        font-size: 13px;
        letter-spacing: 0.05px;
        opacity: 0.6;
      }
    }

    &__flash-icon {
      width: 7px;
      height: 12px;
      margin-right: 10px;
      opacity: 0.6;
    }

    &__title {
      margin: 10px 0 15px;
      font-size: 18px;
      line-height: 1.67;
    }

    &__location {
      display: block;
      margin-bottom: 30px;
      font-size: 14px;
      letter-spacing: 0.1px;
      color: var(--color-text-second);
    }

    &__path {
      opacity: 0.6;
    }

    &__buttons {
      display: flex;
      margin-bottom: 13px;
    }

    &__button {
      margin-right: 5px;
    }

    &__information {
      display: flex;
      justify-content: space-between;
      height: 50px;
    }
  }
</style>