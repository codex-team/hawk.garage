<template>
  <form class="create-workspace" @submit.prevent="createWorkspace">
    <div class="create-workspace__message">{{message}}</div>
    <label for="name">Workspace name</label>
    <input id="name" type="text" v-model="name">
    <button type="submit">Create</button>
  </form>
</template>

<script>
import { CREATE_WORKSPACE } from '../../store/actions/workspaces';

export default {
  name: 'CreateWorkspace',
  data() {
    return {
      name: '',
      message: ''
    };
  },
  methods: {
    /**
     * Creates new workspace
     */
    async createWorkspace() {
      try {
        const createdWorkspace = await this.$store.dispatch(CREATE_WORKSPACE, { name: this.name });

        this.$router.push({ name: 'workspace-settings', params: { workspaceId: createdWorkspace.id } });
      } catch (e) {
        this.message = e;
      }
    }
  }
};
</script>

<style>
  .create-workspace {
    margin: 50px;

    > * {
      display: block;
      margin-bottom: 10px;
    }
  }
</style>
