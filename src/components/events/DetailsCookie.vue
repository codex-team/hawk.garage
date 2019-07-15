<template>
  <div class="event-details">
    <h2 class="event-details__header">
      COOKIES
    </h2>
    <div class="event-details__content-container">
      <div
        v-for="(cookie, index) in cookies"
        :key="cookie.key"
        class="event-details__content-block"
        :class="{
          'event-details__content-block--first': index === 0,
          'event-details__content-block--last': index === cookies.length - 1
        }"
      >
        <div class="event-details__key">
          {{ cookie.key }}
        </div>
        <div class="event-details__value">
          {{ cookie.value }}
        </div>
      </div>
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
  }
};
</script>
