<template>
  <form class="form">
    <label for="name">Workspace name</label>
    <input type="text" id="name" v-model="name">
    <button class="button" @click="deleteWorkspace">Delete workspace</button>
  </form>
</template>

<script>

import { DELETE_WORKSPACE } from '../../store/actions/workspaces';

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
      await this.$store.dispatch(DELETE_WORKSPACE, this.workspaceId);
      this.$router.push('/');
    }
  }
};
</script>

<style>
  .form {
    margin: 10px;
  }
</style>
