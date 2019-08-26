<template>
  <div class="account-settings__logo" />
</template>

<script>
  export default {
    name: 'SettingsLogo'
  };
</script>

<style scoped>
  .account-settings {
    &__logo {
      float: left;
      width: 42px;
      height: 42px;
      margin-right: 20px;
      background-image: url("../../assets/hawk-logo.png");
      background-position: center center;
      background-size: cover;
    }
  }
</style>
