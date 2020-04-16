<template>
  <div
    class="project-placeholder"
  >
    <Icon
      class="project-placeholder__icon"
      symbol="plant"
    />
    No project selected
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../utils/Icon.vue';

export default Vue.extend({
  name: 'ProjectPlaceholder',
  components: {
    Icon,
  },
});
</script>

<style>
  .project-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    opacity: .6;

    &__icon {
      display: block;
      width: 30px;
      height: 55px;
      margin-bottom: 15px;
    }
  }
</style>
