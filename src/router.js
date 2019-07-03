import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import AppShell from './components/AppShell';
import Settings from './components/Settings';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';

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
          path: '/workspaces/:workspaceId/settings',
          name: 'workspace-settings',
          component: () => import(/* webpackChunkName: 'workspace-settings' */ './components/workspaces/Settings')
        },
        {
          path: '/workspaces/create',
          name: 'workspace-create',
          component: () => import(/* webpackChunkName: 'workspace-create' */ './components/workspaces/Create')
        },
        {
          path: '/projects/:projectId',
          name: 'project-overview',
          component: () => import(/* webpackChunkName: 'project-overview' */ './components/projects/ProjectOverview.vue')
        }
      ]
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
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
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authRoutes = /^\/(login|sign-up)/;

  if (store.getters.isAuthenticated) {
    if (authRoutes.test(to.fullPath)) {
      next('/');
    }
  } else {
    if (!authRoutes.test(to.fullPath)) {
      next('/login');
    }
  }
  next();
});

export default router;
