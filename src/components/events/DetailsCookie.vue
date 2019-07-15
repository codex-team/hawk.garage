<template>
  <div class="event-details">
    <h2 class="event-details__header">
      COOKIES
    </h2>
    <div class="event-details__content-container">
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
      <div
        v-if="uninterestedCookies.length"
        class="event-details__expand"
        @click="isUninterestedShown = !isUninterestedShown"
      >
        <Icon
          class="event-details__expand-icon"
          symbol="dots"
        />
        <!--  eslint-disable vue/no-v-html-->
        <div v-html="expandButtonText" />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../utils/Icon';

export default {
  name: 'DetailsCookie',
  components: {
    Icon
  },
  props: {
    cookies: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isUninterestedShown: false
    };
  },
  computed: {
    filteredCookies() {
      return this.cookies.filter(c => this.isUninterestedShown || !c.uninterested);
    },
    uninterestedCookies() {
      return this.cookies.filter(c => c.uninterested);
    },
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
