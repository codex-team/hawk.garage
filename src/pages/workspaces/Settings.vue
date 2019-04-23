<template>
  <div>
    <form @submit.prevent="changeSettings">
      <label for="name">Workspace name</label>
      <input type="text" id="name" >
      <button>Remove workspace</button>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  methods: {
    changeSettings() {

    }
  }
};
</script>

<style>

</style>
