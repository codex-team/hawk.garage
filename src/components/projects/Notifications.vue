<template>
  <div class="project-notifications settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.notifications.title') }}
    </div>
    <div class="form-section">
      <label class="label form-section__label">{{ $t('projects.settings.notifications.channels')}}</label>
      <div class="form-section__row">
        <div>{{$t('projects.settings.notifications.email.title')}}</div>
        <div class="form-section__row__main ">
          <div class="form-section__row__main__text">
            {{$t('projects.settings.notifications.email.notificationsOn')}}
          </div>
          <FormTextFieldset
            v-model="settings.email.value"
            label="email"
            @input="showSubmitButton=true"
          />
        </div>
        <input
          v-model="settings.email.enabled"
          type="checkbox"
          class="checkbox"
          @change="save()"
        >
      </div>
      <hr class="form-section__hr">
      <div class="form-section__row">
        <div>{{$t('projects.settings.notifications.slack.title')}}</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            {{$t('projects.settings.notifications.slack.alerts')}} <u>{{$t('projects.settings.notifications.slack.webhookApp')}}</u>
          </div>
          <FormTextFieldset
            v-model="settings.slack.value"
            :label="$t('projects.settings.notifications.slack.webhookUrl')"
            @input="showSubmitButton=true"
          />
        </div>

        <input
          v-model="settings.slack.enabled"
          type="checkbox"
          class="checkbox"
          @change="save()"
        >
      </div>
      <hr class="form-section__hr">
      <div class="form-section__row">
        <div>{{$t('projects.settings.notifications.telegram.title')}}</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            {{$t('projects.settings.notifications.telegram.alertsBy')}}
          </div>
          <FormTextFieldset
            v-model=" settings.tg.value"
            :label="$t('projects.settings.notifications.telegram.webhookUrl')"
            @input="showSubmitButton=true"
          />
        </div>
        <input
          v-model="settings.tg.enabled"
          type="checkbox"
          class="checkbox"
          @change="save()"
        >
      </div>
    </div>
    <div class="form-section">
      <label class="label form-section__label">{{$t('projects.settings.notifications.actions.title')}}</label>
      <div class="form-section__row">
        <div>{{$t('projects.settings.notifications.actions.new.title')}}</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            {{$t('projects.settings.notifications.actions.new.firstOccurrence')}}
          </div>
        </div>
        <input
          type="radio"
          class="radio"
          name="recieveMode"
          :checked="actionType === actionTypes.ONLY_NEW"
          @input.prevent="changeRadio(actionTypes.ONLY_NEW)"
        >
      </div>
      <hr class="form-section__hr">
      <div class="form-section__row">
        <div>{{$t('projects.settings.notifications.actions.all.title')}}</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            {{$t('projects.settings.notifications.actions.all.allEvents')}}
          </div>
        </div>
        <input
          type="radio"
          class="radio"
          name="recieveMode"
          :checked="actionType === actionTypes.ALL"
          @input.prevent="changeRadio(actionTypes.ALL)"
        >
      </div>
      <hr class="form-section__hr">
      <div class="form-section__row">
        <div>{{$t('projects.settings.notifications.actions.including.title')}}</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            {{$t('projects.settings.notifications.actions.including.onlyIncluding')}}
          </div>
          <FormTextFieldset
            v-model="words"
            :label="$t('projects.settings.notifications.actions.including.words')"
            @input="showSubmitButton=true"
          />
        </div>
        <input
          type="radio"
          name="recieveMode"
          class="radio"
          :checked="actionType === actionTypes.INCLUDING"
          @input.prevent="changeRadio(actionTypes.INCLUDING)"
        >
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
  GET_NOTIFICATION_SETTINGS,
  UPDATE_NOTIFICATION_SETTINGS
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
      actionType: notify.actionType || 0,
      words: notify.words || '',
      settings: notify.settings || {},

      showSubmitButton: false,
      actionTypes: {
        ONLY_NEW: 1,
        ALL: 2,
        INCLUDING: 3
      }
    };
  },
  computed: {
  },
  created() {
    this.$store.dispatch(GET_NOTIFICATION_SETTINGS, this.$route.params.projectId);
  },
  methods: {
    async save() {
      const projectId = this.$route.params.projectId;

      console.log({
        notify: {
          actionType: this.actionType,
          words: this.words,
          settings: this.settings
        }
      });

      try {
        await this.$store.dispatch(UPDATE_NOTIFICATION_SETTINGS, {
          projectId,
          notify: {
            actionType: this.actionType,
            words: this.words,
            settings: this.settings
          }
        });
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
    async changeRadio(type) {
      this.actionType = type;
      await this.save();
    }
  }
}
;
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
  .form-section {
    display: block;
    padding-bottom: 50px;

    &__row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      padding-top: 20px;
      padding-bottom: 20px;

      &__main {
        width: 280px;
        color: var(--color-text-second);
        font-weight: 500;
        font-size: 13px;

        &__text {
          padding-bottom: 15px;
        }

      }

    }

    &__submit-button {
      margin-bottom: 20px;
    }

  }

  .checkbox {
    width: 28px;
    height: 28px;
    background-color: var(--color-bg-second);
    border-radius: 4px;
  }

  .radio {
    width: 28px;
    height: 28px;
  }

</style>
