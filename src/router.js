import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import Home from './pages/Home';
import Settings from './pages/Settings';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/:workspaceId/settings',
          name: 'workspace-settings',
          component: () => import(/* webpackChunkName: 'workspace-settings' */ './pages/workspaces/Settings')
        },
        {
          path: '/create-workspace',
          name: 'create-workspace',
          component: () => import(/* webpackChunkName: 'create-workspace' */ './components/CreateWorkspace')
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
