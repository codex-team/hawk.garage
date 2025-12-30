import { defineComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from './store';

import { Analytics, AnalyticsEventType } from './analytics';

import AppShell from './components/AppShell.vue';
import invitesHandler from './invitesHandler';
import unsubscribeHandler from './unsubscribeHandler';
import { loadAsyncComponent } from './utils';

/**
 * Empty component for routes that only use beforeEnter guards
 */
const EmptyComponent = defineComponent({
  render: () => null,
});

/**
 * Disable return-type rule to leave router 'component' imports with short syntax
 */

const router = createRouter({
  history: createWebHistory(),
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
          component: loadAsyncComponent(() => import(/* webpackChunkName: 'settings' */ './components/account/settings/Layout.vue')),
          redirect: 'account/general',
          children: [
            {
              path: 'general',
              name: 'account-general',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'settings' */'./components/account/settings/General.vue')),
            },
            {
              path: 'appearance',
              name: 'account-appearance',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'settings' */'./components/account/settings/Appearance.vue')),
            },
            {
              path: 'notifications',
              name: 'account-notifications',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'settings' */'./components/account/settings/Notifications.vue')),
            },
            {
              path: 'billing',
              name: 'account-billing',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'settings' */'./components/account/settings/Billing.vue')),
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
          component: loadAsyncComponent(() => import(/* webpackChunkName: 'workspace-settings' */ './components/workspace/settings/Layout.vue')),
          redirect: to => `/workspace/${to.params.workspaceId.toString()}/settings/general`,
          children: [
            {
              path: 'general',
              name: 'workspace-settings-general',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'workspace-settings' */ './components/workspace/settings/General.vue')),
              props: true,
            },
            {
              path: 'team',
              name: 'workspace-settings-team',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'workspace-team' */ './components/workspace/settings/Team.vue')),
            },
            {
              path: 'volume',
              name: 'workspace-settings-used-volume',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'workspace-used-volume' */ './components/workspace/settings/UsedVolume.vue')),
            },
            {
              path: 'billing',
              name: 'workspace-settings-billing',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'workspace-billing' */ './components/workspace/settings/Billing.vue')),
            },
          ],
        },

        /**
         * Project
         */
        {
          path: 'project/:projectId',
          component: loadAsyncComponent(() => import(/* webpackChunkName: 'project' */ './components/project/Project.vue')),
          children: [
            {
              path: '',
              name: 'project-overview',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-overview' */ './components/project/Overview.vue')),
              children: [
                /**
                 * Project Event
                 * -------------
                 */
                {
                  path: 'event/:eventId/:repetitionId?',
                  name: 'event',
                  component: loadAsyncComponent(() => import(/* webpackChunkName: 'event-overview' */ './components/event/Layout.vue')),
                  // eslint-disable-next-line jsdoc/require-param
                  /**
                   * Support old-style event urls:
                   *  - without repetitionId
                   *  - without tab
                   */
                  beforeEnter: (to, from, next) => {
                    /**
                     * Normalize path by removing trailing slashes
                     */
                    const normalizedPath = to.path.replace(/\/+$/, '');

                    /**
                     * Match the event route path pattern:
                     * /project/:projectId/event/:eventId[/:repetitionId][/:tab]
                     */
                    const pathMatch = normalizedPath.match(
                      /^\/project\/([^/]+)\/event\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?$/
                    );

                    if (!pathMatch) {
                      next();

                      return;
                    }

                    const projectId = pathMatch[1];
                    const eventId = pathMatch[2];
                    const segment3 = pathMatch[3];
                    const segment4 = pathMatch[4];
                    const knownTabs = new Set(['overview', 'repetitions', 'daily', 'affected']);

                    /**
                     * Determine if segment3 is a tab name or a repetitionId
                     */
                    const isSegment3Tab = segment3 !== undefined && knownTabs.has(segment3);

                    /**
                     * Legacy format: /project/:projectId/event/:eventId/:tab
                     * segment3 is a tab, segment4 is undefined
                     */
                    if (isSegment3Tab && segment4 === undefined) {
                      next(`/project/${projectId}/event/${eventId}/${eventId}/${segment3}`);

                      return;
                    }

                    /**
                     * Normal format: /project/:projectId/event/:eventId/:repetitionId/:tab
                     * segment3 is repetitionId, segment4 is tab
                     */
                    if (segment3 !== undefined && !isSegment3Tab && segment4 !== undefined) {
                      /**
                       * Already in correct format, continue
                       */
                      next();

                      return;
                    }

                    /**
                     * Missing tab: /project/:projectId/event/:eventId[/:repetitionId]
                     * Redirect to overview
                     */
                    if (segment4 === undefined) {
                      const repetitionId = segment3 && !isSegment3Tab ? segment3 : eventId;

                      next(`/project/${projectId}/event/${eventId}/${repetitionId}/overview`);

                      return;
                    }

                    next();
                  },
                  children: [
                    {
                      path: 'overview',
                      name: 'event-overview',
                      component: loadAsyncComponent(() => import(/* webpackChunkName: 'event-overview' */ './components/event/Overview.vue')),
                    },
                    {
                      path: 'repetitions',
                      name: 'event-repetitions',
                      component: loadAsyncComponent(() => import(/* webpackChunkName: 'event-repetitions' */ './components/event/Repetitions.vue')),
                    },
                    {
                      path: 'daily',
                      name: 'event-daily',
                      component: loadAsyncComponent(() => import(/* webpackChunkName: 'event-daily' */ './components/event/Daily.vue')),
                    },
                    {
                      path: 'affected',
                      name: 'event-affected',
                      component: loadAsyncComponent(() => import(/* webpackChunkName: 'event-affected' */ './components/event/UsersAffected.vue')),
                    },
                  ],
                },
              ],
            },
            {
              path: 'releases',
              name: 'project-releases',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-releases' */ './components/project/Releases.vue')),
              children: [
                {
                  path: ':release',
                  name: 'project-release',
                  component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-releases' */ './components/project/release/Layout.vue')),
                  redirect: { name: 'project-release-events' },
                  children: [
                    {
                      path: 'events',
                      name: 'project-release-events',
                      component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-release' */ './components/project/release/Events.vue')),
                    },
                    {
                      path: 'files',
                      name: 'project-release-files',
                      component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-release' */ './components/project/release/Files.vue')),
                    },
                    {
                      path: 'commits',
                      name: 'project-release-commits',
                      component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-release' */ './components/project/release/Commits.vue')),
                    },
                  ],
                },
              ],
            },
            {
              path: 'add-catcher',
              name: 'add-catcher',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-add-catcher' */ './components/catalog/catchers/AddCatcher.vue')),
            },
            {
              path: 'setup-catcher/:page',
              name: 'setup-catcher',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-add-catcher' */ './components/catalog/catchers/dynamicLoadGuidePages.js')),
            },
          ],
        },

        /**
         * Project Settings
         * -------------
         */
        {
          path: 'project/:projectId/settings',
          component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/Layout.vue')),
          children: [
            {
              path: 'general',
              name: 'project-settings-general',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/General.vue')),
            },
            {
              path: 'integrations',
              name: 'project-settings-integrations',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/Integrations.vue')),
            },
            {
              path: 'notifications',
              name: 'project-settings-notifications',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/Notifications.vue')),
            },
            {
              path: 'patterns',
              name: 'project-settings-patterns',
              component: loadAsyncComponent(() => import(/* webpackChunkName: 'project-settings' */ './components/project/settings/EventGroupingPattern.vue')),
            },
            {
              path: 'rate-limits',
              name: 'project-settings-rate-limits',
              component: loadAsyncComponent(() =>
                import(
                  /* webpackChunkName: 'project-settings' */ './components/project/settings/RateLimits.vue'
                )),
            },
          ],
        },
      ],
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: loadAsyncComponent(() => import(/* webpackChunkName: 'auth-pages' */ './components/auth/SignUp.vue')),
    },
    {
      path: '/login',
      name: 'login',
      component: loadAsyncComponent(() => import(/* webpackChunkName: 'auth-pages' */ './components/auth/Login.vue')),
      props: route => ({
        success: route.query.success as string | undefined,
        emailPrefilled: route.query.emailPrefilled as string | undefined,
      }),
    },
    {
      path: '/join/:inviteHash',
      component: EmptyComponent,
      beforeEnter: invitesHandler,
    },
    {
      path: '/join/:workspaceId/:inviteHash',
      component: EmptyComponent,
      beforeEnter: invitesHandler,
    },
    {
      path: '/recover',
      name: 'recover',
      component: loadAsyncComponent(() => import(/* webpackChunkName: 'auth-pages' */ './components/auth/RecoverPassword.vue')),
    },
    {
      path: '/unsubscribe/:projectId/:ruleId',
      component: EmptyComponent,
      beforeEnter: unsubscribeHandler,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authRoutes = /^\/(login|sign-up|recover)/;
  const routesAvailableWithoutAuth = /^\/(join|unsubscribe)/;

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
    void Analytics?.track(AnalyticsEventType.PageVisited, eventProperties);
  } catch (e) {
    console.error(e);
  }

  next();
});

export default router;
