<template>
  <div>
    <div class="account-settings__title">
      Hawk
    </div>
    <div class="accounts-settings__caption">
      Made by CodeX
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountSettingsTitle'
};
</script>

<style scoped>
  .account-settings {
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
