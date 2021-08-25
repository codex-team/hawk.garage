<template>
  <div class="guide-page">
    <GuideHeader
      class="guide-page__header"
      :background-image="catcher.cover"
      :github-link="catcher.repoUrl"
      :catcher-name="catcher.name"
      :description="catcher.description"
      :readme-link="catcher.readmeUrl"
    />
    <div class="guide-page__instructions">
      <div class="guide-page__instructions-header">
        {{ $t('components.catalog.installation') }}
      </div>
      <GuideStepBlock :step-number="1">
        <template #header>
          {{ $t('components.catalog.getToken') }}
        </template>
        <template #content>
          {{ $t('components.catalog.hereIsToken') }}
          <TokenBlock :token="project.token" />
        </template>
      </GuideStepBlock>
      <GuideStepBlock :step-number="2" last>
        <template #header>
          {{ $t('components.catalog.followGuide') }}
        </template>
        <template #content>
          {{ $t('components.catalog.readmeDisclaimer') }}
          <p>
            <UiButton
              :content="$t('components.catalog.viewReadme')"
              submit
              :href="catcher.repoUrl"
              target="_blank"
            />
          </p>
        </template>
      </GuideStepBlock>
    </div>
  </div>
</template>

<script>
import GuideStepBlock from "../../GuideStepBlock";
import GuideSection from "../../GuideSection";
import CodeBlock from "../../../utils/CodeBlock";
import GuideHeader from "../../GuidePageHeader";
import TokenBlock from "../../../project/TokenBlock";
import UiButton from '../../../utils/UiButton';

export default {
  name: "SetupPhpCatcher",
  components: {
    GuideStepBlock,
    CodeBlock,
    GuideSection,
    TokenBlock,
    GuideHeader,
    UiButton
  },
  data(){
    return {
      catchers: [
        {
          route: 'php',
          name: 'PHP',
          cover: require('../../../../assets/catalog/php.svg'),
          description: this.$t('components.catalog.catchers.php'),
          repoUrl: 'https://github.com/codex-team/hawk.php',
          readmeUrl: 'https://github.com/codex-team/hawk.php/blob/master/README.md',
        },
        {
          route: 'nodejs',
          name: 'Node.js',
          cover: require('../../../../assets/catalog/nodejs.svg'),
          description: this.$t('components.catalog.catchers.nodejs'),
          repoUrl: 'https://github.com/codex-team/hawk.nodejs',
          readmeUrl: 'https://github.com/codex-team/hawk.nodejs/blob/master/README.md',
        },
        {
          route: 'python',
          name: 'Python',
          cover: require('../../../../assets/catalog/python.svg'),
          description: this.$t('components.catalog.catchers.python'),
          repoUrl: 'https://github.com/codex-team/hawk.python',
          readmeUrl: 'https://github.com/codex-team/hawk.python/blob/master/README.md',
        },
        {
          route: 'go',
          name: 'Go',
          cover: require('../../../../assets/catalog/go/go@3x.jpg'),
          description: this.$t('components.catalog.catchers.go'),
          repoUrl: 'https://github.com/codex-team/hawk.go',
          readmeUrl: 'https://github.com/codex-team/hawk.go/blob/master/README.md',
        }
      ],
    }
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

    /**
     * Viewed catcher info
     */
    catcher(){
      return this.catchers.find(catcher => catcher.route === this.$route.params.page)
    }
  }
};
</script>

<style src="../../../../styles/guide-page.css"></style>
