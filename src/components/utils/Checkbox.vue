<template>
  <input
    :id="name"
    v-model="checked"
    type="checkbox"
    class="checkbox"
  >
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    name: {
      type: String,
      required: true
    },
    checked: {
      type: Boolean
    }
  }
};
</script>

<style scoped>
  .checkbox {
    width: 28px;
    height: 28px;
    background-color: var(--color-bg-second);
    border-radius: 4px;
  }
</style>
