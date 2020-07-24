<template>
  <div
    class="project-placeholder"
  >
    <Icon
      class="project-placeholder__icon"
      symbol="plant"
    />
    {{ $t('projects.placeholder') }}
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--color-text-second);
    font-weight: bold;
    font-size: 14px;

    &__icon {
      display: block;
      width: 30px;
      height: 55px;
      margin-bottom: 15px;
    }
  }
</style>
