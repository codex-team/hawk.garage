/* eslint no-shadow: ["error", { "allow": ["state", "getters"] }] */
import {
  FETCH_EVENT_REPETITIONS
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as projectsApi from '../../../api/projects';
import * as eventsApi from '../../../api/events';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_REPETITIONS_LIST: 'SET_REPETITIONS_LIST'
};

/**
 * @typedef {object} Project - represent project in workspace
 * @property {String} id - project id
 * @property {String} name - project name
 * @property {String} workspaceId - ID of the workspace to which the project belongs
 * @property {String} [image] - project image
 */

/**
 * Module state
 * @typedef {object} ProjectsModuleState
 * @property {array<Project>} list - user's projects
 */

/**
 * Creates module state
 * @return {WorkspacesModuleState}
 */
function initialState() {
  return {
    /**
     * Holds event's repetitions
     * object key is event id
     */
    repetitions: {}
  };
}

/**
 * Module getters
 */
const getters = {

};

const actions = {
  getEventRepetitions({ commit, state }, { eventId }) {
    return state.repetitions[eventId];
  },

  async [FETCH_EVENT_REPETITIONS]({ commit }, { projectId, eventId }) {
    const repetitions = await eventsApi.getRepetitions(projectId, eventId);

    commit(mutationTypes.SET_REPETITIONS_LIST, {
      eventId,
      repetitions
    });
  }
};

const mutations = {
  /**
   */
  [mutationTypes.SET_REPETITIONS_LIST](state, { eventId, repetitions }) {
    state.repetitions[eventId] = repetitions;
  },

  /**
   * Resets module state
   * @param {ProjectsModuleState} state - Vuex state
   */
  [RESET_STORE](state) {
    Object.assign(state, initialState());
  }
};

export default {
  state: initialState(),
  getters,
  actions,
  mutations
};
