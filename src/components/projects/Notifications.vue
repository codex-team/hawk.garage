<template>
  <div class="project-notifications settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.notifications') }}
    </div>
    <div class="form-section">
      <label class="label form-section__label">Channels</label>
      <div class="form-section__row">
        <div>Email</div>
        <FormTextFieldset
          v-model="notify.settings.email.value"
          placeholder="email"
          @input="showSubmitButton=true"
        />
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
      <button
        v-if="showSubmitButton"
        class="button button--submit form-section__submit-button"
        @click="save()"
      >
        {{ $t('settings.account.submit') }}
      </button>
    </div>
  </div>
</template>

<script>
import FormTextFieldset from '../forms/TextFieldset';
import { GET_NOTIFICATION_SETTINGS, UPDATE_NOTIFICATION_SETTINGS } from '../../store/modules/notify/actionTypes';
import notifier from 'codex-notifier';
import { mapState } from 'vuex';

export default {
  name: 'ProjectNotifications',
  components: {
    FormTextFieldset
  },
  data() {
    return {
      showSubmitButton: false
    };
  },
  computed:
      mapState({
        notify: state => state.notify
      }),
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
    }
  }
}
;
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
  .form-section {
    display: block;

    &__row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      padding-top: 20px;
      padding-bottom: 20px;

      &__main {
        color: var(--color-text-second);
        font-weight: 500;
        font-size: 13px;

        &__text {
          padding-bottom: 15px;
        }

      }

    }

    &__submit-button {
      margin: 0 0 20px 0;
    }

  }

  .checkbox {
    width: 28px;
    height: 28px;
    background-color: var(--color-bg-second);
    border-radius: 4px;
  }

</style>
