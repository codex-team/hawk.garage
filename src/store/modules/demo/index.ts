/**
 * Demo mode Vuex module
 *
 * Manages demo mode state which replaces all API calls with mock data
 */

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
   */
  ENABLE_DEMO(state: DemoState): void {
    state.isActive = true;
    console.log('[Demo Mode] Enabled - all API calls will use mock data');
  },

  /**
   * Disable demo mode
   */
  DISABLE_DEMO(state: DemoState): void {
    state.isActive = false;
    console.log('[Demo Mode] Disabled - API calls will use real server');
  },

  /**
   * Set demo mode state
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
   */
  toggleDemo({ commit, state }: { commit: Function; state: DemoState }): void {
    commit('SET_DEMO', !state.isActive);
  },

  /**
   * Enable demo mode
   */
  enableDemo({ commit }: { commit: Function }): void {
    commit('ENABLE_DEMO');
  },

  /**
   * Disable demo mode
   */
  disableDemo({ commit }: { commit: Function }): void {
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
