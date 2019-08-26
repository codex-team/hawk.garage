<template>
  <SettingsWindow
    :logo="AccountSettingsLogo"
    :menu="AccountSettingsMenu"
    :title="AccountSettingsTitle"
    on-close-route="/"
  />
</template>

<script>
import SettingsWindow from '../settings/Window';
import AccountSettingsLogo from './Logo';
import AccountSettingsMenu from './Menu';
import AccountSettingsTitle from './Title';

export default {
  name: 'AccountSettingsWindow',
  components: {
    SettingsWindow
  },
  data() {
    return {
      AccountSettingsLogo,
      AccountSettingsMenu,
      AccountSettingsTitle
    };
  }
};
</script>
