<template>
  <form class="create-workspace" @submit.prevent="createWorkspace">
    <div class="create-workspace__message">{{message}}</div>
    <label for="name">Workspace name</label>
    <input id="name" type="text" v-model="name">
    <button type="submit">Create</button>
  </form>
</template>

<script>
import { CREATE_WORKSPACE } from '../store/actions/workspaces';

export default {
  name: 'CreateWorkspace',
  data() {
    return {
      name: '',
      message: ''
    };
  },
  methods: {
    async createWorkspace() {
      try {
        await this.$store.dispatch(CREATE_WORKSPACE, { name: this.name });
        this.message = '';
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
      margin-bottom: 10px;
      display: block;
    }
  }
</style>
