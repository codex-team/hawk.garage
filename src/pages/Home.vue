<template>
  <div class="home">
    <aside class="home__aside">
      <div class="home__aside-header">
        <button @click="logout">Logout</button>
      </div>
      <div class="home__workspaces">
        <button
          @click="$router.push('/workspace-create')"
        >
          Create workspace
        </button>
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
import * as consts from '@/constants/LocalStorageKeys';

import { AUTH_LOGOUT } from '../store/actions/auth';

export default {
  name: 'Home',
  data() {
    return {
      projects: []
    };
  },
  methods: {
    loadProjects() {
      let tmpProjects;
      // @todo wait for api

      let data = {
        projects: ['PROECT1', 'PROJECT2', 'ETC']
      };

      if (navigator.onLine) {
        this.projects = this.projects.concat(data.projects);
        localStorage.setItem(consts.PROJECTS_KEY, JSON.stringify(data.projects));
      } else {
        try {
          tmpProjects = JSON.parse(localStorage.getItem(consts.PROJECTS_KEY));
        } catch (err) {
          tmpProjects = [];
        }

        this.projects = this.projects.concat(tmpProjects);
      }
    },
    logout() {
      this.$store.commit(AUTH_LOGOUT);
    }
  },
  computed: {
    /**
     * @return {Array<Workspace>} - registered workspaces
     */
    workspaces() {
      return this.$store.state.workspaces.list;
    } },
  beforeMount() {
    this.loadProjects();
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
