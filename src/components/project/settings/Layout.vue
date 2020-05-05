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
        <hr
          v-if="isAdmin"
          class="delimiter"
        >
        <div
          v-if="isAdmin"
          class="settings-window__menu-item settings-window__menu-item--attention"
          @click="removeProject"
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
import { REMOVE_PROJECT } from '@/store/modules/projects/actionTypes';
import notifier from 'codex-notifier';

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

    /**
     * Is user admin in workspace with this project
     */
    isAdmin(): boolean {
      const workspace = this.$store.getters.getWorkspaceByProjectId(this.$route.params.projectId);

      return workspace ? this.$store.getters.isCurrentUserAdmin(workspace.id) : false;
    },
  },
  methods: {
    /**
     * Remove current project
     */
    async removeProject() {
      if (!window.confirm(this.$i18n.t('projects.settings.removeConfirmation').toString())) {
        return;
      }
      try {
        await this.$store.dispatch(REMOVE_PROJECT, this.project!.id);
        this.$router.push({ name: 'home' });
        notifier.show({
          message: this.$i18n.t('projects.settings.removeSuccess').toString(),
          style: 'success',
          time: 10000,
        });
      } catch {
        notifier.show({
          message: this.$i18n.t('projects.settings.removeError').toString(),
          style: 'error',
          time: 10000,
        });
      }
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
