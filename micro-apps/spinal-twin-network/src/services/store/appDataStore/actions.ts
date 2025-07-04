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
  getEquipmentListMultiple,
  updateMultipleAttributes,
  getAttributsMultiple,
  getContext,
  getchildren,
  getMultipleChildrenRelationNode,
  getGroupes,
  gethildrenRelationNode,
  readStaticDetailsMultiple,
  getMultipleParentRelationNode,
  getPositionMultiple,
  gethildrenRelationContextNode,
  getMultipleChildrenRelationContextNode,
} from "../../spinalAPI/GeographicContext/geographicContext";
import type {
  IEquipmentItem,
  ISpaceSelectorItem,
  IZoneItem,
} from "../../../components/SpaceSelector";
import { INodeItem } from "../../../interfaces/INodeItem";
import {
  IViewInfoBody,
  IViewInfoItemRes,
} from "../../spinalAPI/GeographicContext/getViewInfo";
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
import SpriteManager from "../../../../../../global-components/viewer/manager/spriteManager";
import ViewerManager from "../../../../../../global-components/viewer/manager/viewerManager";
import { IConfig } from "../../../interfaces/IConfig";
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

  async [ActionTypes.GET_CONTEXT](
    { commit }: AugmentedActionContextAppData,
    { buildingId, patrimoineId, forceUpdate }
  ): Promise<any> {
    const spinalAPI = SpinalAPI.getInstance();
    if (typeof ApiIteratorStore[ActionTypes.GET_CONTEXT] === "undefined") {
      ApiIteratorStore[ActionTypes.GET_CONTEXT] = {};
    }

    const contextObjStore = ApiIteratorStore[ActionTypes.GET_CONTEXT]!;
    if (
      typeof contextObjStore[buildingId] === "undefined" ||
      forceUpdate === true
    ) {
      contextObjStore[buildingId] = spinalAPI.createIteratorCall(
        getContext,
        patrimoineId,
        buildingId
      );
    }
    const contexts = await contextObjStore[buildingId].next();
    return contexts.value;
  },

  async [ActionTypes.GET_CHILDREN](
    { commit }: AugmentedActionContextAppData,
    { buildingId, patrimoineId, nodeId, forceUpdate }
  ): Promise<any> {
    const spinalAPI = SpinalAPI.getInstance();
    if (typeof ApiIteratorStore[ActionTypes.GET_CHILDREN] === "undefined") {
      ApiIteratorStore[ActionTypes.GET_CHILDREN] = {};
    }

    const contextObjStore = ApiIteratorStore[ActionTypes.GET_CHILDREN]!;
    if (
      typeof contextObjStore[buildingId] === "undefined" ||
      forceUpdate === true
    ) {
      contextObjStore[buildingId] = spinalAPI.createIteratorCall(
        getchildren,
        patrimoineId,
        buildingId,
        nodeId
      );
    }
    const contexts = await contextObjStore[buildingId].next();
    return contexts.value;
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

  async [ActionTypes.UPDATE_MULTIPLE_ATTRIBUTES](
    { commit }: AugmentedActionContextAppData,
    { buildingId, formattedData }: { buildingId: string; formattedData: any[] }
  ): Promise<any> {
    const spinalAPI = SpinalAPI.getInstance();
    try {
      const result = await updateMultipleAttributes(buildingId, formattedData);
      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des attributs:", error);
      throw error;
    }
  },

  async [ActionTypes.GET_EQUIPMENT_LIST_MULTIPLE](
    { commit }: AugmentedActionContextAppData,
    { patrimoineId, buildingId, roomIds, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.GET_EQUIPMENT_LIST_MULTIPLE] ===
      "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_EQUIPMENT_LIST_MULTIPLE] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_EQUIPMENT_LIST_MULTIPLE][
        buildingId
      ] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_EQUIPMENT_LIST_MULTIPLE][buildingId] =
        spinalAPI.createIteratorCall(
          getEquipmentListMultiple,
          patrimoineId,
          buildingId,
          roomIds
        );
    }
    const items = await ApiIteratorStore[
      ActionTypes.GET_EQUIPMENT_LIST_MULTIPLE
    ][buildingId].next();
    return items?.value;
  },
  async [ActionTypes.GET_CHILDREN_BY_RELATION](
    { commit }: AugmentedActionContextAppData,
    { patrimoineId, buildingId, nodeId, relation, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION] ===
      "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION][
        buildingId
      ] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION][buildingId] =
        spinalAPI.createIteratorCall(
          gethildrenRelationNode,
          patrimoineId,
          buildingId,
          nodeId,
          relation
        );
    }
    const items = await ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION][
      buildingId
    ].next();
    return items?.value;
  },

  async [ActionTypes.RESET_API_ITERATOR_STORE](
    { commit }: AugmentedActionContextAppData,
    { buildingId }: any
  ): Promise<void> {
    // List of ActionTypes keys to check and reset
    const keysToReset = [
      ActionTypes.GET_CHILDREN_BY_RELATION,
      ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE,
      ActionTypes.GET_POSITION_MULTIPLE,
      ActionTypes.GET_GROUPES_CATEGORY,
      ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE,
      ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE_CONTEXT,
      ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT,
      ActionTypes.READ_STATIC_DETAILS_MULTIPLE,
      // ActionTypes.ADD_COMPONENT_AS_SPRITES,
      // ActionTypes.REMOVE_ALL_SPRITES,
      ActionTypes.REMOVE_ALL_LINES,
    ];

    // Iterate through each key and delete the buildingId entry if it exists
    keysToReset.forEach((key) => {
      if (
        typeof ApiIteratorStore[key] !== "undefined" &&
        typeof ApiIteratorStore[key][buildingId] !== "undefined"
      ) {
        delete ApiIteratorStore[key][buildingId];
      }
    });
  },

  //        async [ActionTypes.RESET_API_ITERATOR_STORE](
  //   { commit }: AugmentedActionContextAppData,
  //   { buildingId }: any
  // ): Promise<void> {
  //   if (
  //     typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION] !== 'undefined' &&
  //     typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION][buildingId] !== 'undefined'
  //   ) {
  //     delete ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION][buildingId];
  //   }
  //          if (
  //     typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE] !== 'undefined' &&
  //     typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE][buildingId] !== 'undefined'
  //   ) {
  //     delete ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE][buildingId];
  //          }
  //          if (
  //     typeof ApiIteratorStore[ActionTypes.GET_POSITION_MULTIPLE] !== 'undefined' &&
  //     typeof ApiIteratorStore[ActionTypes.GET_POSITION_MULTIPLE][buildingId] !== 'undefined'
  //   ) {
  //     delete ApiIteratorStore[ActionTypes.GET_POSITION_MULTIPLE][buildingId];
  //       }
  //       if (
  //         typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT] !== 'undefined' &&
  //         typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT][buildingId] !== 'undefined'
  //       ) {
  //         delete ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT][buildingId];
  //               }
  //           if (
  //     typeof ApiIteratorStore[ActionTypes.GET_GROUPES_CATEGORY] !== 'undefined' &&
  //     typeof ApiIteratorStore[ActionTypes.GET_GROUPES_CATEGORY][buildingId] !== 'undefined'
  //   ) {
  //     delete ApiIteratorStore[ActionTypes.GET_GROUPES_CATEGORY][buildingId];
  //           }
  //           if (
  //     typeof ApiIteratorStore[ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE] !== 'undefined' &&
  //     typeof ApiIteratorStore[ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE][buildingId] !== 'undefined'
  //   ) {
  //     delete ApiIteratorStore[ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE][buildingId];
  //   }

  //   },

  async [ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE](
    { commit }: AugmentedActionContextAppData,
    { patrimoineId, buildingId, relations, size, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE] ===
      "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE][
        buildingId
      ] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE][
        buildingId
      ] = spinalAPI.createIteratorCall(
        getMultipleParentRelationNode,
        patrimoineId,
        buildingId,
        relations,
        size
      );
    }
    const items = await ApiIteratorStore[
      ActionTypes.GET_PARENT_BY_RELATION_MULTIPLE
    ][buildingId].next();
    return items?.value;
  },

  async [ActionTypes.GET_GROUPES_CATEGORY](
    { commit }: AugmentedActionContextAppData,
    { patrimoineId, buildingId, context, category, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();

    if (
      typeof ApiIteratorStore[ActionTypes.GET_GROUPES_CATEGORY] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_GROUPES_CATEGORY] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_GROUPES_CATEGORY][buildingId] ===
      "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_GROUPES_CATEGORY][buildingId] =
        spinalAPI.createIteratorCall(
          getGroupes,
          patrimoineId,
          buildingId,
          context,
          category
        );
    }
    const items = await ApiIteratorStore[ActionTypes.GET_GROUPES_CATEGORY][
      buildingId
    ].next();
    return items?.value;
  },

  async [ActionTypes.GET_POSITION_MULTIPLE](
    { commit }: AugmentedActionContextAppData,
    { patrimoineId, buildingId, ids, size, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.GET_POSITION_MULTIPLE] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_POSITION_MULTIPLE] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_POSITION_MULTIPLE][buildingId] ===
      "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_POSITION_MULTIPLE][buildingId] =
        spinalAPI.createIteratorCall(
          getPositionMultiple,
          patrimoineId,
          buildingId,
          ids,
          size
        );
    }
    const items = await ApiIteratorStore[ActionTypes.GET_POSITION_MULTIPLE][
      buildingId
    ].next();
    return items?.value;
  },

  async [ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE](
    { commit }: AugmentedActionContextAppData,
    { patrimoineId, buildingId, relations, size, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE] ===
      "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE][
        buildingId
      ] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE][
        buildingId
      ] = spinalAPI.createIteratorCall(
        getMultipleChildrenRelationNode,
        patrimoineId,
        buildingId,
        relations,
        size
      );
    }
    const items = await ApiIteratorStore[
      ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE
    ][buildingId].next();
    return items?.value;
  },

  async [ActionTypes.READ_STATIC_DETAILS_MULTIPLE](
    { commit }: AugmentedActionContextAppData,
    { buildingId, dynamicIds, size, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.READ_STATIC_DETAILS_MULTIPLE] ===
      "undefined"
    ) {
      ApiIteratorStore[ActionTypes.READ_STATIC_DETAILS_MULTIPLE] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.READ_STATIC_DETAILS_MULTIPLE][
        buildingId
      ] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.READ_STATIC_DETAILS_MULTIPLE][buildingId] =
        spinalAPI.createIteratorCall(
          readStaticDetailsMultiple,
          buildingId,
          dynamicIds,
          size
        );
    }
    const items = await ApiIteratorStore[
      ActionTypes.READ_STATIC_DETAILS_MULTIPLE
    ][buildingId].next();
    const processEquipments = (items) => {
      return items.map((item) => {
        const group = item.groupParents;

        // Function to check similarity of endpoint names
        const isSimilarName = (name1, name2) => {
          const baseName1 = name1.replace(/\d+$/, "");
          const baseName2 = name2.replace(/\d+$/, "");
          return baseName1 === baseName2;
        };
        let filteredEndpoints = [];
        if (Array.isArray(item.endpoints)) {
          const seenNames = new Set();

          for (const ep of item.endpoints) {
            if (ep && ep.name && ep.value !== null) {
              // Check for similar name already added
              const isDuplicate = [...seenNames].some((existingName) =>
                isSimilarName(existingName, ep.name)
              );

              if (!isDuplicate) {
                filteredEndpoints.push({
                  name: ep.name,
                  value: ep.value,
                });
                seenNames.add(ep.name);
              }

              // Break once 5 unique entries are added
              if (filteredEndpoints.length === 5) break;
            }
          }
        }

        // controlEndpoints = item.endpoint or null
        const controlEndpoints = item.controlEndpoint || null;
        // const controlEndpoints = item.endpoint;
        let positionVector: THREE.Vector3 | null = null;

        const spatialCategory = item.attributsList.find(
          (attr: any) => attr.name === "Spatial"
        );
        if (spatialCategory && spatialCategory.attributs.length > 0) {
          const positionAttr = spatialCategory.attributs.find(
            (attr: any) => attr.label === "XYZ center"
          );
          if (positionAttr) {
            const positionValues = positionAttr.value.split(";").map(Number);
            if (positionValues.length === 3) {
              positionVector = new THREE.Vector3(
                positionValues[0],
                positionValues[1],
                positionValues[2]
              );
            }
          }
        }

        return {
          dynamicId: item.dynamicId,
          group: group,
          endpoints: filteredEndpoints,
          controlEndpoints: controlEndpoints,
          position: positionVector,
        };
      });
    };

    const result = processEquipments(items.value);
    return result;
  },

  // async [ActionTypes.GET_ATTRIBUTE_LIST_MULTIPLE](
  //   { commit }: AugmentedActionContextAppData,
  //   { buildingId, dynamicIds,size, forceUpdate }: any
  // ): Promise<IEquipmentItem[]> {
  //   const spinalAPI = SpinalAPI.getInstance();
  //   if (
  //     typeof ApiIteratorStore[ActionTypes.GET_ATTRIBUTE_LIST_MULTIPLE] ===
  //     'undefined'
  //   ) {
  //     ApiIteratorStore[ActionTypes.GET_ATTRIBUTE_LIST_MULTIPLE] = {};
  //   }

  //   if (
  //     typeof ApiIteratorStore[ActionTypes.GET_ATTRIBUTE_LIST_MULTIPLE][
  //       buildingId
  //     ] === 'undefined'
  //   ) {
  //     ApiIteratorStore[ActionTypes.GET_ATTRIBUTE_LIST_MULTIPLE][buildingId] =
  //       spinalAPI.createIteratorCall(
  //         getAttributsMultiple,
  //         buildingId,
  //         dynamicIds,
  //         size
  //       );
  //   }
  //   const items = await ApiIteratorStore[
  //     ActionTypes.GET_ATTRIBUTE_LIST_MULTIPLE
  //   ][buildingId].next();
  //   return items?.value;
  // },

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
  ////////////////////////////////////////////////////////////
  ///////////// CONTEXT CHILDREN ////////////////////////////
  ////////////////////////////////////////////////////////////

  async [ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT](
    { commit }: AugmentedActionContextAppData,
    { patrimoineId, buildingId, contextId, nodeId, relation, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT] ===
      "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT] = {};
    }

    if (
      typeof ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT][
        buildingId
      ] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT][
        buildingId
      ] = spinalAPI.createIteratorCall(
        gethildrenRelationContextNode,
        patrimoineId,
        buildingId,
        contextId,
        nodeId,
        relation
      );
    }
    const items = await ApiIteratorStore[
      ActionTypes.GET_CHILDREN_BY_RELATION_CONTEXT
    ][buildingId].next();
    return items?.value;
  },

  async [ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE_CONTEXT](
    { commit }: AugmentedActionContextAppData,
    { patrimoineId, buildingId, contextId, relations, size, forceUpdate }: any
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[
        ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE_CONTEXT
      ] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE_CONTEXT] =
        {};
    }
    if (
      typeof ApiIteratorStore[
        ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE_CONTEXT
      ][buildingId] === "undefined"
    ) {
      ApiIteratorStore[ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE_CONTEXT][
        buildingId
      ] = spinalAPI.createIteratorCall(
        getMultipleChildrenRelationContextNode,
        patrimoineId,
        buildingId,
        contextId,
        relations,
        size
      );
    }
    const items = await ApiIteratorStore[
      ActionTypes.GET_CHILDREN_BY_RELATION_MULTIPLE_CONTEXT
    ][buildingId].next();
    return items?.value;
  },

  ////////////////////////////////////////////////////////
  //                VIEWER
  ////////////////////////////////////////////////////////

  async [ActionTypes.OPEN_VIEWER](
    { commit, dispatch, state }: AugmentedActionContextAppData,
    playload: { onlyThisModel: boolean; config: IConfig; item: any }
  ): Promise<void> {
    try {
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

  [ActionTypes.ADD_CARD_COMPONENT](
    { commit, dispatch, state },
    { items, buildingId, component }: any
  ) {
    return ViewerManager.getInstance().addCardomponent(
      items,
      buildingId,
      component
    );
  },

  [ActionTypes.ADD_COMPONENT_AS_SPRITES](
    { commit, dispatch, state },
    { items, buildingId, component }: any
  ) {
    return ViewerManager.getInstance().addComponentAsSprites(
      items,
      buildingId,
      component
    );
  },

  [ActionTypes.ADD_COMPONENT_NETWORK_AS_SPRITE](
    { commit, dispatch, state},
    { items, buildingId, component }: any
  ) {
    return ViewerManager.getInstance().addComponentNetworkAsSprite(
      items,
      buildingId,
      component
    );
  },

  [ActionTypes.REMOVE_CARDS]({ commit, dispatch, state }) {
    return SpriteManager.getInstance().removeCards();
  },

  [ActionTypes.REMOVE_ALL_SPRITES]({ commit, dispatch, state }) {
    return SpriteManager.getInstance().removeSprites();
  },
  [ActionTypes.SELECT_SPRITES](
    { commit, dispatch, state },
    dynamicIds: Array<number>
  ) {
    console.log("select sprites", dynamicIds);
    return SpriteManager.getInstance().selecNetworktSprites(dynamicIds);
  },
  [ActionTypes.DESELECT_SPRITE](
    { commit, dispatch, state },
    dynamicIds: Array<number>
  ) {
    return SpriteManager.getInstance().deselectSprites(dynamicIds);
  },
  [ActionTypes.DESELECT_LINE](
    { commit, dispatch, state },
    dynamicIds: Array<number>
  ) {
    return SpriteManager.getInstance().removeStyleLine(dynamicIds);
  },
  [ActionTypes.REMOVE_ALL_LINES]({ commit, dispatch, state }) {
    return ViewerManager.getInstance().removeAllLines();
  },
};
