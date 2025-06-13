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

import { getBuildings, getBuildingById } from "../../spinalAPI/GeographicContext/getBuildings";
import { IGetAllBuildingsRes } from "../../../interfaces/IGetAllBuildingsRes";
import { SpinalAPI } from "../../spinalAPI/SpinalAPI";
import { MutationTypes } from "./mutations";
import { postRoomInventory,postFloorInventory,getEquipments, getFloors, getRooms, getBuilding ,
	getAttributListMultiple, getDocumentation ,postDownloadFile ,getTicket, getParent,
	getNotes, getNodeEndpointList, getNodeControlEndpointList ,getTimeSeriesAsync , getFile, getNodeReadMultiple, getEquipementPositions
} from "../../spinalAPI/GeographicContext/geographicContext";
import { addTicketDoc, createTicket, getProcess, getWorkFlowList, Ticket } from "../../spinalAPI/CreateTicket";

import { deleteFile, uploadDoc, deleteAttribut, deleteCategoryAttribut, updateCategoryAttribut, updateAttribut } from "../../spinalAPI/UploadDoc/Doc";

import { getGroupContextCategoryList, getGroupContextGroupList, getGroupContextread } from "../../spinalAPI/ContextGroup/groupContext";

import { createAttribut, createCategory, getCategoriesList } from "../../spinalAPI/NodeAttributs/nodeAttributs";

import { getEquipmentContexts, getCategoryList, getGroupList, getequipementList } from "../../spinalAPI/EquipementsGroup/equipementsGroup";
import type { IEquipmentItem, IZoneItem, ISpaceSelectorItem } from "../../../../../../global-components/SpaceSelector";
import { INodeItem } from "../../../interfaces/INodeItem";
import { IViewInfoBody, IViewInfoItemRes } from "../../spinalAPI/GeographicContext/getViewInfo";
import { ActionTypes, ApiIteratorStoreRecordNumberType, ApiIteratorStoreRecordStringType, ApiIteratorStoreType, AugmentedActionContextAppData } from "../../../interfaces/vuexStoreTypes";
import { getGroupsItems, getAllCategoriesTree } from "../../spinalAPI/GeographicContext/groupsItems";
import SpriteManager from "../../../../../../global-components/viewer/manager/spriteManager";
import ViewerManager from "../../../../../../global-components/viewer/manager/viewerManager";
import ModelManager  from "../../../../../../global-components/viewer/manager/modelManager";
import { IConfig } from "../../../interfaces/IConfig";
import { classifyItemByBimFileId } from "./utils/openViewer";
import * as lodash from "lodash";

const ApiIteratorStore: ApiIteratorStoreType & ApiIteratorStoreRecordStringType & ApiIteratorStoreRecordNumberType = {};

export const actions = {
	async [ActionTypes.UPDATE_MULTIPLE_ATTRIBUTES]({ commit }: AugmentedActionContextAppData, { buildingId, formattedData }: { buildingId: string; formattedData: any[] }): Promise<any> {
		// console.log('arrivé dans l actio');
		const spinalAPI = SpinalAPI.getInstance();
        try {
            const result = await updateMultipleAttributes(buildingId, formattedData);
            // console.log('Mise à jour des attributs réussie:', result);
            return result;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des attributs:', error);
            throw error;
        }
    },

	async [ActionTypes.GET_ATTRIBUT_LIST_MULTIPLE]({ commit }: AugmentedActionContextAppData, { buildingId, referenceIds }: { buildingId: string; referenceIds: number[] }): Promise<any> {
		try {
      		const chunkedIds = lodash.chunk(referenceIds, 200);
			const promises = chunkedIds.map(ids => getAttributListMultiple(buildingId, ids));
			const promiseResults = await Promise.allSettled(promises);
			const result = promiseResults.reduce((acc, result) => {
				if (result.status === 'fulfilled') {
					acc.push(...result.value);
				}
				return acc;
			}, []);
			// const result = await getAttributListMultiple(buildingId, referenceIds);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération attributs:', error);
			throw error;
		}
	},

	async [ActionTypes.GET_DOCUMENTATION]({ commit }: AugmentedActionContextAppData, { buildingId, referenceIds }: { buildingId: string; referenceIds: number }): Promise<any> {
		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getDocumentation(buildingId, referenceIds);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},

	async [ActionTypes.POST_DOWNLOAD_FILE]({ commit }: AugmentedActionContextAppData, { buildingId, referenceIds }: { buildingId: string; referenceIds: any }): Promise<any> {
		try {
			const result = await postDownloadFile(buildingId, referenceIds);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},

	async [ActionTypes.GET_TICKET]({ commit }: AugmentedActionContextAppData, { buildingId, referenceIds }: { buildingId: string; referenceIds: number }): Promise<any> {
		// console.log(buildingId , referenceIds , 'RR');

		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getTicket(buildingId, referenceIds);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},

	async [ActionTypes.GET_NOTES]({ commit }: AugmentedActionContextAppData, { buildingId, referenceIds }: { buildingId: string; referenceIds: number }): Promise<any> {
		// console.log(buildingId , referenceIds , 'RR');

		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getNotes(buildingId, referenceIds);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},


	async [ActionTypes.GET_NODE_ENDPOINT_LIST]({ commit }: AugmentedActionContextAppData, { buildingId, referenceIds }: { buildingId: string; referenceIds: number }): Promise<any> {
		// console.log(buildingId , referenceIds , 'RR');

		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getNodeEndpointList(buildingId, referenceIds);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},

	async [ActionTypes.GET_NODE_CONTROL_ENDPOINT_LIST]({ commit }: AugmentedActionContextAppData, { buildingId, referenceIds }: { buildingId: string; referenceIds: number }): Promise<any> {
		// console.log(buildingId , referenceIds , 'RR');

		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getNodeControlEndpointList(buildingId, referenceIds);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},

	async [ActionTypes.GET_TIMES_SERIES]({ commit }: AugmentedActionContextAppData, { buildingId, referenceIds, begin, end }: { buildingId: string; referenceIds: number; begin: number; end: number }): Promise<any> {
		// console.log(buildingId , referenceIds , 'RR');
		const endpointId = referenceIds.toString();
		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getTimeSeriesAsync(buildingId, endpointId, begin, end);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},

	async [ActionTypes.READ_NODE_MULTIPLE]({ commit }: AugmentedActionContextAppData, { buildingId, nodeIds, includeChildrenRelations, includeParentRelations }: { buildingId: string; nodeIds: number []; includeChildrenRelations: boolean; includeParentRelations: boolean }): Promise<any> {
		try {
			const chunkedIds = lodash.chunk(nodeIds, 200);
			const promises = chunkedIds.map(ids => getNodeReadMultiple(buildingId, ids, includeChildrenRelations, includeParentRelations));
			const promiseResults = await Promise.allSettled(promises);
			const result = promiseResults.reduce((acc, result) => {
				if (result.status === 'fulfilled') {
					acc.push(...result.value);
				}
				return acc;
			}, []);
			// const result = await getAttributListMultiple(buildingId, referenceIds);
			return result;
			//const result = await getNodeReadMultiple(buildingId, nodeIds, includeChildrenRelations, includeParentRelations);
			//return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},




	async [ActionTypes.GET_GROUP_CONTEXT_GROUP_LIST]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, contextDynId, categoryDynId, id, forceUpdate }: any): Promise<IZoneItem[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_GROUP_CONTEXT_GROUP_LIST] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_GROUP_CONTEXT_GROUP_LIST] = {};
		}
		const floorObjStore = ApiIteratorStore[ActionTypes.GET_GROUP_CONTEXT_GROUP_LIST]!;

		if (typeof floorObjStore[id] === "undefined" || forceUpdate === true) {
			floorObjStore[id] = spinalAPI.createIteratorCall(getGroupContextGroupList, patrimoineId, buildingId, contextDynId, categoryDynId);
		}
		const floors = await floorObjStore[id].next();
		// commit(MutationTypes.SET_DATA, { id: id, items: floors.value });
		return floors.value;
	},

	async [ActionTypes.GET_GROUP_CONTEXT_CATEGORY_LIST]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, contextDynId, id, forceUpdate }: any): Promise<IZoneItem[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_GROUP_CONTEXT_CATEGORY_LIST] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_GROUP_CONTEXT_CATEGORY_LIST] = {};
		}
		const floorObjStore = ApiIteratorStore[ActionTypes.GET_GROUP_CONTEXT_CATEGORY_LIST]!;

		if (typeof floorObjStore[id] === "undefined" || forceUpdate === true) {
			floorObjStore[id] = spinalAPI.createIteratorCall(getGroupContextCategoryList, patrimoineId, buildingId, contextDynId,);
		}
		const floors = await floorObjStore[id].next();
		// commit(MutationTypes.SET_DATA, { id: id, items: floors.value });
		return floors.value;
	},

	async [ActionTypes.GET_EQUIPMENTS_GROUP]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, floorId, id, forceUpdate }: any): Promise<IZoneItem[]> {

		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_EQUIPMENTS_GROUP] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_EQUIPMENTS_GROUP] = {};
		}
		const floorObjStore = ApiIteratorStore[ActionTypes.GET_EQUIPMENTS_GROUP]!;

		if (typeof floorObjStore[id] === "undefined" || forceUpdate === true) {
			floorObjStore[id] = spinalAPI.createIteratorCall(getEquipmentContexts, patrimoineId, buildingId, floorId);
		}
		const floors = await floorObjStore[id].next();
		// commit(MutationTypes.SET_DATA, { id: id, items: floors.value });
		return floors.value;
	},

	async [ActionTypes.GET_CATEGORY_LIST]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, contextDynId, id, forceUpdate }: any): Promise<IZoneItem[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_CATEGORY_LIST] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_CATEGORY_LIST] = {};
		}
		const floorObjStore = ApiIteratorStore[ActionTypes.GET_CATEGORY_LIST]!;

		if (typeof floorObjStore[id] === "undefined" || forceUpdate === true) {
			floorObjStore[id] = spinalAPI.createIteratorCall(getCategoryList, patrimoineId, buildingId, contextDynId,);
		}
		const floors = await floorObjStore[id].next();
		// commit(MutationTypes.SET_DATA, { id: id, items: floors.value });
		return floors.value;
	},

	async [ActionTypes.GET_GROUP_LIST]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, contextDynId, categoryDynId, id, forceUpdate }: any): Promise<IZoneItem[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_GROUP_LIST] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_GROUP_LIST] = {};
		}
		const floorObjStore = ApiIteratorStore[ActionTypes.GET_GROUP_LIST]!;

		if (typeof floorObjStore[id] === "undefined" || forceUpdate === true) {
			floorObjStore[id] = spinalAPI.createIteratorCall(getGroupList, patrimoineId, buildingId, contextDynId, categoryDynId);
		}
		const floors = await floorObjStore[id].next();
		// commit(MutationTypes.SET_DATA, { id: id, items: floors.value });
		return floors.value;
	},

	async [ActionTypes.GET_EQUIPEMENT_LIST]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, contextDynId, categoryDynId, groupDynId, id, forceUpdate }: any): Promise<IZoneItem[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_EQUIPEMENT_LIST] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_EQUIPEMENT_LIST] = {};
		}
		const floorObjStore = ApiIteratorStore[ActionTypes.GET_EQUIPEMENT_LIST]!;

		if (typeof floorObjStore[id] === "undefined" || forceUpdate === true) {
			floorObjStore[id] = spinalAPI.createIteratorCall(getequipementList, patrimoineId, buildingId, contextDynId, categoryDynId, groupDynId);
		}
		const floors = await floorObjStore[id].next();
		// commit(MutationTypes.SET_DATA, { id: id, items: floors.value });
		return floors.value;
	},


	async [ActionTypes.GET_EQUIPMENT_POSITION_MULTIPLE]({ commit }: AugmentedActionContextAppData, { buildingId, equipmentIds }: any): Promise<IZoneItem[]> {
		try {
			const chunkedIds = lodash.chunk(equipmentIds, 200);
			const promises = chunkedIds.map(ids => getEquipementPositions(buildingId, ids));

			const promiseResults = await Promise.allSettled(promises);
			const result = promiseResults.reduce((acc, result) => {
				if (result.status === 'fulfilled') {
					acc.push(...result.value);
				}
				return acc;
			}, []);
		  // const result = await getAttributListMultiple(buildingId, referenceIds);
		  return result;
	  } catch (error) {
		  console.error('Erreur lors de la récupération des positions:', error);
		  throw error;
	  }
	},


	async [ActionTypes.GET_BUILDINGS]({ commit, state }: AugmentedActionContextAppData, { patrimoineId, forceUpdate }): Promise<IGetAllBuildingsRes[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_BUILDINGS] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_BUILDINGS] = {};
		}

		if (typeof ApiIteratorStore[ActionTypes.GET_BUILDINGS][patrimoineId] === "undefined" || forceUpdate === true) {
			ApiIteratorStore[ActionTypes.GET_BUILDINGS][patrimoineId] = spinalAPI.createIteratorCall(getBuildings, patrimoineId);
		}

		const buildings = await ApiIteratorStore[ActionTypes.GET_BUILDINGS][patrimoineId]!.next();
		commit(MutationTypes.SET_BUILDINGS, buildings.value);
		return buildings.value;
	},
	async [ActionTypes.GET_BOS_BUILDING]({ commit }: AugmentedActionContextAppData, { buildingId }: { buildingId: string; }): Promise<any> {
		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getBuilding(buildingId);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},

	async [ActionTypes.GET_BUILDING_BY_ID]({ commit, state }: AugmentedActionContextAppData, { buildingId, forceUpdate }): Promise<IGetAllBuildingsRes> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID] = {};
		}

		if (typeof ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID][buildingId] === "undefined" || forceUpdate === true) {
			ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID][buildingId] = spinalAPI.createIteratorCall(getBuildingById, buildingId);
		}

		const building = await ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID][buildingId]!.next();
		return building.value;
	},


	async [ActionTypes.GET_FLOORS]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, forceUpdate }): Promise<IZoneItem[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_FLOORS] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_FLOORS] = {};
		}

		const floorObjStore = ApiIteratorStore[ActionTypes.GET_FLOORS]!;
		if (typeof floorObjStore[buildingId] === "undefined" || forceUpdate === true) {
			floorObjStore[buildingId] = spinalAPI.createIteratorCall(getFloors, patrimoineId, buildingId);
		}

		const floors = await floorObjStore[buildingId].next();
		commit(MutationTypes.SET_FLOORS, { id: buildingId, items: floors.value });
		return floors.value;
	},

	async [ActionTypes.GET_ROOMS]({ commit }: AugmentedActionContextAppData, { buildingId, patrimoineId, floorId, id, forceUpdate }: any): Promise<IZoneItem[]> {
		const spinalAPI = SpinalAPI.getInstance();
		if (typeof ApiIteratorStore[ActionTypes.GET_ROOMS] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_ROOMS] = {};
		}
		const floorObjStore = ApiIteratorStore[ActionTypes.GET_ROOMS]!;

		if (typeof floorObjStore[id] === "undefined" || forceUpdate === true) {
			floorObjStore[id] = spinalAPI.createIteratorCall(getRooms, patrimoineId, buildingId, floorId, id);
		}
		const floors = await floorObjStore[id].next();
		commit(MutationTypes.SET_ROOMS, { id: id, items: floors.value });
		return floors.value;
	},

	async [ActionTypes.GET_EQUIPMENTS]({ commit }: AugmentedActionContextAppData, { floorId, roomId, patrimoineId, buildingId, id, forceUpdate }: any): Promise<IEquipmentItem[]> {
		const spinalAPI = SpinalAPI.getInstance();

		if (typeof ApiIteratorStore[ActionTypes.GET_EQUIPMENTS] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_EQUIPMENTS] = {};
		}

		const roomObjStore = ApiIteratorStore[ActionTypes.GET_EQUIPMENTS]!;

		if (typeof roomObjStore[id] === "undefined" || forceUpdate === true) {
			roomObjStore[id] = spinalAPI.createIteratorCall(getEquipments, patrimoineId, buildingId, floorId, roomId, id);
		}

		const equipments = await roomObjStore[id].next();
		commit(MutationTypes.SET_EQUIPMENTS, { id: id, items: equipments.value });
		return equipments.value;
	},

	async [ActionTypes.GET_GROUPS_ITEMS]({ commit, state }: AugmentedActionContextAppData, { forceUpdate, config, buildingId }): Promise<{ [key: string]: INodeItem }> {
		const spinalAPI = SpinalAPI.getInstance();

		if (typeof ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS] = {};
		}

		if (typeof ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS][buildingId] === "undefined" || forceUpdate) {
			ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS][buildingId] = spinalAPI.createIteratorCall(getGroupsItems, config, buildingId);
		}

		const items = await ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS][buildingId].next();
		return items?.value;
	},

	async [ActionTypes.GET_CATEGORIES_TREE]({ commit, state }: AugmentedActionContextAppData, { forceUpdate, buildingId, context }): Promise<{ [key: string]: INodeItem }> {
		const spinalAPI = SpinalAPI.getInstance();

		if (typeof ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE] === "undefined") {
			ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE] = {};
		}

		if (typeof ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE][buildingId] === "undefined" || forceUpdate) {
			ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE][buildingId] = spinalAPI.createIteratorCall(getAllCategoriesTree, buildingId, context);
		}

		const items = await ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE][buildingId].next();
		return items?.value;
	},

	async [ActionTypes.GET_WORKFLOW_LIST]({ commit }: AugmentedActionContextAppData, { buildingId }: { buildingId: string; referenceIds: number }): Promise<any> {

		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getWorkFlowList(buildingId);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},
	async [ActionTypes.GET_PROCESS_WORKFLOW]({ commit }: AugmentedActionContextAppData, { buildingId, workflowId }: { buildingId: string; referenceIds: number, workflowId: number }): Promise<any> {

		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getProcess(buildingId, workflowId);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},
	async [ActionTypes.ADD_TICKET]({ commit }: AugmentedActionContextAppData, { buildingId, data, file }: { buildingId: string; data: any, file: any[] }): Promise<any> {
		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await createTicket(buildingId, data);
			file.forEach(async (element) => {
				const file = new FormData();
				file.append('file', element);
				const adddoc = await addTicketDoc(buildingId, result.dynamicId, file);
			})
			return result;
		} catch (error) {
			console.error('Erreur lors de la création du ticket:', error);
			throw error;
		}
	},
	async [ActionTypes.ADD_DOC]({ commit }: AugmentedActionContextAppData, { buildingId, referenceId, file }: { buildingId: string, referenceId: number, file: any[] }): Promise<any> {
		try {
			const results = await Promise.all(file.map(async (element) => {
				const file = new FormData();
				file.append('file', element);
				const result = await uploadDoc(buildingId, referenceId, file);
				return result;
			}))

			return results;
		} catch (error) {
			console.error('Erreur lors de l\'ajout d(u)(es) document')
		}
	},

	async [ActionTypes.GET_FILE]({ commit }: AugmentedActionContextAppData, { buildingId, referenceId }: { buildingId: string; referenceId: any }): Promise<any> {
		try {
			const result = await getFile(buildingId, referenceId);
			return result;
		} catch (error) {
			console.log('Erreur lors de la récuperation du fichier', error);
			throw error;
		}
	},
	async [ActionTypes.DELETE_FILE]({ commit }: AugmentedActionContextAppData, { buildingId, referenceId, fileId }: { buildingId: string, referenceId: number, fileId: number }): Promise<any> {

		try {
			const result = await deleteFile(buildingId, referenceId, fileId)
			return result;

		} catch (error) {
			console.error('Erreur lors de la suppression du fichier');
			throw error;
		}
	},

	async [ActionTypes.DELETE_ATTRIBUT]({ commit }: AugmentedActionContextAppData, { buildingId, referenceId, cateId, name }: { buildingId: string, referenceId: number, cateId: number, name: string }): Promise<any> {

		try {
			const result = await deleteAttribut(buildingId, referenceId, cateId, name)
			return result;

		} catch (error) {
			console.error('Erreur lors de la suppression du fichier');
			throw error;
		}
	},
	async [ActionTypes.UPDATE_ATTRIBUT]({ commit }: AugmentedActionContextAppData, { buildingId, referenceId, cateId, name, item }: { buildingId: string, referenceId: number, cateId: number, name: string, item: object }): Promise<any> {

		try {
			const result = await updateAttribut(buildingId, referenceId, cateId, name, item)
			return result;
		} catch (error) {
			console.error('Erreur lors de la suppression du fichier');
			throw error;
		}
	},

	async [ActionTypes.GET_PARENT]({ commit }: AugmentedActionContextAppData, { buildingId, referenceIds }: { buildingId: string; referenceIds: number }): Promise<any> {
		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getParent(buildingId, referenceIds);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},



	async [ActionTypes.DELETE_CATE_ATTRIBUT]({ commit }: AugmentedActionContextAppData, { buildingId, referenceId, cateId }: { buildingId: string, referenceId: number, cateId: number, name: string }): Promise<any> {
		try {
			const result = await deleteCategoryAttribut(buildingId, referenceId, cateId)
			return result;
		} catch (error) {
			console.error('Erreur lors de la suppression du fichier');
			throw error;
		}
	},


	async [ActionTypes.UPDATE_CATE_ATTRIBUT]({ commit }: AugmentedActionContextAppData, { buildingId, referenceId, cateId, item }: { buildingId: string, referenceId: number, cateId: number, name: string, item: object }): Promise<any> {
		console.warn('11111111111111111 :', referenceId);

		try {
			const result = await updateCategoryAttribut(buildingId, referenceId, cateId, item)
			return result;
		} catch (error) {
			console.error('Erreur lors de la suppression du fichier');
			throw error;
		}
	},


	async [ActionTypes.GET_CATEGORIES_LIST]({ commit }: AugmentedActionContextAppData, { buildingId, referenceId }: { buildingId: string; referenceId: number }): Promise<any> {
		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getCategoriesList(buildingId, referenceId);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des catégories:', error);
			throw error;
		}
	},

	async [ActionTypes.ADD_ATTRIBUT]({ commit, dispatch }: AugmentedActionContextAppData, { buildingId, referenceId, formData }: { buildingId: string; referenceId: number; categoryId: number; formData: FormData }): Promise<any> {

		const spinalAPI = SpinalAPI.getInstance();
		const update = formData.get('update');
		const str_list = formData.get('categoriesList') as string;
		const categoryName = formData.get('categoryName') as string;



		if (str_list !== '') {
			const categriesList = str_list.split(',');
			try {
				const result = await Promise.all(categriesList.map(async (element) => {
					const category = await createCategory(buildingId, referenceId, element);
					return category;
				}))

			} catch (error) {
				console.error('Erreur lors de la création des catégories:', error);
				throw error;
			}
		}
		if (update === 'true') {

			try {
				// Fonction pour récupérer le dynamicId avec des tentatives répétées
				async function getDynamicIdWithRetry() {
					const maxRetries = 10; // Nombre maximum de tentatives
					const delay = 1000; // Délai entre chaque tentative en millisecondes

					for (let attempt = 1; attempt <= maxRetries; attempt++) {
						const categoriesList = await dispatch(ActionTypes.GET_CATEGORIES_LIST, { buildingId, referenceId });
						// console.log(`Attempt ${attempt}: categoriesList: `, categoriesList);

						const category = categoriesList.find((element) => element.name === categoryName);
						if (category && category.dynamicId) {
							return category.dynamicId;
						}

						// Attendre avant la prochaine tentative
						await new Promise(resolve => setTimeout(resolve, delay));
					}

					throw new Error('Failed to retrieve dynamicId after multiple attempts');
				}

				// Récupérer le dynamicId avec des tentatives répétées
				const dynamicId = await getDynamicIdWithRetry();

				// Formater les données
				const formattedData = new FormData();
				formData.forEach((value, key) => {
					if (key !== 'update' && key !== 'categoriesList') {
						formattedData.append(key, value);
					}
				});



				// Créer l'attribut
				const result = await createAttribut(buildingId, referenceId, dynamicId, formattedData);
				return result;
			} catch (error) {
				console.error('Erreur lors de la création des attributs:', error);
				throw error;
			}


		}
		else {
			const dynamicId = formData.get('dynamicId');
			const formattedData = new FormData();
			formData.forEach((value, key) => {
				if (key !== 'update' && key !== 'categoriesList') {
					formattedData.append(key, value);
				}
			});
			const result = await createAttribut(buildingId, referenceId, dynamicId, formattedData);
			return result;

		}
		// try {
		// 	const result = await createAttribut(buildingId, referenceId, categoryId, formattedData);
		// 	return result;
		// } catch (error) {
		// 	console.error('Erreur lors de la création des attributs:', error);
		// 	throw error;

		// }
	},

	async [ActionTypes.GET_FLOOR_INVENTORY](
			{ commit }: AugmentedActionContextAppData,
			{ id, body, includePosition, includeArea, onlyDynamicId }: {
				id: number;
				body: { context: string; category: string };
				includePosition?: boolean;
				includeArea?: boolean;
				onlyDynamicId?: boolean;
			}
	): Promise<any> {
		try {
			const result = await postFloorInventory(id, body, includePosition, includeArea, onlyDynamicId);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération de l’inventaire du floor:', error);
			throw error;
		}
	},

	async [ActionTypes.GET_ROOM_INVENTORY](
		{ commit }: AugmentedActionContextAppData,
		{ id, body, includePosition, onlyDynamicId }: {
			id: number;
			body: { context: string; category: string };
			includePosition?: boolean;
			onlyDynamicId?: boolean;
		}
		): Promise<any> {
			try {
				const result = await postRoomInventory(id, body, includePosition, onlyDynamicId);
				return result;
			} catch (error) {
				console.error("Erreur lors de la récupération de l’inventaire du floor:", error);
				throw error;
			}
	},




	////////////////////////////////////////////////////////
	//                VIEWER
	////////////////////////////////////////////////////////

	async [ActionTypes.OPEN_VIEWER]({ commit, dispatch, state }: AugmentedActionContextAppData, playload: { onlyThisModel: boolean; config: IConfig; item: any }): Promise<void> {
		try {

			if(playload.item.type ==="building"){
				const building = await dispatch(ActionTypes.GET_BOS_BUILDING, {
				  buildingId: playload.item.buildingId,
				  forceUpdate: false,
				})
				const body = {
				  dynamicId:[building.dynamicId],
				  roomRef: false,
				  floorRef: true,
				  equipements: true,
				  dbIdsToAdd: [],
				}
				// console.log('body to load -----> : ', body);
			    // console.log('playload item to load -----> : ', playload.item);
				playload.item.dynamicId = building.dynamicId;
				await ViewerManager.getInstance().loadInViewer(
				  playload.item,
				  playload.onlyThisModel,
				  body
				);
				return;
		
			}
			const viewerInfo = playload.config.viewerInfo;
			const body = {
				dynamicId: [playload.item.dynamicId],
				roomRef: viewerInfo.roomRef,
				floorRef: viewerInfo.floorRef,
				equipements: false,
				dbIdsToAdd: [],
			};

			if (viewerInfo.equipments === "all") {
				body.equipements = true;
				body.dbIdsToAdd = [];
			} else if (viewerInfo.equipments === "groupItem") {
				body.equipements = false;
				const map = await dispatch(ActionTypes.GET_GROUPS_ITEMS, { config: playload.config, buildingId: playload.item.buildingId });
				console.log('Get group items : ', map);
				body.dbIdsToAdd = classifyItemByBimFileId(map, playload.item.dynamicId, playload.item.type);
			}
			await ViewerManager.getInstance().loadInViewer(playload.item, playload.onlyThisModel, body);
			if (playload.onlyThisModel) state.viewerStartedList = {};
			commit(MutationTypes.ADD_VIEWER_LOADED, { id: playload.item.dynamicId });
		} catch (error) {
			console.log("errror", error);
		}
	},

	async [ActionTypes.GET_VIEWER_INFO]({ commit, state }: AugmentedActionContextAppData, playload): Promise<IViewInfoItemRes[]> {
		return ViewerManager.getInstance().getViewerInfoMerged(playload);
	},
	[ActionTypes.SELECT_ITEMS]({ commit, dispatch, state }, playload: any) {
		ViewerManager.getInstance().select(playload);
	},

	[ActionTypes.HIDE_ITEMS]({ commit, dispatch, state }, playload: any) {
		ViewerManager.getInstance().hide(playload);
	},

	[ActionTypes.ISOLATE_ITEMS]({ commit, dispatch, state }, playload: any) {
		console.log(ViewerManager.getInstance(), 'Linstance : le payload : ', playload);
		
		let isKeyPresent = false;
		for (let id of playload.item.parents) {
			const instance = ViewerManager.getInstance();
			if (instance._viewerStartedList.hasOwnProperty(id.toString())) {
				console.log('ça a marchééééééééééééééééééééé');
				isKeyPresent = true;
				break;
			}
		}
	
		if (isKeyPresent) {
			ViewerManager.getInstance().isolate(playload);
		} else {

			console.log(playload.config , playload.item , playload.onlyThisModel , 'toto');
			
			dispatch(ActionTypes.OPEN_VIEWER, {
				onlyThisModel: playload.onlyThisModel,
				config: playload.config,
				item: playload.item
			});
		}
	},

	[ActionTypes.FIT_TO_VIEW_ITEMS]({ commit, dispatch, state }, playload: any) {
		ViewerManager.getInstance().fitToView(playload);
	},

	async [ActionTypes.UNLOAD_MODEL]({ commit, dispatch, state }, playload: any) {
		await ViewerManager.getInstance().unload(playload);

		if (!Array.isArray(playload)) playload = [playload];

		for (const item of playload) {
			commit(MutationTypes.REMOVE_VIEWER_LOADED, { id: item.dynamicId });
		}
	},

	[ActionTypes.COLOR_ITEMS]({ commit, dispatch, state }, { items, buildingId }: any) {
		return ViewerManager.getInstance().colorItems(items, buildingId);
	},

	[ActionTypes.ADD_SPRITES]({ commit, dispatch, state }, { items, buildingId }: any) {
		return ViewerManager.getInstance().addSprites(items, buildingId);
	},

	[ActionTypes.ADD_COMPONENT_AS_SPRITES]({ commit, dispatch, state }, { items, buildingId, component }: any) {
		return ViewerManager.getInstance().addComponentAsSprites(items, buildingId, component);
	},

	[ActionTypes.REMOVE_ALL_SPRITES]({ commit, dispatch, state }) {
		return SpriteManager.getInstance().removeSprites();
	},
	[ActionTypes.SELECT_SPRITES]({ commit, dispatch, state }, dynamicIds: Array<number>) {
		return SpriteManager.getInstance().selectSprites(dynamicIds);
	},

	[ActionTypes.GET_VIEWER_OBJECT_PROPERTIES]({ commit, dispatch, state }, dbId: number) {
		return ViewerManager.getInstance().getObjectProperties(dbId);
	},

	

	[ActionTypes.REMOVE_SPRITES_BY_GROUP]({ commit, dispatch, state }, group: string) {
		return SpriteManager.getInstance().removeSpritesByGroup(group);
	},
};
