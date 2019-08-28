<template>
  <div class="project-notifications settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.notifications') }}
    </div>
    <div class="form-section">
      <label class="label form-section__label">Channels</label>
      <div class="form-section__row">
        <div>Email</div>
        <div class="form-section__row__main ">
          <div class="form-section__row__main__text">
            Notifications on
          </div>
          <FormTextFieldset
            v-model="notify.settings.email.value"
            label="email"
            @input="showSubmitButton=true"
          />
        </div>
        <input
          v-model="notify.settings.email.enabled"
          type="checkbox"
          class="checkbox"
          @change="save()"
        >
      </div>
      <hr class="form-section__hr">
      <div class="form-section__row">
        <div>Slack</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            Alerts through the <u>Webhook app</u>
          </div>
          <FormTextFieldset
            v-model="notify.settings.slack.value"
            label="Webhook URL"
            @input="showSubmitButton=true"
          />
        </div>

        <input
          v-model="notify.settings.slack.enabled"
          type="checkbox"
          class="checkbox"
          @change="save()"
        >
      </div>
      <hr class="form-section__hr">
      <div class="form-section__row">
        <div>Telegram</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            Alerts by CodeX Bot
          </div>
          <FormTextFieldset
            v-model=" notify.settings.tg.value"
            label="Webhook URL"
            @input="showSubmitButton=true"
          />
        </div>
        <input
          v-model="notify.settings.tg.enabled"
          type="checkbox"
          class="checkbox"
          @change="save()"
        >
      </div>
    </div>
    <div class="form-section">
      <label class="label form-section__label">What to receive</label>
      <div class="form-section__row">
        <div>Only new events</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            First occurrence of event
          </div>
        </div>
        <input
          type="radio"
          class="radio"
          :checked="notify.actionType === actionTypes.ONLY_NEW"
          @input.prevent="changeRadio(actionTypes.ONLY_NEW)"
        >
      </div>
      <hr class="form-section__hr">
      <div class="form-section__row">
        <div>All events</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            All event occurances. Max frequency is 5 times/min.
          </div>
        </div>
        <input
          type="radio"
          class="radio"
          :checked="notify.actionType === actionTypes.ALL"
          @input.prevent="changeRadio(actionTypes.ALL)"
        >
      </div>
      <hr class="form-section__hr">
      <div class="form-section__row">
        <div>Custom filters</div>
        <div class="form-section__row__main">
          <div class="form-section__row__main__text">
            Only events that includes passed words
          </div>
          <FormTextFieldset
            v-model="notify.words"
            label="Including words"
            @input="showSubmitButton=true"
          />
        </div>
        <input
          type="radio"
          class="radio"
          :checked="notify.actionType === actionTypes.INCLUDING"
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
  UPDATE_NOTIFICATION_SETTINGS,
  SET_ACTION_TYPE
} from '../../store/modules/notify/actionTypes';
import notifier from 'codex-notifier';
import { mapState } from 'vuex';

export default {
  name: 'ProjectNotifications',
  components: {
    FormTextFieldset
  },
  data() {
    return {
      showSubmitButton: false,
      actionTypes: {
        ONLY_NEW: 1,
        ALL: 2,
        INCLUDING: 3
      }
    };
  },
  computed: {
    ...mapState({
      notify: state => state.notify
    })
  },
  created() {
    this.$store.dispatch(GET_NOTIFICATION_SETTINGS, this.$route.params.projectId);
  },
  methods: {
    async save() {
      const projectId = this.$route.params.projectId;

      try {
        await this.$store.dispatch(UPDATE_NOTIFICATION_SETTINGS, {
          projectId,
          notify: this.notify
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
      console.log(type);
      await this.$store.dispatch(SET_ACTION_TYPE, type);

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
