<template>
  <div>
    <div
      v-if="event"
      class="event-overview"
    >
      <DetailsBacktrace
        v-if="hasBacktrace"
        class="event-overview__section"
        :backtrace="event.payload.backtrace"
        :lang="lang"
      />
      <DetailsCookie
        v-if="event.payload.cookies && event.payload.cookies.length"
        class="event-overview__section"
        :cookies="event.payload.cookies"
      />
      <DetailsAddons
        v-if="getIntegrationAddons('vue')"
        class="event-overview__section"
        :addons="getIntegrationAddons('vue')"
        title="Vue"
      />
      <DetailsAddons
        v-if="hasContext"
        class="event-overview__section"
        :addons="event.payload.context"
        :title="$t('event.context')"
      />
      <DetailsAddons
        v-if="addonsFiltered"
        class="event-overview__section"
        :addons="addonsFiltered"
      />
      <div
        v-if="isNoAdditionalInformation"
        class="empty-event-label"
      >
        {{ $t('event.emptyData') }}
      </div>
    </div>
    <div
      v-else
      class="event-overview__loading"
    >
      {{ $t('event.loading') }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DetailsCookie from './details/DetailsCookie.vue';
import DetailsBacktrace from './details/DetailsBacktrace.vue';
import DetailsAddons from './details/DetailsAddons.vue';
import { HawkEvent } from '@/types/events';

export default Vue.extend({
  name: 'EventOverview',
  components: {
    DetailsCookie,
    DetailsBacktrace,
    DetailsAddons,
  },
  props: {
    /**
     * Original (first) event data
     */
    event: {
      type: Object as () => HawkEvent,
      required: true,
    },
  },
  computed: {
    /**
     * Get calling env language based on event.catcherType
     * errors/javascript -> javascript
     *
     * @returns {string | undefined}
     */
    lang(): string | undefined {
      return this.event.catcherType ? this.event.catcherType.split('/').pop() : '';
    },

    /**
     * Addons without integration
     * that will be shown as separated components
     *
     * @returns {object}
     */
    addonsFiltered(): object | null {
      if (!this.hasAddons) {
        return null;
      }

      const integrationToFilter = [ 'vue' ];
      const filteredAddons = {};

      Object.entries(this.event.payload.addons).forEach(([name, value]) => {
        if (!integrationToFilter.includes(name)) {
          filteredAddons[name] = value;
        }
      });

      return filteredAddons;
    },

    /**
     * Return true if event has a backtrace info
     *
     * @returns {boolean}
     */
    hasBacktrace(): boolean {
      return this.event.payload.backtrace && this.event.payload.backtrace.length > 0;
    },

    /**
     * Return true if event has a context
     *
     * @returns {boolean}
     */
    hasContext(): boolean {
      return this.event.payload.context && Object.keys(this.event.payload.context).length > 0;
    },

    /**
     * Return true if event has addons
     *
     * @returns {boolean}
     */
    hasAddons(): boolean {
      return this.event.payload.addons && Object.keys(this.event.payload.addons).length > 0;
    },

    /**
     * Returns true if the event has no backtrace, context and addons
     *
     * @returns {boolean}
     */
    isNoAdditionalInformation(): boolean {
      const noBacktrace = !this.hasBacktrace;
      const noAddons = !this.hasAddons;
      const noContext = !this.hasContext;

      return noBacktrace && noAddons && noContext;
    },
  },
  methods: {
    /**
     * Extract integration group from the addons
     * For example, 'vue' or 'react'
     *
     * @param {string} integrationName - name of an integration
     * @returns {object} object with integration addons
     */
    getIntegrationAddons(integrationName: string): object | null {
      if (!this.hasAddons) {
        return null;
      }

      if (!this.event.payload.addons[integrationName]) {
        return null;
      }

      return this.event.payload.addons[integrationName];
    },
  },
});
</script>

<style>
  .event-overview {
    &__section {
      margin-bottom: 30px;
    }

    &__loading {
      height: 46px;
      margin-top: 50px;
      padding: 13px 11px 13px 15px;
      font-weight: 500;
      line-height: 20px;
      background-color: var(--color-bg-main);
      border-radius: 9px;
      cursor: pointer;
    }
  }

  .empty-event-label {
    color: var(--color-text-second);
    padding: 80px 0;
    text-align: center;
  }
</style>
