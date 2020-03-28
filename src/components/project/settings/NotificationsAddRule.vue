<template>
  <div class="grid-form">
    <section class="grid-form__section">
      <div class="grid-form__section-name">
        {{ $t('projects.settings.notifications.sectionWhereToReceive') }}
      </div>
      <div class="grid-form__section-content">
        <section>
          <FormTextFieldset
            v-model="form.channels.email.endpoint"
            :label="$t('projects.settings.notifications.email')"
            :description="$t('projects.settings.notifications.emailDescription')"
            :hidden="!form.channels.email.isEnabled"
            placeholder="alerts@yourteam.org"
            name="email"
          />
          <UiCheckbox
            v-model="form.channels.email.isEnabled"
            />
        </section>
        <section>
          <FormTextFieldset
            v-model="form.channels.slack.endpoint"
            :label="$t('projects.settings.notifications.slack')"
            :description="$t('projects.settings.notifications.slackDescription')"
            :hidden="!form.channels.slack.isEnabled"
            placeholder="Webhook App endpoint"
            name="slack"
          />
          <UiCheckbox
            v-model="form.channels.slack.isEnabled"
          />
        </section>
        <section>
          <FormTextFieldset
            v-model="form.channels.telegram.endpoint"
            :label="$t('projects.settings.notifications.telegram')"
            :description="$t('projects.settings.notifications.telegramDescription')"
            :hidden="!form.channels.telegram.isEnabled"
            placeholder="@codex_bot endpoint"
            name="telegram"
          />
          <UiCheckbox
            v-model="form.channels.telegram.isEnabled"
          />
        </section>
      </div>
    </section>
    <section class="grid-form__section">
      <div class="grid-form__section-name">
        {{ $t('projects.settings.notifications.sectionWhatToReceive') }}
      </div>
      <div class="grid-form__section-content">
        <section>
          <RadioButtonGroup
            name="receiveType"
            :options="receiveTypes"
            v-model="form.receiveType"
          />
        </section>
      </div>
    </section>
    <section class="grid-form__section">
      <div class="grid-form__section-name">
        {{ $t('projects.settings.notifications.sectionCustomFilters') }}
      </div>
      <div class="grid-form__section-content">
        <section>
          <FormTextFieldset
            v-model="form.filters.including"
            :label="$t('projects.settings.notifications.includingWordsLabel')"
            :description="$t('projects.settings.notifications.includingWordsDescription')"
            placeholder="codex, editor"
            name="email"
          />
        </section>
        <section>
          <FormTextFieldset
            v-model="form.filters.excluding"
            :label="$t('projects.settings.notifications.excludingWordsLabel')"
            :description="$t('projects.settings.notifications.excludingWordsDescription')"
            placeholder="chunk. unknow"
            name="slack"
          />
        </section>
      </div>
    </section>
    <UiButton
      :content="$t('projects.settings.notifications.addRuleSubmit')"
      submit
    />
    <UiButton
      :content="$t('projects.settings.notifications.addRuleCancel')"
      @click="$emit('cancel')"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FormTextFieldset from './../../forms/TextFieldset.vue';
import RadioButtonGroup from './../../forms/RadioButtonGroup.vue';
import UiCheckbox from './../../forms/UiCheckbox.vue';
import UiButton from './../../utils/UiButton.vue';

export default Vue.extend({
  name: 'ProjectSettingsNotificationsAddRule',
  components: {
    FormTextFieldset,
    RadioButtonGroup,
    UiCheckbox,
    UiButton,
  },
  data() {
    return {
      /**
       * Form filling state
       */
      form: {
        channels: {
          email: {
            endpoint: null,
            isEnabled: true,
          },
          slack: {
            endpoint: null,
            isEnabled: false,
          },
          telegram: {
            endpoint: null,
            isEnabled: false,
          },
        },
        receiveType: 'all',
        filters: {
          including: null,
          excluding: null,
        },
      },
      /**
       * Available options of 'What to receive'
       */
      receiveTypes: [
        {
          id: 'all',
          label: this.$t('projects.settings.notifications.receiveNewLabel'),
          description: this.$t('projects.settings.notifications.receiveNewDescription'),
        },
        {
          id: 'onlyNew',
          label: this.$t('projects.settings.notifications.receiveAllLabel'),
          description: this.$t('projects.settings.notifications.receiveAllDescription'),
        },
      ],
    };
  },
});
</script>

<style>
  .grid-form {
    &__section {
      &:not(:first-of-type){
        margin-top: 50px;
      }

      display: flex;

      &-name {
        width: 120px;
        margin-right: 60px;
        font-size: 15px;
        letter-spacing: 0.19px;
      }

      &-content {
        section {
          display: flex;
          width: 370px;

          .radio-button-group {
            margin-top: -15px;
            margin-bottom: -15px;
            flex-basis: 100%;
          }

          .form-fieldset {
            flex-grow: 2;

            .input {
              max-width: 280px;
            }
          }

          &:not(:last-of-type) {
            margin-bottom: 18px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--color-delimiter-line);
          }

          .ui-checkbox {
            margin-top: 3px;
          }
        }
      }
    }

    .ui-button {
      margin-top: 30px;
      margin-right: 20px;
    }
  }
</style>
