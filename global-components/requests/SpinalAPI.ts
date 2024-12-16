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
interface SpinalWindow extends Window {
  spinalApi?: SpinalAPI;
}
export enum API_MODE {
  BOS_APP,
  PAM_APP
};

export class SpinalAPI {
  axiosInstance = axios.create({ baseURL: this.apiUrl });
  static #instanceParent: SpinalWindow = window;
  api_mode = API_MODE.BOS_APP;

  public static setHook(_window: SpinalWindow) {
    SpinalAPI.#instanceParent = _window;
  }
  public setApiMode(mode: API_MODE) {
    this.api_mode = mode;
  }

  get apiUrl() {
    return `${this._apiUrl}${this._apiUrl.endsWith('/') ? '' : '/'}`;
  }
  private constructor(public readonly _apiUrl: string = '') {
    this.axiosInstance.interceptors.request.use((request) => {
      const t = localStorage.getItem('token');
      // @ts-ignore
      if (t) request.headers.common.Authorization = `Bearer ${t}`;
      return request;
    });
  }

  /**
   * @static
   * @param {string} [apiUrl] mandatory on 1st call after it's not needed
   * @return {*}  {SpinalAPI}
   * @memberof SpinalAPI
   */
  public static getInstance(apiUrl?: string): SpinalAPI {
    if (SpinalAPI.#instanceParent.spinalApi)
      return SpinalAPI.#instanceParent.spinalApi;
    SpinalAPI.#instanceParent.spinalApi = new SpinalAPI(
      apiUrl || process.env.SPINAL_API_URL
    );

    return SpinalAPI.#instanceParent.spinalApi;
  }

  public createUrl(apiRoute: string): string {
    if (apiRoute.startsWith('/')) apiRoute = apiRoute.substring(1);
    return this.apiUrl + apiRoute;
  }
  public createUrlWithPlatformId(buildingId: string, apiRoute: string): string {
    if (this.api_mode === API_MODE.BOS_APP)
      return this.createUrl(apiRoute);
    if (apiRoute.startsWith('/')) apiRoute = apiRoute.substring(1);
    return `${this.apiUrl}api/v2/building/${buildingId}${apiRoute}`;
  }

  get = this.axiosInstance.get;
  post = this.axiosInstance.post;
  put = this.axiosInstance.put;
  delete = this.axiosInstance.delete;

  async *createIteratorCall<K extends (...args) => any>(
    fct: K,
    ...args: Parameters<K>
  ): AsyncGenerator<Awaited<ReturnType<K>>> {
    const res = await fct(...args);
    while (true) {
      yield res;
    }
  }
}
