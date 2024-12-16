import { SpinalAPI } from "../SpinalAPI";


export async function uploadDoc(buildingId: string, refrenceId: number, file: FormData){
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${refrenceId}/upload_file`);
    const res = await spinalAPI.post(url, file )
    return res.data;
}