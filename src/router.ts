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
        /**
         * Account settings
         * ----------------
         */
        {
          path: 'account',
          name: 'account',
          component: () => import(/* webpackChunkName: 'settings' */ './components/account/settings/Layout.vue'),
          redirect: 'account/general',
          children: [
            {
              path: 'general',
              name: 'account-general',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/settings/General.vue'),
            },
            {
              path: 'appearance',
              name: 'account-appearance',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/settings/Appearance.vue'),
            },
            // {
            //   path: 'billing',
            //   name: 'billing-settings',
            //   component: () => import(/* webpackChunkName: 'settings' */'./components/account/Billing.vue'),
            // },
          ],
        },
        /**
         * Workspace settings
         * ----------------
         */
        {
          path: 'workspace/:workspaceId',
          name: 'workspace-settings',
          component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspace/settings/Layout.vue'),
          redirect: 'workspace/:workspaceId/settings',
          children: [
            {
              path: 'settings',
              name: 'workspace-settings-general',
              component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspace/settings/General.vue'),
              props: true,
            },
            {
              path: 'team',
              name: 'workspace-settings-team',
              component: () => import(/* webpackChunkName: 'workspace-team' */ './components/workspace/settings/Team.vue'),
            },
            // {
            //   path: 'billing',
            //   name: 'workspace-settings-billing',
            //   component: () => import(/* webpackChunkName: 'workspace-billing' */ './components/workspace/Billing.vue'),
            // },
          ],
        },
        /**
         * Project
         * ----------------
         */
        {
          path: 'project/:projectId',
          name: 'project-overview',
          component: () => import(/* webpackChunkName: 'project-overview' */ './components/project/Overview.vue'),
          children: [
            /**
             * Project Event
             * -------------
             */
            {
              path: 'event/:eventId/:repetitionId?',
              name: 'event',
              component: () => import(/* webpackChunkName: 'event-overview' */ './components/event/Layout.vue'),
              redirect: 'event/:eventId/:repetitionId?/overview',
              children: [
                {
                  path: 'overview',
                  name: 'event-overview',
                  component: () => import(/* webpackChunkName: 'event-overview' */ './components/event/Overview.vue'),
                },
                {
                  path: 'repetitions',
                  name: 'event-repetitions',
                  component: () => import(/* webpackChunkName: 'event-repetitions' */ './components/event/Repetitions.vue'),
                },
                {
                  path: 'daily',
                  name: 'event-daily',
                  component: () => import(/* webpackChunkName: 'event-daily' */ './components/event/Daily.vue'),
                },
              ],
            },

            /**
             * Project Settings
             * -------------
             */
            {
              path: 'settings',
              component: () => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/Layout.vue'),
              children: [
                {
                  path: 'general',
                  name: 'project-settings-general',
                  component: () => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/General.vue'),
                },
                {
                  path: 'integrations',
                  name: 'project-settings-integrations',
                  component: () => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/Integrations.vue'),
                },
                {
                  path: 'notifications',
                  name: 'project-settings-notifications',
                  component: () => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/Notifications.vue'),
                },
              ],
            },
          ],
        },
        {
          path: 'project/:projectId/add-catcher',
          name: 'add-catcher',
          component: () => import(/* webpackChunkName: 'project-add-catcher' */ './components/catalog/catchers/AddCatcher.vue'),
        },
        {
          path: 'project/:projectId/setup-catcher/:page',
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
