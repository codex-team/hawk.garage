import { createStore } from 'vuex';

import app from './modules/app';
import user from './modules/user';
import workspaces from './modules/workspaces';
import projects from './modules/projects';
import modalDialog from './modules/modalDialog';
import type { EventsModuleState } from './modules/events/index';
import events from './modules/events/index';
import type { PlansModuleState } from './modules/plans/index';
import plans from './modules/plans/index';
import demo, { type DemoState } from './modules/demo';

import createPersistedState from 'vuex-persistedstate';
import type { User } from '../types/user';

const debug = import.meta.env.MODE !== 'production';

/**
 * This structure represents state of User Module
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
  demo: DemoState;
}

/**
 * TS ignore used to allow to connect not-refactored .js modules to TypeScript Vuex Module type
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export default createStore({
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

    demo,
  },
  plugins: [
    createPersistedState({
      paths: [
        'app',
        'user',
        'demo',
      ],
    }),
  ],
  strict: debug,
});
