<template>
  <div class="guide-page">
    <GuideHeader
      class="guide-page__header"
      :background-image="sentryImage"
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
          <TokenBlock
            v-if="computedDSN"
            :token="computedDSN"
          />
          <template v-else>
            <p style="color: var(--color-indicator-critical);">
              {{ $t('projects.settings.integrations.sentryDSNTextNoToken') }}
            </p>
            <UiButton
              v-if="project"
              :href="`/project/${project.id}/settings/integrations`"
              :content="$t('projects.settings.general.title')"
            />
          </template>
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
import GuideStepBlock from '../../GuideStepBlock';
import GuideHeader from '../../GuidePageHeader';
import TokenBlock from '../../../project/TokenBlock';
import { getSentryDSN } from '../../../../utils';
import UiButton from '../../../utils/UiButton';
import sentryImage from '../../../../assets/catalog/sentry.svg';

export default {
  name: 'SetupJavascriptCatcher',
  components: {
    GuideStepBlock,
    GuideHeader,
    TokenBlock,
    UiButton,
  },
  data() {
    return {
      sentryImage,
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
