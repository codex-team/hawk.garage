<template>
  <div class="guide-page">
    <GuideHeader
      class="guide-page__header"
      :background-image="require('../../../../assets/catalog/javascript/js@3x.jpg')"
      github-link="https://github.com/codex-team/hawk.javascript"
      catcher-name="Javascript"
      description="Advanced client catcher with errors bunching"
      readme-link="https://github.com/codex-team/hawk.javascript/blob/master/README.md"
      last-version="2.0"
    />
    <div class="guide-page__instructions">
      <div class="guide-page__instructions-header">
        INSTALLATION
      </div>
      <GuideStepBlock
        :step-number="1"
        last
      >
        <template #header>
          GET AN INTEGRATION TOKEN
        </template>
        <template #content>
          Your Integration token for <b>{{ project.name }}</b>:
          <TokenBlock
            :token="project.token"
          />
        </template>
      </GuideStepBlock>
    </div>
  </div>
</template>

<script>
import GuideStepBlock from '../../GuideStepBlock';
import GuideHeader from '../../GuidePageHeader';
import TokenBlock from '../../../projects/TokenBlock';

export default {
  name: 'SetupPhpCatcher',
  components: {
    GuideStepBlock,
    GuideHeader,
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

<style src="../../../../styles/guide-page.css"></style>
