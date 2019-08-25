<template>
  <PopupWindow @close="$router.push('/')">
    <div class="settings-window">
      <div class="settings-window__menu">
        <div class="settings-window__header window-header clearfix">
          <div class="window-header__logo" />
          <div class="window-header__title">
            Hawk
          </div>
          <div class="window-header__caption">
            Made by CodeX
          </div>
        </div>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'account-settings'}"
        >
          Account settings
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'home'}"
        >
          Notifications
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'home'}"
        >
          Billing information
        </router-link>
        <hr class="settings-window__menu-delimiter">
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'home'}"
        >
          Appearance
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'home'}"
        >
          Language
        </router-link>
        <hr class="settings-window__menu-delimiter">
        <div
          class="settings-window__menu-item settings-window__menu-item--attention"
          @click="logout"
        >
          Log out
        </div>
      </div>
      <div class="settings-window__content">
        <router-view />
      </div>
    </div>
  </PopupWindow>
</template>

<script>
import { RESET_STORE } from '../store/methodsTypes';
import PopupWindow from './utils/PopupWindow';

export default {
  name: 'SettingsWindow',
  components: {
    PopupWindow
  },
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
    display: flex;
    height: 100%;
    background-color: var(--color-bg-second);

    &__menu {
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
      display: block;
      width: 220px;
      height: 34px;
      margin: 0 -10px 0 -10px;
      padding-left: 10px;
      font-weight: 500;
      line-height: 34px;
      border-radius: 3px;
      cursor: pointer;
      user-select: none;

      &:hover, &.router-link-exact-active {
        background-color: var(--color-bg-second);
      }

      &--attention {
        color: var(--color-indicator-critical)
      }
    }

    &__menu-delimiter {
      border: 1px solid var(--color-bg-second);
    }

    &__content {
      width: 100%;
      padding: 50px 200px 50px 50px;
    }
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
</style>
