<template>
  <div class="n-rule">
    <div class="n-rule__actions">
      <UiSwitch
        :label="$t('projects.settings.notifications.ruleIsEnabled')"
        v-model="rule.isEnabled"
      />
      <TooltipMenu :options="menuOptions"/>
    </div>
    <section class="n-rule__type">
      {{ receiveType }}
    </section>
    <section>
      <div class="n-rule__filter" v-if="rule.including">
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
      <div class="n-rule__filter" v-if="rule.excluding">
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
        class="n-rule__channel"
        v-for="(channel, channelName) in rule.channels"
        :key="channelName"
      >
        <Icon :symbol="channelName" />
        {{ channel.endpoint }}
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ProjectNotificationsRule, ReceiveTypes } from '@/types/project-notifications';
import NotificationsRuleFilter from './NotificationsRuleFilter.vue';
import Icon from '@/components/utils/Icon.vue';
import TooltipMenu, { TooltipMenuItem } from "@/components/utils/TooltipMenu.vue";
import UiSwitch from "@/components/forms/UiSwitch.vue";

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
  },
  computed: {
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
      return [
        {
          title: this.$t('projects.settings.notifications.editRule') as string,
          onClick() {
            console.log('Edit rule clicked');
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
  data() {
    return {
    };
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
      float: right;
      display: flex;

      .ui-switch {
        margin-right: 20px;
      }
    }
  }
</style>
