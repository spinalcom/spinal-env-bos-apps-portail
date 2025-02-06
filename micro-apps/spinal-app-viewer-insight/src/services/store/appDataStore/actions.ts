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

import {
  getBuildings,
  getBuildingById,
} from "../../spinalAPI/GeographicContext/getBuildings";
import { IGetAllBuildingsRes } from "../../../interfaces/IGetAllBuildingsRes";
import { SpinalAPI } from "../../spinalAPI/SpinalAPI";
import { MutationTypes } from "./mutations";
import {
  getEquipments,
  getFloors,
  getRooms,
  getRoomsRefMultiple,
  getBuilding,
  getBuildingInfo
} from "../../spinalAPI/GeographicContext/geographicContext";
import type {
  IEquipmentItem,
  ISpaceSelectorItem,
  IZoneItem,
} from "../../../../../../global-components/SpaceSelector";
import { INodeItem } from "../../../interfaces/INodeItem";
import { IViewInfoItemRes } from "../../spinalAPI/GeographicContext/getViewInfo";
import {
  ActionTypes,
  ApiIteratorStoreRecordNumberType,
  ApiIteratorStoreRecordStringType,
  ApiIteratorStoreType,
  AugmentedActionContextAppData,
} from "../../../interfaces/vuexStoreTypes";
import {
  getGroupsItems,
  getAllCategoriesTree,
} from "../../spinalAPI/GeographicContext/groupsItems";
import SpriteManager from "../../../../../../global-components/viewer/manager/spriteManager"
import ViewerManager from "../../../../../../global-components/viewer/manager/viewerManager";
// import SpriteManager from "../../../components/viewer/manager/spriteManager";
// import ViewerManager from "../../../components/viewer/manager/viewerManager";
import { IConfig } from "../../../interfaces/IConfig";
import { getSourceValue } from "../../spinalAPI/endpoints/getEndpoints";
import {
  getItemsToRegroup,
  regroupByGeographicItem,
  regroupByGeograhicGroup,
} from "./utils/regroupement";
import { classifyItemByBimFileId } from "./utils/openViewer";

const ApiIteratorStore: ApiIteratorStoreType &
  ApiIteratorStoreRecordStringType &
  ApiIteratorStoreRecordNumberType = {};

export const actions = {
  async [ActionTypes.GET_BUILDINGS](
    { commit, state }: AugmentedActionContextAppData,
    { patrimoineId, forceUpdate }
  ): Promise<IGetAllBuildingsRes[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (typeof ApiIteratorStore[ActionTypes.GET_BUILDINGS] === "undefined") {
      ApiIteratorStore[ActionTypes.GET_BUILDINGS] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_BUILDINGS][patrimoineId] ===
        "undefined" ||
      forceUpdate === true
    ) {
      ApiIteratorStore[ActionTypes.GET_BUILDINGS][patrimoineId] =
        spinalAPI.createIteratorCall(getBuildings, patrimoineId);
    }

    const buildings = await ApiIteratorStore[ActionTypes.GET_BUILDINGS][
      patrimoineId
    ]!.next();
    commit(MutationTypes.SET_BUILDINGS, buildings.value);
    return buildings.value;
  },

  async [ActionTypes.GET_BUILDING_BY_ID](
    { commit, state }: AugmentedActionContextAppData,
    { buildingId, forceUpdate }
  ): Promise<IGetAllBuildingsRes> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID][buildingId] ===
        "undefined" ||
      forceUpdate === true
    ) {
      ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID][buildingId] =
        spinalAPI.createIteratorCall(getBuildingById, buildingId);
    }

    const building = await ApiIteratorStore[ActionTypes.GET_BUILDING_BY_ID][
      buildingId
    ]!.next();
    return building.value;
  },

  async [ActionTypes.GET_BUILDING_INFO]({ commit }: AugmentedActionContextAppData, { buildingId }: { buildingId: string; }): Promise<any> {
		const spinalAPI = SpinalAPI.getInstance();
		try {
			const result = await getBuildingInfo(buildingId);
			return result;
		} catch (error) {
			console.error('Erreur lors de la récupération des objets de référence:', error);
			throw error;
		}
	},

  async [ActionTypes.GET_BOS_BUILDING](
    { commit, state }: AugmentedActionContextAppData,
    { buildingId, forceUpdate }
  ): Promise<IGetAllBuildingsRes> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.GET_BOS_BUILDING] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_BOS_BUILDING] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_BOS_BUILDING][buildingId] ===
        "undefined" ||
      forceUpdate === true
    ) {
      ApiIteratorStore[ActionTypes.GET_BOS_BUILDING][buildingId] =
        spinalAPI.createIteratorCall(getBuilding, buildingId);
    }

    const building = await ApiIteratorStore[ActionTypes.GET_BOS_BUILDING][
      buildingId
    ]!.next();
    return building.value;
  },

  async [ActionTypes.GET_FLOORS](
    { commit }: AugmentedActionContextAppData,
    { buildingId, patrimoineId, forceUpdate }
  ): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (typeof ApiIteratorStore[ActionTypes.GET_FLOORS] === "undefined") {
      ApiIteratorStore[ActionTypes.GET_FLOORS] = {};
    }

    const floorObjStore = ApiIteratorStore[ActionTypes.GET_FLOORS]!;
    if (
      typeof floorObjStore[buildingId] === "undefined" ||
      forceUpdate === true
    ) {
      floorObjStore[buildingId] = spinalAPI.createIteratorCall(
        getFloors,
        patrimoineId,
        buildingId
      );
    }

    const floors = await floorObjStore[buildingId].next();
    commit(MutationTypes.SET_FLOORS, { id: buildingId, items: floors.value });
    return floors.value;
  },

  async [ActionTypes.GET_ROOMS](
    { commit }: AugmentedActionContextAppData,
    { buildingId, patrimoineId, floorId, id, forceUpdate }: any
  ): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (typeof ApiIteratorStore[ActionTypes.GET_ROOMS] === "undefined") {
      ApiIteratorStore[ActionTypes.GET_ROOMS] = {};
    }
    const floorObjStore = ApiIteratorStore[ActionTypes.GET_ROOMS]!;

    if (typeof floorObjStore[id] === "undefined" || forceUpdate === true) {
      floorObjStore[id] = spinalAPI.createIteratorCall(
        getRooms,
        patrimoineId,
        buildingId,
        floorId,
        id
      );
    }
    const floors = await floorObjStore[id].next();
    commit(MutationTypes.SET_ROOMS, { id: id, items: floors.value });
    return floors.value;
  },

  async [ActionTypes.GET_EQUIPMENTS](
    { commit }: AugmentedActionContextAppData,
    { floorId, roomId, patrimoineId, buildingId, id, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();

    if (typeof ApiIteratorStore[ActionTypes.GET_EQUIPMENTS] === "undefined") {
      ApiIteratorStore[ActionTypes.GET_EQUIPMENTS] = {};
    }

    const roomObjStore = ApiIteratorStore[ActionTypes.GET_EQUIPMENTS]!;

    if (typeof roomObjStore[id] === "undefined" || forceUpdate === true) {
      roomObjStore[id] = spinalAPI.createIteratorCall(
        getEquipments,
        patrimoineId,
        buildingId,
        floorId,
        roomId,
        id
      );
    }

    const equipments = await roomObjStore[id].next();
    commit(MutationTypes.SET_EQUIPMENTS, { id: id, items: equipments.value });
    return equipments.value;
  },

  async [ActionTypes.GET_GROUPS_ITEMS](
    { commit, state }: AugmentedActionContextAppData,
    { forceUpdate, config, buildingId }
  ): Promise<{ [key: string]: INodeItem }> {
    const spinalAPI = SpinalAPI.getInstance();

    if (typeof ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS] === "undefined") {
      ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS][buildingId] ===
        "undefined" ||
      forceUpdate
    ) {
      ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS][buildingId] =
        spinalAPI.createIteratorCall(getGroupsItems, config, buildingId);
    }
    
    const items = await ApiIteratorStore[ActionTypes.GET_GROUPS_ITEMS][
      buildingId
    ].next();
    return items?.value;
  },

  async [ActionTypes.GET_CATEGORIES_TREE](
    { commit, state }: AugmentedActionContextAppData,
    { forceUpdate, buildingId, context }
  ): Promise<{ [key: string]: INodeItem }> {
    const spinalAPI = SpinalAPI.getInstance();

    if (
      typeof ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE][buildingId] ===
        "undefined" ||
      forceUpdate
    ) {
      ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE][buildingId] =
        spinalAPI.createIteratorCall(getAllCategoriesTree, buildingId, context);
    }

    const items = await ApiIteratorStore[ActionTypes.GET_CATEGORIES_TREE][
      buildingId
    ].next();
    return items?.value;
  },

  async [ActionTypes.REGROUP_ITEMS](
    { dispatch, commit, state }: AugmentedActionContextAppData,
    playload: { config: IConfig; item: ISpaceSelectorItem; forceUpdate }
  ) {
    const map = await dispatch(ActionTypes.GET_GROUPS_ITEMS, {
      config: playload.config,
      buildingId: playload.item.buildingId,
    });
    const itemsToRegroup = getItemsToRegroup(map, playload.item);
    if (!itemsToRegroup || itemsToRegroup.length === 0) {
      return Object.assign([], [{ ...playload.item, children: [] }]);
    }

    await getSourceValue(
      playload.item.buildingId,
      itemsToRegroup,
      playload.config.source,
      playload.forceUpdate
    );

    const regroupement = playload.config.regroupement;

    if (regroupement === "floors") {
      const refs = await getRoomsRefMultiple(
        playload.item.buildingId,
        itemsToRegroup.map((el) => el.dynamicId)
      );
      const ids = refs.reduce(
        (acc, el: any) => ({
          ...acc,
          [el.dynamicId]: el.infoReferencesObjects.map((el) => el.dbid),
        }),
        {}
      );
      itemsToRegroup.forEach((el: any) => {
        el.dbid = ids[el.dynamicId];
      });
      const items = regroupByGeographicItem(
        map,
        "geographicFloor",
        itemsToRegroup
      );
      return items;
    }
    if (regroupement === "rooms")
      return regroupByGeographicItem(map, "geographicRoom", itemsToRegroup);
    const obj = await dispatch(ActionTypes.GET_CATEGORIES_TREE, {
      buildingId: playload.item.buildingId,
      context: regroupement.context,
    });
    const groups = Object.assign([], obj[regroupement.category] || []);
    return regroupByGeograhicGroup(groups, itemsToRegroup); 
  },

  ////////////////////////////////////////////////////////
  //                VIEWER
  ////////////////////////////////////////////////////////

  async [ActionTypes.OPEN_VIEWER](
    { commit, dispatch, state }: AugmentedActionContextAppData,
    playload: { onlyThisModel: boolean; config: IConfig; item: any }
  ): Promise<void> {
    try {
      console.log("OPEN_VIEWER", playload);
      if(playload.item.type ==="building"){
        const building = await dispatch(ActionTypes.GET_BOS_BUILDING, {
          buildingId: playload.item.buildingId,
          forceUpdate: false,
        })
        const body = {
          dynamicId:[building.dynamicId],
          roomRef: false,
          floorRef: true,
          equipements: false,
          dbIdsToAdd: [],
        }
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
        const map = await dispatch(ActionTypes.GET_GROUPS_ITEMS, {
          config: playload.config,
          buildingId: playload.item.buildingId,
        });
        playload.item.type="geographicFloor"; //TODO: remove this line, we should fix groupItem bug in a better way
        body.dbIdsToAdd = classifyItemByBimFileId(
          map,
          playload.item.dynamicId,
          playload.item.type
        );
      }
    
      await ViewerManager.getInstance().loadInViewer(
        playload.item,
        playload.onlyThisModel,
        body
      );

      if (playload.onlyThisModel) state.viewerStartedList = {};

      commit(MutationTypes.ADD_VIEWER_LOADED, { id: playload.item.dynamicId });
    } catch (error) {
      console.log("errror", error);
    }
  },

  async [ActionTypes.GET_VIEWER_INFO](
    { commit, state }: AugmentedActionContextAppData,
    playload
  ): Promise<IViewInfoItemRes[]> {
    return ViewerManager.getInstance().getViewerInfoMerged(playload);
  },
  [ActionTypes.SELECT_ITEMS]({ commit, dispatch, state }, playload: any) {
    ViewerManager.getInstance().select(playload);
  },

  [ActionTypes.ISOLATE_ITEMS]({ commit, dispatch, state }, playload: any) {
    ViewerManager.getInstance().isolate(playload);
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

  [ActionTypes.COLOR_ITEMS](
    { commit, dispatch, state },
    { items, buildingId }: any
  ) {
    return ViewerManager.getInstance().colorItems(items, buildingId);
  },

  



  [ActionTypes.ADD_SPRITES](
    { commit, dispatch, state },
    { items, buildingId }: any
  ) {
    return ViewerManager.getInstance().addSprites(items, buildingId);
  },

  [ActionTypes.ADD_COMPONENT_AS_SPRITES](
    { commit, dispatch, state },
    { items, buildingId, component }: any
  ) {
    // console.log({
    //   MESSAGE: 'COUCOU',
    //   ITEMS: items,
    //   BUILDING_ID: buildingId,
    //   COMPONENT: component,
    // })
    return ViewerManager.getInstance().addComponentAsSprites(
      items,
      buildingId,
      component
    );
  },

  [ActionTypes.REMOVE_ALL_SPRITES]({ commit, dispatch, state }) {
    return SpriteManager.getInstance().removeSprites();
  },
  [ActionTypes.SELECT_SPRITES](
    { commit, dispatch, state },
    dynamicIds: Array<number>
  ) {
    console.log("SELECT_SPRITES", dynamicIds);
    return SpriteManager.getInstance().selectSprites(dynamicIds);
  },

  [ActionTypes.UPDATE_SELECTED_CHART_ITEMS](
    { commit, dispatch, state },
    item: any
  ) {
    const foundItem = state.selectedChartItems.find((el) => {
      return el.dynamicId === item.dynamicId;
    });

    if (foundItem) {
      commit(MutationTypes.REMOVE_CHART_ITEM, item);
    } else {
      commit(MutationTypes.ADD_CHART_ITEM, item);
    }
  },

};
