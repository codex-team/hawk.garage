<template>
  <div class="home">
    <button @click="logout">Logout</button>
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
