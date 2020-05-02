import NotificationsRule from '@/components/project/settings/NotificationsRule.vue';
import { ProjectNotificationsRule, ReceiveTypes } from '@/types/project-notifications';
import store from '@/store';
import router from '@/router';
import { withKnobs } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';
import i18n from '@/i18n';

/**
 * Return random item of an array
 * @param arr - list of available options
 */
function getRandomArrayItem(arr: any[]): any {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Creates example of project notification rule
 */
function createRuleMock(): ProjectNotificationsRule {
  const rule = {
    channels: {},
  } as ProjectNotificationsRule;

  if (getRandomArrayItem([1, 2]) === 1) {
    rule.channels.email = {
      endpoint: 'alers@yourteam.com',
      isEnabled: getRandomArrayItem([true, false]),
    };
  }

  if (getRandomArrayItem([1, 2]) === 1) {
    rule.channels.slack = {
      endpoint: 'https://hooks.slack.com/services/' + Math.random() * 100,
      isEnabled: getRandomArrayItem([true, false]),
    };
  }

  if (getRandomArrayItem([1, 2]) === 1) {
    rule.channels.telegram = {
      endpoint: 'https://bot.codex.so/' + Math.random() * 100,
      isEnabled: getRandomArrayItem([true, false]),
    };
  }

  rule.whatToReceive = getRandomArrayItem([ReceiveTypes.ONLY_NEW, ReceiveTypes.ALL]);

  if (getRandomArrayItem([1, 2]) === 1) {
    rule.excluding = ['Script error', 'chunk'];
  }

  if (getRandomArrayItem([1, 2]) === 1) {
    rule.including = ['codex', 'editor'];
  }

  return rule;
}

export default {
  component: NotificationsRule,
  title: 'Project/Settings/Notifications',
  parameters: {
  },
  decorators: [
    () => ({
      template: '<div style="width: 600px; max-height: 100%; padding: 20px 0; overflow-y: auto;"><story /></div>',
    }),
    centered,
    withKnobs,
  ],
};

export const List = () => ({
  components: { NotificationsRule },
  template: `
    <div>
      <NotificationsRule
      v-for="rule in rules"
      :key="rule.id"
      :rule="rule"
      />
    </div>
  `,
  props: {
    rules: {
      type: Array,
      default: () => {
        const rules: ProjectNotificationsRule[] = [];

        for (let i = 0; i < 5; i++) {
          rules.push(createRuleMock());
        }

        return rules;
      },
    },
  },
  store,
  router,
  i18n,
});
