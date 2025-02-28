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

import { SpinalAPI } from 'global-components';
const baseURL = '/api/v1';

export function addDigitalTwinRequest(data) {
  const body = {
    name: data.name,
    url: data.url,
  };
  const query = data.set_as_actual_digitaltwin
    ? '?set_as_actual_digitaltwin=true'
    : '';
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/add_digitaltwin${query}`);
  return spinalAPI.post(url, body).then((result) => {
    return result.data;
  });
}

export function getAllDigitalTwinRequest() {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/get_all_digitaltwins`);
  return spinalAPI.get(url).then((result) => {
    return result.data;
  });
}

export function getActualDigitalTwinRequest() {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/get_actual_digitaltwin`);
  return spinalAPI.get(url).then((result) => {
    return result.data;
  });
}

export function getDigitalTwinRequest(id) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/get_digitaltwin/${id}`);
  return spinalAPI.get(url).then((result) => {
    return result.data;
  });
}

export function deleteDigitalTwinRequest(id) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/delete_digitaltwin/${id}`);
  return spinalAPI.delete(url).then((result) => {
    return result.data;
  });
}

export function setAsActualDigitalTwinRequest(id) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/set_as_actual_digitaltwin/${id}`);
  return spinalAPI.put(url).then((result) => {
    return result.data;
  });
}
