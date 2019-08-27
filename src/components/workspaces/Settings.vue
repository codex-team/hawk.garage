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
          :to="{ name: 'workspace-settings', params: {workspaceId: workspace.id} }"
        >
          {{ $t('workspaces.settings.workspace.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item workspace-settings__menu-item"
          :to="{ name: 'workspace-team', params: {workspaceId: workspace.id} }"
        >
          {{ $t('workspaces.settings.team.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item workspace-settings__menu-item"
          :to="{ name: 'home' }"
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
  data() {
    const workspaceId = this.$route.params.workspaceId;

    const workspace = this.$store.state.workspaces.list.find(element => element.id === workspaceId);

    return {
      workspace
    };
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
