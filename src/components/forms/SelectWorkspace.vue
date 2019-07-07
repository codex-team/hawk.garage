<template>
  <fieldset class="select-workspace">
    <label class="select-workspace__label" for="selectWorkspace">SELECT WORKSPACE</label>
    <select
      name="workspace"
      id="selectWorkspace"
      class="select-workspace__select"
    >
      <option v-for="workspace in workspaces" :value="workspace.id">{{workspace.name}}</option>
    </select>
  </fieldset>
</template>

<script>
export default {
  name: 'SelectWorkspace',
  props: {
    workspaces: Array,
    required: true
  }
};
</script>

<style>

</style>
