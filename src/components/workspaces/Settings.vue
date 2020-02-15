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
          v-if="isAdmin"
          class="settings-window__menu-item workspace-settings__menu-item"
          :to="{ name: 'workspace-billing' }"
        >
          {{ $t('workspaces.settings.billing.title') }}
        </router-link>
        <hr class="delimiter">
        <div
          class="settings-window__menu-item settings-window__menu-item--attention"
          @click="removeWorkspace"
        >
          {{ $t('workspaces.settings.remove') }}
          <Icon
            class="settings-window__menu-icon"
            symbol="rubbish"
          />
        </div>
      </div>
    </template>
  </SettingsWindow>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import Icon from '../utils/Icon';
import SettingsWindow from '../settings/Window';
import { FETCH_WORKSPACE, REMOVE_WORKSPACE } from '../../store/modules/workspaces/actionTypes';

export default {
  name: 'WorkspaceSettings',
  components: {
    SettingsWindow,
    EntityImage,
    Icon,
  },
  computed: {
    /**
     * Workspace id to show
     */
    workspaceId() {
      return this.$route.params.workspaceId;
    },

    /**
     * Workspace to show
     */
    workspace() {
      return this.$store.getters.getWorkspaceById(this.workspaceId);
    },

    /**
     * Is current user admin for this workspace
     */
    isAdmin() {
      if (!this.workspace.users) {
        return false;
      }

      const user = this.$store.state.user.data;

      return this.workspace.users.find(u => u.id === user.id).isAdmin;
    },
  },
  created() {
    this.$store.dispatch(FETCH_WORKSPACE, this.workspaceId);
  },
  methods: {
    /**
     * Remove current workspace
     */
    removeWorkspace() {
      this.$store.dispatch(REMOVE_WORKSPACE, this.workspaceId);
    },
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
    }
  }
</style>
