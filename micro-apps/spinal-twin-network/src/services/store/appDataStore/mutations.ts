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

import type { IEquipmentItem, IZoneItem, ISpaceSelectorItem } from "../../../components/SpaceSelector";
import type { IGetAllBuildingsRes } from "../../../interfaces/IGetAllBuildingsRes";
import { IViewInfoItemRes } from "../../../services/spinalAPI/GeographicContext/getViewInfo";
import type { MutationTree } from "vuex";
import type { StateAppData } from "./state";
import { stat } from "fs";
import { INodeItemTree } from "../../../interfaces/INodeItem";

export enum MutationTypes {
	SET_BUILDINGS = "SET_BUILDINGS",
	SET_SELECTED_ZONE = "SET_SELECTED_ZONE",
	SET_FLOORS = "SET_FLOORS",
	SET_ROOMS = "SET_ROOMS",
	SET_EQUIPMENTS = "SET_EQUIPMENTS",
	SET_VIEWINFO = "SET_VIEWINFO",
	SET_TEMPORALITY = "SET_TEMPORALITY",
	ADD_VIEWER_LOADED = "ADD_VIEWER_LOADED",
	REMOVE_VIEWER_LOADED = "REMOVE_VIEWER_LOADED",
	SET_ITEM_SELECTED = "SET_ITEM_SELECTED",
	SET_DATA = "SET_DATA",
	RESET_DATA = "RESET_DATA",
	ADD_SELECTED_EQUIPEMENT = "ADD_SELECTED_EQUIPEMENT",
	REMOVE_SELECTED_EQUIPEMENT = "REMOVE_SELECTED_EQUIPEMENT",
	RESET_EQUIPEMENT = "RESET_EQUIPEMENT",
	SET_HARDWARE_EQUIPEMENT_COLOR = "SET_HARDWARE_EQUIPEMENT_COLOR",
	SET_HARDWER_COLOR = "SET_HARDWER_COLOR",
	SET_APP_CONFIG = 'SET_APP_CONFIG',
	SET_HARDWARE_LIST = 'SET_HARDWARE_LIST',

}

export type MutationsAppData<S = StateAppData> = {
	[MutationTypes.SET_BUILDINGS](state: S, payload: IGetAllBuildingsRes[]): void;
	[MutationTypes.SET_SELECTED_ZONE](state: S, payload: ISpaceSelectorItem): void;
	[MutationTypes.SET_FLOORS](state: S, payload: { id: string; items: IZoneItem[] }): void;
	[MutationTypes.SET_ROOMS](state: S, payload: { id: number; items: IZoneItem[] }): void;
	[MutationTypes.SET_EQUIPMENTS](state: S, payload: { id: number; items: IEquipmentItem[] }): void;
	[MutationTypes.SET_VIEWINFO](state: S, payload: { id: number; items: IViewInfoItemRes[] }): void;
	[MutationTypes.ADD_VIEWER_LOADED](state: S, payload: { id: string }): void;
	[MutationTypes.REMOVE_VIEWER_LOADED](state: StateAppData, payload: { id: string }): void;
	[MutationTypes.SET_ITEM_SELECTED](state: StateAppData, item): void;
	[MutationTypes.SET_DATA](state: StateAppData, data: INodeItemTree[]): void;
	[MutationTypes.RESET_DATA](state: StateAppData): void;
	[MutationTypes.ADD_SELECTED_EQUIPEMENT](state: StateAppData, id: number): void;
	[MutationTypes.REMOVE_SELECTED_EQUIPEMENT](state: StateAppData, id: number): void;
	[MutationTypes.RESET_EQUIPEMENT](state: StateAppData): void;
	[MutationTypes.SET_HARDWARE_EQUIPEMENT_COLOR](state: StateAppData, payload: { contextId: number; color: string }): void;
	[MutationTypes.SET_HARDWER_COLOR](state: StateAppData, payload: { contextId: number; color: string }): void;
	[MutationTypes.SET_APP_CONFIG](state: StateAppData, payload: any): void;
	[MutationTypes.SET_HARDWARE_LIST](state: StateAppData, payload: any[]): void;
	
};

export const mutations: MutationTree<StateAppData> & MutationsAppData = {
	[MutationTypes.SET_BUILDINGS](state: StateAppData, payload: IGetAllBuildingsRes[]): void {
		state.buildings = payload;
	},
	[MutationTypes.SET_SELECTED_ZONE](state: StateAppData, payload: ISpaceSelectorItem): void {
		state.zoneSelected = payload;
	},
	[MutationTypes.SET_FLOORS](state: StateAppData, { id, items }: { id: string; items: IZoneItem[] }): void {
		state.floors[id] = items;
	},
	[MutationTypes.SET_ROOMS](state: StateAppData, { id, items }: { id: number; items: IZoneItem[] }): void {
		state.rooms[id] = items;
	},
	[MutationTypes.SET_EQUIPMENTS](state: StateAppData, { id, items }: { id: number; items: IEquipmentItem[] }): void {
		state.roomBimObj[id] = items;
	},
	[MutationTypes.SET_VIEWINFO](state: StateAppData, { id, items }: { id: number; items: IViewInfoItemRes[] }): void {
		state.buildingInfo[id] = items;
	},

	[MutationTypes.SET_TEMPORALITY](state: StateAppData, payload: ISpaceSelectorItem) {
		state.temporalitySelected = payload;
	},

	[MutationTypes.ADD_VIEWER_LOADED](state: StateAppData, { id }): void {
		const copy = Object.assign({}, state.viewerStartedList);
		if (!copy[id]) copy[id] = id;

		state.viewerStartedList = copy;
	},

	[MutationTypes.REMOVE_VIEWER_LOADED](state: StateAppData, { id }): void {
		const copy = Object.assign({}, state.viewerStartedList);
		delete copy[id];

		state.viewerStartedList = copy;
	},

	[MutationTypes.SET_ITEM_SELECTED](state: StateAppData, item): void {
		state.itemSelected = item;
	},

	[MutationTypes.SET_DATA](state: StateAppData, data: INodeItemTree[]): void {
		state.data = data;
	},
	[MutationTypes.RESET_DATA](state: StateAppData): void {
		state.data = [];
		// console.log("RESET_DATA", state.data);
	},
	//Add number to Selected equipement 
	[MutationTypes.ADD_SELECTED_EQUIPEMENT](state: StateAppData, id: number): void {
		state.selectedEquipements.push(id);
	},
	//Remove number to Selected equipement
	[MutationTypes.REMOVE_SELECTED_EQUIPEMENT](state: StateAppData, id: number): void {
		const index = state.selectedEquipements.indexOf(id);
		if (index > -1) {
			state.selectedEquipements.splice(index, 1);
		}
	},
	//Clean selected equipement
	[MutationTypes.RESET_EQUIPEMENT](state: StateAppData): void {
		state.selectedEquipements = [];
	},

	[MutationTypes.SET_HARDWARE_EQUIPEMENT_COLOR](state: StateAppData, { contextId, color }: { contextId: number; color: string }): void {
		if (state.hardwareequipementColor.has(contextId)) {
			state.hardwareequipementColor.set(contextId, color);
		} else {
			state.hardwareequipementColor.set(contextId, color);
		}
	},

	[MutationTypes.SET_HARDWER_COLOR](state: StateAppData, { contextId, color }: { contextId: number; color: string }): void {
		if (state.hardwareColor.has(contextId)) {
			state.hardwareColor.set(contextId, color);
		} else {
			state.hardwareColor.set(contextId, color);
		}
	},


	[MutationTypes.SET_APP_CONFIG](state: StateAppData, payload: any): void {
			state.appConfig = payload;
		  },

	[MutationTypes.SET_HARDWARE_LIST](state: StateAppData, payload: any[]): void {
		state.hardwareList = payload;
	}
};
