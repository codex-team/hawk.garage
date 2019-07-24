<template>
  <div class="setup-php-catcher">
    <div class="setup-php-catcher__header">
      <CatcherLabel />
      <div class="setup-php-catcher__name">
        PHP
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
      <InstructionBlock :step-number="1">
        <template #header>
          Get an Integration token
        </template>
        <template #content>
          Your Integration token for codex.so PHP:
          <CodeBlock>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjMyNjQ1NTd9.GTPeWVWuJwiA4xidun__FwFc0XyBBJKCUcKi79mp-uY</CodeBlock>
        </template>
      </InstructionBlock>
      <InstructionBlock :step-number="2" last>
        <template #header>
          Follow the installation guide
        </template>
        <template #content>
          Install module with Composer:
          <CodeBlock>$ composer require codex-team/hawk.php</CodeBlock>
        </template>
      </InstructionBlock>
    </div>
  </div>
</template>

<script>
import CatcherLabel from './CatcherLabel';
import InstructionBlock from './InstructionBlock'
import CodeBlock from '../utils/CodeBlock';
export default {
  name: 'SetupPhpCatcher',
  components: {
    CatcherLabel,
    InstructionBlock,
    CodeBlock
  }
};
</script>

<style>
  .setup-php-catcher {
    &__header {
      height: 200px;
      padding: 20px;
      background: radial-gradient(circle at 63% 0, rgba(28, 35, 54, 0.72), #15171f), no-repeat center/cover url('../../assets/catalog/php.svg');
    }

    &__name {
      margin-top: 10px;
      font-weight: bold;
      font-size: 43px;
    }

    &__description {
      margin-top: 10px;
      font-size: 15px;
      line-height: 1.2;
    }

    &__info {
      display: flex;
      margin-top: 40px;
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
      background: no-repeat  left/ auto 100%  url("../../assets/github.svg");
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
  }
</style>
