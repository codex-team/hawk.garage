<template>
  <div class="viewed-by__users">
    <Icon
      class="viewed-by__eye-icon"
      symbol="eye"
    />
    <div class="viewed-by__users-avatar" />
    <div class="viewed-by__users-avatar" />
    <div class="viewed-by__users-avatar" />
    <span class="viewed-by__users-count">+17</span>
    <span class="viewed-by__assignee-text">{{ $t('event.viewedBy.assignee') }}</span>
    <div class="viewed-by__assignee-icons-bg">
      <div class="viewed-by__assignee-icon-bg">
        <Icon
          class="viewed-by__assignee-icon"
          symbol="assignee"
        />
      </div>
      <Icon
        class="viewed-by__assignee-arrow-down"
        symbol="arrow-down"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from './Icon.vue';

export default Vue.extend({
  name: 'ViewedBy',
  components: {
    Icon,
  },
});
</script>

<style>
  .viewed-by {
    &__users {
      display: flex;
      align-items: center;
      font-weight: 500;

      &-avatar {
        width: 14px;
        height: 14px;
        margin-right: 6px;
        background-color: var(--color-bg-second);
        border-radius: 5px;
      }

      &-count {
        margin-right: 30px;
        font-size: 12px;
        opacity: 0.6;
      }
    }

    &__eye-icon {
      width: 12px;
      height: 8px;
      margin-right: 6px;
      opacity: 0.6;
    }

    &__assignee {

      &-icons-bg {
        display: flex;
        align-items: center;
        padding: 4px 9px 4px 4px;
        background-color: var(--color-bg-main);
        border-radius: 7px;
      }

      &-icon-bg {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-right: 5px;
        background-color: var(--color-bg-second);
        border-radius: 5px;
      }

      &-text {
        margin-right: 10px;
        font-size: 14px;
        opacity: 0.6;
      }

      &-icon {
        width: 14px;
        height: 14px;
        opacity: 0.6;
      }

      &-arrow-down {
        width: 12px;
        height: 12px;
        opacity: 0.6;
      }
    }
  }
</style>
