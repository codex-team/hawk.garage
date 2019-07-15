<template>
  <DetailsBase
    :expand-showed="uninterestedCookies.length"
    @expandClicked="isUninterestedShown = !isUninterestedShown"
  >
    <template #header>
      BACKTRACE
    </template>
    <template #content>
      <div
        v-for="cookie in filteredCookies"
        :key="cookie.key"
        class="event-details__content-block"
      >
        <div class="event-details__key">
          {{ cookie.key }}
        </div>
        <div class="event-details__value">
          {{ cookie.value }}
        </div>
      </div>
    </template>
    <template #expandButton>
      <!--eslint-disable vue/no-v-html-->
      <div v-html="expandButtonText" />
    </template>
  </DetailsBase>
</template>

<script>
import DetailsBase from './DetailsBase';

/**
 * @type {string[]} Cookie keys to be marked as uninteresting
 */
const uninterestedCookieKeys = ['_ym_id', '_ga'];

export default {
  name: 'DetailsCookie',
  components: {
    DetailsBase
  },
  props: {
    /**
     * Cookies to show
     */
    cookies: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      /**
       * Is all cookies shown
       */
      isUninterestedShown: false
    };
  },
  computed: {
    /**
     * Cookies to display
     */
    filteredCookies() {
      return this.cookies.filter(c => this.isUninterestedShown || !uninterestedCookieKeys.includes(c.key));
    },

    /**
     * Array of uninterested cookies
     */
    uninterestedCookies() {
      return this.cookies.filter(c => uninterestedCookieKeys.includes(c.key));
    },

    /**
     * Text for expand button
     */
    expandButtonText() {
      if (this.isUninterestedShown) return 'Hide';
      switch (this.uninterestedCookies.length) {
        case 0:
          return;
        case 1:
          return `Show <b>${this.uninterestedCookies[0].key}</b>`;
        case 2:
          return `Show <b>${this.uninterestedCookies[0].key}</b> and <b>${this.uninterestedCookies[1].key}</b> cookies`;
      }

      return `Show <b>${this.uninterestedCookies[0].key}</b>, <b>${this.uninterestedCookies[1].key}</b> and other uninterested cookies`;
    }
  }
};
</script>
