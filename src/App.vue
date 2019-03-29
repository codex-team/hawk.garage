<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/settings">Settings</router-link>
      |
      <router-link to="/sign-up">SignUp</router-link>
    </div>
    <router-view class="rout"/>
  </div>
</template>

<script>
export default {
  name: 'app'
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
    font-family: "Lato", system-ui, sans-serif;
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
    padding: 13px 18px;
    font-size: 17px;
    font-family: inherit;
    outline: none;
    background: #fff;
    border: 1px solid var(--color-line-gray);
    box-shadow: inset 0 1px 2px 0 color(var(--color-line-gray) alpha(50%));
    border-radius: 2px;

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
    color: color(var(--color-bg-button) lightness(-60%));
    cursor: pointer;
    background-color: var(--color-bg-button);
    line-height: 1em;

    &:hover {
      background-color: color(var(--color-bg-button) lightness(-10%));
      color: color(var(--color-bg-button) lightness(-70%));
    }

    &--submit {
      background-color: var(--color-bg-submit-button);
      color: #fff;

      &:hover {
        background-color: color(var(--color-bg-submit-button) lightness(-15%));
        color: #fff;
      }
    }
  }

  ::placeholder {
    color: color(var(--color-text-form-gray) alpha(40%));
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
</style>
