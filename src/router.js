import Vue from 'vue';
import Router from 'vue-router';
import VueCookies from 'vue-cookies';
import store from './store';

import AppShell from './components/AppShell';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import { CONFIRM_INVITE } from './store/modules/workspaces/actionTypes';
import notifier from 'codex-notifier';
import i18n from './i18n';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppShell,
      children: [
        {
          path: 'settings',
          name: 'settings',
          component: () => import(/* webpackChunkName: 'settings' */ './components/account/Window'),
          redirect: 'settings/account',
          children: [
            {
              path: 'account',
              name: 'account-settings',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/Account')
            },
            {
              path: 'appearance',
              name: 'appearance-settings',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/Appearance')
            }
          ]
        },
        {
          path: 'workspaces/:workspaceId',
          component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspaces/Settings'),
          children: [
            {
              path: 'settings',
              name: 'workspace-settings'
            },
            {
              path: 'team',
              name: 'workspace-team',
              component: () => import(/* webpackChunkName: 'workspace-team' */ './components/workspaces/Team')
            }
          ]
        },
        {
          path: 'projects/:projectId',
          name: 'project-overview',
          component: () => import(/* webpackChunkName: 'project-overview' */ './components/projects/Overview.vue'),
          children: [
            {
              path: 'event/:eventId',
              name: 'event-overview',
              component: () => import(/* webpackChunkName: 'event-overview' */ './components/events/Overview.vue')
            }
          ]
        },
        {
          path: 'projects/:projectId/add-catcher',
          name: 'add-catcher',
          component: () => import(/* webpackChunkName: 'project-add-catcher' */'./components/catalog/catchers/AddCatcher.vue')
        },
        {
          path: 'projects/:projectId/setup-catcher/php',
          name: 'setup-php-catcher',
          component: () => import(/* webpackChunkName: 'project-setup-catcher' */'./components/catalog/catchers/SetupPhpCatcher.vue')
        }
      ]
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUp
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/join/:workspaceId/:inviteHash?',
      async beforeEnter(to, from, next) {
        const { workspaceId, inviteHash } = to.params;

        if (!store.getters.isAuthenticated) {
          VueCookies.set('afterAuthRedirect', to.path, '1d');
          next('/login');
          return;
        }

        let isSuccessful = true;

        try {
          await store.dispatch(CONFIRM_INVITE, { workspaceId, inviteHash });
        } catch (e) {
          isSuccessful = false;
        }

        console.log(i18n);

        notifier.show({
          message: isSuccessful ? i18n.t('workspaces.settings.team.joinNotification') : i18n.t('workspaces.settings.team.brokenLinkNotification'),
          style: isSuccessful ? 'success' : 'error',
          time: 10000
        });

        next('/');
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authRoutes = /^\/(login|sign-up)/;
  const routesAvailableWithoutAuth = /^\/(join)/;

  if (store.getters.isAuthenticated) {
    if (authRoutes.test(to.fullPath)) {
      next('/');
    }
  } else {
    if (!authRoutes.test(to.fullPath) && !routesAvailableWithoutAuth.test(to.fullPath)) {
      next('/login');
    }
  }
  next();
});

export default router;
