<template>
  <div class="appearance-settings settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.appearance.title') }}
    </div>
    <AppearanceLanguage />
  </div>
</template>

<script>
import AppearanceLanguage from './AppearanceLanguage';

export default {
  name: 'AppearanceSettings',
  components: {
    AppearanceLanguage,
  },
};
</script>

<style src="../../../styles/settings-window-page.css"></style>
