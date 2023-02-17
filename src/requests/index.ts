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

export const SERVER_BASE_URL = process.env.SPINAL_API_URL;

export function initAxios() {
  // const host = "http://localhost:8065";
  // axios.create({ baseURL: `${serverHost}` });
  axios.interceptors.request.use((request: any) => {
    const t = localStorage.getItem('token');
    // request.url = path.normalize(serverHost + "/" + request.url);
    if (t) request.headers.common.Authorization = `Bearer ${t}`;
    return request;
  });
}
