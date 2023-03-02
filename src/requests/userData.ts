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


import axios from "axios";
import { SERVER_BASE_URL } from ".";

const endpoint = "/api/v1";
const host = (SERVER_BASE_URL || "").replace(`/\/$/`, el => "");
const baseURL = host.match(new RegExp(endpoint)) ? host : host + endpoint;


export function getUserProfile(profileId: string) {
    return axios.get(`${baseURL}/user_profile/get_profile/${profileId}`).then((result) => {
        return result.data;
    })
}

export function getBuildingApp(profileId: string) {
    return axios.get(`${baseURL}/user_profile/get_authorized_apps/${profileId}`).then((result) => {
        return result.data;
    }).catch((err) => {
        return []
    });
}

export function getAdminApp(profileId: string) {
    return axios.get(`${baseURL}/user_profile/get_authorized_admin_apps/${profileId}`).then((result) => {
        return result.data;
    }).catch((err) => {
        return []
    });
}

export function getTokenData(token: string) {
    return axios.post(`${baseURL}/getTokenData`, { token }).then((result) => {
        return result.data;
    }).catch((err) => {
        return { code: 401, message: "error" }
    });
}

export function addAppToFavorite(appIds) {
    return axios.post(`${baseURL}/add_app_to_favoris`, { appIds }).then((result) => {
        return result.data;
    }).catch((err) => {
        return []
    });
}

export function removeAppFromFavorite(appIds) {
    return axios.post(`${baseURL}/remove_app_from_favoris`, { appIds }).then((result) => {
        return result.data;
    }).catch((err) => {
        return []
    });
}

export function getFavoriteApps() {
    return axios.get(`${baseURL}/get_favorite_apps`).then((result) => {
        return result.data;
    }).catch((err) => {
        return []
    });
}



/*
export function getPortofolios(profileId: string | null) {
    if (!profileId) throw new Error("no profileId found");

    return axios.get(`${baseURL}/user_profile/get_authorized_portofolio/${profileId}`).then((result) => {
        return result.data;
    })
}

export function getUserApps(profileId: string | null) {
    if (!profileId) throw new Error("no profileId found");

    return axios.get(`${baseURL}/user_profile/get_authorized_apps/${profileId}`).then((result) => {
        return result.data;
    })
}

export function getUserBos(profileId: string | null) {
    if (!profileId) throw new Error("no profileId found");

    return axios.get(`${baseURL}/user_profile/get_authorized_bos/${profileId}`).then((result) => {
        return result.data;
    })
}

export function getAppById(appId: string | null) {
    return axios.get(`${baseURL}/get_app_by_id/${appId}`).then((result) => {
        return result.data;
    })
}
*/