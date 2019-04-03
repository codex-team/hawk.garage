import Vue from 'vue';
import Router from 'vue-router';
import Home from './pages/Home.vue';
import Settings from './pages/Settings.vue';
import SignUp from './pages/SignUp.vue';
import Login from './pages/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/login'
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
