import Vue from 'vue';

import clickOutside from './clickOutside';
import copyable from './copyable';
import infiniteScroll from 'vue-infinite-scroll';
Vue.use(infiniteScroll);

Vue.directive('click-outside', clickOutside);
Vue.directive('copyable', copyable);
