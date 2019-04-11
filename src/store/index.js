import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import workspaces from './modules/workspaces';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    auth,
    workspaces
  },
  strict: debug
});
