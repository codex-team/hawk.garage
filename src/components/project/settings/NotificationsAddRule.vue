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
            v-model="form.channels.telegram.endpoint"
            :label="$t('projects.settings.notifications.telegram')"
            :description="$t('projects.settings.notifications.telegramDescription')"
            :hidden="!form.channels.telegram.isEnabled"
            :is-invalid="!isChannelEndpointValid('telegram') && endpointShouldBeValidated.telegram"
            placeholder="https://notify.bot.codex.so/u/XXXXXXXXXXXX"
          />
          <UiCheckbox
            v-model="form.channels.telegram.isEnabled"
          />
        </section>
        <section>
          <FormTextFieldset
            v-model="form.channels.email.endpoint"
            :label="$t('projects.settings.notifications.email')"
            :description="$t('projects.settings.notifications.emailDescription')"
            :hidden="!form.channels.email.isEnabled"
            :is-invalid="!isChannelEndpointValid('email') && endpointShouldBeValidated.email"
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
            :is-invalid="!isChannelEndpointValid('slack') && endpointShouldBeValidated.slack"
            placeholder="Webhook App endpoint"
          />
          <UiCheckbox
            v-model="form.channels.slack.isEnabled"
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
          >
            <template #description="{ option }">
              <div
                v-if="option.id === receiveTypesEnum.SEEN_MORE"
                class="grid-form__seen-more-description"
              >
                <TextFieldset
                  v-model="selectedThreshold"
                  type="number"
                  :required="true"
                  :is-invalid="!/^[1-9]\d*$/.test(selectedThreshold.toString())"
                  :label="$t('common.threshold')"
                  :need-image="false"
                />
                <CustomSelect
                  v-model="selectedThresholdPeriod"
                  :label="$t('common.thresholdPeriod')"
                  :options="seenMoreThresholdPeriod"
                  :need-image="false"
                />
              </div>
              <div v-else>
                {{ option.description }}
              </div>
            </template>
          </RadioButtonGroup>
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
      ref="submitButton"
      :content="submitButtonText"
      :is-loading="isWaitingForResponse"
      submit
    />
    <UiButton
      :content="$t('projects.settings.notifications.addRuleCancel')"
      @click.prevent="$emit('cancel')"
    />
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import FormTextFieldset from './../../forms/TextFieldset.vue';
import RadioButtonGroup, { RadioButtonGroupItem } from './../../forms/RadioButtonGroup.vue';
import UiCheckbox from './../../forms/UiCheckbox.vue';
import UiButton, { UiButtonComponent } from './../../utils/UiButton.vue';
import { ProjectNotificationsRule, ReceiveTypes, thresholdPeriodToMilliseconds, millisecondsToThresholdPeriod } from '@/types/project-notifications';
import {
  ProjectNotificationsAddRulePayload,
  ProjectNotificationsUpdateRulePayload
} from '@/types/project-notifications-mutations';
import { deepMerge } from '@/utils';
import { ADD_NOTIFICATIONS_RULE, UPDATE_NOTIFICATIONS_RULE } from '@/store/modules/projects/actionTypes';
import notifier from 'codex-notifier';
import CustomSelect from '@/components/forms/CustomSelect.vue';
import CustomSelectOption from '@/types/customSelectOption';
import TextFieldset from './../../forms/TextFieldset.vue';

export default Vue.extend({
  name: 'ProjectSettingsNotificationsAddRule',
  components: {
    FormTextFieldset,
    RadioButtonGroup,
    UiCheckbox,
    CustomSelect,
    UiButton,
    TextFieldset,
  },
  props: {
    /**
     * In which project rule is creating
     */
    projectId: {
      type: String,
      required: true,
    },

    /**
     * Rule under editing
     */
    rule: {
      type: Object as () => ProjectNotificationsRule,
      default: undefined,
    },
  },
  data(): {
    form: ProjectNotificationsAddRulePayload,
    receiveTypes: RadioButtonGroupItem[],
    isFormInvalid: boolean,
    isWaitingForResponse: boolean,
    seenMoreThresholdPeriod: CustomSelectOption[],
    receiveTypesEnum: typeof ReceiveTypes,
    selectedThreshold: string,
    selectedThresholdPeriod: CustomSelectOption,
    /**
     * Object that represents displaying of the validation state of each endpoint
     */
    endpointShouldBeValidated: {
      /**
       * Flag that represents, if validation state of the telegram endpoint should be displayed in textfield state
       */
      telegram: boolean,

      /**
       * Flag that represents, if validation state of the slack endpoint should be displayed in textfield state
       */
      slack: boolean,

      /**
       * Flag that represents, if validation state of the email endpoint should be displayed in textfield state
       */
      email: boolean,
    },
    } {
    const selectedThreshold = '100';
    const selectedThresholdPeriod: CustomSelectOption = {
      id: 'hour',
      name: this.$t('common.hour') as string,
      value: 'hour',
    };

    return {
      /**
       * Form filling state
       */
      form: {
        projectId: this.projectId,
        channels: {
          telegram: {
            endpoint: '',
            isEnabled: true,
          },
          email: {
            endpoint: '',
            isEnabled: false,
          },
          slack: {
            endpoint: '',
            isEnabled: false,
          },
        },
        threshold: parseInt(selectedThreshold),
        thresholdPeriod: thresholdPeriodToMilliseconds.get(selectedThresholdPeriod.id),
        whatToReceive: ReceiveTypes.SEEN_MORE,
        including: [],
        excluding: [],
      },
      receiveTypesEnum: ReceiveTypes,
      seenMoreThresholdPeriod: [ {
        id: 'minute',
        value: 'minute',
        name: this.$t('common.minute') as string,
      },
      {
        id: 'hour',
        value: 'hour',
        name: this.$t('common.hour') as string,
      },
      {
        id: 'day',
        value: 'day',
        name: this.$t('common.day') as string,
      },
      {
        id: 'week',
        value: 'week',
        name: this.$t('common.week') as string,
      } ],
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
          id: ReceiveTypes.SEEN_MORE,
          label: this.$t('projects.settings.notifications.receiveSeenMoreLabel') as string,
        },
      ],

      /**
       * When true, invalid fields will be highlighted
       */
      isFormInvalid: false,

      /**
       * Used to show loader and block multiple sending
       */
      isWaitingForResponse: false,

      selectedThreshold,
      selectedThresholdPeriod,
      endpointShouldBeValidated: {
        telegram: false,
        slack: false,
        email: false
      },
    };
  },
  computed: {
    /**
     * Text on submit button: Add or Update
     */
    submitButtonText(): string {
      if (!this.rule) {
        return this.$t('projects.settings.notifications.addRuleSubmit') as string;
      }

      return this.$t('projects.settings.notifications.updateRuleSubmit') as string;
    },
  },
  watch: {
    selectedThreshold: {
      handler: function (value: string): void {
        this.$set(this.form, 'threshold', parseInt(value));
      },
    },
    selectedThresholdPeriod: {
      handler: function (value: CustomSelectOption): void {
        if (!value) {
          return;
        }
        this.$set(this.form, 'thresholdPeriod', thresholdPeriodToMilliseconds.get(value.id));
      },
    },
  },
  created(): void {
    /**
     * When we merge this.form and this.rule (on rule editing),
     * we will get extra 'id' property, that will be removed immediately
     * (see below)
     */
    interface FormFilledByRule extends ProjectNotificationsAddRulePayload {
      id: string;
    }

    /**
     * We does not store unfilled channels in DB, so we need to fill it by default values
     */
    if (this.rule) {
      const mergedRule = deepMerge(this.form, this.rule) as FormFilledByRule;

      /**
       * Set selecteable fields to currently saved un rule
       * If nothing is stored in rule, set default values
       */
      if (this.rule.threshold !== undefined && this.rule.threshold !== null) {
        this.$data.selectedThreshold = this.rule.threshold.toString();
      }
      this.$data.selectedThresholdPeriod = this.seenMoreThresholdPeriod.find((option) => {
        return option.id === millisecondsToThresholdPeriod.get(this.rule.thresholdPeriod ?? 3600000);
      }) as CustomSelectOption;

      /**
       * The type of this.form (ProjectNotificationsAddRulePayload)
       * should not not contain rule id
       */
      delete mergedRule.id;

      this.form = mergedRule;
    }
  },
  methods: {
    /**
     * Fill 'including' property with array from splitted input string
     *
     * @param value - user input string with commas
     */
    splitIncludingFilters(value: string): void {
      this.form.including = value.split(',');
    },

    /**
     * Fill 'excluding' property with array from splitted input string
     *
     * @param value - user input string with commas
     */
    splitExcludingFilters(value: string): void {
      this.form.excluding = value.split(',');
    },

    /**
     * Saves form
     */
    async save(): Promise<void> {
      if (this.isWaitingForResponse) {
        return;
      }

      const isValid = this.validateForm();

      if (!isValid) {
        this.isFormInvalid = true;
        (this.$refs.submitButton as unknown as UiButtonComponent).shake();

        return;
      }

      this.isWaitingForResponse = true;

      try {
        let successMessage;

        if (!this.rule) {
          /**
           * Adding new rule
           */
          await this.$store.dispatch(ADD_NOTIFICATIONS_RULE, this.form);

          successMessage = this.$t('projects.settings.notifications.addRuleSuccessMessage');
        } else {
          /**
           * Updating the rule
           */
          await this.$store.dispatch(UPDATE_NOTIFICATIONS_RULE, Object.assign({
            ruleId: this.rule.id,
          }, this.form) as ProjectNotificationsUpdateRulePayload);

          successMessage = this.$t('projects.settings.notifications.updateRuleSuccessMessage');
        }

        this.isWaitingForResponse = false;
        this.isFormInvalid = false;

        this.$emit('success');

        notifier.show({
          message: successMessage as string,
          style: 'success',
          time: 3000,
        });
      } catch (e) {
        notifier.show({
          message: e.message,
          style: 'error',
          time: 10000,
        });

        console.error(e);

        this.isWaitingForResponse = false;
        (this.$refs.submitButton as unknown as UiButtonComponent).shake();
      }
    },

    /**
     * Validate saved form fields and return valid-status
     */
    validateForm(): boolean {
      this.endpointShouldBeValidated.telegram = this.form.channels.telegram!.isEnabled;
      this.endpointShouldBeValidated.slack = this.form.channels.slack!.isEnabled;
      this.endpointShouldBeValidated.email = this.form.channels.email!.isEnabled;

      let allChannelsValid = true;

      /**
       * Check channels
       */
      const notEmptyChannels = Object.keys(this.form.channels).forEach((channelName: string) => {
        if (!this.isChannelEndpointValid(channelName)) {
          allChannelsValid = false;
        }
      });

      const isThresholdInvalid = !/^[1-9]\d*$/.test(this.selectedThreshold);

      if (!allChannelsValid || isThresholdInvalid) {
        return false;
      }

      return true;
    },

    /**
     * Return true if passed channel endpoint is filled correctly
     *
     * @param channelName - key of this.form.channels object
     */
    isChannelEndpointValid(channelName: string): boolean {
      const channel = this.form.channels[channelName];

      switch (true) {
        case (channelName === 'email' && this.form.channels.email!.isEnabled):
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.form.channels.email!.endpoint)) {
            return false;
          }

          return true;

        case (channelName === 'slack' && this.form.channels.slack!.isEnabled):
          if (!/^https:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/.test(this.form.channels.slack!.endpoint)) {
            return false;
          }

          return true;

        case (channelName === 'telegram' && this.form.channels.telegram!.isEnabled):
          if (!/^https:\/\/notify\.bot\.codex\.so\/u\/[A-Za-z0-9]+$/.test(this.form.channels.telegram!.endpoint)) {
            return false;
          }

          return true;
      }

      return true;
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

    &__seen-more-description {
      display: flex;
      gap: 10px;

      .form-fieldset__label, .custom-select__label {
        font-weight: 400;
        font-size: 13px;
        text-transform: none;
      }

      .custom-select {
        min-width: 100px;
      }
    }
  }
</style>
