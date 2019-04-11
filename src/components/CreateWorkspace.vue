<template>
  <form class="create-workspace">
    <label for="name">Workspace name</label>
    <input id="name" type="text">
    <button type="submit">Create</button>
  </form>
</template>

<script>
export default {
  name: 'CreateWorkspace'
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
