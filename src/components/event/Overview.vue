<template>
  <div>
    <div
      v-if="event"
      class="event-overview"
    >
      <DetailsSuspectedCommits
        v-if="
          event.release && event.release.commits && event.release.commits.length
        "
        class="event-overview__section"
        :commits="event.release.commits"
      />
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
        icon="vue"
        title="Vue"
      />
      <DetailsAddons
        v-if="getIntegrationAddons('nuxt')"
        class="event-overview__section"
        :addons="getIntegrationAddons('nuxt')"
        icon="nuxt"
        title="Nuxt"
      />
      <DetailsAddons
        v-if="getIntegrationAddons('flask')"
        class="event-overview__section"
        :addons="getIntegrationAddons('flask')"
        icon="flask"
        title="Flask"
      />
      <DetailsAddons
        v-if="getIntegrationAddons('fastapi')"
        class="event-overview__section"
        :addons="getIntegrationAddons('fastapi')"
        icon="fastapi"
        title="FastAPI"
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
        {{ isLoading ? $t("event.loading") : $t("event.emptyData") }}
      </div>
    </div>
    <div
      v-else
      class="event-overview__loading"
    >
      {{ $t("event.loading") }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DetailsCookie from './details/DetailsCookie.vue';
import DetailsBacktrace from './details/DetailsBacktrace.vue';
import DetailsSuspectedCommits from './details/DetailsSuspectedCommits.vue';
import DetailsAddons from './details/DetailsAddons.vue';
import { HawkEvent } from '@/types/events';
import { EventAddons } from '@hawk.so/types';
import { ValueOf } from '../../types/utils';

export default Vue.extend({
  name: 'EventOverview',
  components: {
    DetailsCookie,
    DetailsBacktrace,
    DetailsAddons,
    DetailsSuspectedCommits,
  },
  props: {
    /**
     * Original (first) event data
     */
    event: {
      type: Object as () => HawkEvent,
      required: true,
    },

    /**
     * Flag determines if event is loading
     */
    isLoading: {
      type: Boolean,
      default: false,
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
    addonsFiltered(): {[key: string]: string} | null {
      if (!this.hasAddons) {
        return null;
      }

      const integrationToFilter = ['vue', 'nuxt', 'flask', 'fastapi'];
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
     * @param integrationName - name of an integration
     * @returns object with integration addons
     */
    getIntegrationAddons(integrationName: string): ValueOf<EventAddons> | null {
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
@import "./../../styles/custom-properties.css";

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
  @apply --empty-placeholder;
}
</style>
