import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import AppShell from './components/AppShell.vue';

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
          component: () => import(/* webpackChunkName: 'settings' */ './components/account/Window.vue'),
          redirect: 'settings/account',
          children: [
            {
              path: 'account',
              name: 'account-settings',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/Account.vue'),
            },
            {
              path: 'appearance',
              name: 'appearance-settings',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/Appearance.vue'),
            },
            {
              path: 'billing',
              name: 'billing-settings',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/Billing.vue'),
            },
          ],
        },
        {
          path: 'workspace/:workspaceId',
          name: 'workspace-settings',
          component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspace/SettingsLayout.vue'),
          redirect: 'workspace/:workspaceId/settings',
          children: [
            {
              path: 'settings',
              name: 'workspace-settings-main',
              component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspace/SettingsMain.vue'),
              props: true,
            },
            {
              path: 'team',
              name: 'workspace-settings-team',
              component: () => import(/* webpackChunkName: 'workspace-team' */ './components/workspace/SettingsTeam.vue'),
            },
            {
              path: 'billing',
              name: 'workspace-settings-billing',
              component: () => import(/* webpackChunkName: 'workspace-billing' */ './components/workspace/SettingsBilling.vue'),
            },
          ],
        },
        {
          path: 'projects/:projectId',
          name: 'project-overview',
          component: () => import(/* webpackChunkName: 'project-overview' */ './components/projects/Overview.vue'),
          children: [
            {
              path: 'event/:eventId/repetitions',
              name: 'event-repetitions-overview',
              component: () => import(/* webpackChunkName: 'event-repetitions-overview' */ './components/repetitions/Overview.vue'),
            },
            {
              path: 'event/:eventId/:repetitionId?',
              name: 'event-overview',
              component: () => import(/* webpackChunkName: 'event-overview' */ './components/events/Overview.vue'),
            },
            {
              path: 'settings',
              component: () => import(/* webpackChunkName: 'project-settings' */ './components/projects/Settings.vue'),
              children: [
                {
                  path: '/',
                  name: 'project-settings',
                  component: () => import(/* webpackChunkName: 'project-settings' */ './components/projects/Project.vue'),
                },
                {
                  path: 'integrations',
                  name: 'project-integrations',
                  component: () => import(/* webpackChunkName: 'project-integrations' */ './components/projects/Integrations.vue'),
                },
              ],
            },
          ],
        },
        {
          path: 'projects/:projectId/add-catcher',
          name: 'add-catcher',
          component: () => import(/* webpackChunkName: 'project-add-catcher' */ './components/catalog/catchers/AddCatcher.vue'),
        },
        {
          path: 'projects/:projectId/setup-catcher/:page',
          name: 'setup-catcher',
          component: () => import(/* webpackChunkName: 'project-add-catcher' */ './components/catalog/catchers/dynamicLoadGuidePages.js'),
        },
      ],
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import(/* webpackChunkName: 'auth-pages' */ './components/auth/SignUp.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: 'auth-pages' */ './components/auth/Login.vue'),
      props: route => ({
        isPasswordRecoverSuccess: route.params.isPasswordRecoverSuccess === 'true',
      }),
    },
    {
      path: '/join/:workspaceId/:inviteHash?',
      beforeEnter: async (to, from, next) => (await import(/* webpackChunkName: 'invites-handler' */'./invitesHandler')).default(to, from, next),
    },
    {
      path: '/recover',
      name: 'recover',
      component: () => import(/* webpackChunkName: 'auth-pages' */ './components/auth/RecoverPassword.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authRoutes = /^\/(login|sign-up|reset)/;
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
