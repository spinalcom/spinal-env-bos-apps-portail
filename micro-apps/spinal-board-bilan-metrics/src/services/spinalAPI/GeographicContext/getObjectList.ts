import { SpinalAPI } from '../SpinalAPI';


export async function getMultipleReferenceObjects(buildingId: string, referenceIds: number[]): Promise<any> {
    // console.log('Début de la récupération des objets de référence');
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/room/reference_object_list_multiple');
    try {
        const response = await spinalAPI.post<any>(url, referenceIds);
        // console.log('Fin de la récupération des objets de référence');
        return response.data; 
    } catch (error) {
        console.error('Erreur lors de la récupération des objets de référence:', error);
        throw error;
    }
}
