<template>
  <SettingsWindow on-close-route="/">
    <template v-slot:logo>
      <AccountSettingsLogo />
    </template>
    <template v-slot:title>
      <AccountSettingsTitle />
    </template>
    <template v-slot:menu>
      <AccountSettingsMenu />
    </template>
  </SettingsWindow>
</template>

<script>
import SettingsWindow from '../settings/Window';
import AccountSettingsLogo from './Logo';
import AccountSettingsMenu from './Menu';
import AccountSettingsTitle from './Title';

export default {
  name: 'AccountSettingsWindow',
  components: {
    AccountSettingsMenu,
    AccountSettingsTitle,
    AccountSettingsLogo,
    SettingsWindow
  }
};
</script>
