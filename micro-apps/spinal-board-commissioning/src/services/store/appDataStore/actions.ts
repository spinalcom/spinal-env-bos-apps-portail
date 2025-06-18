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
import {
  getItemsToRegroup,
  regroupByGeographicItem,
  regroupByGeograhicGroup,
} from "./utils/regroupement";
import { classifyItemByBimFileId } from "./utils/openViewer";
import connectSocket from "../../websocket";
import { getContextId } from "../../websocket/Current";
import { subscribe } from "../../websocket/subscribe";
import { getControlpointList, getGroupEquipement } from "../..";


const ApiIteratorStore: ApiIteratorStoreType &
  ApiIteratorStoreRecordStringType &
  ApiIteratorStoreRecordNumberType = {};

export const actions = {
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
    



      // floor actions
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


        // Equipments actions 
    async [ActionTypes.GET_BUILDING_EQUIPMENTS]({ commit }: AugmentedActionContextAppData, { buildingId, floors }: { buildingId: string; floors: any }): Promise<any> {
          const spinalAPI = SpinalAPI.getInstance();
          try {
            let floorEquipement = []
            for(const floor of floors) {
              const result = await getGroupEquipement(buildingId, floor);
              floorEquipement = floorEquipement.concat(result);
            }
            return floorEquipement;

          } catch (error) {
            console.error('Erreur lors de la récupération des équipements:', error);
            throw error;
          }
    },

    async [ActionTypes.GET_FLOOR_EQUIPMENTS]({ commit }: AugmentedActionContextAppData, { buildingId, floor }: { buildingId: string; floor: any }): Promise<any> {
        const spinalAPI = SpinalAPI.getInstance();
        try {
            const result = await getGroupEquipement(buildingId, floor);
            return result;
        } catch (error) {
            console.error('Erreur lors de la récupération des équipements:', error);
            throw error;
        }
    },
    async [ActionTypes.GET_CONTROL_POINT_MULTIPLE]({commit }: AugmentedActionContextAppData, {buildingId, item}): Promise<any> {
      const spinalAPI = SpinalAPI.getInstance();
      try {
          const res = await getControlpointList(buildingId, item)
          return res;
      } catch (error) {
        
      }
    },

    async [ActionTypes.RUN_WITH_LOADER](
      { commit }: AugmentedActionContextAppData, {message, task}: {message: string, task: ()=> Promise<any>}): Promise<any> {
      commit(MutationTypes.SET_LOADER, true);
      
        try {
          commit(MutationTypes.SET_LOADER, true);
        console.log("task started");
         await task();
        console.log("task finished");
     
        commit(MutationTypes.SET_LOADER, false);
      }
      catch (error) {
      
        throw error;
      }

    }
      
};
