import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import workspaces from './modules/workspaces';
import projects from './modules/projects';
import modalDialog from './modules/modalDialog';
import events from './modules/events/index.ts';

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    app,
    user,
    workspaces,
    projects,
    modalDialog,
    events,
  },
  plugins: [
    createPersistedState({
      paths: [
        'app',
        'user',
      ],
    }),
  ],
  strict: debug,
});
