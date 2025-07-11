import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import { Analytics, AnalyticsEventType } from './analytics';

import AppShell from './components/AppShell.vue';

Vue.use(Router);

/**
 * Disable return-type rule to leave router 'component' imports with short syntax
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppShell,
      props: true,
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
            {
              path: 'notifications',
              name: 'account-notifications',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/settings/Notifications.vue'),
            },
            {
              path: 'billing',
              name: 'account-billing',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/settings/Billing.vue'),
            },
          ],
        },
        /**
         * Workspace
         * ----------------
         */
        {
          path: 'workspace/:workspaceId',
          name: 'workspace',
        },

        /**
         * Workspace settings
         * ----------------
         */
        {
          path: 'workspace/:workspaceId/settings',
          name: 'workspace-settings',
          component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspace/settings/Layout.vue'),
          redirect: 'workspace/:workspaceId/settings/general',
          children: [
            {
              path: 'general',
              name: 'workspace-settings-general',
              component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspace/settings/General.vue'),
              props: true,
            },
            {
              path: 'team',
              name: 'workspace-settings-team',
              component: () => import(/* webpackChunkName: 'workspace-team' */ './components/workspace/settings/Team.vue'),
            },
            {
              path: 'volume',
              name: 'workspace-settings-used-volume',
              component: () => import(/* webpackChunkName: 'workspace-used-volume' */ './components/workspace/settings/UsedVolume.vue'),
            },
            {
              path: 'billing',
              name: 'workspace-settings-billing',
              component: () => import(/* webpackChunkName: 'workspace-billing' */ './components/workspace/settings/Billing.vue'),
            },
          ],
        },

        /**
         * Project
         */
        {
          path: 'project/:projectId',
          component: () => import(/* webpackChunkName: 'project' */ './components/project/Project.vue'),
          children: [
            {
              path: '',
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
                    {
                      path: 'affected',
                      name: 'event-affected',
                      component: () => import(/* webpackChunkName: 'event-affected' */ './components/event/UsersAffected.vue'),
                    },
                  ],
                },
              ],
            },
            {
              path: 'add-catcher',
              name: 'add-catcher',
              component: () => import(/* webpackChunkName: 'project-add-catcher' */ './components/catalog/catchers/AddCatcher.vue'),
            },
            {
              path: 'setup-catcher/:page',
              name: 'setup-catcher',
              component: () => import(/* webpackChunkName: 'project-add-catcher' */ './components/catalog/catchers/dynamicLoadGuidePages.js'),
            },
          ],
        },

        /**
         * Project Settings
         * -------------
         */
        {
          path: 'project/:projectId/settings',
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
            {
              path: 'patterns',
              name: 'project-settings-patterns',
              component: () => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/EventGroupingPattern.vue'),
            },
          ],
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
        successMessage: route.params.successMessage,
        emailPrefilled: route.params.emailPrefilled,
      }),
    },
    {
      path: '/join/:inviteHash',
      beforeEnter: async (to, from, next) => (await import(/* webpackChunkName: 'invites-handler' */'./invitesHandler')).default(to, from, next),
    },
    {
      path: '/join/:workspaceId/:inviteHash',
      beforeEnter: async (to, from, next) => (await import(/* webpackChunkName: 'invites-handler' */'./invitesHandler')).default(to, from, next),
    },
    {
      path: '/recover',
      name: 'recover',
      component: () => import(/* webpackChunkName: 'auth-pages' */ './components/auth/RecoverPassword.vue'),
    },
    {
      path: '/unsubscribe/:projectId/:ruleId',
      beforeEnter: async (to, from, next) => (await import(/* webpackChunkName: 'unsubscribe-handler' */'./unsubscribeHandler')).default(to, from, next),
    }
  ],
});

router.beforeEach((to, from, next) => {
  const authRoutes = /^\/(login|sign-up|recover)/;
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

  /**
   * Track visit
   */
  try {
    /**
     * Try to get user id
     */
    if (store.state.user && store.state.user.data && store.state.user.data.id) {
      Analytics?.setUserId(store.state.user.data.id);
    }

    /**
     * Event additional data
     */
    const eventProperties = {
      url: to.fullPath,
    };

    /**
     * Track event
     */
    Analytics?.track(AnalyticsEventType.PageVisited, eventProperties);
  } catch (e) {
    console.error(e);
  }

  next();
});

export default router;
