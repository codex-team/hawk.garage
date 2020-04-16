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
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: var(--color-text-second);

    &__icon {
      display: block;
      width: 30px;
      height: 55px;
      margin-bottom: 15px;
    }
  }
</style>
