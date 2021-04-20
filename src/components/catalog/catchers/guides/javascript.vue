<template>
  <div class="guide-page">
    <GuideHeader
      class="guide-page__header"
      :background-image="
        require('../../../../assets/catalog/javascript/js@3x.jpg')
      "
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
            $ npm install @hawk.so/javascript --save
          </CodeBlock>
          <CodeBlock language="js" copyable>
            $ yarn add @hawk.so/javascript
          </CodeBlock>
          Import HawkCatcher:
          <CodeBlock language="js" copyable>
            import HawkCatcher from '@hawk.so/javascript';
          </CodeBlock>
          Load from CDN:
          <CodeBlock language="js" copyable>
            &lt;script
            src="https://cdn.jsdelivr.net/npm/@hawk.so/javascript@2.9.0/dist/hawk.min.js"
            async&gt;&lt;/script&gt;
          </CodeBlock>
          Create HawkCatcher class instance when script will be ready and pass
          your Integration Token:
          <CodeBlock language="js" copyable>
            const hawk = new HawkCatcher({token: '{{ project.token }}'});
          </CodeBlock>
          Or
          <CodeBlock language="js" copyable>
            const hawk = new HawkCatcher('{{ project.token }}');
          </CodeBlock>
          Or
          <CodeBlock language="js" copyable>
            &lt;script
            src="https://cdn.jsdelivr.net/npm/@hawk.so/javascript@2.9.0/dist/hawk.min.js"
            onload="const hawk = new HawkCatcher({token: '{{
              project.token
            }}'})"&gt;&lt;/script&gt;
          </CodeBlock>
        </template>
      </GuideStepBlock>
    </div>
  </div>
</template>

<script>
import GuideStepBlock from "../../GuideStepBlock";
import GuideHeader from "../../GuidePageHeader";
import TokenBlock from "../../../project/TokenBlock";
import CodeBlock from "../../../utils/CodeBlock";

export default {
  name: "SetupJavascriptCatcher",
  components: {
    GuideStepBlock,
    GuideHeader,
    TokenBlock,
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
