import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import Home from './pages/Home';
import Settings from './pages/Settings.vue';
import SignUp from './pages/SignUp.vue';
import Login from './pages/Login.vue';

Vue.use(Router);

const isAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    return next();
  }
  next('/login');
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: isAuthenticated
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
