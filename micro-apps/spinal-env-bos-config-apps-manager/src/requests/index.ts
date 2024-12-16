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

import { SpinalAPI } from 'global-components';
const baseURL = '/api/v1';

export function createBuildingAppsRequest(data: any) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/create_building_app`);
  return spinalAPI.post(url, data);
}

export function createAdminAppsRequest(data: any) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/create_admin_app`);
  return spinalAPI.post(url, data);
}

export async function getAllBuildingAppsRequest() {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/get_all_building_apps`);
    const result = await spinalAPI.get(url);
    return result;
  } catch (error) {
    return [];
  }
}

export async function getAllAdminAppsRequest() {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/get_all_admin_apps`);
    const result = await spinalAPI.get(url);
    return result;
  } catch (error) {
    return [];
  }
}

export async function getBuildingAppRequest(appId: string) {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/get_building_app/${appId}`);
    const result = await spinalAPI.get(url);
    return result;
  } catch (error) {
    return undefined;
  }
}

export async function getAdminAppRequest(appId: string) {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`${baseURL}/get_admin_app/${appId}`);
    const result = await spinalAPI.get(url);
    return result;
  } catch (error) {
    return undefined;
  }
}

export function deleteBuildingAppRequest(appId: string) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/delete_building_app/${appId}`);
  return spinalAPI.delete(url);
}

export function deleteAdminAppRequest(appId: string) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/delete_admin_app/${appId}`);
  return spinalAPI.delete(url);
}

export function updateBuildingAppRequest(appId: string, newData: any) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/update_building_app/${appId}`);
  return spinalAPI.put(url, newData);
}

export function updateAdminAppRequest(appId: string, newData: any) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/update_admin_app/${appId}`);
  return spinalAPI.put(url, newData);
}

export function uploadAdminFileRequest(fileData: any) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/upload_admin_apps`);
  return spinalAPI.post(url, fileData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function uploadBuildingFileRequest(fileData: any) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/upload_building_apps`);
  return spinalAPI.post(url, fileData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
