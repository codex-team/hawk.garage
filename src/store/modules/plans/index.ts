import Vue from 'vue';
import { Plan } from '@/types/plan';
import { FETCH_PLANS } from './actionTypes';
import * as plansApi from '@/api/plans';

enum MutationType {
  SetPlans = 'SET_PLANS' // set plans to store
}

/**
 * Module state interface
 */
export interface PlansModuleState {
  /**
   * List of available plans
   */
  list: Plan[];
}

/**
 * Returns initial module state
 */
function initialState(): PlansModuleState {
  return { list: [] };
}

const getters = {
  /**
   * Returns tariff plan by id
   *
   * @param state - module state
   */
  getPlanById: (state: PlansModuleState) => (id: string): Plan | undefined => {
    return state.list.find(plan => plan.id === id);
  },
};

const actions = {
  /**
   * Fetch and set tariff plans
   *
   * @param commit - VueX commit method
   */
  async [FETCH_PLANS]({ commit }): Promise<void> {
    const plans = await plansApi.getPlans();

    commit(MutationType.SetPlans, plans);
  },
};

const mutations = {
  /**
   * Set plans to store
   *
   * @param state - module state
   * @param plans - plans to set
   */
  [MutationType.SetPlans](state: PlansModuleState, plans: Plan[]): void {
    Vue.set(state, 'list', plans);
  },
};

export default {
  state: initialState(),
  actions,
  getters,
  mutations,
};
