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
    IEquipmentItem,
    IBuildingItem,
    IZoneItem
} from '../../../../../../global-components/SpaceSelector/interfaces/IBuildingItem';

export async function getRoomContexts(patrimoineId: string, buildingId: string): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/roomsGroup/list`);
    let result = await spinalAPI.get<IZoneItem[]>(url);
    const res = result.data.map((obj) => {
        return obj;
    });
    return res;
}



export async function getRoomList(patrimoineId: string, buildingId: string, contextDynId: number, categoryDynId: number, groupDynId: number): Promise<IZoneItem[]> {    
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/roomsGroup/${contextDynId}/category/${categoryDynId}/group/${groupDynId}/roomList`);
    let result = await spinalAPI.get<IZoneItem[]>(url);
    const res = result.data.map((obj) => {
        Object.assign(obj, { patrimoineId, buildingId, req: 'RoomList' });
        return obj;
    });
    // console.log('LES DONNÉES RECUPERE DANS L OBJET SONT :::',res)
    return res;
}