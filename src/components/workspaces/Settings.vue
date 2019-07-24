<template>
  <form class="settings-form">
    <label for="name">Workspace name</label>
    <input
      id="name"
      v-model="name"
      type="text"
    >
    <button
      class="button"
      @click="deleteWorkspace"
    >
      Delete workspace
    </button>
  </form>
</template>

<script>

import { REMOVE_WORKSPACE } from '../../store/modules/workspaces/actionTypes';

export default {
  name: 'WorkspaceSettings',
  data() {
    const workspaceId = this.$route.params.workspaceId;

    const workspace = this.$store.state.workspaces.list.find(element => element.id === workspaceId);

    return {
      workspaceId,
      name: workspace.name
    };
  },
  methods: {
    /**
     * Deletes workspace
     */
    async deleteWorkspace() {
      await this.$store.dispatch(REMOVE_WORKSPACE, this.workspaceId);
      this.$router.push('/');
    }
  }
};
</script>

<style>
  .settings-form {
    margin: 10px;
  }
</style>
