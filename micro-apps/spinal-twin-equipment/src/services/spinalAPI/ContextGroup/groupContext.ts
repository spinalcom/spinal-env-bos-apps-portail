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
import { IConfig, EntryPoint } from "../../../interfaces/IConfig";
import * as lodash from "lodash";
import { config } from '../../../config';
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


async function processPositionType(position_type, buildingId, allLists) {
    
    const roomIds = allLists.map(room => room.dynamicId.toString());
    const chunkedRoomIds = lodash.chunk(roomIds, 200);

    //const position = await getEquipementPositions(buildingId, roomIds);
    const positionPromises = chunkedRoomIds.map(ids => getEquipementPositions(buildingId, ids));
    const positionResults = await Promise.allSettled(positionPromises);

    const position = positionResults.reduce((acc, result) => {
        if (result.status === 'fulfilled') {
            acc.push(...result.value);
        }
        return acc;
    }, []);

    
    const readPromises = chunkedRoomIds.map(ids => getNodeReadMultiple(buildingId, ids, true, false));
    const readResults = await Promise.allSettled(readPromises);

    const nodeReads = readResults.reduce((acc, result) => {
        if (result.status === 'fulfilled') {
            acc.push(...result.value);
        }
        return acc;
    }, []);

    const newLists = allLists.map(obj => {
        const correctNode = nodeReads.find(node => node.dynamicId === obj.dynamicId);
        if (!correctNode) {
            return obj;
        }
        const response = correctNode.children_relation_list;
        const relation_tickets = response.find(relation => relation.name === "SpinalSystemServiceTicketHasTicket")
        const count_tickets = relation_tickets ? relation_tickets.children_number : 0;
        const relation_ep = response.find(relation => relation.name === "hasEndPoint")
        const count_ep = relation_ep ? relation_ep.children_number : 0;
        const relation_cp = response.find(relation => relation.name === "hasControlPoints")
        const count_cp = relation_cp ? relation_cp.children_number : 0;
        const relation_notes = response.find(relation => relation.name === "hasNotes")
        const count_notes = relation_notes ? relation_notes.children_number : 0;
        const relation_category_attributes = response.find(relation => relation.name === "hasCategoryAttributes")
        const count_category_attributes = relation_category_attributes ? relation_category_attributes.children_number : 0;
        const relation_files = response.find(relation => relation.name === "hasFiles")
        const count_files = relation_files ? relation_files.children_number : 0;
        return { ...obj, nbr_tickets: count_tickets, nbr_ep: count_ep, nbr_cp: count_cp, nbr_notes: count_notes, nbr_category_attributes: count_category_attributes, nbr_files: count_files };
    })
    

    let roomsOnFloor;
    if (position_type.type === 'building') {
        roomsOnFloor = newLists.map(obj => {
            const pos = position.find(pos => pos.dynamicId === obj.dynamicId);
            return { ...obj, floor: pos?.info?.floor, room: pos?.info?.room};
        });
    } else if (position_type.type === 'geographicFloor') {
        const List_floor = get_element_floor(position);
        roomsOnFloor = getRoomsByFloor(position_type.dynamicId, newLists, List_floor).map(obj => {
            const pos = position.find(pos => pos.dynamicId === obj.dynamicId);
            return { ...obj, floor: pos?.info?.floor, room: pos?.info?.room };
        });
    } else if (position_type.type === 'geographicRoom') {
        const List_floor = get_element_floor(position);
        roomsOnFloor = getElByFloor(position_type.dynamicId, newLists, List_floor).map(obj => {
            const pos = position.find(pos => pos.dynamicId === obj.dynamicId);
            return { ...obj, floor: pos?.info?.floor, room: pos?.info?.room };
        });
    } else {
        return newLists; // Fallback for unhandled types
    }

    
    const promises = chunkedRoomIds.map(ids => getAttributeListMultiple(buildingId, ids));
    const results = await Promise.allSettled(promises);

    const attribut = results.reduce((acc, result) => {
        if (result.status === 'fulfilled') {
            acc.push(...result.value);
        }
        return acc;
    }, []);

    return {
        data: enrichBIMObjects(roomsOnFloor, attribut),
    };
}

function enrichBIMObjects(bimObjects: any[], dataObjects: any[]): any[] {

    const attributesDictionary: { [dynamicId: number]: any[] } = {};

    // console.log(dataObjects);

    dataObjects?.forEach(obj => {
        attributesDictionary[obj.dynamicId] = obj.categoryAttributes;
    });

    return bimObjects.map(bimObject => {
        if (attributesDictionary[bimObject.dynamicId]) {
            return { ...bimObject, categoryAttributes: attributesDictionary[bimObject.dynamicId] };
        }
        return bimObject;
    });
}

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

function getRoomsByFloor(floorId: number, rooms: any, roomFloorInfos: any): any[] {

    const roomIdsOnFloor = roomFloorInfos
        .filter(info => info.floorDynamicId === floorId)
        .map(info => info.roomDynamicId);

    return rooms.filter(room => roomIdsOnFloor.includes(room.dynamicId));
}

function getElByFloor(floorId: number, rooms: any, roomFloorInfos: any): any[] {

    const roomIdsOnFloor = roomFloorInfos
        .filter(info => info.RDynamicId === floorId)
        .map(info => info.roomDynamicId);
    return rooms.filter(room => roomIdsOnFloor.includes(room.dynamicId));
}

function get_element_floor(results: any[]): IRoomFloorInfo[] {

    return results.filter(a => !a.error).map(result => ({
        roomDynamicId: result.dynamicId,
        floorDynamicId: result?.info?.floor?.dynamicId,
        RDynamicId: result?.info?.room?.dynamicId
    }));
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

// export async function getequipementList(patrimoineId: string, buildingId: string, contextDynId: number, categoryDynId: number, groupDynId: number): Promise<IZoneItem[]> {
//     const spinalAPI = SpinalAPI.getInstance();
//     const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/equipementsGroup/${contextDynId}/category/${categoryDynId}/group/${groupDynId}/equipementList`);
//     let result = await spinalAPI.get<IZoneItem[]>(url);
//     const res = result.data.map((obj) => {
//         Object.assign(obj, { patrimoineId, buildingId });
//         return obj;
//     });
//     return res;
// }



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