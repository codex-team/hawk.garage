<template>
  <div class="modal-form">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.notifications.title') }}
    </div>

    <section class="modal-form__section">
      <div class="modal-form__section-title">
        {{ $t('projects.settings.notifications.addRule') }}
      </div>
      <AddRule
        v-if="addRuleOpened || (!rules || !rules.length)"
        @cancel="addRuleOpened = false"
      />
      <UiButton
        v-else
        :content="$t('projects.settings.notifications.addRuleToggler')"
        submit
        @click="addRuleOpened = true"
      />
    </section>

    <section class="modal-form__section">
      <div class="modal-form__section-title">
        {{ $t('projects.settings.notifications.rulesList') }}
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AddRule from './NotificationsAddRule.vue';
import { ProjectNotificationsRule, ReceiveTypes } from '@/types/project-notifications';
import UiButton from "@/components/utils/UiButton.vue";

export default Vue.extend({
  name: 'ProjectSettingsNotifications',
  components: {
    AddRule,
    UiButton,
  },
  data(): {
    rules: ProjectNotificationsRule[],
    addRuleOpened: boolean,
  } {
    return {
      rules: [
        {
          id: '123456',
          isEnabled: true,
          uidAdded: 'adaad',
          whatToReceive: ReceiveTypes.ONLY_NEW,
          including: ['codex', 'editor'],
          excluding: [ 'script error.' ],
          channels: {
            slack: {
              isEnabled: true,
              endpoint: 'https://hooks.slack.com/services/T038Y…',
            },
            telegram: {
              isEnabled: true,
              endpoint: 'https://bot.codex.so/E2V87B3X3B44…',
            },
          },
        },
      ],
      /**
       * Flag indicates Add Rule form opening state
       */
      addRuleOpened: false,
    };
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
  @import url('../../../styles/custom-properties.css');

  .modal-form {
    &__section {
      margin-bottom: 50px;

      &-title {
        @apply --ui-label;
        margin-bottom: 15px;
      }
    }
  }
</style>
