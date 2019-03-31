import Vue from 'vue';
import Router from 'vue-router';
import Settings from './pages/Settings.vue';
import SignUp from './pages/SignUp.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/sign-up'
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
    }
  ]
});
