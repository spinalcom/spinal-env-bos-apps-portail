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

const endpoint = "/api/v2";
const host = (process.env.SPINAL_API_URL || "").replace(`/\/$/`, el => "");
const baseURL = host.match(new RegExp(endpoint)) ? host : host + endpoint;

const http = axios.create({ baseURL });
http.interceptors.request.use((request: any) => {
    const t = localStorage.getItem('token');
    if (t) request.headers.common.Authorization = `Bearer ${t}`;
    return request;
});

export function getAllUserProfilesRequest() {
    try {
        return http.get("/user_profile/get_all_profile");
    } catch (error) {
        console.error(error);
        return { data: [] }
    }
}

export function createUserProfileRequest(data: any) {
    return http.post("/user_profile/create_profile", data);
}

export function getUserProfileRequest(profileId: string) {
    return http.get(`/user_profile/get_profile/${profileId}`);
}

export function deleteUserProfileRequest(profileId: string) {
    return http.delete(`/user_profile/delete_profile/${profileId}`);
}


export function editUserProfileRequest(profileId: string, newData: any) {
    return http.put(`/user_profile/edit_profile/${profileId}`, newData);
}


export function getAllAppsRequest() {
    try {
        return http.get("/get_all_building_apps");
    } catch (error) {
        console.error(error)
        return { data: [] }
    }
}

export function getAllContextsRequest() {
    try {
        return http.get("/get_digitaltwin_contexts");
    } catch (error) {
        return []
    }
}

export function getAllApisRequest() {
    return http.get("/get_all_api_route");
}

