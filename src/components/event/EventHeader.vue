<template>
  <div class="event-header">
    <div class="event-layout__container">
      <UiLabel
        text="Uncaught TypeError"
        icon="flash"
      />
      <h1 class="event-header__title">
        {{ (!loading) ? event.payload.title : $t('event.loading') }}
      </h1>
      <Filepath
        class="event-header__location"
        :location="location"
        :is-highlight="true"
        :title="location"
      />
      <div class="event-header__buttons">
        <UiButton
          class="event-header__button"
          :content="$t('event.resolve')"
          icon="checkmark"
        />
        <UiButton
          class="event-header__button"
          :content="$t('event.star')"
          icon="star"
        />
        <UiButton
          class="event-header__button"
          :content="$t('event.ignore')"
          icon="hided"
        />
        <UiButton
          class="event-header__button"
          :content="$t('event.issue')"
          icon="github"
        />
      </div>
      <div class="event-header__nav-bar">
        <TabBar
          :items="navigationItems"
          :active-item-index="currentNavigationItem"
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
import TabBar, { TabInfo } from '../utils/TabBar.vue';
import ViewedBy from '../utils/ViewedBy.vue';
import UiButton from '../utils/UiButton.vue';
import Filepath from '../utils/Filepath.vue';
import UiLabel from '../utils/UiLabel.vue';
import { HawkEvent, HawkEventBacktraceFrame } from '@/types/events';

export default Vue.extend({
  name: 'EventHeader',
  components: {
    TabBar,
    ViewedBy,
    UiButton,
    UiLabel,
    Filepath,
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
     * @return {TabInfo[]}
     */
    navigationItems(): TabInfo[] {
      return [
        {
          title: this.$i18n.t('event.navigation.overview') as string,
          routeName: 'event-overview',
        },
        {
          title: this.$i18n.t('event.navigation.repetitions') as string,
          routeName: 'event-repetitions',
          badge: !this.loading ? this.event.totalCount : 0,
        },
        {
          title: this.$i18n.t('event.navigation.daily') as string,
          routeName: 'event-daily',
        },
      ];
    },

    /**
     * Return index of current page from this.navigationItems
     */
    currentNavigationItem(): number {
      return this.navigationItems.findIndex(({ routeName }) => {
        return routeName === this.$route.name;
      });
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
  },
});
</script>

<style>
  .event-header {
    padding: 35px 20px 0 20px;
    color: var(--color-text-main);
    background-color: #121419;

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
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 650px;
    }

    &__buttons {
      display: flex;
      margin-bottom: 13px;
    }

    &__button {
      margin-right: 5px;
    }

    &__nav-bar {
      display: flex;
      justify-content: space-between;
      height: 50px;
    }
  }
</style>
