<template>
  <div class="acc-notifies">
    <section>
      <h3>
        {{ $t('settings.notifications.channelsHeading') }}
      </h3>
      <div
        class="settings-field"
        v-for="channelName of Object.keys(form.channels)"
        :key="channelName"
      >
        <div class="settings-field__name">
          {{ $t('settings.notifications.channels.' + channelName) }}
        </div>
        <div class="settings-field__description">
          {{ $t('settings.notifications.channelDescriptions.' + channelName) }}
        </div>
        <div class="settings-field__input">
          <UiCheckbox
            v-model="form.channels[channelName].isEnabled"
          />
        </div>
      </div>
    </section>
    <section>
      <h3>
        {{ $t('settings.notifications.actionTypesHeading') }}
      </h3>
      <div
        class="settings-field"
        v-for="action of Object.keys(form.whatToReceive)"
        :key="action"
      >
        <div class="settings-field__name">
          {{ $t('settings.notifications.actions.' + action) }}
        </div>
        <div class="settings-field__description">
          {{ $t('settings.notifications.actionDescriptions.' + action) }}
        </div>
        <div class="settings-field__input">
          <UiCheckbox
            v-model="form.whatToReceive[action]"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { User } from '../../../types/user';
import UiCheckbox from './../../forms/UiCheckbox.vue';
import { AccountNotificationTypes } from '../../../types/account-notifications';

export default Vue.extend({
  components: {
    UiCheckbox,
  },
  props: {
    /**
     * Current user
     */
    user: {
      type: Object as () => User,
      required: true,
    },
  },
  data() {

    return {
      form: {
        userId: this.user.id,
        channels: {
          email: {
            endpoint: '',
            isEnabled: true,
          },
          webPush: {
            endpoint: '',
            isEnabled: false,
          },
          desktopPush: {
            endpoint: '',
            isEnabled: false,
          },
        },
        whatToReceive: {
          [AccountNotificationTypes.IssueAssigning]: true,
          [AccountNotificationTypes.WeeklyDigest]: true,
          [AccountNotificationTypes.SystemMessages]: true,
        },
      },
    };
  },
});
</script>

<style>
  @import url('../../../styles/custom-properties.css');

  .acc-notifies {
    max-width: var(--width-popup-form-container);

    h3 {
      @apply --ui-label;
    }

    section {
      margin-bottom: 60px;
    }
  }

  .settings-field {
    display: flex;
    padding: 15px 0;
    align-items: center;

    &:not(:last-of-type){
      border-bottom: 1px solid var(--color-delimiter-line);
    }

    &__name {
      font-size: 15px;
      color: var(--color-text-main);
      letter-spacing: 0.19px;
      min-width: 180px;
    }

    &__description {
      @apply --font-small;

      color: var(--color-text-second);
      flex-grow: 2;
    }

    &__input {

    }
  }
</style>
