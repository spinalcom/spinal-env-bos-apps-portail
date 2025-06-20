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

import type {
  IEquipmentItem,
  IZoneItem,
  ISpaceSelectorItem,
} from "../../../../../../global-components/SpaceSelector";
import type { IGetAllBuildingsRes } from "../../../interfaces/IGetAllBuildingsRes";
import { IViewInfoItemRes } from "../../spinalAPI/GeographicContext/getViewInfo";
import type { MutationTree } from "vuex";
import type { StateAppData } from "./state";
import { INodeItemTree } from "../../../interfaces/INodeItem";
import { getContextId, getCurrentData } from "../../websocket/Current";
import { ILoading } from "../../../interfaces/ILoading";

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
  ADD_CHART_ITEM = "ADD_ITEM",
  REMOVE_CHART_ITEM = "REMOVE_ITEM",
  UPDATE_CHART_ITEM = "UPDATE_ITEM",
  SET_SOURCE = "SET_SOURCE",
  SET_T_INDEX= "SET_T_INDEX",
  SET_ENDPOINT = "SET_ENDPOINT",
  SET_STRIPE_DATA = "SET_STRIPE_DATA",
  SET_CONTEXT = "SET_CONTEXT",
  SET_CATEGORIES_CONTEXT = "SET_CATEGORIES_CONTEXT",
  SET_GROUP_EQUIP = "SET_GROUP_EQUIP",
  SET_LOADING = "SET_LOADING",
  SET_LOADER = "SET_LOADER",
  RESET_LOADING = "RESET_LOADING",
  SET_FILTER_DATA = "SET_FILTER_DATA",
  SET_CANCEL_FILTER = "SET_CANCEL_FILTER",
  SET_SOURCE_LIST = "SET_SOURCE_LIST",
  SET_FILTER_DATA_CONFIG = "SET_FILTER_DATA_CONFIG",
  SET_VALUE_REGEX = "SET_VALUE_REGEX",
  SET_CONFIG_LABEL = "SET_CONFIG_LABEL",
  SET_DOWNLOAD_DATA = "SET_DOWNLOAD_DATA",
  SET_APP_CONFIG = 'SET_APP_CONFIG',
  SET_VALUE_FILTERS = "SET_VALUE_FILTERS",
}

export type MutationsAppData<S = StateAppData> = {
  [MutationTypes.SET_BUILDINGS](state: S, payload: IGetAllBuildingsRes[]): void;
  [MutationTypes.SET_SELECTED_ZONE](
    state: S,
    payload: ISpaceSelectorItem
  ): void;
  [MutationTypes.SET_FLOORS](
    state: S,
    payload: { id: string; items: IZoneItem[] }
  ): void;
  [MutationTypes.SET_ROOMS](
    state: S,
    payload: { id: number; items: IZoneItem[] }
  ): void;
  [MutationTypes.SET_EQUIPMENTS](
    state: S,
    payload: { id: number; items: IEquipmentItem[] }
  ): void;
  [MutationTypes.SET_VIEWINFO](
    state: S,
    payload: { id: number; items: IViewInfoItemRes[] }
  ): void;
  [MutationTypes.ADD_VIEWER_LOADED](state: S, payload: { id: string }): void;
  [MutationTypes.REMOVE_VIEWER_LOADED](
    state: StateAppData,
    payload: { id: string }
  ): void;
  [MutationTypes.SET_ITEM_SELECTED](state: StateAppData, item): void;
  [MutationTypes.SET_DATA](state: StateAppData, data: INodeItemTree[]): void;
  [MutationTypes.SET_ENDPOINT](state: StateAppData, children: any[]): void;
  [MutationTypes.SET_STRIPE_DATA](state: StateAppData, dataStripe: any): void;
  [MutationTypes.SET_CONTEXT](state: StateAppData, context: any): void;
  [MutationTypes.SET_CATEGORIES_CONTEXT](state: StateAppData, categoriesContext: any): any;
  [MutationTypes.SET_GROUP_EQUIP](state: StateAppData, groupEquipement: any[]): any;
  [MutationTypes.SET_LOADING](state: StateAppData, payload: ILoading): void;
  [MutationTypes.RESET_LOADING](state: StateAppData): void;
  [MutationTypes.SET_FILTER_DATA](state: StateAppData, filter: any): void;
  [MutationTypes.SET_CANCEL_FILTER](state: StateAppData, cancelFilter: boolean): void;
  [MutationTypes.SET_LOADER](state: StateAppData, loader: boolean): void;
  [MutationTypes.SET_SOURCE_LIST](state: StateAppData, sourceList: any[]): void;
  [MutationTypes.SET_FILTER_DATA_CONFIG](state: StateAppData, filterDataConfig: any[]): void;
  [MutationTypes.SET_VALUE_REGEX](state: StateAppData, paylod: {regex: string, column: string}): void;
  [MutationTypes.SET_CONFIG_LABEL]( state: StateAppData, configLabel: any[]): void;
  [MutationTypes.SET_DOWNLOAD_DATA](state: StateAppData, downloadData: any[]): void;
  [MutationTypes.SET_APP_CONFIG](state: StateAppData, payload: any): void;
  [MutationTypes.SET_VALUE_FILTERS](state: StateAppData, valueFilters: any[]): void;
  

};

export const mutations: MutationTree<StateAppData> & MutationsAppData = {
  [MutationTypes.SET_BUILDINGS](
    state: StateAppData,
    payload: IGetAllBuildingsRes[]
  ): void {
    state.buildings = payload;
  },
  [MutationTypes.SET_SELECTED_ZONE](
    state: StateAppData,
    payload: ISpaceSelectorItem
  ): void {
    state.zoneSelected = payload;
  },
  [MutationTypes.SET_FLOORS](
    state: StateAppData,
    { id, items }: { id: string; items: IZoneItem[] }
  ): void {
    state.floors[id] = items;
  },
  [MutationTypes.SET_ROOMS](
    state: StateAppData,
    { id, items }: { id: number; items: IZoneItem[] }
  ): void {
    state.rooms[id] = items;
  },
  [MutationTypes.SET_EQUIPMENTS](
    state: StateAppData,
    { id, items }: { id: number; items: IEquipmentItem[] }
  ): void {
    state.roomBimObj[id] = items;
  },
  [MutationTypes.SET_VIEWINFO](
    state: StateAppData,
    { id, items }: { id: number; items: IViewInfoItemRes[] }
  ): void {
    state.buildingInfo[id] = items;
  },

  [MutationTypes.SET_TEMPORALITY](
    state: StateAppData,
    payload: ISpaceSelectorItem
  ) {
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

  [MutationTypes.ADD_CHART_ITEM](state: StateAppData, item): void {
    state.selectedChartItems.push(item);
  },

  [MutationTypes.REMOVE_CHART_ITEM](state: StateAppData, item): void {
    state.selectedChartItems = state.selectedChartItems.filter(
      (selectedItem) => selectedItem.dynamicId !== item.dynamicId
    );
  },
  [MutationTypes.SET_T_INDEX](state: StateAppData, index: number): void {
    state.t_index = index;
  },
  [MutationTypes.SET_DATA](state: StateAppData, data: INodeItemTree[]): void {
    state.data = data;
  },

  [MutationTypes.SET_SOURCE](state: StateAppData, source): void {
    state.selectedSource = source;
  },
  [MutationTypes.SET_ENDPOINT]: async function (state: StateAppData, children): Promise<void> {
  
  },
  [MutationTypes.SET_STRIPE_DATA](state: StateAppData, dataStripe: any): void {
    state.StripeDataList = dataStripe;
  },

  [MutationTypes.SET_CONTEXT](state: StateAppData, context: any): void {
    state.context = context;
  },
  [MutationTypes.SET_CATEGORIES_CONTEXT](state: StateAppData, categoriesContext: any): void {
    state.categoriesContext = categoriesContext;
  },
  [MutationTypes.SET_GROUP_EQUIP](state: StateAppData, groupEquipement: any[]): void {
    state.groupEquipement = groupEquipement;
  },
  [MutationTypes.SET_LOADING](state: StateAppData, payload: ILoading): void {
    state.progressLoader = {...state.progressLoader, ...payload }; 
  },
  [MutationTypes.RESET_LOADING](state: StateAppData): void {
    state.progressLoader = {
      isLoading: false,
      message: '',
      total: 0,
      completed: 0,
      percent: 0,
      isError : null,
      logs: [],
    };
  },
  
  [MutationTypes.SET_FILTER_DATA](state: StateAppData, filter: any): void {
    state.filterData = filter;

  },

  [MutationTypes.SET_CANCEL_FILTER](state: StateAppData, cancelFilter: boolean): void {
    state.cancelFilter = cancelFilter;
  },
  [MutationTypes.SET_LOADER](state: StateAppData, loader: boolean): void {
    state.Loading = loader;
  },

  [MutationTypes.SET_SOURCE_LIST](state: StateAppData, sourceList: any[]): void {
    state.SourceList = sourceList;
  },

  [MutationTypes.SET_FILTER_DATA_CONFIG](state: StateAppData, filterDataConfig: any[]): void {
    state.filterDataConfig = filterDataConfig;
  },
  
  [MutationTypes.SET_VALUE_REGEX](state: StateAppData, payload: {regex: string, column: string}): void {
    state.ValueRegex = payload;
  },

  [MutationTypes.SET_CONFIG_LABEL](state: StateAppData, configLabel: any[]): void {
    state.configLabel = configLabel;
  },
  [MutationTypes.SET_DOWNLOAD_DATA](state: StateAppData, downloadData: any[]): void {
    state.DownloadData = downloadData;
  },
   [MutationTypes.SET_APP_CONFIG](state: StateAppData, payload: any): void {
      state.appConfig = payload;
    },

  [MutationTypes.SET_VALUE_FILTERS](state: StateAppData, valueFilters: any[]): void {
    state.valueFilters = valueFilters;
  }
    



};
