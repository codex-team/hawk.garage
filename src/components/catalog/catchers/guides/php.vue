<template>
  <div class="guide-page">
    <GuideHeader
      class="guide-page__header"
      :background-image="require('../../../../assets/catalog/php.svg')"
      github-link="https://github.com/codex-team/hawk.php"
      catcher-name="PHP"
      description="Can be connected as standalone script or as monolog provider"
      readme-link="https://github.com/codex-team/hawk.php/blob/master/README.md"
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
          Your Integration token for <b>{{ project.name }}</b>:
          <CodeBlock
            language="plaintext"
            one-line
            class="guide-page__token"
            copyable
          >
            {{ project.token }}
          </CodeBlock>
        </template>
      </GuideStepBlock>
      <GuideStepBlock
        :step-number="2"
        last
      >
        <template #header>
          FOLLOW THE INSTALLATION GUIDE
        </template>
        <template #content>
          Install module with Composer:
          <CodeBlock
            class="php"
            copyable
          >
            $ composer require codex-team/hawk.php
          </CodeBlock>
          Next you can use module as standalone class or connect it with Monolog.
          <ul class="guide-page__link-list">
            <li><a href="#standalone-class">Use as standalone class</a></li>
            <li><a href="#monolog-handler">Use as Monolog handler</a></li>
          </ul>
        </template>
      </GuideStepBlock>
      <GuideSection>
        <template #header>
          Using as standalone class
        </template>
        <template #content>
          <p>
            Create an instance with Token at the entry point of your project.
          </p>
          <CodeBlock
            one-line
            copyable
          >
            \Hawk\HawkCatcher::instance('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjMyNjQ1NTd9.GTP');
          </CodeBlock>
          <h3>Enable handlers</h3>
          <p>
            By default Hawk will catch everything. You can run function with no params.
          </p>
          <CodeBlock
            language="php"
            copyable
          >
            <code>\Hawk\HawkCatcher::enableHandlers();</code>
          </CodeBlock>
          <p>
            It is similar to
          </p>
          <CodeBlock
            language="php"
            copyable
          >
            <pre>\Hawk\HawkCatcher::enableHandlers(
  true, // exceptions
  true, // errors
  true // shitdown
);</pre>
          </CodeBlock>
          <p>
            You can pass types of …
          </p>
        </template>
      </GuideSection>
    </div>
  </div>
</template>

<script>
import GuideStepBlock from '../../GuideStepBlock';
import GuideSection from '../../GuideSection';
import CodeBlock from '../../../utils/CodeBlock';
import GuideHeader from '../../GuidePageHeader';

export default {
  name: 'SetupPhpCatcher',
  components: {
    GuideStepBlock,
    CodeBlock,
    GuideSection,
    GuideHeader
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
