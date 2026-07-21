/**
 * Demo mode Vuex module
 *
 * Manages demo mode state which replaces all API calls with mock data
 */

import type { Commit } from 'vuex';

export interface DemoState {
  /**
   * Whether demo mode is currently active
   */
  isActive: boolean;
}

/**
 * Initial state
 */
const state: DemoState = {
  isActive: false,
};

/**
 * Getters
 */
const getters = {
  /**
   * Check if demo mode is active
   * @param state
   */
  isDemoMode(state: DemoState): boolean {
    return state.isActive;
  },
};

/**
 * Mutations
 */
const mutations = {
  /**
   * Enable demo mode
   * @param state
   */
  ENABLE_DEMO(state: DemoState): void {
    state.isActive = true;
    console.log('[Demo Mode] Enabled - all API calls will use mock data');
  },

  /**
   * Disable demo mode
   * @param state
   */
  DISABLE_DEMO(state: DemoState): void {
    state.isActive = false;
    console.log('[Demo Mode] Disabled - API calls will use real server');
  },

  /**
   * Set demo mode state
   * @param state
   * @param isActive
   */
  SET_DEMO(state: DemoState, isActive: boolean): void {
    state.isActive = isActive;
    console.log(`[Demo Mode] ${isActive ? 'Enabled' : 'Disabled'}`);
  },
};

/**
 * Actions
 */
const actions = {
  /**
   * Toggle demo mode on/off
   * @param root0
   */
  toggleDemo({ commit, state }: { commit: Commit;
    state: DemoState; }): void {
    commit('SET_DEMO', !state.isActive);
  },

  /**
   * Enable demo mode
   * @param root0
   */
  enableDemo({ commit }: { commit: Commit }): void {
    commit('ENABLE_DEMO');
  },

  /**
   * Disable demo mode
   * @param root0
   */
  disableDemo({ commit }: { commit: Commit }): void {
    commit('DISABLE_DEMO');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
