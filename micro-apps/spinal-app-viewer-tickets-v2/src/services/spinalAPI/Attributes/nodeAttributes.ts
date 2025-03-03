import { SpinalAPI } from '../SpinalAPI';

  export async function Attribute_list_multiple(dynamicIds: number[]){
    const platformId = localStorage.getItem("idBuilding") || "";
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(
      platformId,
      `api/v1/node/attribute_list_multiple`
    );
    let result = await spinalAPI.post(url, dynamicIds);
    return result.data;
  }