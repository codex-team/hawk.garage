import { NavigationGuard } from 'vue-router';
import notifier from 'codex-notifier';
import i18n from './i18n';
import store from './store';
import * as projectsApi from './api/projects';

const unsubscribeHandler: NavigationGuard = async function (to, from, next) {
  const { ruleId, projectId } = to.params;

  try {
    await projectsApi.unsubscribeFromNotifications({
      projectId,
      ruleId,
    });

    notifier.show({
      message: i18n.t('notifications.unsubscribe.success').toString(),
      style: 'success',
      time: 5000,
    });
  } catch (error) {
    notifier.show({
      message: i18n.t('notifications.unsubscribe.error').toString(),
      style: 'error',
      time: 5000,
    });
  }

  next('/');
}

export default unsubscribeHandler;
