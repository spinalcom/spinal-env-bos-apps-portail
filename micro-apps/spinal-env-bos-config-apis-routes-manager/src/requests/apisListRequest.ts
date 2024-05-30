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

// export const HTTP = axios.create({ baseURL });
// HTTP.interceptors.request.use((request: any) => {
//     const t = localStorage.getItem('token');
//     if (t) request.headers.common.Authorization = `Bearer ${t}`;
//     return request;
// });

import { SpinalAPI } from "~/common_data/requests/SpinalAPI";

const baseURL = "/api/v1";

//////////////////////////////////////////
//              BOS                     //
//////////////////////////////////////////
export function createBosApiRouteRequest(data: any) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/create_bos_api_route`);
    return spinalAPI.post(url, data);
    
}

export function updateBosApiRouteRequest(id: string, newData: any) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/update_bos_api_route/${id}`);
    return spinalAPI.put(url, newData);
    
}

export function getBosApiRouteByIdRequest(id: string) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/get_bos_api_route/${id}`);
    return spinalAPI.get(url);
    
}

export function getAllBosApiRouteRequest() {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/get_all_bos_api_route`);
    return spinalAPI.get(url);
    
}

export function deleteBosApiRouteRequest(id: string) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/delete_bos_api_route/${id}`);
    return spinalAPI.delete(url);
    
}

export function uploadBosApisFile(fileData: any) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/upload_bos_apis_routes`);
    return spinalAPI.post(url, fileData,  { headers: { 'Content-Type': 'multipart/form-data' }});
    
}

//////////////////////////////////////////
//              PORTOFOLIO              //
//////////////////////////////////////////
export function createPortofolioApiRouteRequest(data: any) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/create_portofolio_api_route`);


    return spinalAPI.post(url, data);

    
}

export function updatePortofolioApiRouteRequest(id: string, newData: any) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/update_portofolio_api_route/${id}`);

    return spinalAPI.put(url, newData);

    
}

export function getPortofolioApiRouteByIdRequest(id: string) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/get_portofolio_api_route/${id}`);

    return spinalAPI.get(url);

    
}

export function getAllPortofolioApiRouteRequest() {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/get_all_portofolio_api_route`);

    return spinalAPI.get(url);

    
}

export function deletePortofolioApiRouteRequest(id: string) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/delete_portofolio_api_route/${id}`);

    return spinalAPI.delete(url);

    
}

export function uploadPortofolioApisFile(fileData: any) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/upload_portofolio_apis_routes`);

    return spinalAPI.post(url, fileData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    
}