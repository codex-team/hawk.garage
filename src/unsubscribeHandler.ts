import type { NavigationGuard } from 'vue-router';
import notifier from 'codex-notifier';
import { i18n } from './i18n';
import * as projectsApi from './api/projects';

const unsubscribeHandler: NavigationGuard = async function (to, from, next) {
  const { ruleId, projectId } = to.params;

  try {
    await projectsApi.unsubscribeFromNotifications({
      projectId,
      ruleId,
    });

    notifier.show({
      message: i18n.global.t('projects.settings.patterns.notifications.unsubscribe.success'),
      style: 'success',
      time: 5000,
    });
  } catch (error) {
    console.error(error);
    notifier.show({
      message: i18n.global.t('projects.settings.patterns.notifications.unsubscribe.error'),
      style: 'error',
      time: 5000,
    });
  }

  next('/');
};

export default unsubscribeHandler;
