<template>
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
      :to="{ name: 'home'}"
    >
      {{ $t('settings.billing.title') }}
    </router-link>
    <hr class="settings-window__menu-delimiter">
    <router-link
      class="settings-window__menu-item"
      :to="{ name: 'appearance-settings'}"
    >
      {{ $t('settings.appearance.title') }}
    </router-link>
    <hr class="settings-window__menu-delimiter">
    <div
      class="settings-window__menu-item settings-window__menu-item--attention"
      @click="logout"
    >
      {{ $t('settings.logout') }}
    </div>
  </div>
</template>

<script>
import { RESET_STORE } from '../../store/methodsTypes';

export default {
  name: 'AccountSettingsMenu',
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

<style scoped>

</style>
