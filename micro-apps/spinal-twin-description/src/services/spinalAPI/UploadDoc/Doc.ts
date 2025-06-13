import { SpinalAPI } from "../SpinalAPI";


export async function uploadDoc(buildingId: string, refrenceId: number, file: FormData) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${refrenceId}/upload_file`);
    const res = await spinalAPI.post(url, file)
    return res.data;
}


export async function deleteFile(buildingId: string, refrenceId: number, fileId: number) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${refrenceId}/delete_file/${fileId}`);
    const res = await spinalAPI.delete(url)
    console.log(res);
    return res;
}

export async function deleteCategoryAttribut(buildingId: string, referenceId: number, cateId: number) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceId}/category/${cateId}/delete/`);
    const res = await spinalAPI.delete(url)
    console.log(res);
    return res;
}

export async function updateAttribut(buildingId: string, referenceId: number, cateId: number, name: string, item: object) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceId}/category/${cateId}/attribut/${name}/update`);
    const res = await spinalAPI.put(url, item)
    console.log(res);
    return res;
}

export async function updateCategoryAttribut(buildingId: string, referenceId: number, cateId: number, item: object) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceId}/categoryById/${cateId}/update`);
    const res = await spinalAPI.put(url, item)
    console.log(res);
    return res;
}

export async function deleteAttribut(buildingId: string, referenceId: number, cateId: number, name: string) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceId}/category/${cateId}/attribut/${name}/delete`);
    const res = await spinalAPI.delete(url)
    console.log(res);
    return res;
}
