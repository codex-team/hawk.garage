<template>
  <SettingsWindow
    on-close-route="/"
    class="account-settings-window"
  >
    <template v-slot:header>
      <div class="settings-window__header account-settings-window__header">
        <div class="account-settings-window__logo settings-window__logo" />
        <div class="account-settings-window__title">
          Hawk
        </div>
        <div class="account-settings-window__caption">
          Made by CodeX
        </div>
      </div>
    </template>

    <template v-slot:menu>
      <div>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'account-settings'}"
        >
          {{ $t('settings.account.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'home'}"
        >
          {{ $t('settings.notifications.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'billing-settings'}"
        >
          {{ $t('settings.billing.title') }}
        </router-link>
        <hr class="delimiter">
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'appearance-settings'}"
        >
          {{ $t('settings.appearance.title') }}
        </router-link>
        <hr class="delimiter">
        <div
          class="settings-window__menu-item settings-window__menu-item--attention"
          @click="logout"
        >
          {{ $t('settings.logout') }}
          <Icon
            class="settings-window__menu-icon account-settings-window__menu-icon"
            symbol="logout"
          />
        </div>
      </div>
    </template>
  </SettingsWindow>
</template>

<script>
import SettingsWindow from '../settings/Window';
import Icon from '../utils/Icon';
import { RESET_STORE } from '../../store/methodsTypes';

export default {
  name: 'AccountSettingsWindow',
  components: {
    SettingsWindow,
    Icon,
  },
  methods: {
    /**
     * Logouts user
     */
    logout() {
      this.$store.dispatch(RESET_STORE);
    },
  },
};
</script>

<style>
  .account-settings-window {
    &__header {
      margin-left: -62px;
    }

    &__logo {
      background-image: url("../../assets/hawk-logo.png");
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

    &__menu-icon {
      width: 18px;
      height: 18px;
    }
  }
</style>
