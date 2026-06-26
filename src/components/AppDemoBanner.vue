<template>
  <div class="app-demo-banner">
    <span class="app-demo-banner__text">{{ $t('demo.bannerText') }}</span>
    <div class="app-demo-banner__actions">
      <UiButton
        class="app-demo-banner__button"
        :content="$t('demo.disableButton')"
        @click="onDisableClick"
      />
      <UiButton
        class="app-demo-banner__button app-demo-banner__button--secondary"
        :content="$t('demo.registerButton')"
        @click="onRegisterClick"
      />
      <UiButton
        class="app-demo-banner__button app-demo-banner__button--secondary"
        :content="$t('demo.contactButton')"
        href="mailto:team@hawk.so"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useDemo } from '../composables/useDemo';

import UiButton from './utils/UiButton.vue';

defineOptions({
  name: 'AppDemoBanner',
});

const router = useRouter();
const { disableDemo } = useDemo();

const onDisableClick = (): void => {
  void disableDemo();
};

const onRegisterClick = async (): Promise<void> => {
  await disableDemo();

  /* eslint-disable camelcase */
  const registrationUtm = {
    utm_source: 'demo',
    utm_medium: 'demo_banner',
    utm_campaign: 'demo_mode',
    utm_content: 'registration_button',
  };
  /* eslint-enable camelcase */

  void router.push({
    name: 'sign-up',
    query: registrationUtm,
  });
};
</script>

<style>
  .app-demo-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    padding: 7px 20px;
    color: #fff;
    font-size: 14px;
    white-space: nowrap;
    background: linear-gradient(90deg, #6800D0 19.23%, #5D34F0 100%), #12141B;
    /* box-shadow: 0 1px 0 rgba(193, 146, 255, 0.307), inset 0 -2px 6px rgba(0, 0, 0, 0.161); */
    z-index: 1;

    &__text {
      font-weight: 500;
    }

    &__actions {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }

    &__button {
      padding: 6px 10px;
      background: #fff;
      color: #2C209D;
      border-radius: 4px;
      transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease, transform 80ms ease;
      border: 0 !important;
      display: inline-flex;
      outline: none !important;
      font-size: 14px;
      line-height: 1.4;
      height: 32px;
      align-items: center;
      justify-content: center;

      &:hover,
      &:focus-visible {
        background: #dbd4ff;
        color: #2C209D !important;
      }

      &:active {
        transform: translateY(1px);
      }

      &--secondary {
        background: #20173B;
        color: #E4E1FF;

        &:hover,
        &:focus-visible {
          background: #2a1c54;
          color: #fff !important;
        }
      }
    }
  }
</style>
