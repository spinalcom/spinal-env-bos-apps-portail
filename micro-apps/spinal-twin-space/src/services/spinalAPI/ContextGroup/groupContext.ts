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

import { INodeItem, IGroupTreeRec } from "../../../interfaces/INodeItem";
import { SpinalAPI } from '../SpinalAPI';
// import { IConfig, EntryPoint } from "../../../interfaces/IConfig";
import * as lodash from "lodash";
import { store } from '../../store/index';
import { INodeItemTree } from "../../interfaces/INodeItem";
import { MutationTypes } from '../../store/appDataStore/mutations';
import { getNodeReadMultiple } from '../GeographicContext/geographicContext'
import { getequipementList } from "../EquipementsGroup/equipementsGroup";

import type {
    IEquipmentItem,
    IBuildingItem,
    IZoneItem,
    IRoomPositionRes,

} from '../../../../../../global-components/SpaceSelector/interfaces/IBuildingItem';

export async function getAttributeListMultiple(buildingId: string, roomIds: string[]): Promise<IRoomPositionRes[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/node/attribute_list_multiple');
    try {
        const response = await spinalAPI.post<IRoomPositionRes[]>(url, roomIds); 
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des positions des pièces:', error);
        throw error;
    }
}

export async function getRoomPositions(buildingId: string, roomIds: string[]): Promise<IRoomPositionRes[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/room/get_position_multiple');
    try {
        const response = await spinalAPI.post<IRoomPositionRes[]>(url, roomIds);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des positions des pièces:', error);
        throw error;
    }
}



export async function getEquipementPositions(buildingId: string, roomIds: string[]): Promise<IRoomPositionRes[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/equipment/get_position_multiple');
    try {
        const response = await spinalAPI.post<IRoomPositionRes[]>(url, roomIds); // Envoyer le tableau d'identifiants
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des positions des pièces:', error);
        throw error;
    }
}



export async function getroomList(patrimoineId: string, buildingId: string, contextDynId: number, categoryDynId: number, groupDynId: number): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/roomsGroup/${contextDynId}/category/${categoryDynId}/group/${groupDynId}/roomList`);
    let result = await spinalAPI.get<IZoneItem[]>(url);
    const res = result.data.map((obj) => {
        Object.assign(obj, { patrimoineId, buildingId });
        return obj;
    });

    return res;
}


export async function getGroupContextCategoryList(patrimoineId: string, buildingId: string, contextDynId: number): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/groupeContext/${contextDynId}/category_list`);
    let result = await spinalAPI.get<IZoneItem[]>(url);
    const res = result.data.map((obj) => {
        Object.assign(obj, { patrimoineId, buildingId, req: 'CategoryList' });
        return obj;
    });
    return res;
}

export async function getGroupContextGroupList(patrimoineId: string, buildingId: string, contextDynId: number, categoryDynId: number): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/groupeContext/${contextDynId}/category/${categoryDynId}/group_list`);
    let result = await spinalAPI.get<IZoneItem[]>(url);
    const res = result.data.map((obj) => {
        Object.assign(obj, { patrimoineId, buildingId, req: 'GroupList' });
        return obj;
    });
    return res;
}


export async function getGroupContextread(patrimoineId: string, buildingId: string, contextDynId: number, categoryDynId: number, groupDynId: number): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/groupContext/${contextDynId}/category/${categoryDynId}/group/${groupDynId}/read`);
    let result = await spinalAPI.get<IZoneItem[]>(url);
    const res = result.data.map((obj) => {
        Object.assign(obj, { patrimoineId, buildingId, req: 'EquipementList' });
        return obj;
    });
    return res;
}



// export async function getEnrichedEquipmentList(patrimoineId: string, buildingId: string, contextDynId: number, categoryDynId: number, groupDynId: number){

// }