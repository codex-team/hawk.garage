import Vue from 'vue';
import Router from 'vue-router';
import notifier from 'codex-notifier';
import store from './store';

import AppShell from './components/AppShell';

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
            },
            {
              path: 'billing',
              name: 'billing-settings',
              component: () => import(/* webpackChunkName: 'settings' */'./components/account/Billing')
            }
          ]
        },
        {
          path: 'workspaces/:workspaceId',
          name: 'workspace-settings',
          component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspaces/Settings'),
          redirect: to => ({
            name: 'workspace-settings',
            params: { workspaceId: to.params.workspaceId }
          }),
          children: [
            {
              path: 'settings',
              name: 'workspace-settings-workspace',
              component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspaces/Workspace')
            },
            {
              path: 'billing',
              name: 'workspace-billing',
              component: () => import(/* webpackChunkName: 'workspace-billing' */ './components/workspaces/Billing')
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
            },
            {
              path: 'event/:eventId/repetitions',
              name: 'event-repetitions-overview',
              component: () => import(/* webpackChunkName: 'event-repetitions-overview' */ './components/repetitions/Overview.vue')
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
      component: () => import(/* webpackChunkName: 'auth-pages' */ './components/auth/SignUp')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: 'auth-pages' */ './components/auth/Login')
    },
    {
      path: '/join/:workspaceId/:inviteHash?',
      beforeEnter: async (to, from, next) => (await import(/* webpackChunkName: 'invites-handler' */'./invitesHandler')).default(to, from, next)
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

router.beforeEach((to, from, next) => {
  if (to.query.error) {
    notifier.show({
      message: to.query.error,
      style: 'error',
      time: 5000
    });
  }
  next();
});

export default router;
