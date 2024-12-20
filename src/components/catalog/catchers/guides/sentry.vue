<template>
  <div class="guide-page">
    <GuideHeader
      class="guide-page__header"
      :background-image="
        require('../../../../assets/catalog/sentry.svg')
      "
      catcher-name="Sentry"
      :badge="'external'"
      :description="$t('components.catalog.migrationFromSentryDescription')"
    />
    <div class="guide-page__instructions">
      <div class="guide-page__instructions-header">
        {{ $t('components.catalog.installation') }}
      </div>
      <GuideStepBlock :step-number="1">
        <template #header>
          {{ $t('components.catalog.getDSN') }}
        </template>
        <template #content>
          {{ $t('components.catalog.hereIsDSN') }}
          <TokenBlock :token="computedDSN" />
        </template>
      </GuideStepBlock>
      <GuideStepBlock
        :step-number="2"
        last
      >
        <template #header>
          {{ $t('components.catalog.useDSN') }}
        </template>
        <template #content>
          {{ $t('components.catalog.useDSNText') }}
        </template>
      </GuideStepBlock>
    </div>
  </div>
</template>

<script>
import GuideSection from '../../GuideSection';
import GuideStepBlock from '../../GuideStepBlock';
import GuideHeader from '../../GuidePageHeader';
import TokenBlock from '../../../project/TokenBlock';
import CodeBlock from '../../../utils/CodeBlock';
import UiButton from '../../../utils/UiButton';
import { getSentryDSN } from '../../../../utils';

export default {
  name: 'SetupJavascriptCatcher',
  components: {
    GuideStepBlock,
    GuideHeader,
    TokenBlock,
    CodeBlock,
    GuideSection,
    UiButton,
  },
  data() {
    return {
      repoUrl: 'https://github.com/codex-team/hawk.javascript',
      readmeUrl: 'https://github.com/codex-team/hawk.javascript/blob/master/README.md',
    };
  },
  computed: {
    /**
     * Current viewed project
     *
     * @returns {Project}
     */
    project() {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.getProjectById(projectId);
    },

    computedDSN() {
      if (!this.project || !this.project.token) {
        return '';
      }

      return getSentryDSN(this.project.token);
    },
  },
};
</script>

<style src="../../../../styles/guide-page.css"></style>
