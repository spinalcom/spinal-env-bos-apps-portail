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
import type { IBuildingItem, IZoneItem, IEquipmentItem, IRefItem, } from '../../interfaces/IBuildingItem';


export async function getFloors(): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl('api/v1/floor/list');
  let result = await spinalAPI.get<IZoneItem[]>(url);
  const res = result.data.map((obj) => {
    Object.assign(obj, { color: '#D138DE' });
    return obj;
  });
  return res;
}

export async function getRooms(floorId: string, floorDynId: number): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`api/v1/floor/${floorDynId}/room_list`);
  let result = await spinalAPI.get<IZoneItem[]>(url);
  const res = result.data.map((obj) => {
    Object.assign(obj, { floorId, color: '#ded638' });
    return obj;
  });
  return res;
}

export async function getEquipments(floorId: string, roomId : string): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`api/v1/room/${roomId}/equipement_list`);
  let result = await spinalAPI.get<IEquipmentItem[]>(url);
  const res = result.data.map((obj) => {
    Object.assign(obj, { floorId, roomId, color: '#2693ff' });
    return obj;
  });
  return res;
}

export async function getFloorRef(floorDynId: number): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(    `api/v1/floor/${floorDynId}/reference_Objects_list`);
  let result = await spinalAPI.get<IRefItem>(url);
  return result.data.infoReferencesObjects;
}

export async function getRoomsRef(roomDynId: number): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrl(`api/v1/room/${roomDynId}/reference_Objects_list`);
  let result = await spinalAPI.get<IRefItem>(url);
  return result.data.infoReferencesObjects;
}
