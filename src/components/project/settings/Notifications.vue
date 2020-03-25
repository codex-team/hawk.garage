<template>
  <div class="modal-form">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.notifications.title') }}
    </div>

    <section class="modal-form__section">
      <div class="modal-form__section-title">
        {{ $t('projects.settings.notifications.addRule') }}
      </div>
      <AddRule />
    </section>

    <section class="modal-form__section">
      <div class="modal-form__section-title">
        {{ $t('projects.settings.notifications.rulesList') }}
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AddRule from './NotificationsAddRule.vue';

export default Vue.extend({
  name: 'ProjectSettingsNotifications',
  components: {
    AddRule,
  }
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
  @import url('../../../styles/custom-properties.css');

  .modal-form {
    &__section {
      margin-bottom: 50px;

      &-title {
        @apply --ui-label;
        margin-bottom: 15px;
      }
    }
  }
</style>
