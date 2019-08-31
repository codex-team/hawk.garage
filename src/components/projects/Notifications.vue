<template>
  <div class="project-notifications settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.notifications.title') }}
    </div>

    <div
      v-if="common.actionType !== -1"
      class="form"
    >
      <div class="form-text">
        Common
      </div>

      <div class="form-section">
        <label class="label form-section__label">{{ $t('projects.settings.notifications.channels') }}</label>
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.email.title') }}</div>
          <div class="form-section__row-main ">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.email.notificationsOn') }}
            </div>
            <FormTextFieldset
              v-model="common.settings.email.value"
              label="email"
              @input="showSubmitButton=true"
            />
          </div>
          <input
            v-model="common.settings.email.enabled"
            type="checkbox"
            class="checkbox"
            @change="save()"
          >
        </div>
        <hr class="form-section__hr">
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.slack.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.slack.alerts') }} <u>{{
                $t('projects.settings.notifications.slack.webhookApp') }}</u>
            </div>
            <FormTextFieldset
              v-model="common.settings.slack.value"
              :label="$t('projects.settings.notifications.slack.webhookUrl')"
              @input="showSubmitButton=true"
            />
          </div>

          <input
            v-model="common.settings.slack.enabled"
            type="checkbox"
            class="checkbox"
            @change="save()"
          >
        </div>
        <hr class="form-section__hr">
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.telegram.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.telegram.alertsBy') }}
            </div>
            <FormTextFieldset
              v-model=" common.settings.tg.value"
              :label="$t('projects.settings.notifications.telegram.webhookUrl')"
              @input="showSubmitButton=true"
            />
          </div>
          <input
            v-model="common.settings.tg.enabled"
            type="checkbox"
            class="checkbox"
            @change="save()"
          >
        </div>
      </div>
      <div class="form-section">
        <label class="label form-section__label">{{ $t('projects.settings.notifications.actions.title') }}</label>
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.actions.new.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.actions.new.firstOccurrence') }}
            </div>
          </div>
          <input
            type="radio"
            class="radio"
            name="recieveModeCommon"
            :checked="common.actionType === actionTypes.ONLY_NEW"
            @input.prevent="changeRadioCommon(actionTypes.ONLY_NEW)"
          >
        </div>
        <hr class="form-section__hr">
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.actions.all.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.actions.all.allEvents') }}
            </div>
          </div>
          <input
            type="radio"
            class="radio"
            name="recieveModeCommon"
            :checked="common.actionType === actionTypes.ALL"
            @input.prevent="changeRadioCommon(actionTypes.ALL)"
          >
        </div>
        <hr class="form-section__hr">
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.actions.including.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.actions.including.onlyIncluding') }}
            </div>
            <FormTextFieldset
              v-model="common.words"
              :label="$t('projects.settings.notifications.actions.including.words')"
              @input="showSubmitButton=true"
            />
          </div>
          <input
            type="radio"
            name="recieveModeCommon"
            class="radio"
            :checked="common.actionType === actionTypes.INCLUDING"
            @input.prevent="changeRadioCommon(actionTypes.INCLUDING)"
          >
        </div>
      </div>
    </div>

    <div class="form">
      <div class="form-text">
        Personal
      </div>
      <div class="form-section">
        <label class="label form-section__label">{{ $t('projects.settings.notifications.channels') }}</label>
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.email.title') }}</div>
          <div class="form-section__row-main ">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.email.notificationsOn') }}
            </div>
            <FormTextFieldset
              v-model="personal.settings.email.value"
              label="email"
              @input="showSubmitButton=true"
            />
          </div>
          <input
            v-model="personal.settings.email.enabled"
            type="checkbox"
            class="checkbox"
            @change="save()"
          >
        </div>
        <hr class="form-section__hr">
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.slack.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.slack.alerts') }} <u>{{
                $t('projects.settings.notifications.slack.webhookApp') }}</u>
            </div>
            <FormTextFieldset
              v-model="personal.settings.slack.value"
              :label="$t('projects.settings.notifications.slack.webhookUrl')"
              @input="showSubmitButton=true"
            />
          </div>

          <input
            v-model="personal.settings.slack.enabled"
            type="checkbox"
            class="checkbox"
            @change="save()"
          >
        </div>
        <hr class="form-section__hr">
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.telegram.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.telegram.alertsBy') }}
            </div>
            <FormTextFieldset
              v-model=" personal.settings.tg.value"
              :label="$t('projects.settings.notifications.telegram.webhookUrl')"
              @input="showSubmitButton=true"
            />
          </div>
          <input
            v-model="personal.settings.tg.enabled"
            type="checkbox"
            class="checkbox"
            @change="save()"
          >
        </div>
      </div>
      <div class="form-section">
        <label class="label form-section__label">{{ $t('projects.settings.notifications.actions.title') }}</label>
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.actions.new.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.actions.new.firstOccurrence') }}
            </div>
          </div>
          <input
            type="radio"
            class="radio"
            name="recieveModePersonal"
            :checked="personal.actionType === actionTypes.ONLY_NEW"
            @input.prevent="changeRadioPersonal(actionTypes.ONLY_NEW)"
          >
        </div>
        <hr class="form-section__hr">
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.actions.all.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.actions.all.allEvents') }}
            </div>
          </div>
          <input
            type="radio"
            class="radio"
            name="recieveModePersonal"
            :checked="personal.actionType === actionTypes.ALL"
            @input.prevent="changeRadioPersonal(actionTypes.ALL)"
          >
        </div>
        <hr class="form-section__hr">
        <div class="form-section__row">
          <div>{{ $t('projects.settings.notifications.actions.including.title') }}</div>
          <div class="form-section__row-main">
            <div class="form-section__row-main-text">
              {{ $t('projects.settings.notifications.actions.including.onlyIncluding') }}
            </div>
            <FormTextFieldset
              v-model="personal.words"
              :label="$t('projects.settings.notifications.actions.including.words')"
              @input="showSubmitButton=true"
            />
          </div>
          <input
            type="radio"
            name="recieveModePersonal"
            class="radio"
            :checked="personal.actionType === actionTypes.INCLUDING"
            @input.prevent="changeRadioPersonal(actionTypes.INCLUDING)"
          >
        </div>
      </div>
    </div>
    <button
      v-if="showSubmitButton"
      class="button button--submit form-section__submit-button"
      @click="save()"
    >
      Save
    </button>
  </div>
</template>

<script>
import FormTextFieldset from '../forms/TextFieldset';
import {
  GET_PERSONAL_NOTIFICATION_SETTINGS,
  GET_COMMON_NOTIFICATION_SETTINGS,
  UPDATE_PERSONAL_NOTIFICATION_SETTINGS,
  UPDATE_COMMON_NOTIFICATION_SETTINGS
} from '../../store/modules/notify/actionTypes';
import notifier from 'codex-notifier';

export default {
  name: 'ProjectNotifications',
  components: {
    FormTextFieldset
  },
  data() {
    const notify = JSON.parse(JSON.stringify(this.$store.state.notify));

    return {
      personal: {
        actionType: notify.personal.actionType || -1,
        words: notify.personal.words || '',
        settings: notify.personal.settings || {}
      },
      common: {
        actionType: notify.common.actionType || -1, // not used in api, but useful to check if we have no access to notify
        words: notify.common.words || '',
        settings: notify.common.settings || {}
      },
      showSubmitButton: false,
      actionTypes: {
        ONLY_NEW: 1,
        ALL: 2,
        INCLUDING: 3
      }
    };
  },
  created() {
    this.$store.dispatch(GET_PERSONAL_NOTIFICATION_SETTINGS, this.$route.params.projectId);
    this.$store.dispatch(GET_COMMON_NOTIFICATION_SETTINGS, this.$route.params.projectId);
  },
  methods: {
    async save() {
      const projectId = this.$route.params.projectId;

      try {
        await this.$store.dispatch(UPDATE_PERSONAL_NOTIFICATION_SETTINGS, {
          projectId,
          notify: {
            actionType: this.personal.actionType,
            words: this.personal.words,
            settings: this.personal.settings
          }
        });

        // actionType === -1 means that we don't have access to common settings
        if (this.common.actionType !== -1) {
          await this.$store.dispatch(UPDATE_COMMON_NOTIFICATION_SETTINGS, {
            projectId,
            notify: {
              actionType: this.common.actionType,
              words: this.common.words,
              settings: this.common.settings
            }
          });
        }
      } catch (e) {
        notifier.show({
          message: e.message,
          style: 'error',
          time: 5000
        });
        return;
      }

      notifier.show({
        message: 'Settings updated',
        style: 'success',
        time: 5000
      });
      this.showSubmitButton = false;
    },
    async changeRadioCommon(type) {
      this.common.actionType = type;
      await this.save();
    },
    async changeRadioPersonal(type) {
      this.personal.actionType = type;
      await this.save();
    }
  }
}
;
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
  .form-text {
    display: flex;
    justify-content: center;
    font-size: 20px;
    font-weight: bolder;
  }

  .form-section {
    display: block;
    padding-bottom: 50px;

    &__row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      padding-top: 20px;
      padding-bottom: 20px;

      &-main {
        width: 280px;
        padding: 20px;
        color: var(--color-text-second);
        font-weight: 500;
        font-size: 13px;

        &-text {
          padding-bottom: 15px;
        }

      }

    }

    &__submit-button {
      margin-bottom: 20px;
    }

  }
</style>
