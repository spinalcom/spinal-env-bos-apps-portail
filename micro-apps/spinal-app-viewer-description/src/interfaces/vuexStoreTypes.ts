/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

import { ActionContext } from "vuex";
import { MutationsAppData } from "../services/store/appDataStore/mutations";
import type { StateAppData } from "../services/store/appDataStore/state";
import { INodeItem } from "./INodeItem

export type AugmentedActionContextAppData = {
	commit<K extends keyof MutationsAppData>(key: K, payload: Parameters<MutationsAppData[K]>[1]): ReturnType<MutationsAppData[K]>;
} & Omit<ActionContext<StateAppData, StateAppData>, "commit">;

export enum ActionTypes {
	GET_BUILDINGS = "GET_BUILDINGS",
	GET_BUILDING_BY_ID = "GET_BUILDING_BY_ID",
	OPEN_VIEWER = "OPEN_VIEWER",
	GET_VIEWER_INFO = "GET_VIEWER_INFO",
	SELECT_ITEMS = "SELECT_ITEMS",
	FIT_TO_VIEW_ITEMS = "FIT_TO_VIEW_ITEMS",
	ISOLATE_ITEMS = "ISOLATE_ITEMS",
	spaceSelectedIdspaceSelectedId = "HIDE_ITEMS",
	UNLOAD_MODEL = "UNLOAD_MODEL",
	GET_FLOORS = "GET_FLOORS",
	GET_ROOMS = "GET_ROOMS",
	GET_EQUIPMENTS = "GET_EQUIPMENTS",
	GET_GROUPS_ITEMS = "GET_GROUPS_ITEMS",
	GET_CATEGORIES_TREE = "GET_CATEGORIES_TREE",
	GET_GROUPS_ITEMS_BY_GEOITEM = "GET_GROUPS_ITEMS_BY_GEOITEM",
	GET_ITEM_CONTROL_POINT = "GET_ITEM_CONTROL_POINT",
	COLOR_ITEMS = "COLOR_ITEMS",
	ADD_SPRITES = "ADD_SPRITES",
	ADD_COMPONENT_AS_SPRITES = "ADD_COMPONENT_AS_SPRITES",
	REMOVE_SPRITES_BY_GROUP = "REMOVE_SPRITES_BY_GROUP",
	REMOVE_ALL_SPRITES = "REMOVE_ALL_SPRITES",
	SELECT_SPRITES = "SELECT_SPRITES",
	GET_REFERENCE_OBJECT_LIST_MULTIPLE = "GET_REFERENCE_OBJECT_LIST_MULTIPLE",
	GET_STATIC_DETAILS = "GET_STATIC_DETAILS",
	GET_NODE_READ = "GET_NODE_READ",
	GET_STATIC_DETAILS_EQUIPEMENT = "GET_STATIC_DETAILS_EQUIPEMENT",
	GET_INVENTORY_MULTIPLE = "GET_INVENTORY_MULTIPLE",
	GET_FLOOR_STATIC_DETAILS = "GET_FLOOR_STATIC_DETAILS",
	GET_BIM_OBJECT_INFO = "GET_BIM_OBJECT_INFO",
	GET_BUILDING_INFO = "GET_BUILDING_INFO",
	GET_BUILDING_STATIC_DETAILS = "GET_BUILDING_STATIC_DETAILS",
	GET_POSTION_EQUIPEMENT = "GET_POSTION_EQUIPEMENT",
	GET_POSTION_ROOM = "GET_POSTION_ROOM",
	GET_DOCUMENTATION = "GET_DOCUMENTATION",
	POST_DOWNLOAD_FILE = "POST_DOWNLOAD_FILE",
	GET_PARENT = "GET_PARENT",
	GET_TICKET = "GET_TICKET",
	GET_ATTRIBUT_LIST_MULTIPLE = "GET_ATTRIBUT_LIST_MULTIPLE",
	HIDE_ITEMS = "HIDE_ITEMS",
	GET_TIMES_SERIES = "GET_TIMES_SERIES",
	GET_BOS_BUILDING = "GET_BOS_BUILDING",
	GET_WORKFLOW_LIST = "GET_WORKFLOW_LIST",
	GET_PROCESS_WORKFLOW =  "GET_PROCESS_WORKFLOW",
	ADD_TICKET = "ADD_TICKET",
	GET_FILE = "GET_FIle",
	ADD_DOC = "ADD_DOC",
	GET_CATEGORIES_LIST = "GET_CATEGORIES_LIST",
	ADD_ATTRIBUT = "ADD_ATTRIBUT",
	DELETE_FILE = "DELETE_FILE",
	DELETE_ATTRIBUT = 'DELETE_ATTRIBUT',
	DELETE_CATE_ATTRIBUT = 'DELETE_CATE_ATTRIBUT',
	UPDATE_CATE_ATTRIBUT = 'UPDATE_CATE_ATTRIBUT',
	UPDATE_ATTRIBUT = 'UPDATE_ATTRIBUT',
	GET_CONTEXT_LIST = 'GET_CONTEXT_LIST',
	GET_CONTEXT_CATEGORY_LIST = 'GET_CONTEXT_CATEGORY_LIST',
	GET_CONTEXT_CATEGORY_GROUP_LIST = 'GET_CONTEXT_CATEGORY_GROUP_LIST'
}

export type TFctViewerIteract = (stateContext: AugmentedActionContextAppData, payload: { buildingId: string; id: number | number[] }) => Promise<void>;
export type TFctGeoAPICall<Payload, FctReturn> = (stateContext: AugmentedActionContextAppData, payload: Payload) => Promise<FctReturn>;

export interface IFctGeoCallPayload {
	platformId: string;
	id: number;
	forceUpdate?: boolean;
}

type asyncGen = { [ActionIt in ActionTypes]?: AsyncGenerator<Awaited<ReturnType<ActionIt>>> };

export type ApiIteratorStoreType = asyncGen | { [key: string]: asyncGen };

export type ApiIteratorStoreRecordStringType = {
	[ActionIt in ActionTypes]?: Record<string, AsyncGenerator<Awaited<ReturnType<Actions[ActionIt]>>>>;
};

export type ApiIteratorStoreRecordNumberType = { [ActionIt in ActionTypes]?: Record<number, AsyncGenerator<Awaited<ReturnType<Actions[ActionIt]>>>> };
