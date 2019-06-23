<template>
  <div id="app" :class="[themeClass]">
    <router-view/>
  </div>
</template>

<script>
import { FETCH_WORKSPACES } from './store/actions/workspaces';
import * as api from './api';

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
    api.setAuthToken(this.$store.state.auth.accessToken);

    this.$store.watch(
      state => state.auth.accessToken,
      accessToken => api.setAuthToken(accessToken)
    );

    this.$store.dispatch(FETCH_WORKSPACES);
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
      height: 40px;

      color: var(--color-text-main);

      background-image: linear-gradient(to bottom, #18a96c, #048058);
      border-radius: 13px;
      box-shadow: 0 17px 17px -9px #01a95e4d;

      &:hover {
        color: var(--color-text-main);

        background-image: linear-gradient(to bottom, #04b168, #00734e);
      }
    }
  }

  ::placeholder {
    color: var(--color-text-second);

    opacity: 0.35;
  }

  svg {
    fill: currentColor;
  }
</style>
