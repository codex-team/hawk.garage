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
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/Account.vue')
            },
            {
              path: 'appearance',
              name: 'appearance-settings',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/Appearance.vue')
            },
            {
              path: 'billing',
              name: 'billing-settings',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/Billing.vue')
            }
          ]
        },
        {
          path: 'workspaces/:workspaceId',
          name: 'workspace-settings',
          component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspaces/Settings.vue'),
          redirect: 'workspaces/:workspaceId/settings',
          children: [
            {
              path: 'settings',
              name: 'workspace-settings-workspace',
              component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspaces/Workspace.vue')
            },
            {
              path: 'billing',
              name: 'workspace-billing',
              component: () => import(/* webpackChunkName: 'workspace-billing' */ './components/workspaces/Billing.vue')
            },
            {
              path: 'team',
              name: 'workspace-team',
              component: () => import(/* webpackChunkName: 'workspace-team' */ './components/workspaces/Team.vue')
            }
          ]
        },
        {
          path: 'projects/:projectId',
          name: 'project-overview',
          component: () => import(/* webpackChunkName: 'project-overview' */ './components/projects/Overview.vue'),
          children: [
            {
              path: 'event/:eventId/repetitions',
              name: 'event-repetitions-overview',
              component: () => import(/* webpackChunkName: 'event-repetitions-overview' */ './components/repetitions/Overview.vue')
            },
            {
              path: 'event/:eventId/:repetitionId?',
              name: 'event-overview',
              component: () => import(/* webpackChunkName: 'event-overview' */ './components/events/Overview.vue')
            },
            {
              path: 'settings',
              name: 'project-settings',
              component: () => import(/* webpackChunkName: 'project-settings' */ './components/projects/Settings.vue'),
              redirect: 'settings/integrations',
              children: [
                {
                  path: 'integrations',
                  name: 'project-integrations',
                  component: () => import(/* webpackChunkName: 'project-integrations' */ './components/projects/Integrations.vue')
                }
              ]
            }
          ]
        },
        {
          path: 'projects/:projectId/add-catcher',
          name: 'add-catcher',
          component: () => import(/* webpackChunkName: 'project-add-catcher' */ './components/catalog/catchers/AddCatcher.vue')
        },
        {
          path: 'projects/:projectId/setup-catcher/:page',
          name: 'setup-catcher',
          component: () => import(/* webpackChunkName: 'project-add-catcher' */ './components/catalog/catchers/dynamicLoadGuidePages.js')
        }
      ]
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import(/* webpackChunkName: 'auth-pages' */ './components/auth/SignUp.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: 'auth-pages' */ './components/auth/Login.vue')
    },
    {
      path: '/join/:workspaceId/:inviteHash?',
      beforeEnter: async (to, from, next) => (await import(/* webpackChunkName: 'invites-handler' */'./invitesHandler')).default(to, from, next)
    },
    {
      path: '/reset',
      name: 'recoverPassword',
      component: () => import(/* webpackChunkName: 'auth-pages' */ './components/auth/RecoverPassword.vue')
    }
  ]
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
