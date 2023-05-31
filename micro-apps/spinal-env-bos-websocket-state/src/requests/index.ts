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

import axios from 'axios';

const endpoint = '/api/v1/pam';
const host = (process.env.SPINAL_API_URL || '').replace(`/\/$/`, (el) => '');
const baseURL = host.match(new RegExp(endpoint)) ? host : host + endpoint;

export const http = axios.create({baseURL});
http.interceptors.request.use((request: any) => {
  const t = localStorage.getItem('token');
  if (t) request.headers.common.Authorization = `Bearer ${t}`;
  return request;
});

export async function getWebsocketStateRequest() {
  return http.get(`/websocket/get_websocket_state`);
}

export async function getWebsocketClientCountRequest() {
  return http.get(`/websocket/get_client_connected_count`);
}

export async function readWebsocketLogsRequest(
  begin: number = new Date().setHours(0, 0, 0, 0),
  end: number = Date.now()
) {
  return http.get(`/websocket_log/read/${begin}/${end}`);
}

export async function readCurrentWeekLogsRequest() {
  return http.get(`/websocket_log/read_current_week`);
}

export async function readCurrentYearLogsRequest() {
  return http.get(`/websocket_log/read_current_year`);
}

export async function readLast24hLogsRequest() {
  return http.get(`/websocket_log/read_from_last_24h`);
}

export function getPortofoliosRequest(profileId: string | null) {
  if (!profileId) throw new Error('no profileId found');

  return http
    .get(`${baseURL}/user_profile/get_authorized_portofolio/${profileId}`)
    .then((result) => {
      return result.data;
    });
}
