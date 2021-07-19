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
            $ npm install @hawk.so/javascript --save
          </CodeBlock>
          Or
          <CodeBlock language="javascript" copyable>
            $ yarn add @hawk.so/javascript
          </CodeBlock>
          Load from CDN:
          <CodeBlock language="html" copyable>
            &lt;script
            src="https://cdn.jsdelivr.net/npm/@hawk.so/javascript@2.9.0/dist/hawk.min.js"
            async&gt;&lt;/script&gt;
          </CodeBlock>
        </template>
      </GuideStepBlock>
      <GuideSection>
        <template #header> Initialize HawkCatcher </template>
        <template #content>
          <p>
            Create HawkCatcher class instance when script will be ready and pass
            your Integration Token as follow:
          </p>
          <CodeBlock language="javascript" copyable>
            const hawk = new HawkCatcher({token: '{{ project.token }}'});
          </CodeBlock>
          Or
          <CodeBlock language="javascript" copyable>
            const hawk = new HawkCatcher('{{ project.token }}');
          </CodeBlock>
          Or
          <CodeBlock language="html" copyable>
            &lt;script
            src="https://cdn.rawgit.com/codex-team/hawk.javascript/master/hawk.js"
            onload="const hawk = new HawkCatcher({token: '{{
              project.token
            }}'})"&gt;&lt;/script&gt;
          </CodeBlock>
          Initialization settings:
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Require</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>token</td>
                <td>string</td>
                <td>require</td>
                <td>Your project's Integration Token.</td>
              </tr>
              <tr>
                <td>release</td>
                <td>string/number</td>
                <td>optional</td>
                <td>
                  Unique identifier of the release. Used for source map
                  consuming.
                </td>
              </tr>
              <tr>
                <td>user</td>
                <td>
                  {id: string, name?: string, image?: string, url?: string}
                </td>
                <td>optional</td>
                <td>Current authenticated user.</td>
              </tr>
              <tr>
                <td>context</td>
                <td>object</td>
                <td>optional</td>
                <td>Any data you want to pass with every message.</td>
              </tr>
              <tr>
                <td>vue</td>
                <td>Vue constructor</td>
                <td>optional</td>
                <td>
                  Pass Vue constructor to set up the [Vue
                  integration](#integrate-to-vue-application).
                </td>
              </tr>
              <tr>
                <td>disableGlobalErrorsHandling</td>
                <td>boolean</td>
                <td>optional</td>
                <td>Do not initialize global errors handling.</td>
              </tr>
              <tr>
                <td>beforeSend</td>
                <td>function(event) => event</td>
                <td>optional</td>
                <td>
                  This Method allows you to filter any data you don't want
                  sending to Hawk.
                </td>
              </tr>
            </tbody>
          </table>
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
            hawk.send(e);<br />
            }
          </CodeBlock>
        </template>
      </GuideSection>
    </div>
  </div>
</template>

<script>
import GuideSection from '../../GuideSection';
import GuideStepBlock from '../../GuideStepBlock';
import GuideHeader from '../../GuidePageHeader';
import TokenBlock from '../../../project/TokenBlock';
import CodeBlock from '../../../utils/CodeBlock';

export default {
  name: 'SetupJavascriptCatcher',
  components: {
    GuideStepBlock,
    GuideHeader,
    TokenBlock,
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
