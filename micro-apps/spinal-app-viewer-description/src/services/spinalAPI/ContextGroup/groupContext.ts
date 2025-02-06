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

import type {
    IEquipmentItem,
    IBuildingItem,
    IZoneItem,
    IRoomPositionRes,

} from '../../../../../../global-components/SpaceSelector/interfaces/IBuildingItem';

import { error, log, warn } from 'console';
import { logTypes } from "micro-apps/spinal-env-pam-websocket-state/src/store/constants";


export async function getGroupContext(patrimoineId: string, buildingId: string, position_type: any,): Promise<any | null> {

    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/groupContext/list`);
    //insérer la selection de groupe
    let result = await spinalAPI.get<IZoneItem[]>(url);
    // console.warn(result);

    let resultCopy = JSON.parse(JSON.stringify(result));

    // Filtrez `result.data` et mettez à jour `resultCopy.data` avec les éléments filtrés
    resultCopy.data = resultCopy.data.filter(item =>
        item.type === 'BIMObjectGroupContext' || item.type === 'geographicRoomGroupContext'
    );
    // console.log(resultCopy);

    store.commit(MutationTypes.SET_USER_SELECTION, { "ctx": resultCopy.data });



    const matchedContext = resultCopy.data.find(context => context.name === store.state.appDataStore.user_selected.ctx);
    let type;
    let List: IZoneItem[] | null = null;

    if (matchedContext) {
        let tree = await getGroupContextCategoryList(patrimoineId, buildingId, matchedContext.dynamicId);
        store.commit(MutationTypes.SET_USER_SELECTION, { "ctx": resultCopy.data, "cat": tree });
        const matchedCategory = tree.find(context => context.name === store.state.appDataStore.user_selected.cat);
        if (matchedCategory) {
            let grpList = await getGroupContextGroupList(patrimoineId, buildingId, matchedContext.dynamicId, matchedCategory.dynamicId);
            store.commit(MutationTypes.SET_USER_SELECTION, { "ctx": resultCopy.data, "cat": tree, "grp": grpList });
            let allLists = [];
            for (const selectedGroupName of store.state.appDataStore.user_selected.grp) {
                const matchedGrpList = grpList.find(context => context.name === selectedGroupName);
                if (matchedGrpList) {
                    let list;
                    type = matchedGrpList.type;
                    if (matchedGrpList.type === "BIMObjectGroup") {
                        list = await getequipementList(patrimoineId, buildingId, matchedContext.dynamicId, matchedCategory.dynamicId, matchedGrpList.dynamicId);
                    } else if (matchedGrpList.type === "geographicRoomGroup") {
                        list = await getroomList(patrimoineId, buildingId, matchedContext.dynamicId, matchedCategory.dynamicId, matchedGrpList.dynamicId);
                    }
                    if (list) {
                        allLists.push(...list);
                    }
                }
            }

            if (position_type.type === 'building') {
                return allLists;
            } else if (position_type.type === 'geographicFloor') {
                // console.log('ça rentre');

                const roomIds = allLists.map(room => room.dynamicId.toString());
                let position;
                if (type === "geographicRoomGroup") {
                    position = await getRoomPositions(buildingId, roomIds);
                } else {
                    position = await getEquipementPositions(buildingId, roomIds);
                }
                const List_floor = get_element_floor(position);


                const roomsOnFloor = getRoomsByFloor(position_type.dynamicId, allLists, List_floor);


                // const attribut = await getAttributeListMultiple(buildingId, roomIds);

                const chunkedRoomIds = lodash.chunk(roomIds, 500);
                const promises = chunkedRoomIds.map(ids => getAttributeListMultiple(buildingId, ids));
                const results = await Promise.allSettled(promises);

                const attribut = results.reduce((acc, result) => {
                    if (result.status === "fulfilled") {
                        acc.push(...result.value);
                    }
                    return acc;
                }, []);

                const nomenclature = createUnifiedNomenclature(attribut);
                let alldataBimObject = {
                    data: enrichBIMObjects(roomsOnFloor, attribut),
                    nomenclature: nomenclature
                };

                return alldataBimObject;
            } else if (position_type.type === "geographicRoom") {

                // console.log('ça rentre dans la 222222222222222222223*');

                const roomIds = allLists.map(room => room.dynamicId.toString());
                let position;
                if (type === "geographicRoomGroup") {
                    position = await getRoomPositions(buildingId, roomIds);
                } else {
                    position = await getEquipementPositions(buildingId, roomIds);
                }
                const List_floor = get_element_floor(position);
                // console.log(List_floor);


                const roomsOnFloor = getElByFloor(position_type.dynamicId, allLists, List_floor);
                const toto = [{
                    roomDynamicId: position_type.dynamicId
                }]

                // console.warn(List_floor, 'dzdzdzdz///////////////////////////////////');
                // console.warn(roomsOnFloor, 'dzdzdzdz///////////////////////////////////');
                // console.warn(position_type, 'dzdzdzdz//////////////////////////////////');
                // const attribut = await getAttributeListMultiple(buildingId, roomIds);

                const chunkedRoomIds = lodash.chunk(roomIds, 500);
                const promises = chunkedRoomIds.map(ids => getAttributeListMultiple(buildingId, ids));
                const results = await Promise.allSettled(promises);

                const attribut = results.reduce((acc, result) => {
                    if (result.status === "fulfilled") {
                        acc.push(...result.value);
                    }
                    return acc;
                }, []);

                const nomenclature = createUnifiedNomenclature(attribut);
                let alldataBimObject = {
                    data: enrichBIMObjects(roomsOnFloor, attribut),
                    nomenclature: nomenclature
                };

                return alldataBimObject;

            }
            else {

                // console.warn('RESTE', position_type);
                return allLists;
            }
        }
    }

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

function createUnifiedNomenclature(dataArray: any[]): any {
    const unifiedNomenclature = {};
    dataArray?.forEach(data => {
        data.categoryAttributes?.forEach(category => {
            if (!unifiedNomenclature[category.name]) {
                unifiedNomenclature[category.name] = [];
            }

            category?.attributs?.forEach(attribut => {
                if (!unifiedNomenclature[category.name].includes(attribut.label)) {
                    unifiedNomenclature[category.name].push(attribut.label);
                }
            });
        });
    });
    return unifiedNomenclature
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
export async function getContextList(buildingId: string): Promise<IRoomPositionRes[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/context/list');
    try {
        let result = await spinalAPI.get<IZoneItem[]>(url); // Envoyer le tableau d'identifiants
        return result.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des positions des pièces:', error);
        throw error;
    }
}
export async function getContextCategoryList(buildingId: string, contextId: number): Promise<IRoomPositionRes[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/groupeContext/${contextId}/category_list`);
    try {
        let result = await spinalAPI.get<IZoneItem[]>(url); // Envoyer le tableau d'identifiants
        return result.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des positions des pièces:', error);
        throw error;
    }
}
export async function getContextCategoryGroupList(buildingId: string, contextId: number, categoryDynId: number): Promise<IRoomPositionRes[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/groupeContext/${contextId}/category/${categoryDynId}/group_list`);
    try {
        let result = await spinalAPI.get<IZoneItem[]>(url); // Envoyer le tableau d'identifiants
        return result.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des positions des pièces:', error);
        throw error;
    }
}



export async function getequipementList(patrimoineId: string, buildingId: string, contextDynId: number, categoryDynId: number, groupDynId: number): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/equipementsGroup/${contextDynId}/category/${categoryDynId}/group/${groupDynId}/equipementList`);
    let result = await spinalAPI.get<IZoneItem[]>(url);
    const res = result.data.map((obj) => {
        Object.assign(obj, { patrimoineId, buildingId });
        return obj;
    });
    return res;
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