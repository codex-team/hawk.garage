import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import workspaces from './modules/workspaces';
import projects from './modules/projects';
import modalDialog from './modules/modalDialog';
import events, { EventsModuleState } from './modules/events/index';
import plans, { PlansModuleState } from './modules/plans/index';

import createPersistedState from 'vuex-persistedstate';
import { User } from '../types/user';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

/**
 * This structure represents state of User Module
 *
 * @todo rewrite User Module to ts and move this interface there
 */
interface UserModuleState {
  /**
   * User's access token
   */
  accessToken: string;

  /**
   * User's refresh token for getting new tokens pair
   */
  refreshToken: string;

  /**
   * User account data
   */
  data: User;
}

/**
 * Root state with all modules
 */
export interface RootState {
  events: EventsModuleState;
  user: UserModuleState;
  plans: PlansModuleState;
}

/**
 * TS ignore used to allow to connect not-refactored .js modules to TypeScript Vuex Module type
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export default new Vuex.Store({
  modules: {
    // @ts-ignore
    app,
    // @ts-ignore
    user,
    // @ts-ignore
    workspaces,
    // @ts-ignore
    projects,
    // @ts-ignore
    modalDialog,

    events,

    plans,
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
