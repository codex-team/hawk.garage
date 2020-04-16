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
          :to="{ name:'project-settings-general' }"
        >
          {{ $t('projects.settings.general.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'project-settings-integrations'}"
        >
          {{ $t('projects.settings.integrations.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item"
          :to="{ name: 'project-settings-notifications'}"
        >
          {{ $t('projects.settings.notifications.title') }}
        </router-link>
        <hr class="delimiter">
        <div
          @click="removeProject"
          class="settings-window__menu-item settings-window__menu-item--attention"
        >
          {{ $t('projects.settings.remove') }}
          <Icon
            class="settings-window__menu-icon"
            symbol="rubbish"
          />
        </div>
      </div>
    </template>

    <template v-slot:content>
      <router-view
        v-if="project"
        :project="project"
      />
    </template>
  </SettingsWindow>
</template>

<script lang="ts">
import Vue from 'vue';
import SettingsWindow from '../../settings/Window.vue';
import Icon from '@/components/utils/Icon.vue';
import { Project } from '../../../types/project';

export default Vue.extend({
  name: 'ProjectSettingsWindow',
  components: {
    SettingsWindow,
    Icon,
  },
  computed: {
    /**
     * Current viewed project
     * @return {Project}
     */
    project(): Project {
      return this.$store.getters.getProjectById(this.$route.params.projectId);
    },
  },
});
</script>

<style>
  .project-settings {
    &__header {
      margin-left: -62px;
    }
    &__logo {
      background-image: url("../../../assets/hawk-logo.png");
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
