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

import {
    getUserProfile,
    getBuildingApp,
    getAdminApp,
    getTokenData
} from "../requests/userData";

export const SET_USER_APPS = "SET_USER_APPS";
export const SET_USER_BOS = "SET_USER_BOS";
export const SET_USER_INFO = "SET_USER_INFO";
export const SET_AND_FORMAT_APPS = "SET_AND_FORMAT_APPS";
export const SET_SELECTED_APP = "SET_SELECTED_APP";
export const SET_PORTOFOLIO = "SET_PORTOFOLIO";
export const SELECT_PORTOFOLIO = "SELECT_PORTOFOLIO";

const names = {
    "apps": "Applications",
    "adminApps": "Administration"
}


function classifyByCategory(apps: any[]): { name: string, id: string, apps: any[] }[] {
    const obj: { [key: string]: any } = {};
    apps.forEach(data => {
        const categoryId = data.categoryName.toLowerCase();
        if (!obj[categoryId]) obj[categoryId] = { id: categoryId, name: data.categoryName, apps: [] };

        obj[categoryId].apps.push(data)
    });

    return Array.from(Object.values(obj));
}

function classifyByCategoryAndGroup(apps: any[]) {
    let categories = classifyByCategory(apps);
    const groups: { [ke: string]: { name: string; id: string } } = {};

    const data = categories.map(({ name, id, apps }) => {
        let t: { [key: string]: any } = { name, id };

        apps.forEach(el => {
            const groupId = el.groupName.toLowerCase();
            if (!t[groupId]) {
                t[groupId] = [];
                groups[groupId] = { name: el.groupName, id: groupId }
            }

            t[groupId].push(el);
        })

        return t
    })

    return { groups: Array.from(Object.values(groups)), data }
}

const appsFormattedMap = new Map();
let inProcess = false;

export const appDataStore = {
    namespaced: true,
    state: {
        selectedPortofolio: undefined,
        portofolios: undefined,
        spaceSelected: "",
        appSelected: undefined,
        appsDisplayed: [],
        pamApps: [],
        bos: [],
        appsFormatted: undefined,
        userInfo: {},
        _privateData: { userInfoIsSet: false, appsIsSet: false }
    },
    mutations: {
        [SELECT_PORTOFOLIO](state: any, playload) {
            state.selectedPortofolio = playload;
        },
        [SET_PORTOFOLIO](state: any, playload) {

            state.portofolios = ["adminApps", "apps"].reduce((liste: any[], key) => {
                if (playload[key]) {
                    liste.push({
                        id: key,
                        name: names[key],
                        apps: playload[key]
                    })
                }

                return liste;
            }, []);
        },


        [SET_USER_INFO](state: any, playload: any) {
            state.userInfo = playload;
            state._privateData.userInfoIsSet = true;
        },

        [SET_AND_FORMAT_APPS](state: any, { apps, appsFormatted }: any) {
            state.appsDisplayed = apps;
            state.appsFormatted = appsFormatted;
        },

        [SET_SELECTED_APP](state: any, playload: any) {
            state.appSelected = playload;
        }
    },
    actions: {
        async getPortofolios({ commit, dispatch, state }: any) {
            try {
                const profileId = await dispatch("getProfileId");
                const profile = await getUserProfile(profileId);
                commit(SET_PORTOFOLIO, profile);
            } catch (error) {

            }
        },



        getProfileId() {
            if (localStorage.getItem("profileId")) return Promise.resolve(localStorage.getItem("profileId"));
            // send request
        },

        getUserInfo({ commit, state }: any) {
            if (state._privateData.userInfoIsSet) return state.userInfo;

            let userInfo = {}
            const storage = localStorage.getItem("user");
            if (storage) userInfo = JSON.parse(atob(storage));
            //send request;

            commit(SET_USER_INFO, userInfo)
            return userInfo;
        },

        async selectSpace({ commit, dispatch, state }: any, data: { portofolioId: string, buildingId: string }) {

            if (!state.portofolios) {
                await dispatch("getPortofolios")
            }

            let apps = []
            const portofolio = state.portofolios.find(el => el.id === data.portofolioId);
            if (portofolio && !data.buildingId) {
                apps = portofolio.apps.map(el => {
                    el.parent = {
                        portofolioId: data.portofolioId,
                        buildingId: data.buildingId,
                    };
                    return el;
                });
                state.spaceSelected = data.portofolioId;
            } else if (portofolio && data.buildingId) {
                const building = portofolio.buildings.find(el => el.id === data.buildingId);
                if (building) {
                    state.spaceSelected = data.buildingId;
                    apps = building.apps.map(el => {
                        el.parent = {
                            portofolioId: data.portofolioId,
                            buildingId: data.buildingId,
                        };
                        return el;
                    });
                }
            }

            let appsFormatted = classifyByCategoryAndGroup(apps);
            // console.log(appsFormatted)

            // let appsFormatted: any = [];
            // if (appsFormattedMap.get(state.spaceSelected)) appsFormatted = appsFormattedMap.get(state.spaceSelected);
            // else {
            // appsFormatted = classifyByCategoryAndGroup(apps);
            //     appsFormattedMap.set(state.spaceSelected, appsFormatted);
            // }

            commit(SET_AND_FORMAT_APPS, { apps, appsFormatted });


        },
    }
}