import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import Home from './pages/Home';
import Settings from './pages/Settings.vue';
import SignUp from './pages/SignUp.vue';
import Login from './pages/Login.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
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
  const loginRoutes = /^\/(login|sign-up)/;

  if (store.getters.isAuthenticated) {
    if (loginRoutes.test(to.fullPath)) {
      next('/');
    }
  } else {
    if (!loginRoutes.test(to.fullPath)) {
      next('/login');
    }
  }
  next();
});

export default router;
