<template>
  <div class="appearance-settings settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.appearance.title') }}
    </div>
    <LanguageSelect />
  </div>
</template>

<script>
import LanguageSelect from '../forms/LanguageSelect';

export default {
  name: 'AppearanceSettings',
  components: {
    LanguageSelect,
  },
};
</script>

<style src="../../styles/settings-window-page.css"></style>
