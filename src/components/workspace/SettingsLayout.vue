<template>
  <SettingsWindow on-close-route="/">
    <template v-slot:header>
      <div class="settings-window__header workspace-settings__header" v-if="workspace">
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
      <div v-if="workspace">
        <router-link
          class="settings-window__menu-item workspace-settings__menu-item"
          :to="{ name: 'workspace-settings-main', params: {workspaceId: workspace.id} }"
        >
          {{ $t('workspaces.settings.workspace.title') }}
        </router-link>
        <router-link
          class="settings-window__menu-item workspace-settings__menu-item"
          :to="{ name: 'workspace-settings-team', params: {workspaceId: workspace.id} }"
        >
          {{ $t('workspaces.settings.team.title') }}
        </router-link>
        <router-link
          v-if="isAdmin"
          class="settings-window__menu-item workspace-settings__menu-item"
          :to="{ name: 'workspace-settings-billing' }"
        >
          {{ $t('workspaces.settings.billing.title') }}
        </router-link>
      </div>
    </template>

    <template v-slot:content>
      <router-view :workspace="workspace" v-if="workspace" />
    </template>
  </SettingsWindow>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import SettingsWindow from '../settings/Window';
import { FETCH_WORKSPACE } from '../../store/modules/workspaces/actionTypes';

export default {
  name: 'WorkspaceSettingsLayout',
  components: {
    SettingsWindow,
    EntityImage,
  },
  data() {
    return {
      /**
       * Workspace which settings we are viewing
       */
      workspace: null,
    };
  },
  computed: {
    isAdmin() {
      if (!this.workspace.users) {
        return false;
      }

      const user = this.$store.state.user.data;
      const member = this.workspace.users.find(u => u.id === user.id);

      return member ? member.isAdmin : false;
    },
  },
  async created() {
    const workspaceId = this.$route.params.workspaceId;
    const workspaceLoaded = this.$store.getters.getWorkspaceById(workspaceId);

    if (workspaceLoaded) {
      this.workspace = workspaceLoaded;
    } else {
      this.workspace = await this.$store.dispatch(FETCH_WORKSPACE, workspaceId);
    }
  },
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
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__menu-item {
      width: 200px;
      margin-left: 0;
    }
  }
</style>
