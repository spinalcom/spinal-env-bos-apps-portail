/*
 * Copyright 2025 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
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

import { SpinalAPI } from 'global-components/requests';

const appConfigIt = getAppConfigGen();

export async function getAppConfig() {
  const { value } = await appConfigIt.next();
  return value;
}

/**
 * Get app config generator
 * get app and app config from url query
 * and return app config when the query changes
 * @return {*}  {AsyncGenerator<any, never, never>}
 */
async function* getAppConfigGen(): AsyncGenerator<any, never, never> {
  let configId = 'randomstring';
  let response = null;
  // get app config from query
  while (true) {
    const searchParams = new URLSearchParams(window.location.search);
    const newConfigId = searchParams.get('appConfig');
    const appId = searchParams.get('app');
    if (!appId) {
      response = { data: null };
    } else if (newConfigId !== configId) {
      const spinalApi = SpinalAPI.getInstance();
      const url = spinalApi.createUrl(
        newConfigId
          ? `/api/v1/get_building_sub_app/${appId}/${newConfigId}`
          : `/api/v1/get_building_sub_app/${appId}`
      );

      configId = newConfigId;
      response = await spinalApi.get(url);
    }
    yield response.data;
  }
}
