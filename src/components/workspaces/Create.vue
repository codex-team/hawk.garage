<template>
  <form class="create-workspace" @submit.prevent="createWorkspace">
    <div class="create-workspace__message">{{message}}</div>

    <label for="name">Workspace name</label>
    <input id="name" type="text" v-model="name">

    <label for="description">Workspace description</label>
    <input id="description" type="text" v-model="description">

    <label for="image">Workspace image</label>
    <input id="image" type="text" placeholder="Enter image link" v-model="image">

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
      description: '',
      image: '',
      message: ''
    };
  },
  methods: {
    /**
     * Creates new workspace
     */
    async createWorkspace() {
      try {
        const workspaceInfo = {
          name: this.name,
          description: this.description,
          image: this.image
        };

        const createdWorkspace = await this.$store.dispatch(CREATE_WORKSPACE, workspaceInfo);

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
