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

import { SpinalAPI } from '../SpinalAPI';

export async function loginRequest(userData: any) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl('api/v1/auth');
  const result = await spinalAPI.post(url, userData);
  return result.data;
}

export async function getUserProfile() {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`api/v1/user_profile/get_profile`);
  const result = await spinalAPI.get(url);
  return result.data;
}

export async function getBuildingApp(profileId: string) {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(
      `api/v1/user_profile/get_authorized_apps/${profileId}`
    );
    const result = await spinalAPI.get(url);
    return result.data;
  } catch (error) {
    return [];
  }
}

export async function getAdminApp(profileId: string) {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(
      `api/v1/user_profile/get_authorized_admin_apps/${profileId}`
    );
    const result = await spinalAPI.get(url);
    return result.data;
  } catch (error) {
    return [];
  }
}

export async function getTokenData(token: string) {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`api/v1/getTokenData`);
    const result = await spinalAPI.post(url, { token });
    return result.data;
  } catch (error) {
    return { code: 401, message: 'error' };
  }
}

export async function addAppToFavorite(appIds) {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`api/v1/add_app_to_favoris`);
    const result = await spinalAPI.post(url, { appIds });
    return result.data;
  } catch (error) {
    return [];
  }
}

export async function removeAppFromFavorite(appIds) {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`api/v1/remove_app_from_favoris`);
    const result = await spinalAPI.post(url, { appIds });
    return result.data;
  } catch (error) {
    return [];
  }
}

export async function getFavoriteApps() {
  try {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`api/v1/get_favorite_apps`);
    const result = await spinalAPI.get(url);
    return result.data;
  } catch (error) {
    return [];
  }
}
