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

// import axios from "axios";

// const endpoint = "/api/v1";
// const host = (process.env.SPINAL_API_URL || "").replace(`/\/$/`, el => "");
// const baseURL = host.match(new RegExp(endpoint)) ? host : host + endpoint;

// const http = axios.create({ baseURL });
// http.interceptors.request.use((request: any) => {
//     const t = localStorage.getItem('token');
//     if (t) request.headers.common.Authorization = `Bearer ${t}`;
//     return request;
// });

import { SpinalAPI } from "~/common_data/requests/SpinalAPI";
const baseURL = "/api/v1";

export async function getAllAppProfilesRequest() {
    try {
        const spinalAPI = SpinalAPI.getInstance();
        const url = spinalAPI.createUrl(`${baseURL}/app_profile/get_all_profile`);
        const result = await spinalAPI.get(url);
        return result;
    } catch (error) {
        console.error(error);
        return { data: [] }
    }
}

export function createAppProfileRequest(data: any) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/app_profile/create_profile`);
    return spinalAPI.post(url, data);
}

export function getAppProfileRequest(profileId: string) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/app_profile/get_profile/${profileId}`);
    return spinalAPI.get(url);
}

export function deleteAppProfileRequest(profileId: string) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/app_profile/delete_profile/${profileId}`);
    return spinalAPI.delete(url);
}


export function editAppProfileRequest(profileId: string, newData: any) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/app_profile/edit_profile/${profileId}`);
    return spinalAPI.put(url, newData);
}


export async function getAllContextsRequest() {
    try {
        const spinalAPI = SpinalAPI.getInstance();
        const url = spinalAPI.createUrl(`${baseURL}/get_digitaltwin_contexts`);
        const result = await spinalAPI.get(url);
        return result;
    } catch (error) {
        return []
    }
}

export function getAllApisRequest() {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/get_all_bos_api_route`);
    return spinalAPI.get(url);
}

