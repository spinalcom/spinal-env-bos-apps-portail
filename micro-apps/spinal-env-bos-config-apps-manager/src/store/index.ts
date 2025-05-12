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

import Vue from 'vue';
import Vuex, { ActionContext } from 'vuex';
import type { ISpinalApp } from '../types/ISpinalApp';

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
  uploadBuildingFileRequest,
  uploadBuildingAppConfigFileRequest,
  deleteBuildingSubAppRequest,
  updateBuildingSubAppRequest,
  createBuildingSubAppsRequest,
} from '../requests';

import {
  SET_BUILDINGS_APPS,
  SET_ADMIN_APPS,
  ADD_BUILDINGS_APPS,
  ADD_ADMIN_APPS,
  REMOVE_BUILDINGS_APPS,
  REMOVE_ADMIN_APPS,
  EDIT_BUILDINGS_APPS,
  EDIT_ADMIN_APPS,
  REMOVE_BUILDINGS_SUB_APPS,
  EDIT_BUILDINGS_SUB_APPS,
  ADD_BUILDINGS_SUB_APPS,
} from './mutations';
import { ISubApp } from '../types';

Vue.use(Vuex);
export interface IState {
  buildingApps: ISpinalApp[];
  adminApps: ISpinalApp[];
}

export default new Vuex.Store<IState>({
  state: {
    buildingApps: [],
    adminApps: [],
  },
  getters: {},
  mutations: {
    [SET_BUILDINGS_APPS](state: IState, playload: ISpinalApp[]) {
      state.buildingApps = playload;
    },
    [SET_ADMIN_APPS](state: IState, playload: ISpinalApp[]) {
      state.adminApps = playload;
    },

    [ADD_BUILDINGS_APPS](state: IState, playload: ISpinalApp) {
      state.buildingApps = [...state.buildingApps, playload];
    },
    [ADD_ADMIN_APPS](state: IState, playload: ISpinalApp) {
      state.adminApps = [...state.adminApps, playload];
    },
    [ADD_BUILDINGS_SUB_APPS](
      state: IState,
      o: { data: ISubApp; appId: string }
    ) {
      const index = state.buildingApps.findIndex(
        (el: ISpinalApp) => el.id === o.appId
      );
      if (index !== -1) {
        const app = state.buildingApps[index];
        if (!Array.isArray(app.subApps)) app.subApps = [];
        app.subApps.push(o.data);
      }
    },

    [REMOVE_BUILDINGS_APPS](state: IState, id: string) {
      state.buildingApps = state.buildingApps.filter(
        (el: ISpinalApp) => el.id !== id
      );
    },
    [REMOVE_BUILDINGS_SUB_APPS](
      state: IState,
      { appId, configId }: { appId: string; configId: string }
    ) {
      for (const apps of state.buildingApps) {
        if (apps.id === appId) {
          if (!apps.subApps) break; // should not happen
          const idx = apps.subApps.findIndex(
            (el: ISpinalApp) => el.id === configId
          );
          if (idx !== -1) {
            apps.subApps.splice(idx, 1);
            break;
          }
          break;
        }
      }
    },

    [REMOVE_ADMIN_APPS](state: IState, id: string) {
      state.adminApps = state.adminApps.filter(
        (el: ISpinalApp) => el.id !== id
      );
    },

    [EDIT_BUILDINGS_APPS](
      state: IState,
      { id, data }: { id: string; data: ISpinalApp }
    ) {
      const index = state.buildingApps.findIndex(
        (el: ISpinalApp) => el.id === id
      );
      if (index !== -1) {
        const app = state.buildingApps[index];
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            app[key] = data[key];
          }
        }
      }
    },
    [EDIT_ADMIN_APPS](
      state: IState,
      { id, data }: { id: string; data: ISpinalApp }
    ) {
      const index = state.adminApps.findIndex((el: ISpinalApp) => el.id === id);
      if (index !== -1) {
        const app = state.adminApps[index];
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            app[key] = data[key];
          }
        }
      }
    },
    [EDIT_BUILDINGS_SUB_APPS](
      state: IState,
      { appId, id, data }: { appId: string; id: string; data: ISubApp }
    ) {
      const index = state.buildingApps.findIndex(
        (el: ISpinalApp) => el.id === appId
      );
      if (index === -1) return;
      const app = state.buildingApps[index];
      if (!Array.isArray(app.subApps)) return;
      const index2 = app.subApps.findIndex((el: ISubApp) => el.id === id);
      if (index2 === -1) return;
      const subApp = app.subApps[index2];
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          subApp[key] = data[key];
        }
      }
    },
  },
  actions: {
    async createBuildingApps(
      { commit }: ActionContext<IState, any>,
      appInfo: ISpinalApp
    ) {
      const { data } = await createBuildingAppsRequest(appInfo);
      if (!Array.isArray(data.subApps)) data.subApps = [];
      commit(ADD_BUILDINGS_APPS, data);
    },
    async createAdminApps(
      { commit }: ActionContext<IState, any>,
      appInfo: ISpinalApp
    ) {
      const { data } = await createAdminAppsRequest(appInfo);
      commit(ADD_ADMIN_APPS, data);
    },
    async createBuildingSubApps(
      { commit }: ActionContext<IState, any>,
      o: { newValue: ISubApp; appId: string }
    ) {
      const { data } = await createBuildingSubAppsRequest(o.appId, o.newValue);
      commit(ADD_BUILDINGS_SUB_APPS, { data, appId: o.appId });
    },

    async getAllBuildingApps({ commit }: ActionContext<IState, any>) {
      const response: any = await getAllBuildingAppsRequest();
      for (const app of response.data) {
        if (!Array.isArray(app.subApps)) app.subApps = [];
      }
      commit(SET_BUILDINGS_APPS, response.data);
    },
    async getAllAdminApps({ commit }: ActionContext<IState, any>) {
      const response: any = await getAllAdminAppsRequest();
      commit(SET_ADMIN_APPS, response.data);
    },

    async getBuildingApp({ state }: ActionContext<IState, any>, id: string) {
      if (state.buildingApps && state.buildingApps.length > 0)
        return state.buildingApps;
      return getBuildingAppRequest(id);
    },
    async getAdminApp({ state }: ActionContext<IState, any>, id: string) {
      if (state.adminApps && state.adminApps.length > 0) return state.adminApps;
      return getAdminAppRequest(id);
    },

    //*delete By Id
    async deleteBuildingApp(
      { commit }: ActionContext<IState, any>,
      id: string
    ) {
      const { data } = await deleteBuildingAppRequest(id);
      commit(REMOVE_BUILDINGS_APPS, id);
    },
    async deleteBuildingAppConfig(
      { state, commit }: ActionContext<IState, any>,
      id: string
    ) {
      const app = state.buildingApps.find((itm) => {
        return itm.subApps?.find((subApp) => subApp.id === id);
      });
      await deleteBuildingSubAppRequest(app.id, id);
      commit(REMOVE_BUILDINGS_SUB_APPS, { appId: app.id, configId: id });
    },
    async deleteAdminApp({ commit }: ActionContext<IState, any>, id: string) {
      const { data } = await deleteAdminAppRequest(id);
      commit(REMOVE_ADMIN_APPS, id);
    },

    // update
    async updateBuildingApp(
      { commit }: ActionContext<IState, any>,
      { id, newValue }: { id: string; newValue: ISpinalApp }
    ) {
      const { data } = await updateBuildingAppRequest(id, newValue);
      commit(EDIT_BUILDINGS_APPS, { id, data });
    },
    async updateAdminApp(
      { commit }: ActionContext<IState, any>,
      { id, newValue }: { id: string; newValue: ISpinalApp }
    ) {
      const { data } = await updateAdminAppRequest(id, newValue);
      commit(EDIT_ADMIN_APPS, { id, data });
    },
    async updateBuildingSubApp(
      { commit }: ActionContext<IState, any>,
      { appId, id, newValue }: { appId: string; id: string; newValue: ISubApp }
    ) {
      const { data } = await updateBuildingSubAppRequest(appId, id, newValue);
      commit(EDIT_BUILDINGS_SUB_APPS, { appId, id, data });
    },

    // upload
    async uploadAdminFile(
      { dispatch }: ActionContext<IState, any>,
      fileData: FormData
    ) {
      const response = await uploadAdminFileRequest(fileData);
      await dispatch('getAllAdminApps');
    },
    async uploadBuildingAppConfigFile(
      { dispatch }: ActionContext<IState, any>,
      fileData: FormData
    ) {
      const response = await uploadBuildingAppConfigFileRequest(fileData);
      await dispatch('getAllBuildingApps');
    },
    async uploadBuildingFile(
      { dispatch }: ActionContext<IState, any>,
      fileData: FormData
    ) {
      const response = await uploadBuildingFileRequest(fileData);
      await dispatch('getAllBuildingApps');
    },
  },
  modules: {},
});
