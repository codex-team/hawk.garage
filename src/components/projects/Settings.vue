<template>
  <SettingsWindow on-close-route="../">
    <template v-slot:header>
      <div class="settings-window__header account-settings__header">
        <div class="project-settings__logo settings-window__logo" />
        <div class="project-settings__title">
          Hawk
        </div>
        <div class="project-settings__caption">
          Made by CodeX
        </div>
      </div>
    </template>

    <template v-slot:menu>
      <div>
        <router-link
          class="settings-window__menu-item"
          :to="{ name:'project-settings' }"
        >
          {{ $t('projects.settings.project.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'project-integrations'}"
        >
          {{ $t('projects.settings.integrations.title') }}
        </router-link>
      </div>
    </template>
  </SettingsWindow>
</template>

<script>
import SettingsWindow from '../settings/Window';
export default {
  name: 'ProjectSettingsWindow',
  components: {
    SettingsWindow
  }
};
</script>

<style>
  .project-settings {
    &__header {
      margin-left: -62px;
    }
    &__logo {
      background-image: url("../../assets/hawk-logo.png");
      background-position: center center;
      background-size: cover;
    }
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
