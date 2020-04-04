import NotificationsRule from '@/components/project/settings/NotificationsRule.vue';
import { ProjectNotificationsRule, ReceiveTypes } from '@/types/project-notifications';
import store from '@/store';
import router from '@/router';

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
    channels: {}
  };

  rule.channels[getRandomArrayItem(['slack', 'telegram', 'email'])] = {
    endpoint: 'https://bot.codex.so/' + Math.random(),
    isEnabled: getRandomArrayItem([true, false]),
  };

  rule.whatToReceive = getRandomArrayItem(ReceiveTypes.ONLY_NEW, ReceiveTypes.ALL])

  return rule;
}



export const List = () => ({
  components: { NotificationsRule },
  template: `<Rule
    v-for="rule in rules"
    :key="rule.id"
    :rule="rule"
    @editClicked="editRule"
  />`,
  props: {
    rules: {
      type: String,
      default: () => {
        return
      },
    },
  },
  store,
  router,
});
