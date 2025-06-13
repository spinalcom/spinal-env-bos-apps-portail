import { SpinalAPI } from '../SpinalAPI';
import { store } from '../../store/index';
import { MutationTypes } from '../../store/appDataStore/mutations';


export async function updateMultipleAttributes(buildingId: string, formattedData: any[]): Promise<any> {
    // console.log('arrivé dans node attribut');
    
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/node/attribute/update_multiple');

    try {
        const response = await spinalAPI.post<any>(url, formattedData);
        // console.log('fin de node attribut');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des attributs:', error);
        throw error;
    }
    
}


export async function getCategoriesList(buildingId: string, referenceId: number): Promise<any> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/node/${referenceId}/categoriesList`);
    const result = await spinalAPI.get(url);
    return result.data;
}


export async function createAttribut(buildingId, referenceId, categoryId, formattedData: FormData): Promise<any> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/node/${referenceId}/category/${categoryId}/attribut/create`);
    const result = await spinalAPI.post(url, formattedData)
    return result;
}

export async function createCategory(buildingId: string, referenceId: number, categoryName: string): Promise<any> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/node/${referenceId}/category/create`);
    const result = await spinalAPI.post(url, { categoryName: categoryName });
    return result;
}