<template>
  <SettingsWindow on-close-route="/">
    <template v-slot:header>
      <div class="settings-window__header account-settings__header">
        <div class="account-settings__logo settings-window__logo" />
        <div class="account-settings__title">
          Hawk
        </div>
        <div class="account-settings__caption">
          Made by CodeX
        </div>
      </div>
    </template>

    <template v-slot:menu>
      <div>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'account-general'}"
        >
          {{ $t('settings.account.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'account-notifications'}"
        >
          {{ $t('settings.notifications.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'account-billing'}"
        >
          {{ $t('settings.billing.title') }}
        </router-link>

        <hr class="delimiter">

        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'account-appearance'}"
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
            class="settings-window__menu-icon"
            symbol="logout"
          />
        </div>
      </div>
    </template>

    <template v-slot:content>
      <router-view
        v-if="user"
        :user="user"
      />
    </template>
  </SettingsWindow>
</template>

<script lang="ts">
import Vue from 'vue';
import SettingsWindow from '../../settings/Window.vue';
import Icon from '@/components/utils/Icon.vue';
import { RESET_STORE } from '@/store/methodsTypes';
import { User } from '@/types/user';

export default Vue.extend({
  name: 'AccountSettingsLayout',
  components: {
    SettingsWindow,
    Icon,
  },
  computed: {
    /**
     * Current authenticated user
     */
    user(): User {
      return this.$store.state.user.data;
    },
  },
  methods: {
    /**
     * Logouts user
     */
    logout() {
      this.$store.dispatch(RESET_STORE);
    },
  },
});

</script>

<style>
  .account-settings {
    &__header {
      margin-left: -62px;
    }

    &__logo {
      background-image: url("../../../assets/hawk-logo.png");
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
