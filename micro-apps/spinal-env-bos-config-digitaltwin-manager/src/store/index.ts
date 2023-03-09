/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import Vue from "vue";
import Vuex from "vuex";
import {
  addDigitalTwinRequest,
  getAllDigitalTwinRequest,
  getActualDigitalTwinRequest,
  getDigitalTwinRequest,
  deleteDigitalTwinRequest,
  setAsActualDigitalTwinRequest
} from "../requests";


import {
  ADD_DIGITALTWIN,
  SET_DIGITALTWINS,
  SET_ACTUAL_DIGITALTWIN,
  DELETE_DIGITALTWIN
} from "./mutations";

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    digitalTwins: [],
    actualDigitalTwin: undefined
  },

  mutations: {
    [ADD_DIGITALTWIN](state: any, playload: any) {
      state.digitalTwins = [...state.digitalTwins, playload]
    },

    [SET_DIGITALTWINS](state, playload) {
      state.digitalTwins = playload;
    },

    [SET_ACTUAL_DIGITALTWIN](state, playload) {
      state.actualDigitalTwin = playload;
    },

    [DELETE_DIGITALTWIN](state, id) {
      state.digitalTwins = state.digitalTwins.filter(el => el.id !== id);
    },

  },
  actions: {
    async addDigitalTwin({ commit }, data: any) {
      const digitalTwin = await addDigitalTwinRequest(data);
      if (digitalTwin) {
        commit(ADD_DIGITALTWIN, digitalTwin);
        if (data.set_as_actual_digitaltwin) commit(SET_ACTUAL_DIGITALTWIN, digitalTwin);
      }

    },

    async getAllDigitalTwin({ commit }) {
      try {
        const digitalTwins = await getAllDigitalTwinRequest();
        if (digitalTwins) commit(SET_DIGITALTWINS, digitalTwins);
      } catch (error) { }
    },

    async getActualDigitalTwin({ commit }) {
      try {
        const digitalTwin = await getActualDigitalTwinRequest();
        if (digitalTwin) commit(SET_ACTUAL_DIGITALTWIN, digitalTwin);
      } catch (error) { }
    },

    async getDigitalTwin({ commit, state }, id) {
      try {
        let digitalTwin = state.digitalTwins.find(el => el.id === id);
        if (!digitalTwin) digitalTwin = await getDigitalTwinRequest(id);
        return digitalTwin;
      } catch (error) { }
    },

    async deleteDigitalTwin({ commit }, id) {
      try {
        await deleteDigitalTwinRequest(id);
        commit(DELETE_DIGITALTWIN, id);
      } catch (error) { }
    },

    async setAsActualDigitalTwin({ commit }, id) {
      try {
        const digitalTwin = await setAsActualDigitalTwinRequest(id);
        if (digitalTwin) commit(SET_ACTUAL_DIGITALTWIN, digitalTwin);
      } catch (error) { }
    },

  }
});
