<template>
  <div class="home">
    <aside class="home__aside">
      <div class="home__aside-header">
        <button @click="logout">Logout</button>
        <button @click="changeTheme">Change theme</button>
      </div>
      <div class="home__workspaces">
        <button @click="$router.push('/workspace-create')">Create workspace</button>
        <router-link
          :to="{ name: 'workspace-settings', params: { workspaceId:workspace.id } }"
          class="home__workspace-item"
          v-for="workspace in workspaces"
          :key="workspace.id"
        >
          {{workspace.name}}
        </router-link>
      </div>
    </aside>
    <div class="home__content">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>

import { AUTH_LOGOUT } from '../store/actions/auth';
import { THEME_TOGGLE } from '../store/actions/app';

export default {
  name: 'Home',
  methods: {
    logout() {
      this.$store.commit(AUTH_LOGOUT);
    },
    changeTheme() {
      this.$store.commit(THEME_TOGGLE);
    }
  },
  computed: {
    /**
     * @return {Array<Workspace>} - registered workspaces
     */
    workspaces() {
      return this.$store.state.workspaces.list;
    }
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
      display: block;
      color: #fff;
    }
  }
</style>
