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

export const HTTP = axios.create({ baseURL });
HTTP.interceptors.request.use((request: any) => {
    const t = localStorage.getItem('token');
    if (t) request.headers.common.Authorization = `Bearer ${t}`;
    return request;
});

// create

// export function createPortofolioAppsRequest(data: any) {
//     return HTTP.post("/create_portofolio_app", data);
// }

export function createBuildingAppsRequest(data: any) {
    return HTTP.post("/create_building_app", data);
}

export function createAdminAppsRequest(data: any) {
    return HTTP.post("/create_admin_app", data);
}



//get All
// export function getAllPortofolioAppsRequest() {
//     try {
//         return HTTP.get("/get_all_portofolio_apps");
//     } catch (error) {
//         return [];
//     }
// }

export function getAllBuildingAppsRequest() {
    try {
        return HTTP.get("/get_all_building_apps");
    } catch (error) {
        return [];
    }
}

export function getAllAdminAppsRequest() {
    try {
        return HTTP.get("/get_all_admin_apps");
    } catch (error) {
        return [];
    }
}


// get By Id
// export function getPortofolioAppRequest(appId: string) {
//     try {
//         return HTTP.get(`/get_portofolio_app/${appId}`);
//     } catch (error) {
//         return undefined;
//     }
// }

export function getBuildingAppRequest(appId: string) {
    try {
        return HTTP.get(`/get_building_app/${appId}`);
    } catch (error) {
        return undefined;
    }
}

export function getAdminAppRequest(appId: string) {
    try {
        return HTTP.get(`/get_admin_app/${appId}`);
    } catch (error) {
        return undefined;
    }
}

// delete 
// export function deletePortofolioAppRequest(appId: string) {
//     return HTTP.delete(`/delete_portofolio_app/${appId}`);
// }

export function deleteBuildingAppRequest(appId: string) {
    return HTTP.delete(`/delete_building_app/${appId}`);
}

export function deleteAdminAppRequest(appId: string) {
    return HTTP.delete(`/delete_admin_app/${appId}`);
}

// update

// export function updatePortofolioAppRequest(appId: string, newData: any) {
//     return HTTP.put(`/update_portofolio_app/${appId}`, newData);
// }

export function updateBuildingAppRequest(appId: string, newData: any) {
    return HTTP.put(`/update_building_app/${appId}`, newData);
}

export function updateAdminAppRequest(appId: string, newData: any) {
    return HTTP.put(`/update_admin_app/${appId}`, newData);
}

// uploadFile

// export function uploadPortofolioFileRequest(fileData: any) {
//     return HTTP.post(`/upload_portofolio_apps`, fileData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     })
// }

export function uploadAdminFileRequest(fileData: any) {
    return HTTP.post(`/upload_admin_apps`, fileData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function uploadBuildingFileRequest(fileData: any) {
    return HTTP.post(`/upload_building_apps`, fileData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}