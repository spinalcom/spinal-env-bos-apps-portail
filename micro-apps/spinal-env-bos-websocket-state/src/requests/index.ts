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

// import axios from 'axios';

// const endpoint = '/api/v1/pam';
// const host = (process.env.SPINAL_API_URL || '').replace(`/\/$/`, (el) => '');
// const baseURL = host.match(new RegExp(endpoint)) ? host : host + endpoint;

// export const http = axios.create({baseURL});
// http.interceptors.request.use((request: any) => {
//   const t = localStorage.getItem('token');
//   if (t) request.headers.common.Authorization = `Bearer ${t}`;
//   return request;
// });

import { SpinalAPI } from 'global-components';
const baseURL = '/api/v1';

export async function getWebsocketStateRequest() {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/websocket/get_websocket_state`);
  return spinalAPI.get(url);
}

export async function getWebsocketClientCountRequest() {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(
    `${baseURL}/websocket/get_client_connected_count`
  );
  return spinalAPI.get(url);
}

export async function readWebsocketLogsRequest(
  begin: number = new Date().setHours(0, 0, 0, 0),
  end: number = Date.now()
) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(
    `${baseURL}/websocket_log/read/${begin}/${end}`
  );
  return spinalAPI.get(url);
}

export async function readCurrentWeekLogsRequest() {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/websocket_log/read_current_week`);
  return spinalAPI.get(url);
}

export async function readCurrentYearLogsRequest() {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`${baseURL}/websocket_log/read_current_year`);
  return spinalAPI.get(url);
}

export async function readLast24hLogsRequest() {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(
    `${baseURL}/websocket_log/read_from_last_24h`
  );
  return spinalAPI.get(url);
}

export function getPortofoliosRequest(profileId: string | null) {
  if (!profileId) throw new Error('no profileId found');

  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(
    `${baseURL}/user_profile/get_authorized_portofolio/${profileId}`
  );
  return spinalAPI.get(url).then((result) => {
    return result.data;
  });
}
