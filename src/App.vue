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

<style>
  @import "normalize.css";
  @import "styles/variables.css";

  /**
   * Base site styles
   */
  html {
    height: 100%;
  }

  body {
    display: flex;
    align-items: stretch;
    min-height: 100%;
    color: var(--color-text-main);
    font-size: 15px;
    font-family: Roboto, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #app {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /**
   * Base elements rules
   *
   */
  a {
    color: inherit;
    text-decoration: none;
  }

  /**
   * Cancel default list styles
   */
  ul,
  ol {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }

  /**
   * Clearfix for float elements
   */
  .clearfix:after {
    display: table;
    clear: both;
    content: "";
  }

  /**
   * Forms elements
   */
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="search"],
  input[type="url"],
  textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 11px 12px;
    color: var(--color-text-main);
    font-size: 14px;
    background: var(--color-bg-main);
    border: 1px solid #1f2230;
    border-radius: 3px;
    outline: none;

    &:focus {
      box-shadow: 0 0 0 1px var(--color-indicator-medium);
    }
  }

  .button {
    padding: 12px 35px;
    line-height: 1em;
    border: 0;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;

    &--submit {
      margin-top: 32px;
      padding: 12px;
      color: var(--color-text-main);
      font-weight: 500;
      font-size: 14.4px;
      background-color: var(--color-indicator-medium);
      border-radius: 4px;
    }
  }

  ::placeholder {
    color: var(--color-text-second);
    opacity: 0.35;
  }

  svg {
    fill: currentColor;
  }

  body .cdx-notifies {
    right: 20px;
    left: auto;
  }

  body .cdx-notify {
    font-size: 13px;
    background-color: var(--color-bg-second);
    box-shadow: 0 6px 17px -4px #0000009c;

    &__btns-wrapper {
      margin-top: 8px;
    }
  }
</style>
