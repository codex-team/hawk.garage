<template>
  <div class="setup-php-catcher">
    <div class="setup-php-catcher__header">
      <router-link
        class="setup-php-catcher__header-link"
        :to="{name:'add-catcher', params: {projectId: $route.params.projectId}}"
      >
        <Icon
          class="setup-php-catcher__header-link-icon"
          symbol="arrow-left"
        />
        Back to other catchers
      </router-link>
      <div class="setup-php-catcher__name-container">
        <div class="setup-php-catcher__name">
          PHP
        </div>
        <CatcherLabel class="setup-php-catcher__label" />
      </div>
      <div class="setup-php-catcher__description">
        Can be connected as standalone script or as monolog provider
      </div>
      <div class="setup-php-catcher__info">
        <div class="setup-php-catcher__source-code">
          <a href="https://github.com/codex-team/hawk.php">View source</a>
        </div>
        <div class="setup-php-catcher__readme">
          <a href="https://github.com/codex-team/hawk.php/blob/master/README.md">View README.md</a>
        </div>
        <div class="setup-php-catcher__last-version">
          Last version: 1.2.3
        </div>
      </div>
    </div>
    <div class="setup-php-catcher__instructions">
      <div class="setup-php-catcher__instructions-header">
        INSTALLATION
      </div>
      <GuideStepBlock :step-number="1">
        <template #header>
          GET AN INTEGRATION TOKEN
        </template>
        <template #content>
          Your Integration token for codex.so PHP:
          <CodeBlock>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjMyNjQ1NTd9.GTPeWVWuJwiA4xidun__FwFc0XyBBJKCUcKi79mp-uY</CodeBlock>
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
          <CodeBlock>$ composer require codex-team/hawk.php</CodeBlock>
          Next you can use module as standalone class or connect it with Monolog.
          <ul class="setup-php-catcher__link-list">
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
          Create an instance with Token at the entry point of your project.
          <CodeBlock>
            \Hawk\HawkCatcher::instance('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjMyNjQ1NTd9.GTP
          </CodeBlock>
          <h2>Enable handlers</h2>
          By default Hawk will catch everything. You can run function with no params.
          <CodeBlock>\Hawk\HawkCatcher::enableHandlers();</CodeBlock>
          It is similar to
          <CodeBlock>
            \Hawk\HawkCatcher::enableHandlers(
            true, // exceptions
            true, // errors
            true // shitdown
            );
          </CodeBlock>
          You can pass types of …
        </template>
      </GuideSection>
    </div>
  </div>
</template>

<script>
import CatcherLabel from './CatcherLabel';
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
    CatcherLabel
  }
};
</script>

<style>
  .setup-php-catcher {
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 14px;

    &__header {
      display: flex;
      flex-direction: column;
      height: 200px;
      padding: 20px;
      background: radial-gradient(circle at 63% 0, rgba(28, 35, 54, 0.72), #15171f), no-repeat center/cover url('../../../assets/catalog/php.svg');
    }

    &__header-link {
      font-size: 14px;
      line-height: 16px;
      opacity: 0.6;
    }

    &__header-link-icon {
      width: 7px;
      height: 12px;
      margin-right: 8px;
    }

    &__name-container {
      margin-top: 20px;
      display: flex;
    }

    &__name {
      /*margin-top: 20px;*/
      font-weight: bold;
      font-size: 43px;
    }

    &__description {
      margin-top: 5px;
      font-size: 15px;
      line-height: 1.2;
     }

    &__info {
      display: flex;
      margin-top: auto;
    }

    &__label {
      margin-top: 10px;
      margin-left: 20px;
    }

    &__source-code,
    &__readme,
    &__last-version {
      height: 20.5px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20.5px;
      white-space: nowrap;
    }

    &__source-code {
      padding-left: 30px;
      background: no-repeat left/ auto 100% url("../../../assets/github.svg");
    }

    &__readme {
      margin-left: 20px;
    }

    &__last-version {
      margin-left: auto;
      font-weight: normal;
    }

    &__instructions {
      padding: 40px
    }

    &__instructions-header {
      margin-bottom: 20px;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.15px;
    }

    &__link-list {
      color: var(--color-indicator-medium);

      & li {
        display: flex;
        align-items: center;
        margin-top: 15px;
        line-height: 16px;

        :last-child {
          margin-top: 0;
        }

        a {
          border-bottom: 1px dashed var(--color-indicator-medium);
        }

        &::before {
          display: inline-block;
          min-width: 4px;
          min-height: 4px;
          margin-right: 8px;
          margin-left: 8px;
          color: var(--color-indicator-medium);
          font-weight: bold;
          background-color: var(--color-indicator-medium);
          border-radius: 50%;
          content: " ";
        }
      }

    }
  }
</style>
