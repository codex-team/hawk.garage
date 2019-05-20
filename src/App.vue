<template>
  <div id="app" :class="[themeClass]">
    <router-view/>
  </div>
</template>

<script>
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
  }
};
</script>

<style>
  @import "normalize.css";
  @import "styles/variables.css";

  /**
  * Base site styles
  * =================================
  */
  html {
    height: 100%;
  }

  body {
    font-family: Roboto, system-ui, sans-serif;
    align-items: stretch;
    min-height: 100%;
    display: flex;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 15px;
  }

  #app {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  /**
  *
  * Base elements rules
  * ================================================
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
  * Forms elements
  * =========================================
  */
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="search"],
  input[type="url"],
  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    font-size: 14px;
    outline: none;
    color: var(--color-text-second);
    background: var(--color-bg-main);
    border: 1px solid #1f2230;
    border-radius: 3px;

    &:focus {
      border-color: #93d2f3;
      box-shadow: inset 0 1px 2px 0 rgba(129, 218, 255, 0.41);
    }
  }

  .button {
    user-select: none;
    border-radius: 2px;
    border: 0;
    padding: 12px 24px;
    color: color-mod(var(--color-bg-button) lightness(-60%));
    cursor: pointer;
    background-color: var(--color-bg-button);
    line-height: 1em;

    &:hover {
      background-color: color-mod(var(--color-bg-button) lightness(-10%));
      color: color-mod(var(--color-bg-button) lightness(-70%));
    }

    &--submit {
      color: #fff;

      width: 128px;
      height: 40px;
      border-radius: 16px;
      background-image: linear-gradient(to bottom, #4bb96f, #2da66a);
      &:hover {
        background-color: color-mod(var(--color-bg-submit-button) lightness(-15%));
        color: #fff;
      }
    }
  }

  ::placeholder {
    color: color-mod(var(--color-text-form-gray) alpha(40%));
  }
</style>
