/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth';
import axios from 'axios';

const apiMockup = {
  login(email, password) {
    return { response: { accessToken: `${email}${password}` } };
  }
};

const state = {
  token: localStorage.getItem('user-token') || '',
  status: ''
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
};

const actions = {
  async [AUTH_REQUEST]({ commit, dispatch }, user) {
    commit(AUTH_REQUEST);

    try {
      const response = await apiMockup.login(user.email, user.password);

      commit(AUTH_SUCCESS, response);
    } catch (e) {
      commit(AUTH_ERROR);
      throw e;
    }
  }
};

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, response) => {
    const accessToken = response.accessToken;

    localStorage.setItem('access-token', accessToken);
    axios.defaults.headers.common['Authorization'] = accessToken;
    state.status = 'success';
    state.token = accessToken;
  },
  [AUTH_ERROR]: (state) => {
    localStorage.removeItem('user-token');
    state.status = 'error';
  },
  [AUTH_LOGOUT]: (state) => {
    localStorage.removeItem('user-token');
    state.token = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
