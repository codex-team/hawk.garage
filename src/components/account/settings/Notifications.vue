<template>
  <div
    v-if="user.notifications"
    class="acc-notifies"
  >
    <section>
      <h3>
        {{ $t('settings.notifications.channelsHeading') }}
      </h3>
      <div
        v-for="channelName of channelsAvailable"
        :key="channelName"
        class="settings-field"
      >
        <div class="settings-field__name">
          {{ $t('settings.notifications.channels.' + channelName) }}

          <span
            v-if="isChannelUnavailable(channelName)"
            class="settings-field__soon"
          >
            Soon
          </span>
        </div>
        <div class="settings-field__description">
          {{ $t('settings.notifications.channelDescriptions.' + channelName) }}

          <template v-if="channelName === 'email'">
            <span
              v-if="user.email"
              class="settings-field__email"
            >
              {{ user.email }}
            </span>
            <template v-else>
              {{ $t('settings.notifications.channelDescriptions.emailEmptyPlaceholder') }}

              <div class="settings-field__warning">
                <Icon
                  symbol="warning"
                />
                <span
                  v-html="$t('settings.notifications.channelDescriptions.emailEmptyWarning', {
                    accountUrl: '/account/general'
                  })"
                />
              </div>
            </template>
          </template>
        </div>
        <div class="settings-field__input">
          <UiCheckbox
            :value="getChannelState(channelName)"
            :disabled="isChannelUnavailable(channelName) || !user.email"
            @input="channelChanged(channelName, $event)"
          />
        </div>
      </div>
    </section>
    <section>
      <h3>
        {{ $t('settings.notifications.actionTypesHeading') }}
      </h3>
      <div
        v-for="action of whatToReceive"
        :key="action"
        class="settings-field"
      >
        <div class="settings-field__name">
          {{ $t('settings.notifications.actions.' + action) }}
        </div>
        <div class="settings-field__description">
          {{ $t('settings.notifications.actionDescriptions.' + action) }}
        </div>
        <div class="settings-field__input">
          <UiCheckbox
            :value="user.notifications.whatToReceive[action]"
            :disabled="action === 'SystemMessages'"
            @input="whatToReceiveChanged(action, $event)"
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
import {
  UserNotificationType,
  UserNotificationsChannels,
  UserNotificationsReceiveTypesConfig
} from '../../../types/user-notifications';
import {
  CHANGE_NOTIFICATIONS_CHANNEL,
  CHANGE_NOTIFICATIONS_RECEIVE_TYPE,
  FETCH_NOTIFICATIONS_SETTINGS
} from '../../../store/modules/user/actionTypes';
import { NotificationsChannelSettings } from '../../../types/notifications';
import notifier from 'codex-notifier';
import Icon from './../../utils/Icon.vue';

export default Vue.extend({
  components: {
    UiCheckbox,
    Icon,
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
      /**
       * Set of available channel names
       */
      channelsAvailable: ['email', 'webPush', 'desktopPush'] as Array<keyof UserNotificationsChannels>,

      /**
       * Set of available receive types
       */
      whatToReceive: [
        UserNotificationType.IssueAssigning,
        UserNotificationType.WeeklyDigest,
        UserNotificationType.SystemMessages,
      ],
    };
  },
  async created(): Promise<void> {
    /**
     * Load 'notifications' field on user
     */
    await this.$store.dispatch(FETCH_NOTIFICATIONS_SETTINGS);
  },
  methods: {
    /**
     * Notifications channel changed. Need to save new value
     * @param channelName - channel name (key of UserNotificationsChannels)
     * @param value - new value
     */
    async channelChanged(channelName: string, value: boolean): Promise<void> {
      try {
        await this.$store.dispatch(CHANGE_NOTIFICATIONS_CHANNEL, {
          [channelName]: {
            endpoint: '',
            isEnabled: value === true,
          } as NotificationsChannelSettings,
        } as UserNotificationsChannels);
      } catch (error) {
        this.$sendToHawk(error);

        notifier.show({
          message: error.message,
          style: 'error',
        });
      }
    },

    /**
     * Notifications type changed. Need to save new value
     * @param type - whatToReceive type
     * @param value - new value
     */
    async whatToReceiveChanged(type: UserNotificationType, value: boolean): Promise<void> {
      try {
        await this.$store.dispatch(CHANGE_NOTIFICATIONS_RECEIVE_TYPE, {
          [type]: value,
        } as UserNotificationsReceiveTypesConfig);
      } catch (error) {
        this.$sendToHawk(error);

        notifier.show({
          message: error.message,
          style: 'error',
        });
      }
    },

    /**
     * Return active state of passed channel
     *
     * @param channelName - channel name to check
     */
    getChannelState(channelName: string): boolean {
      if (!this.user.notifications) {
        return false;
      }

      if (!this.user.notifications.channels[channelName]) {
        return false;
      }

      if (channelName === 'email' && !this.user.email) {
        return false;
      }

      return this.user.notifications.channels[channelName].isEnabled;
    },

    /**
     * Some channels are temporary unavailable. This method check that.
     *
     * @param channelName - channel name to check
     */
    isChannelUnavailable(channelName: string): boolean {
      return channelName !== 'email';
    },
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
    align-items: center;
    padding: 15px 0;

    &:not(:last-of-type){
      border-bottom: 1px solid var(--color-delimiter-line);
    }

    &__name {
      min-width: 180px;
      color: var(--color-text-main);
      font-size: 15px;
      letter-spacing: 0.19px;
    }

    &__soon {
      display: inline-block;
      margin-left: 4px;
      padding: 2px 5px;
      color: var(--color-text-second);
      font-size: 12px;
      background: var(--color-bg-main);
      border-radius: 4px;
      font-variant-caps: small-caps;
    }

    &__description {
      @apply --font-small;
      flex-grow: 2;
      color: var(--color-text-second);
    }

    &__email {
      font-weight: 500;
      font-style: italic;
    }

    &__warning {
      display: flex;
      max-width: 330px;
      margin-top: 10px;
      color: var(--color-indicator-critical);

      .icon {
        width: 13px;
        height: 12px;
        margin-top: 4px;
        margin-right: 10px;
      }

      a {
        padding-bottom: 1px;
        border-bottom: 1px solid color-mod(var(--color-indicator-critical) alpha(40%));
      }
    }
  }
</style>
