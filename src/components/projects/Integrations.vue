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

<script>

import TokenBlock from './TokenBlock';

export default {
  name: 'ProjectIntegrationsSettings',
  components: {
    TokenBlock
  },
  computed: {
  /**
   * Current viewed project
   * @return {Project}
   */
    project() {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.getProjectById(projectId);
    }
  }
};
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
  .projects-integrations-settings-page {
    &__token {
      margin-top: 15px;
    }
  }
</style>
