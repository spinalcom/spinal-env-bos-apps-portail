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

import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import { IApp, IState } from "../types/interfaces"

import {
  createBuildingAppsRequest,
  createAdminAppsRequest,
  getAllBuildingAppsRequest,
  getAllAdminAppsRequest,
  getBuildingAppRequest,
  getAdminAppRequest,
  deleteBuildingAppRequest,
  deleteAdminAppRequest,
  updateBuildingAppRequest,
  updateAdminAppRequest,
  uploadAdminFileRequest,
  uploadBuildingFileRequest
} from "../requests";


import {
  SET_BUILDINGS_APPS,
  SET_ADMIN_APPS,
  ADD_BUILDINGS_APPS,
  ADD_ADMIN_APPS,
  REMOVE_BUILDINGS_APPS,
  REMOVE_ADMIN_APPS,
  EDIT_BUILDINGS_APPS,
  EDIT_ADMIN_APPS
} from './mutations'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    portofolioApps: [],
    buildingApps: [],
    adminApps: []
  },
  getters: {
  },
  mutations: {

    [SET_BUILDINGS_APPS](state: IState, playload: IApp[]) {
      state.buildingApps = playload;
    },
    [SET_ADMIN_APPS](state: IState, playload: IApp[]) {
      state.adminApps = playload;
    },

    [ADD_BUILDINGS_APPS](state: IState, playload: IApp) {
      state.buildingApps = [...state.buildingApps, playload];
    },
    [ADD_ADMIN_APPS](state: IState, playload: IApp) {
      state.adminApps = [...state.adminApps, playload];
    },

    [REMOVE_BUILDINGS_APPS](state: IState, id: string) {
      state.buildingApps = state.buildingApps.filter((el: IApp) => el.id !== id);
    },
    [REMOVE_ADMIN_APPS](state: IState, id: string) {
      state.adminApps = state.adminApps.filter((el: IApp) => el.id !== id);
    },

    [EDIT_BUILDINGS_APPS](state: IState, { id, data }: { id: string; data: IApp }) {
      const index = state.buildingApps.findIndex((el: IApp) => el.id === id)
      if (index !== -1) {
        state.buildingApps[index] = data;
      }
    },
    [EDIT_ADMIN_APPS](state: IState, { id, data }: { id: string; data: IApp }) {
      const index = state.adminApps.findIndex((el: IApp) => el.id === id)
      if (index !== -1) {
        state.adminApps[index] = data;
      }
    },
  },
  actions: {

    async createBuildingApps({ commit }: ActionContext<IState, any>, appInfo: IApp) {
      const { data } = await createBuildingAppsRequest(appInfo);
      commit(ADD_BUILDINGS_APPS, data);
    },
    async createAdminApps({ commit }: ActionContext<IState, any>, appInfo: IApp) {
      const { data } = await createAdminAppsRequest(appInfo);
      commit(ADD_ADMIN_APPS, data);
    },

    async getAllBuildingApps({ commit }: ActionContext<IState, any>) {
      const response: any = await getAllBuildingAppsRequest()
      commit(SET_BUILDINGS_APPS, response.data);
    },
    async getAllAdminApps({ commit }: ActionContext<IState, any>) {
      const response: any = await getAllAdminAppsRequest()
      commit(SET_ADMIN_APPS, response.data);
    },

    async getBuildingApp({ state }: ActionContext<IState, any>, id: string) {
      if (state.buildingApps && state.buildingApps.length > 0) return state.buildingApps;
      return getBuildingAppRequest(id)
    },
    async getAdminApp({ state }: ActionContext<IState, any>, id: string) {
      if (state.adminApps && state.adminApps.length > 0) return state.adminApps;
      return getAdminAppRequest(id)
    },

    //*delete By Id

    async deleteBuildingApp({ commit }: ActionContext<IState, any>, id: string) {
      const { data } = await deleteBuildingAppRequest(id)
      commit(REMOVE_BUILDINGS_APPS, id)
    },
    async deleteAdminApp({ commit }: ActionContext<IState, any>, id: string) {
      const { data } = await deleteAdminAppRequest(id)
      commit(REMOVE_ADMIN_APPS, id)
    },


    async updateBuildingApp({ commit }: ActionContext<IState, any>, { id, newValue }: { id: string; newValue: IApp }) {
      const { data } = await updateBuildingAppRequest(id, newValue)
      commit(EDIT_BUILDINGS_APPS, { id, data });
    },
    async updateAdminApp({ commit }: ActionContext<IState, any>, { id, newValue }: { id: string; newValue: IApp }) {
      const { data } = await updateAdminAppRequest(id, newValue)
      commit(EDIT_ADMIN_APPS, { id, data });
    },


    // upload

    async uploadAdminFile({ dispatch }: ActionContext<IState, any>, fileData: FormData) {
      const response = await uploadAdminFileRequest(fileData);
      await dispatch("getAllAdminApps");
    },
    async uploadBuildingFile({ dispatch }: ActionContext<IState, any>, fileData: FormData) {
      const response = await uploadBuildingFileRequest(fileData);
      await dispatch("getAllBuildingApps");
    }

  },
  modules: {
  }
})
