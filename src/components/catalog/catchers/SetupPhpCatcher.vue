<template>
  <div class="guide-page">
    <div class="guide-page__header">
      <router-link
        class="guide-page__header-link"
        :to="{name:'add-catcher', params: {projectId: $route.params.projectId}}"
      >
        <Icon
          class="guide-page__header-link-icon"
          symbol="arrow-left"
        />
        Back to other catchers
      </router-link>
      <div class="guide-page__name-container">
        <div class="guide-page__name">
          PHP
        </div>
        <CatalogItemLabel
          class="guide-page__label"
          item-type="catcher"
        />
      </div>
      <div class="guide-page__description">
        Can be connected as standalone script or as monolog provider
      </div>
      <div class="guide-page__info">
        <div class="guide-page__source-code">
          <a href="https://github.com/codex-team/hawk.php">View source</a>
        </div>
        <div class="guide-page__readme">
          <a href="https://github.com/codex-team/hawk.php/blob/master/README.md">View README.md</a>
        </div>
        <div class="guide-page__last-version">
          Last version: 1.2.3
        </div>
      </div>
    </div>
    <div class="guide-page__instructions">
      <div class="guide-page__instructions-header">
        INSTALLATION
      </div>
      <GuideStepBlock :step-number="1">
        <template #header>
          GET AN INTEGRATION TOKEN
        </template>
        <template #content>
          Your Integration token for codex.so PHP:
          <CodeBlock
            language="plaintext"
            one-line
          >
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjMyNjQ1NTd9.GTPeWVWuJwiA4xidun__FwFc0XyBBJKCUcKi79mp-uY
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
          <CodeBlock class="php">
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
          <CodeBlock>
            \Hawk\HawkCatcher::instance('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjMyNjQ1NTd9.GTP');
          </CodeBlock>
          <h3>Enable handlers</h3>
          <p>
            By default Hawk will catch everything. You can run function with no params.
          </p>
          <CodeBlock language="php">
            <code>\Hawk\HawkCatcher::enableHandlers();</code>
          </CodeBlock>
          <p>
            It is similar to
          </p>
          <CodeBlock language="php">
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
import CatalogItemLabel from '../ItemLabel';
import GuideStepBlock from '../GuideStepBlock';
import GuideSection from '../GuideSection';
import CodeBlock from '../../utils/CodeBlock';
import Icon from '../../utils/Icon';

export default {
  name: 'SetupPhpCatcher',
  components: {
    Icon,
    GuideStepBlock,
    CodeBlock,
    GuideSection,
    CatalogItemLabel
  }
};
</script>

<style src="../../../styles/guide-page.css"></style>
