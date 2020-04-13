<template>
  <div class="n-rule">
    <div
      v-if="enableEditing"
      class="n-rule__actions"
    >
      <UiSwitch
        :value="rule.isEnabled"
        :label="$t('projects.settings.notifications.ruleIsEnabled')"
        @input="toggleEnabledState"
      />
      <TooltipMenu
        class="n-rule__dots"
        :options="menuOptions"
      />
    </div>
    <section class="n-rule__type">
      {{ receiveType }}
    </section>
    <section>
      <div
        v-if="rule.including && rule.including.length"
        class="n-rule__filter"
      >
        <span class="n-rule__filter-name">
          {{ $t('projects.settings.notifications.ruleIncludingLabel') }}
        </span>
        <div class="n-rule__filter-rules">
          <NotificationsRuleFilter
            v-for="(filter, index) in rule.including"
            :key="index"
            :content="filter"
          />
        </div>
      </div>
      <div
        v-if="rule.excluding && rule.excluding.length"
        class="n-rule__filter"
      >
        <span class="n-rule__filter-name">
          {{ $t('projects.settings.notifications.ruleExcludingLabel') }}
        </span>
        <div class="n-rule__filter-rules">
          <NotificationsRuleFilter
            v-for="(filter, index) in rule.excluding"
            :key="index"
            :content="filter"
            excluding
          />
        </div>
      </div>
    </section>
    <section>
      <div
        v-for="(channel, channelName) in notEmptyChannels"
        :key="channelName"
        class="n-rule__channel"
      >
        <Icon :symbol="channelName" />
        {{ channel.endpoint }}
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  ProjectNotificationsRule,
  ReceiveTypes,
  NotificationsChannels,
} from '@/types/project-notifications';
import NotificationsRuleFilter from './NotificationsRuleFilter.vue';
import Icon from '@/components/utils/Icon.vue';
import TooltipMenu, { TooltipMenuItem } from '@/components/utils/TooltipMenu.vue';
import UiSwitch from '@/components/forms/UiSwitch.vue';
import { ProjectNotificationsUpdateRulePayload, ProjectNotificationRulePointer } from '../../../types/project-notifications-mutations';
import { TOGGLE_NOTIFICATIONS_RULE_ENABLED_STATE } from '../../../store/modules/projects/actionTypes';

export default Vue.extend({
  name: 'ProjectSettingsNotificationsRule',
  components: {
    NotificationsRuleFilter,
    Icon,
    TooltipMenu,
    UiSwitch,
  },
  props: {
    /**
     * Rule to display
     */
    rule: {
      type: Object as () => ProjectNotificationsRule,
      required: true,
    },

    /**
     * If of a project that owns the rule
     */
    projectId: {
      type: String,
      required: true,
    },

    /**
     * True if current user can edit the rule
     */
    enableEditing: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * Return only filled channels
     */
    notEmptyChannels(): NotificationsChannels {
      const result = {};

      Object.entries(this.rule.channels)
        .filter(([name, channel]) => channel.endpoint !== '')
        .filter(([name, channel]) => channel.isEnabled === true)
        .forEach(([name, channel]) => {
          result[name] = channel;
        });

      return result;
    },

    /**
     * Return human-readable receive type
     */
    receiveType(): string {
      if (this.rule.whatToReceive === ReceiveTypes.ONLY_NEW) {
        return this.$t('projects.settings.notifications.receiveNewLabel') as string;
      }

      return this.$t('projects.settings.notifications.receiveAllLabel') as string;
    },

    /**
     * Items of rule manipulations menu
     * formatted for TooltipMenu component
     */
    menuOptions(): TooltipMenuItem[] {
      const $this = this;

      return [
        {
          title: this.$t('projects.settings.notifications.editRule') as string,
          onClick() {
            $this.$emit('editClicked', $this.rule.id);
          },
        },
        {
          title: this.$t('projects.settings.notifications.removeRule') as string,
          onClick() {
            console.log('Remove rule clicked');
          },
        },
      ];
    },
  },
  methods: {
    /**
     * Send request for toggling isEnables state for current rule
     */
    async toggleEnabledState(): Promise<void> {
      /**
       * Updating the rule
       */
      await this.$store.dispatch(TOGGLE_NOTIFICATIONS_RULE_ENABLED_STATE, {
        ruleId: this.rule.id,
        projectId: this.projectId,
      } as ProjectNotificationRulePointer);
    },
  },
});
</script>

<style>
  @import url('../../../styles/custom-properties.css');

  .n-rule {
    @apply --font-small;
    max-width: var(--width-popup-form-container);

    padding: 20px 0;

    &:not(:last-of-type){
      border-bottom: 1px solid var(--color-delimiter-line);
    }

    &__dots {
      margin-top: -11px;
    }

    section {
      &:not(:last-of-type){
        margin-bottom: 10px;
      }
    }

    &__filter {
      display: flex;

      &-name {
        display: inline-block;
        min-width: 110px;
        padding-top: 5px;
      }
    }

    &__channel {
      display: flex;
      align-items: center;

      &:not(:last-of-type){
        margin-bottom: 8px;
      }

      .icon {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
    }

    &__actions {
      display: flex;
      float: right;

      .ui-switch {
        margin-right: 20px;
      }
    }
  }
</style>
