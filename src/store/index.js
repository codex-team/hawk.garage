import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import auth from './modules/auth';
import workspaces from './modules/workspaces';
import projects from './modules/projects';
import events from './modules/events';

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    app,
    auth,
    workspaces,
    projects,
    events
  },
  plugins: [ createPersistedState() ],
  strict: debug
});
