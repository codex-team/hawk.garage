<template>
  <div class="success-message__wrap">
    <div class="success-message">
      <span class="success-message__icon">
        💌
      </span>
      <span class="success-message__text">
        {{ $t('authPages.recoverPasswordSuccessMessage') }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
/**
 * Component implements message of success password recover
 */
export default class SuccessMessage extends Vue {}
</script>

<style>
.success-message {
  display: inline-block;
  padding: 13px 15px;
  font-size: 14px;
  border: solid 1px var(--color-border);
  border-radius: 3px;

  &__wrap {
    margin-bottom: 30px;
    text-align: center;
  }

  &__icon {
    margin-right: 10px;
    font-size: 13px;
  }
}
</style>
