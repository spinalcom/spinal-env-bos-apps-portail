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

Vue.use(Vuex)

import {
  createBosApiRouteRequest,
  updateBosApiRouteRequest,
  getBosApiRouteByIdRequest,
  getAllBosApiRouteRequest,
  deleteBosApiRouteRequest,
  uploadBosApisFile,
  createPortofolioApiRouteRequest,
  updatePortofolioApiRouteRequest,
  getPortofolioApiRouteByIdRequest,
  getAllPortofolioApiRouteRequest,
  deletePortofolioApiRouteRequest,
  uploadPortofolioApisFile,
} from "../requests/apisListRequest";

import {
  CREATE_BOS_API_ROUTE,
  UPDATE_BOS_API_ROUTE,
  GET_BOS_API_ROUTE,
  SET_ALL_BOS_API_ROUTE,
  DELETE_BOS_API_ROUTE,
  CREATE_PORTOFOLIO_API_ROUTE,
  UPDATE_PORTOFOLIO_API_ROUTE,
  GET_PORTOFOLIO_API_ROUTE,
  SET_ALL_PORTOFOLIO_API_ROUTE,
  DELETE_PORTOFOLIO_API_ROUTE,
} from "./mutations";

import { IApiRoute, IState } from "../interfaces";

export default new Vuex.Store({
  state: () => ({ bosApis: [], portofolioApis: [] }),
  mutations: {

    //create
    [CREATE_BOS_API_ROUTE](state: IState, playload: IApiRoute) {
      state.bosApis = [playload, ...state.bosApis];
    },

    [CREATE_PORTOFOLIO_API_ROUTE](state: IState, playload: IApiRoute) {
      state.portofolioApis = [playload, ...state.portofolioApis];
    },

    // update

    [UPDATE_BOS_API_ROUTE](state: IState, playload: IApiRoute) {
      const copy: any = Object.assign([], state.bosApis);
      const index = copy.findIndex((el: any) => el.id === playload.id);
      if (index !== -1) {
        copy[index] = playload;
        state.bosApis = copy;
      }
    },

    [UPDATE_PORTOFOLIO_API_ROUTE](state: IState, playload: IApiRoute) {
      const copy: any = Object.assign([], state.portofolioApis);
      const index = copy.findIndex((el: any) => el.id === playload.id);
      if (index !== -1) {
        copy[index] = playload;
        state.portofolioApis = copy;
      }
    },


    // getAll
    [SET_ALL_BOS_API_ROUTE](state: IState, playload: IApiRoute[]) {

      state.bosApis = playload;
      // state.bosApis = playload.reduce((liste: any[], item: any) => {
      //   let found = liste.find(el => el.name === item.tag);

      //   if (found) {
      //     found.children.push(item);
      //     return liste;
      //   }

      //   liste.push({
      //     name: item.tag,
      //     children: [item]
      //   })

      //   return liste;
      // }, []);
    },

    [SET_ALL_PORTOFOLIO_API_ROUTE](state: IState, playload: IApiRoute[]) {
      state.portofolioApis = playload;
    },

    // Delete

    [DELETE_BOS_API_ROUTE](state: IState, playload: string) {
      state.bosApis = state.bosApis.filter((el: any) => el.id !== playload);
    },

    [DELETE_PORTOFOLIO_API_ROUTE](state: IState, playload: any) {
      state.portofolioApis = state.portofolioApis.filter((el: any) => el.id !== playload);
    }
  },

  actions: {

    // BOS

    async createBosApiRoute({ commit }: ActionContext<IState, IState>, data: IApiRoute) {
      const response = await createBosApiRouteRequest(data);
      commit(CREATE_BOS_API_ROUTE, response.data);
    },

    async updateBosApiRoute({ commit }: ActionContext<IState, IState>, { id, data }: { id: string; data: IApiRoute }) {
      const response = await updateBosApiRouteRequest(id, data);
      commit(UPDATE_BOS_API_ROUTE, response.data);
    },

    async getBosApiRoute({ commit }: ActionContext<IState, IState>, id: string) {
      const response = await getBosApiRouteByIdRequest(id);
      commit(GET_BOS_API_ROUTE, response.data);
    },

    async getAllBosApiRoute({ commit }: ActionContext<IState, IState>) {
      const response = await getAllBosApiRouteRequest();
      commit(SET_ALL_BOS_API_ROUTE, response.data);
    },

    async deleteBosApiRoute({ commit }: ActionContext<IState, IState>, id: string) {
      await deleteBosApiRouteRequest(id);
      commit(DELETE_BOS_API_ROUTE, id);
    },

    async uploadBosSwaggerFile({ dispatch }: ActionContext<IState, IState>, fileData: any) {
      const response = await uploadBosApisFile(fileData);
      dispatch("getAllBosApiRoute");
    },


    // Portofolio

    async createPortofolioApiRoute({ commit }: ActionContext<IState, IState>, data: IApiRoute) {
      const response = await createPortofolioApiRouteRequest(data);
      commit(CREATE_PORTOFOLIO_API_ROUTE, response.data);
    },

    async updatePortofolioApiRoute({ commit }: ActionContext<IState, IState>, { id, data }: { id: string; data: IApiRoute }) {
      const response = await updatePortofolioApiRouteRequest(id, data);
      commit(UPDATE_PORTOFOLIO_API_ROUTE, response.data);
    },

    async getPortofolioApiRoute({ commit }: ActionContext<IState, IState>, id: any) {
      const response = await getPortofolioApiRouteByIdRequest(id);
      commit(GET_PORTOFOLIO_API_ROUTE, response.data);
    },

    async getAllPortofolioApiRoute({ commit }: ActionContext<IState, IState>) {
      const response = await getAllPortofolioApiRouteRequest();
      commit(SET_ALL_PORTOFOLIO_API_ROUTE, response.data);
    },

    async deletePortofolioApiRoute({ commit }: ActionContext<IState, IState>, id: string) {
      await deletePortofolioApiRouteRequest(id);
      commit(DELETE_PORTOFOLIO_API_ROUTE, id);
    },

    async uploadPortofolioSwaggerFile({ dispatch }: ActionContext<IState, IState>, fileData: any) {
      const response = await uploadPortofolioApisFile(fileData);
      dispatch("getAllPortofolioApiRoute");
    }
  },

  getters: {
    bosApisGet(state) {
      return state.bosApis.reduce((liste: any[], item: any) => {
        let found = liste.find(el => el.name === item.tag);

        if (found) {
          found.children.push(item);
          return liste;
        }

        liste.push({
          name: item.tag,
          children: [item]
        })

        return liste;
      }, []);
    },

    portofolioApisGet(state) {

      return state.portofolioApis.reduce((liste: any[], item: any) => {
        let found = liste.find(el => el.name === item.tag);

        if (found) {
          found.children.push(item);
          return liste;
        }

        liste.push({
          name: item.tag,
          children: [item]
        })

        return liste;
      }, []);
    }
  }
});
