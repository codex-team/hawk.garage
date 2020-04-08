<template>
  <div class="projects-integrations-settings-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.integrations.title') }}
    </div>
    <div>
      {{ $t('projects.settings.integrations.projectTokenLabel') }} <b>{{ project.name }}</b>:
    </div>
    <TokenBlock
      class="projects-integrations-settings-page__token"
      :token="project.token"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Project } from '../../../types/project';
import TokenBlock from '../TokenBlock.vue';

export default Vue.extend({
  name: 'ProjectIntegrationsSettings',
  components: {
    TokenBlock,
  },
  props: {
    /**
     * The project we are working with
     */
    project: {
      type: Object as () => Project,
      required: true,
    },
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
  .projects-integrations-settings-page {
    &__token {
      margin-top: 15px;
    }
  }
</style>
