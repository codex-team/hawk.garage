<template>
  <form
    class="grid-form"
    @submit.prevent="save"
  >
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
            v-model="form.whatToReceive"
            name="whatToReceive"
            :options="receiveTypes"
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
            :value="form.including ? form.including.join(','): ''"
            :label="$t('projects.settings.notifications.includingWordsLabel')"
            :description="$t('projects.settings.notifications.includingWordsDescription')"
            placeholder="codex, editor"
            @input="splitIncludingFilters"
          />
        </section>
        <section>
          <FormTextFieldset
            :value="form.excluding ? form.excluding.join(','): ''"
            :label="$t('projects.settings.notifications.excludingWordsLabel')"
            :description="$t('projects.settings.notifications.excludingWordsDescription')"
            placeholder="chunk. unknow"
            @input="splitExcludingFilters"
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
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import FormTextFieldset from './../../forms/TextFieldset.vue';
import RadioButtonGroup, { RadioButtonGroupItem } from './../../forms/RadioButtonGroup.vue';
import UiCheckbox from './../../forms/UiCheckbox.vue';
import UiButton from './../../utils/UiButton.vue';
import { ProjectNotificationsRule, ReceiveTypes } from '@/types/project-notifications';
import { deepMerge } from '@/utils';

export default Vue.extend({
  name: 'ProjectSettingsNotificationsAddRule',
  components: {
    FormTextFieldset,
    RadioButtonGroup,
    UiCheckbox,
    UiButton,
  },
  props: {
    /**
     * Rule under editing
     */
    rule: {
      type: Object as () => ProjectNotificationsRule,
      default: undefined,
    },
  },
  data(): {
    form: ProjectNotificationsRule,
    receiveTypes: RadioButtonGroupItem[],
    } {
    return {
      /**
       * Form filling state
       */
      form: {
        channels: {
          email: {
            endpoint: '',
            isEnabled: true,
          },
          slack: {
            endpoint: '',
            isEnabled: false,
          },
          telegram: {
            endpoint: '',
            isEnabled: false,
          },
        },
        whatToReceive: ReceiveTypes.ONLY_NEW,
        including: [],
        excluding: [],
      },
      /**
       * Available options of 'What to receive'
       */
      receiveTypes: [
        {
          id: ReceiveTypes.ONLY_NEW,
          label: this.$t('projects.settings.notifications.receiveNewLabel') as string,
          description: this.$t('projects.settings.notifications.receiveNewDescription') as string,
        },
        {
          id: ReceiveTypes.ALL,
          label: this.$t('projects.settings.notifications.receiveAllLabel') as string,
          description: this.$t('projects.settings.notifications.receiveAllDescription') as string,
        },
      ],
    };
  },
  created(): void {
    /**
     * We does not store unfilled channels in DB, so we need to fill it by default values
     */
    if (this.rule) {
      this.form = deepMerge(this.form, this.rule);
    }
  },
  methods: {
    /**
     * Fill 'including' property with array from splitted input string
     * @param value - user input string with commas
     */
    splitIncludingFilters(value: string): void {
      this.form.including = value.split(',');
    },

    /**
     * Fill 'excluding' property with array from splitted input string
     * @param value - user input string with commas
     */
    splitExcludingFilters(value: string): void {
      this.form.excluding = value.split(',');
    },

    /**
     * Saves form
     */
    save(): void {
      console.log('save:', this.form);
    },
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
            flex-basis: 100%;
            margin-top: -15px;
            margin-bottom: -15px;
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
