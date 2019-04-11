<template>
  <div class="home">
    <aside class="home__aside">
      <div class="home__aside-header">
        <button @click="logout">Logout</button>
      </div>
      <div class="home__workspaces">
        <div
          class="home__workspace-item"
          v-for="workspace in workspaces"
          :key="workspace.id"
        >
          {{workspace.name}}
        </div>
      </div>
    </aside>
    <div class="home__content">
      <create-workspace></create-workspace>
    </div>
  </div>
</template>

<script>

import { AUTH_LOGOUT } from '../store/actions/auth';
import CreateWorkspace from '../components/CreateWorkspace';

export default {
  name: 'Home',
  methods: {
    logout() {
      this.$store.commit(AUTH_LOGOUT);
    }
  },
  computed: {
    /**
     * @return {Array<Workspace>} - registered workspaces
     */
    workspaces() {
      return this.$store.state.workspaces.workspaces;
    }
  },
  components: {
    CreateWorkspace
  }
};

</script>

<style>
  @import "../styles/variables.css";

  .home {
    display: flex;
    min-height: 100%;

    &__aside {
      background-color: var(--color-bg-page);
      min-width: 250px;
    }

    &__content {
      width: 100%;
    }

    &__workspace-item {
      color: #fff;
    }
  }
</style>
