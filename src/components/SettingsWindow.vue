<template>
  <div class="settings-window">
    <div class="settings-window__menu">
      <div class="settings-window__header window-header clearfix">
        <div class="window-header__logo"></div>
        <div class="window-header__title">
          Hawk
        </div>
        <div class="window-header__caption">
          Made by CodeX
        </div>
      </div>
      <div class="settings-window__menu-item">
        Account settings
      </div>
      <div class="settings-window__menu-item">
        Notifications
      </div>
      <div class="settings-window__menu-item">
        Billing information
      </div>
      <hr class="settings-window__menu-delimiter">
      <div class="settings-window__menu-item">
        Appearance
      </div>
      <div class="settings-window__menu-item">
        Language
      </div>
      <hr class="settings-window__menu-delimiter">
      <div
        class="settings-window__menu-item settings-window__menu-item--attention"
        @click="logout"
      >
        Log out
      </div>
    </div>
    <div class="setting-window__content"></div>
  </div>
</template>

<script>
import { RESET_STORE } from '../store/actions';

export default {
  name: 'SettingsWindow',
  methods: {
    /**
     * Logouts user
     */
    logout() {
      this.$store.dispatch(RESET_STORE);
    }
  }
};
</script>

<style>
  .settings-window {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    z-index: 10;

    display: flex;

    background-color: var(--color-bg-second);

    &__menu {
      box-sizing: border-box;

      width: 418px;
      padding-top: 30px;
      padding-right: 26px;
      padding-left: 192px;

      background-color: var(--color-bg-main);
    }

    &__header {
      margin-bottom: 30px;
      margin-left: -62px;
    }

    &__menu-item {
      width: 200px;
      height: 34px;
      margin-left: -10px;
      padding-left: 10px;

      font-weight: 500;
      line-height: 34px;

      border-radius: 3px;
      cursor: pointer;

      user-select: none;

      &:hover {
        background-color: var(--color-bg-second);
      }

      &--attention {
        color: var(--color-indicator-critical)
      }
    }

    &__menu-delimiter {
      border: 1px solid var(--color-bg-second);
    }

    .window-header {
      &__logo {
        float: left;
        width: 42px;
        height: 42px;
        margin-right: 20px;

        background-image: url("../assets/hawk-logo.png");
        background-position: center center;
        background-size: cover;
      }

      &__title {
        font-weight: bold;
        font-size: 18px;
      }

      &__caption {
        margin-top: 3px;

        color: var(--color-text-second);
        font-size: 14px;
      }
    }

  }
</style>
