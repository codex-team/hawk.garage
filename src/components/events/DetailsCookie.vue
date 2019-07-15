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
      <!--  eslint-disable vue/no-v-html-->
      <div
        v-if="!isUninterestedShown && uninterestedCookies.length"
        class="event-details__show-more"
        @click="isUninterestedShown = true"
        v-html="showMoreText"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'DetailsCookie',
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
    showMoreText() {
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
