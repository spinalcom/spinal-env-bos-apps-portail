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

import { clearLocalStorage, saveToLocalStorage } from "../utils";
import { loginRequest } from "~/common_data/requests/users";



export const SUCCESS_LOGGED = "SUCCESS_LOGGED";
export const ERROR_LOGGED = "ERROR_LOGGED";


export const logingStore = {
    namespaced: true,
    state: { data: {} },
    mutations: {
        [SUCCESS_LOGGED](state: any, playload: any) {
            if (playload.logged) {
                state.data = playload.data || {};
            }
        }
    },
    actions: {
        async logUser({ commit }: any, userData: any) {
            try {
                const data = await loginRequest(userData);
                commit(SUCCESS_LOGGED, { data, logged: true });
                return true;
            } catch (error) {
                console.error(error);

                commit(SUCCESS_LOGGED, { logged: false });
                return false;
            }
        },

        storeCookie({ state }: any, vueCookieInstance: any) {
            // vueCookieInstance.set('token', state.data.token, { expires: state.data.expieres });
            saveToLocalStorage(state.data);
        },

        clearLocalStorage() {
            clearLocalStorage()
        }
    },

    getters: {},
};