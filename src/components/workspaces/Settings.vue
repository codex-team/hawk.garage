<template>
  <SettingsWindow on-close-route="/">
    <template v-slot:header>
      <div class="settings-window__header workspace-settings__header">
        <EntityImage
          :id="workspace.id"
          class="workspace-settings__logo settings-window__logo"
          :title="workspace.name"
          :name="workspace.name"
          :image="workspace.image"
        />
        <div class="workspace-settings__title">
          {{ workspace.name }}
        </div>
      </div>
    </template>

    <template v-slot:menu>
      <div>
        <router-link
          class="settings-window__menu-item workspace-settings__menu-item"
          :to="{ name: 'workspace-settings', params: {workspaceId: workspace.id}}"
        >
          {{ $t('workspaces.settings.workspace.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item workspace-settings__menu-item"
          :to="{ name: 'home' }"
        >
          {{ $t('workspaces.settings.team.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item workspace-settings__menu-item"
          :to="{ name: 'workspace-billing' }"
        >
          {{ $t('workspaces.settings.billing.title') }}
        </router-link>
      </div>
    </template>
  </SettingsWindow>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import SettingsWindow from '../settings/Window';

export default {
  name: 'WorkspaceSettings',
  components: { SettingsWindow, EntityImage },
  computed: {
    workspace() {
      const workspaceId = this.$route.params.workspaceId;

      return this.$store.getters.getWorkspaceById(workspaceId);
    }
  }
};
</script>

<style>
  .workspace-settings {
    &__header {
      margin-bottom: 40px;
    }

    &__logo {
      width: 26px;
      height: 26px;
      margin-right: 10px;
      line-height: 26px;
      border-radius: 4px;
    }

    &__title {
      color: var(--color-text-main);
      font-weight: 500;
      font-size: 15px;
      line-height: 26px;
    }

    &__menu-item {
      width: 200px;
      margin-left: 0;
    }
  }
</style>
