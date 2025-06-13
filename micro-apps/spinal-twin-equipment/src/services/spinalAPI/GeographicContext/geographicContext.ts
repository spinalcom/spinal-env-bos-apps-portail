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

import { SpinalAPI } from '../SpinalAPI';
import type {
  IBuildingItem,
  IZoneItem,
  IEquipmentItem,
  IRefItem,
} from '../../../../../../global-components/SpaceSelector/interfaces/IBuildingItem';
import { AxiosRequestConfig } from 'axios';

export async function getBuilding(platformId: string) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    'api/v1/building/read'
  );
  let result = await spinalAPI.get<IBuildingItem>(url);
  Object.assign(result.data, { color: '#2693ff' });
  return result.data;
}

export async function getFloors(patrimoineId: string, buildingId: string): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, 'api/v1/floor/list');
  let result = await spinalAPI.get<IZoneItem[]>(url);
  const res = result.data.map((obj) => {
    Object.assign(obj, {buildingId, patrimoineId, color: '#D138DE' });
    return obj;
  });
  return res;
}

export async function getStaticDetails(buildingId: string, roomDynId: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/room/${roomDynId}/read_static_details`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}
export async function getNodeRead(buildingId: string, roomDynId: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${roomDynId}/read`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}

export async function getNodeReadMultiple(buildingId: string, dynamicIds: number [], includeChildrenRelations = true, includeParentRelations = true): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/read_multiple`);
  let config: AxiosRequestConfig = {
    params: {
      includeChildrenRelations,
      includeParentRelations
    }
  };
  let result = await spinalAPI.post<IZoneItem[]>(url,dynamicIds,config);
  return result.data;
}

export async function getpositionEquipement(buildingId: string, eqDynId: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/equipment/${eqDynId}/get_position`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}

export async function getEquipementPositions(buildingId: string, eqDynIds: string[]): Promise<IRoomPositionRes[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/equipment/get_position_multiple');
  try {
      const response = await spinalAPI.post<IRoomPositionRes[]>(url, eqDynIds); // Envoyer le tableau d'identifiants
      return response.data;
  } catch (error) {
      console.error('Erreur lors de la récupération des positions des équipements:', error);
      throw error;
  }
}

export async function getpositionRoom(buildingId: string, roomDynId: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/room/${roomDynId}/get_position`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}

export async function getStaticDetailsEquipement(buildingId: string, roomDynId: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/equipment/${roomDynId}/read_static_details`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}


export async function getFloorStaticDetails(buildingId: string, roomDynId: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/floor/${roomDynId}/read_static_details`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}


export async function getBuildingInfo(buildingId: string): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/building/read`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}


export async function getBuildingStaticDetails(buildingId: string, referenceIds: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/building/${referenceIds}/read_static_details`);
  let result = await spinalAPI.get<IZoneItem[]>(url);

  return result.data;
}

export async function getDocumentation(buildingId: string, referenceIds: number): Promise<IZoneItem[]> {
  
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceIds}/file_list`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}

export async function getTicket(buildingId: string, referenceIds: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceIds}/ticket_list`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}

export async function getNotes(buildingId: string, referenceIds: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceIds}/note_list`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}

export async function getNodeEndpointList(buildingId: string, referenceIds: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceIds}/endpoint_list`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}

export async function getNodeControlEndpointList(buildingId: string, referenceIds: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceIds}/control_endpoint_list`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}

export async function getParent(buildingId: string, referenceIds: number): Promise<IZoneItem[]> {
  
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/node/${referenceIds}/parents`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}


export async function getAttributListMultiple(buildingId: string, referenceIds: number[]): Promise<any> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/node/attribute_list_multiple');
  try {
    const response = await spinalAPI.post<any>(url, referenceIds);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des objets de référence:', error);
    throw error;
  }
}

export async function getTimeSeriesAsync(buildingId: string, endpointId: string, begin: number, end: number) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/endpoint/${endpointId}/timeSeries/read/${begin}/${end}`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  return result.data;
}

export async function getMultipleInventory(buildingId: string, referenceIds: number[]): Promise<any> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/room/inventory_multiple');
  try {
    const response = await spinalAPI.post<any>(url, referenceIds);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des objets de référence:', error);
    throw error;
  }
}


export async function postBIMObjectInfo(buildingId: string, referenceIds: any): Promise<any> {
  console.log('arrivé dans la fonction post');
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/BIM/getBimObjectsInfo');
  try {
    const response = await spinalAPI.post<any>(url, referenceIds);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des objets de référence:', error);
    throw error;
  }
}
export async function postDownloadFile(buildingId: string, referenceIds: any): Promise<Blob> {
  console.log('arrivé dans la fonction post');
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/node/${referenceIds}/download_file`);
  try {
    // Assurez-vous de spécifier que la réponse doit être un 'blob'
    const response = await spinalAPI.post(url, referenceIds, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des objets de référence:', error);
    throw error;
  }
}



export async function getRooms(patrimoineId: string, buildingId: string, floorId: string, floorDynId: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/floor/${floorDynId}/room_list`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  const res = result.data.map((obj) => {
    Object.assign(obj, { patrimoineId, buildingId, floorId, color: '#ded638' });
    return obj;
  });
  return res;
}

export async function getEquipmentGroup(patrimoineId: string, buildingId: string, floorId: string, floorDynId: number): Promise<IZoneItem[]> {
  // console.log('TESSSST55555');
  
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/equipementsGroup/list`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  const res = result.data.map((obj) => {
    Object.assign(obj, { patrimoineId, buildingId, floorId, color: '#ded638' });
    return obj;
  });
  return res;
}

export async function getEquipments(patrimoineId: string, buildingId: string,floorId: string, roomId : string, roomDynId: number): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/room/${roomDynId}/equipement_list`);
  let result = await spinalAPI.get<IEquipmentItem[]>(url);
  const res = result.data.map((obj) => {
    Object.assign(obj, {patrimoineId, buildingId,floorId, roomId, color: '#2693ff' });
    return obj;
  });
  return res;
}

export async function getFloorRef(
  platformId: string,
  floorDynId: number
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/floor/${floorDynId}/reference_Objects_list`
  );
  let result = await spinalAPI.get<IRefItem>(url);
  return result.data.infoReferencesObjects;
}

export async function getRoomsRef(
  platformId: string,
  roomDynId: number
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/room/${roomDynId}/reference_Objects_list`
  );
  let result = await spinalAPI.get<IRefItem>(url);
  return result.data.infoReferencesObjects;
}

export async function getFile(buildingId: string, referenceIds: any): Promise<Blob> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/node/${referenceIds}/download_file`);
  try {
    const response = await spinalAPI.post(url, referenceIds, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des objets de référence:', error);
    throw error;
  }
}


export async function postFloorInventory(id: number, body: { context: string; category: string }, includePosition?: boolean, includeArea: boolean = true, onlyDynamicId: boolean = true): Promise<any> {
  const spinalAPI = SpinalAPI.getInstance();
  const buildingId = localStorage.getItem("idBuilding");
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/floor/${id}/inventory`);

  const params = new URLSearchParams();
  if (includePosition !== undefined) params.append("includePosition", String(includePosition));
  if (includeArea !== undefined) params.append("includeArea", String(includeArea));
  if (onlyDynamicId !== undefined) params.append("onlyDynamicId", String(onlyDynamicId));

  try {
    const response = await spinalAPI.post<any>(`${url}?${params.toString()}`, body);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'inventaire du floor:", error);
    throw error;
  }
}


export async function postRoomInventory(id: number, body: { context: string; category: string }, includePosition?: boolean, onlyDynamicId: boolean = true): Promise<any> {
  const spinalAPI = SpinalAPI.getInstance();
  const buildingId = localStorage.getItem("idBuilding") || '';
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/room/${id}/inventory`);

  const params = new URLSearchParams();
  if (includePosition !== undefined) params.append("includePosition", String(includePosition));
  if (onlyDynamicId !== undefined) params.append("onlyDynamicId", String(onlyDynamicId));

  try {
    const response = await spinalAPI.post<any>(`${url}?${params.toString()}`, body);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'inventaire de la room:", error);
    throw error;
  }
}

