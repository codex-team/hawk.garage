<template>
  <div class="guide-page">
    <GuideHeader
      class="guide-page__header"
      :background-image="require('../../../../assets/catalog/nodejs.svg')"
      github-link="https://github.com/codex-team/hawk.nodejs"
      catcher-name="Javascript"
      description="Track errors from your backend application written on JavaScript"
      readme-link="https://github.com/codex-team/hawk.nodejs/blob/master/README.md"
      last-version="2.0"
    />
    <div class="guide-page__instructions">
      <div class="guide-page__instructions-header">
        INSTALLATION
      </div>
      <GuideStepBlock :step-number="1">
        <template #header>
          GET AN INTEGRATION TOKEN
        </template>
        <template #content>
          Your Integration token for <b>{{ project.name }}</b
          >:
          <TokenBlock :token="project.token" />
        </template>
      </GuideStepBlock>
      <GuideStepBlock :step-number="2" last>
        <template #header>
          FOLLOW THE INSTALLATION GUIDE
        </template>
        <template #content>
          Install package:
          <CodeBlock language="js" copyable>
            $ npm install @hawk.so/nodejs --save
          </CodeBlock>
          <CodeBlock language="js" copyable>
            $ yarn add @hawk.so/nodejs
          </CodeBlock>
          Initialize HawkCatcher:
          <CodeBlock language="js" copyable>
            const HawkCatcher = require('@hawk.so/nodejs').default;
          </CodeBlock>
          Or
          <CodeBlock language="js" copyable>
            import HawkCatcher from '@hawk.so/nodejs';
          </CodeBlock>
          Initialize HawkCatcher in the entry file of your project by passing a
          project token:
          <CodeBlock language="js" copyable>
            HawkCatcher.init('{{ project.token }}');
          </CodeBlock>
        </template>
      </GuideStepBlock>
    </div>
  </div>
</template>

<script>
import GuideHeader from "../../GuidePageHeader";
import GuideStepBlock from "../../GuideStepBlock";
import TokenBlock from "../../../project/TokenBlock";
import CodeBlock from "../../../utils/CodeBlock";

export default {
  name: "SetupPhpCatcher",
  components: {
    GuideStepBlock,
    TokenBlock,
    GuideHeader,
    CodeBlock
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
    }
  }
};
</script>

<style src="../../../../styles/guide-page.css"></style>
