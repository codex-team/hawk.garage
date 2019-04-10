<template>
  <div class="home">
    <aside class="home__aside">
      <div class="home__aside-header">
      <button @click="logout">Logout</button>
      </div>
    </aside>
    <div class="home__content">
      Garage content
    </div>
  </div>
</template>

<script>

import { AUTH_LOGOUT } from '../store/actions/auth';

export default {
  name: 'Home',
  methods: {
    logout() {
      this.$store.commit(AUTH_LOGOUT);
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
      min-height: 100%;

    }
    &__content {
      width: 100%;
      min-height: 100%;
    }
  }
</style>
