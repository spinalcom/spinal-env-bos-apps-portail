import { SpinalAPI } from '../SpinalAPI';


export async function loginRequest(userData: any) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl('api/v1/auth');
    const result = await spinalAPI.post(url, userData);
    return result.data;
}

export async function getUserProfile(profileId: string) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrl(`api/v1/user_profile/get_profile/${profileId}`);
    const result = await spinalAPI.get(url);
    return result.data;
}

export async function getBuildingApp(profileId: string) {
    try {
        const spinalAPI = SpinalAPI.getInstance();
        const url = spinalAPI.createUrl(`api/v1/user_profile/get_authorized_apps/${profileId}`);
        const result = await spinalAPI.get(url);
        return result.data;
    } catch (error) {
        return [];
    }

}

export async function getAdminApp(profileId: string) {
    try {
        const spinalAPI = SpinalAPI.getInstance();
        const url = spinalAPI.createUrl(`api/v1/user_profile/get_authorized_admin_apps/${profileId}`);
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
        return { code: 401, message: "error" }
    }
}

export async function addAppToFavorite(appIds) {
    try {
        const spinalAPI = SpinalAPI.getInstance();
        const url = spinalAPI.createUrl(`api/v1/add_app_to_favoris`);
        const result = await spinalAPI.post(url, { appIds });
        return result.data;
    } catch (error) {
        return []
    }
}

export async function removeAppFromFavorite(appIds) {
    try {
        const spinalAPI = SpinalAPI.getInstance();
        const url = spinalAPI.createUrl(`api/v1/remove_app_from_favoris`);
        const result = await spinalAPI.post(url, { appIds });
        return result.data;
    } catch (error) {
        return []
    }
}

export async function getFavoriteApps() {
    try {
        const spinalAPI = SpinalAPI.getInstance();
        const url = spinalAPI.createUrl(`api/v1/get_favorite_apps`);
        const result = await spinalAPI.get(url);
        return result.data;
    } catch (error) {
        return []
    }
}
