<template>
  <div class="empty-state">
    <div v-if="icon || $slots.icon" class="empty-state__icon">
      <slot name="icon">
        <Icon :symbol="icon" />
      </slot>
    </div>
    <div class="empty-state__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="description || $slots.description" class="empty-state__desc">
      <slot name="description">{{ description }}</slot>
    </div>
    <div v-if="actionHref && actionText" class="empty-state__action">
      <a
        :href="actionHref"
        target="_blank"
        rel="noopener noreferrer"
      >
        <UiButton :content="actionText" small submit />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiButton from './UiButton.vue';
import Icon from './Icon.vue';

export default Vue.extend({
  name: 'EmptyState',
  components: { UiButton, Icon },
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    actionText: {
      type: String,
      default: '',
    },
    actionHref: {
      type: String,
      default: '',
    },
  },
});
</script>

<style>
.empty-state {
  text-align: center;
  padding-block: 100px;
  margin: 16px auto 0 auto;
  background: var(--color-bg-main);
  border: 1px solid var(--color-bg-second);
  border-radius: 12px;
  width: 100%;
}

.empty-state__icon {
  font-size: 28px;
  line-height: 1;
  margin-bottom: 8px;
}

.empty-state__icon svg {
  width: 28px;
  height: 28px;
}

.empty-state__title {
  color: var(--color-text-main);
  font-weight: 700;
}

.empty-state__desc {
  color: var(--color-text-second);
  margin-top: 4px;
}

.empty-state__action {
  margin-top: 14px;
}
</style>


