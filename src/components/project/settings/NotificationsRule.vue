<template>
  <div class="n-rule">
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
      <div class="n-rule__channel" v-for="(channel, channelName) in rule.channels">
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

export default Vue.extend({
  name: 'ProjectSettingsNotificationsRule',
  components: {
    NotificationsRuleFilter,
    Icon,
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
        min-width: 70px;
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
  }
</style>
