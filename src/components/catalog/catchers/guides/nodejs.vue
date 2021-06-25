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
      <div class="guide-page__instructions-header">INSTALLATION</div>
      <GuideStepBlock :step-number="1">
        <template #header> GET AN INTEGRATION TOKEN </template>
        <template #content>
          Your Integration token for <b>{{ project.name }}</b
          >:
          <TokenBlock :token="project.token" />
        </template>
      </GuideStepBlock>
      <GuideStepBlock :step-number="2" last>
        <template #header> FOLLOW THE INSTALLATION GUIDE </template>
        <template #content>
          Install package:
          <CodeBlock language="javascript" copyable>
            $ npm install @hawk.so/nodejs --save
          </CodeBlock>
          Or
          <CodeBlock language="javascript" copyable>
            $ yarn add @hawk.so/nodejs
          </CodeBlock>
        </template>
      </GuideStepBlock>
      <GuideSection>
        <template #header> Initialize HawkCatcher </template>
        <template #content>
          <p>Add HawkCatcher module as follow:</p>
          <CodeBlock language="javascript" copyable>
            const HawkCatcher = require('@hawk.so/nodejs').default;
          </CodeBlock>
          Or
          <CodeBlock language="javascript" copyable>
            import HawkCatcher from '@hawk.so/nodejs';
          </CodeBlock>
          <p>
            Now initialize HawkCatcher in the entry file of your project by
            passing a project token:
          </p>
          <CodeBlock language="javascript" copyable>
            const HAWK_TOKEN = '{{ project.token }}';<br />
            HawkCatcher.init(HAWK_TOKEN);
          </CodeBlock>
          <p>
            Now, Just write your code and HawkCatcher adds listeners for
            uncaughtException and unhandledRejection itself.
          </p>
        </template>
      </GuideSection>
      <GuideSection>
        <template #header> Send Exceptions Manually </template>
        <template #content>
          <p>
            After initializing you can catch exceptions manually in try-catch
            with .send() method follows:
          </p>
          <CodeBlock language="javascript" copyable>
            try { <br />
            throw new Error('My First Hawk Error');<br />
            } catch (e) { <br />
            HawkCatcher.send(e);<br />
            }
          </CodeBlock>
        </template>
      </GuideSection>
    </div>
  </div>
</template>

<script>
import GuideSection from "../../GuideSection";
import GuideHeader from '../../GuidePageHeader';
import GuideStepBlock from '../../GuideStepBlock';
import TokenBlock from '../../../project/TokenBlock';
import CodeBlock from '../../../utils/CodeBlock';

export default {
  name: 'SetupPhpCatcher',
  components: {
    GuideStepBlock,
    TokenBlock,
    GuideHeader,
    CodeBlock,
    GuideSection
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
