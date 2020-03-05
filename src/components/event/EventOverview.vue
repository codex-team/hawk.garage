<template>
  <div class="event-overview">
    <template
      v-if="!loading"
    >
      <DetailsBacktrace
        v-if="event.payload.backtrace && event.payload.backtrace.length"
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
        v-if="event.payload.addons"
        class="event-overview__section"
        :addons="event.payload.addons"
      />
    </template>
    <div
      v-else
      class="event-overview__loading"
    >
      <span>Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DetailsCookie from './DetailsCookie.vue';
import DetailsBacktrace from './DetailsBacktrace.vue';
import DetailsAddons from './DetailsAddons.vue';

export default Vue.extend({
  name: 'EventOverview',
  components: {
    DetailsCookie,
    DetailsBacktrace,
    DetailsAddons,
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
     * Get calling env language based on event.catcherType
     * errors/javascript -> javascript
     *
     * @return {string}
     */
    lang(): string {
      return this.event.catcherType.split('/').pop()!;
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
</style>
