<template>
  <div id="app" :class="[themeClass]">
    <router-view/>
  </div>
</template>

<script>
import * as api from './api';
import { REFRESH_TOKENS } from './store/actions/auth';
import { RESET_STORE } from './store/actions';
import notifier from 'codex-notifier';
import eventBus from './eventBus';

export default {
  name: 'app',
  computed: {
    /**
     * Returns classname according to the theme name
     * @return {string}
     */
    themeClass() {
      return `app--theme--${this.$store.state.app.theme}`;
    }
  },

  /**
   * Vue hook. Called synchronously after the instance is created
   */
  created() {
    /**
     * Configure API
     */
    api.setAuthToken(this.$store.state.auth.accessToken);
    api.eventsHandlers.onTokenExpired = async () => (await this.$store.dispatch(REFRESH_TOKENS)).accessToken;
    api.eventsHandlers.onAuthError = () => this.$store.dispatch(RESET_STORE);

    /**
     * Setup watching on auth state
     */
    this.$store.watch(
      state => state.auth.accessToken,
      accessToken => {
        if (!accessToken) this.$router.push('/login');
        api.setAuthToken(accessToken);
      }
    );

    /**
     * Connect to the event bus
     */
    eventBus.$on('serviceWorkerUpdated', () => {
      notifier.show({
        message: 'New version is available',
        type: 'confirm',
        okText: 'Refresh',
        cancelText: 'Close',
        okHandler: () => window.location.reload(),
        time: 10000
      });
    });
  }
};
</script>

<style src="./styles/base.css"></style>

<style>
  #app {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
  }
</style>
