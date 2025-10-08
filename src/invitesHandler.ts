import { defineComponent } from 'vue';
import notifier from 'codex-notifier';
import store from './store';
import { CONFIRM_INVITE, JOIN_BY_INVITE_LINK } from './store/modules/workspaces/actionTypes';
import { i18n } from './i18n';
import { NavigationGuard } from 'vue-router';

const invitesHandler: NavigationGuard = async function (to, from, next) {
  const { workspaceId, inviteHash } = to.params;

  if (!store.getters.isAuthenticated) {
    Vue.$cookies.set('afterAuthRedirect', to.path, '1d');
    next('/login');

    return;
  }

  let isSuccessful = true;

  try {
    if (!!workspaceId) {
      await store.dispatch(CONFIRM_INVITE, {
        workspaceId,
        inviteHash,
      });
    } else {
      await store.dispatch(JOIN_BY_INVITE_LINK, {
        inviteHash,
      });
    }
  } catch (e) {
    isSuccessful = false;
  }

  notifier.show({
    message: (isSuccessful ? i18n.t('workspaces.settings.team.joinNotification') : i18n.t('workspaces.settings.team.brokenLinkNotification')).toString(),
    style: isSuccessful ? 'success' : 'error',
    time: 10000,
  });

  next('/');
};

export default invitesHandler;
