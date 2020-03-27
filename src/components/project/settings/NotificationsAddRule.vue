<template>
  <div class="grid-form">
    <section class="grid-form__section">
      <div class="grid-form__section-name">
        Where to receive
      </div>
      <div class="grid-form__section-content">
        <section>
          <FormTextFieldset
            :label="$t('projects.settings.notifications.email')"
            name="email"
            :description="$t('projects.settings.notifications.emailDescription')"
            v-model="form.channels.email.endpoint"
            placeholder="alerts@yourteam.org"
          />
          <UiCheckbox
            v-model="form.channels.email.isEnabled"
            />
        </section>
        <section>
          <FormTextFieldset
            :label="$t('projects.settings.notifications.slack')"
            name="slack"
            :description="$t('projects.settings.notifications.slackDescription')"
            v-model="form.channels.slack.endpoint"
            placeholder="alerts@yourteam.org"
          />
          <UiCheckbox
            v-model="form.channels.slack.isEnabled"
          />
        </section>
        <section>
          <FormTextFieldset
            :label="$t('projects.settings.notifications.telegram')"
            name="telegram"
            :description="$t('projects.settings.notifications.telegramDescription')"
            v-model="form.channels.telegram.endpoint"
            placeholder="alerts@yourteam.org"
          />
          <UiCheckbox
            v-model="form.channels.telegram.isEnabled"
          />
        </section>
      </div>
    </section>
    <section class="grid-form__section">
      <div class="grid-form__section-name">
        What to receive
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FormTextFieldset from './../../forms/TextFieldset.vue';
import RadioButtonGroup from './../../forms/RadioButtonGroup.vue';
import UiCheckbox from './../../forms/UiCheckbox.vue';

export default Vue.extend({
  name: 'ProjectSettingsNotificationsAddRule',
  components: {
    FormTextFieldset,
    RadioButtonGroup,
    UiCheckbox,
  },
  data() {
    return {
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
      },
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
            flex-basis: 100%;
          }

          &:not(:last-of-type) {
            margin-bottom: 18px;
            padding-bottom: 15px;
            border-bottom: 1px solid ;
            border-bottom: 1px solid var(--color-delimiter-line);
          }
        }
      }
    }
  }
</style>
