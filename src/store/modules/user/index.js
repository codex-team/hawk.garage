import {
  LOGIN,
  SIGN_UP,
  SET_TOKENS,
  REFRESH_TOKENS,
  FETCH_CURRENT_USER,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  RECOVER_PASSWORD,
  CHANGE_NOTIFICATIONS_CHANNEL,
  CHANGE_NOTIFICATIONS_RECEIVE_TYPE,
  FETCH_NOTIFICATIONS_SETTINGS
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as userApi from '../../../api/user';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_TOKENS: 'SET_TOKENS', // Sets user's auth tokens (for example, after authentication or updating tokens)
  SET_CURRENT_USER: 'SET_CURRENT_USER', // Sets user's field
  SET_NOTIFICATIONS_SETTINGS: 'SET_NOTIFICATIONS_SETTINGS', // set the 'notifications' settings after mutations or fetch
};

/**
 * @typedef {object} User - represents user
 * @property {string} id - user's id
 * @property {string} email - user's email
 * @property {string} name - user's name
 * @property {string} password - user's password
 */

/**
 * @typedef {object} Passwords - represents password pair
 * @property {string} old - user's old password
 * @property {string} new - user's new password
 */

/**
 * Creates module state
 *
 * @returns {UserModuleState}
 */
function initialState() {
  return {
    accessToken: '',
    refreshToken: '',
    data: null,
  };
}

/**
 * All Vuex getters will be stored under this namespace
 *
 * @namespace Getters
 */
const getters = {
  /**
   * Returns true if the user is authenticated else false
   *
   * @param {UserModuleState} state - vuex state
   * @returns {boolean}
   */
  isAuthenticated: state => !!state.accessToken,
};

const actions = {
  /**
   * Send sign up request to the server and performs user login
   *
   * @param {object} context - vuex action context
   * @param {User} user - user's params for auth
   * @returns {Promise<void>} - sign up status
   */
  async [SIGN_UP](context, user) {
    const response = await userApi.signUp(user.email);

    /**
     * Response can contain errors.
     * Throw such errors to the Vue component to display them for user
     */
    if (response.errors && response.errors.length) {
      response.errors.forEach(error => {
        throw new Error(error.message);
      });
    }
  },

  /**
   * Send login request to the server and performs user login
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {User} user - user's params for auth
   */
  async [LOGIN]({ commit }, user) {
    const response = await userApi.login(user.email, user.password);

    /**
     * Response can contain errors.
     * Throw such errors to the Vue component to display them for user
     */
    if (response.errors && response.errors.length) {
      response.errors.forEach(error => {
        throw new Error(error.message);
      });

      return;
    }

    commit(mutationTypes.SET_TOKENS, response.data.login);
  },

  /**
   * Send recover password request to the server
   *
   * @param {object} context - vuex action context
   * @param {User} user - user's params for recovering password
   * @returns {Promise<void>}
   */
  async [RECOVER_PASSWORD](context, user) {
    const response = await userApi.recoverPassword(user.email);

    /**
     * Response can contain errors.
     * Throw such errors to the Vue component to display them for user
     */
    if (response.errors && response.errors.length) {
      response.errors.forEach(error => {
        throw new Error(error.message);
      });
    }
  },

  /**
   * Set tokens after callback from OAuth
   *
   * @param {Function} commit - standard Vuex commit function
   * @param {TokensPair} tokens - user's auth tokens
   */
  async [SET_TOKENS]({ commit }, tokens) {
    commit(mutationTypes.SET_TOKENS, tokens);
  },

  /**
   * Send request for refreshing tokens pair
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - standard Vuex commit function
   * @param {UserModuleState} context.state - vuex state
   *
   * @returns {Promise<TokensPair>}
   */
  async [REFRESH_TOKENS]({ commit, state }) {
    const tokens = await userApi.refreshTokens(state.refreshToken);

    commit(mutationTypes.SET_TOKENS, tokens);

    return tokens;
  },

  /**
   * Send request to fetch current user data
   *
   * @param {Function} commit - standard Vuex commit function
   */
  async [FETCH_CURRENT_USER]({ commit }) {
    const me = await userApi.fetchCurrentUser();

    commit(mutationTypes.SET_CURRENT_USER, me);
  },

  /**
   * Send request to update user profile data
   *
   * @param {object} context - vuex action context
   * @param {User} user - user's params to update
   */
  async [UPDATE_PROFILE](context, user) {
    return userApi.updateProfile(user.name, user.email, user.image);
  },

  /**
   * Send request to change user password
   *
   * @param {object} context - vuex action context
   * @param {Passwords} passwords - user's pair of passwords
   */
  async [CHANGE_PASSWORD](context, passwords) {
    return userApi.changePassword(passwords.old, passwords.new);
  },

  /**
   * Fetches notifications settings and put it to the state
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - allows to call mutation
   * @param {UserModuleState} context.state - module state
   * @returns {Promise<void>}
   */
  async [FETCH_NOTIFICATIONS_SETTINGS]({ commit, state }) {
    const { notifications } = await userApi.fetchNotificationsSettings();

    commit(mutationTypes.SET_CURRENT_USER, Object.assign({}, state.data, {
      notifications,
    }));
  },

  /**
   * Update account notifications channel settings
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - allows to call mutation
   * @param {UserModuleState} context.state - module state
   * @param {UserNotificationsChannels} channel - new channel value
   * @returns {Promise<void>}
   */
  async [CHANGE_NOTIFICATIONS_CHANNEL]({ commit, state }, channel) {
    const { notifications } = await userApi.updateNotificationsChannel(channel);

    commit(mutationTypes.SET_CURRENT_USER, Object.assign({}, state.data, {
      notifications,
    }));
  },

  /**
   * Update account notifications receive type settings
   *
   * @param {object} context - vuex action context
   * @param {Function} context.commit - allows to call mutation
   * @param {UserModuleState} context.state - module state
   * @param {UserNotificationsReceiveTypesConfig} payload - Receive Type with its is-enabled state,
   *                                                        for example, {IssueAssigning: true}
   * @returns {Promise<void>}
   */
  async [CHANGE_NOTIFICATIONS_RECEIVE_TYPE]({ commit, state }, payload) {
    const { notifications } = await userApi.updateNotificationsReceiveType(payload);

    commit(mutationTypes.SET_CURRENT_USER, Object.assign({}, state.data, {
      notifications,
    }));
  },

  /**
   * Resets module state
   *
   * @param {Function} commit - standard Vuex commit function
   */
  [RESET_STORE]({ commit }) {
    commit(RESET_STORE);
  },
};

const mutations = {
  /**
   * Mutation caused by successful authentication
   *
   * @param {UserModuleState} state - Vuex state
   *
   * @param {object} payload - vuex mutation payload
   * @param {string} payload.accessToken - user's access token
   * @param {string} payload.refreshToken - user's refresh token for getting new tokens pair
   */
  [mutationTypes.SET_TOKENS](state, { accessToken, refreshToken }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
  },

  /**
   * Set users data to state
   *
   * @param {UserModuleState} state - Vuex state
   * @param {User} user – user's object to set
   */
  [mutationTypes.SET_CURRENT_USER](state, user) {
    state.data = user;
  },

  /**
   * Resets module state
   *
   * @param {UserModuleState} state - Vuex state
   */
  [RESET_STORE](state) {
    Object.assign(state, initialState());
  },
};

export default {
  state: initialState(),
  getters,
  actions,
  mutations,
};
