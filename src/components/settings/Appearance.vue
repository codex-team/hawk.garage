<template>
  <div class="appearance-settings">
    <div class="account-settings__title">
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
    LanguageSelect
  }
};
</script>
