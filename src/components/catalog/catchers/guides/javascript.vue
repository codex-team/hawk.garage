<template>
  <div class="guide-page">
    <GuideHeader
      class="guide-page__header"
      :background-image="jsImage"
      :github-link="repoUrl"
      catcher-name="JavaScript"
      :description="$t('components.catalog.catchers.js')"
      :readme-link="readmeUrl"
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
          <TokenBlock
            v-if="project"
            :token="project.token"
          />
        </template>
      </GuideStepBlock>
      <GuideStepBlock
        :step-number="2"
        last
      >
        <template #header>
          {{ $t('components.catalog.followGuide') }}
        </template>
        <template #content>
          <GuideSection>
            <template #header>
              {{ $t('components.catalog.installation') }}
            </template>
            <template #content>
              <p>
                Install the package:
              </p>
              <CodeBlock
                language="shell"
                copyable
              >
                $ npm install @hawk.so/javascript --save
              </CodeBlock>
              Or load it from CDN:
              <CodeBlock
                language="html"
                copyable
              >
                &lt;script
                src="https://cdn.jsdelivr.net/npm/@hawk.so/javascript@latest/dist/hawk.min.js"
                async&gt;&lt;/script&gt;
              </CodeBlock>
            </template>
          </GuideSection>
          <GuideSection>
            <template #header>
              {{ $t('components.catalog.initialization') }}
            </template>
            <template #content>
              <p>
                Import the <code>HawkCatcher</code> class and initialize it with the Integration Token:
              </p>
              <CodeBlock
                language="javascript"
                copyable
              >
                import HawkCatcher from '@hawk.so/javascript';
                <br>
                <br>
                const hawk = new HawkCatcher({
                <br>
                &nbsp;&nbsp;token: '{{ project?.token || "" }}'
                <br>
                });
              </CodeBlock>
              <p>
                Initialization settings
              </p>
              <table class="guide-page__instructions-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>token</td>
                    <td><code>string</code></td>
                    <td>require</td>
                    <td>Your project's Integration token.</td>
                  </tr>
                  <tr>
                    <td>release</td>
                    <td><code>string</code>/<code>number</code></td>
                    <td>optional</td>
                    <td>
                      Unique identifier of the release. Used for source map and commits sending.
                    </td>
                  </tr>
                  <tr>
                    <td>user</td>
                    <td>
                      <code>{id: string, name?: string, image?: string, url?: string}</code>
                    </td>
                    <td>optional</td>
                    <td>Current authenticated user.</td>
                  </tr>
                  <tr>
                    <td>context</td>
                    <td><code>object</code></td>
                    <td>optional</td>
                    <td>Any data you want to pass with every message.</td>
                  </tr>
                  <tr>
                    <td>vue</td>
                    <td><code>Vue constructor</code></td>
                    <td>optional</td>
                    <td>
                      Pass Vue constructor to set up the
                      <a href="https://github.com/codex-team/hawk.javascript/blob/master/README.md#integrate-to-vue-application">
                        Vue integration
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>disableGlobalErrorsHandling</td>
                    <td><code>boolean</code></td>
                    <td>optional</td>
                    <td>Do not initialize global errors handling.</td>
                  </tr>
                  <tr>
                    <td>beforeSend</td>
                    <td><code>function(event) => event</code></td>
                    <td>optional</td>
                    <td>
                      This method allows you to filter any data you don't want
                      sending to Hawk.
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>
                More options with details see at the Catcher's <a :href="readmeUrl">README.md</a>
              </p>
            </template>
          </GuideSection>
          <br>
          <br>
          <p>
            {{ $t('components.catalog.readmeDisclaimer') }}
          </p>
          <p>
            <UiButton
              :content="$t('components.catalog.viewReadme')"
              submit
              :href="repoUrl"
              target="_blank"
            />
          </p>
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
import jsImage from '../../../../assets/catalog/javascript/js@3x.jpg';

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
      jsImage,
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
  },
};
</script>

<style src="../../../../styles/guide-page.css"></style>
