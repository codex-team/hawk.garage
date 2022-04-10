<template>
  <a href="mailto:team@hawk.so">
    <div class="feedback-wrapper">
      <Icon symbol="mail" />
      <div class="feedback-description">
        {{ $t("components.feedbackButton.message") }}
      </div>
    </div>
  </a>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from './Icon.vue';

export default Vue.extend({
  name: 'FeedbackButton',
  components: {
    Icon,
  },
});
</script>

<style>
.feedback {
  &-wrapper {
    position: fixed;
    right: 30px;
    bottom: 30px;
    z-index: 9995;
    background-color: var(--color-indicator-medium);
    padding: 8px 10px;
    box-shadow: 0px 9px 16px rgba(16, 106, 189, 0.3);
    border-radius: 8px;
    cursor: pointer;

    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      height: 16px;
      width: 18px;
    }
  }
  &-description {
    font-weight: 500;
    font-size: 14px;
    line-height: 12px;
    margin: 0px 6px;
  }
}
</style>
