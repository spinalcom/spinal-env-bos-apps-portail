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
  getRegisteredAuthPlatformRequest,
  registerAuthPlatformRequest,
  updateAuthPlatformRequest,
  deleteAuthPlatformRequest,
} from "../requests";

Vue.use(Vuex);

const SET_AUTH_PLATFORM_INFO = "SET_AUTH_PLATFORM_INFO";
const DELETE_AUTH_PLATFORM_INFO = "DELETE_AUTH_PLATFORM_INFO";

export default new Vuex.Store({
  state: {
    authPlatformInfo: undefined,
  },
  getters: {},
  mutations: {
    [SET_AUTH_PLATFORM_INFO](state: any, playload: any) {
      state.authPlatformInfo = playload;
    },

    [DELETE_AUTH_PLATFORM_INFO](state: any, { removed }: any) {
      if (removed) state.authPlatformInfo = undefined;
    },
  },
  actions: {
    async getAuthPlatformInfo({ commit }: any) {
      try {
        const response = await getRegisteredAuthPlatformRequest();
        if (response.data) commit(SET_AUTH_PLATFORM_INFO, response.data);
      } catch (error) {
        return;
      }
    },

    async _registerAuthPlatform({ commit }: any, data: any) {
      const response = await registerAuthPlatformRequest(data);

      if (response.data) {
        commit(SET_AUTH_PLATFORM_INFO, response.data);
        return response.data;
      }
    },

    async updateAuthPlatform() {
      return updateAuthPlatformRequest();
    },

    async deleteAuthPlatform({ commit }: any) {
      const response = await deleteAuthPlatformRequest();
      if (response.data) {
        commit(DELETE_AUTH_PLATFORM_INFO, response.data);
        return response.data;
      }
    },
  },
});
