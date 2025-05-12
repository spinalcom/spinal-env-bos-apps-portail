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
import { getControlEndpointListMultiple, getSourceValue, updateEndpoint } from "../../spinalAPI/endpoints/getEndpoints";
import {
  getItemsToRegroup,
  regroupByGeographicItem,
  regroupByGeograhicGroup,
} from "./utils/regroupement";
import { classifyItemByBimFileId } from "./utils/openViewer";
import connectSocket from "../../websocket";
import { getContextId } from "../../websocket/Current";
import { subscribe } from "../../websocket/subscribe";


const ApiIteratorStore: ApiIteratorStoreType &
  ApiIteratorStoreRecordStringType &
  ApiIteratorStoreRecordNumberType = {};

export const actions = {
async [ActionTypes.UPDATE_ENDPOINT]({commit, state}: any, {buildingId, formData, updateType} : {buildingId: string, formData: FormData, updateType: string} ) {
      if(formData.has('allValue')) {
        const value = formData.get('allValue');
        const dynamicIdValue = formData.get('dynamicIds');
        const dynamicIds = dynamicIdValue ? JSON.parse(dynamicIdValue as string) : [];
        let updatePromise: any[]  = [];
        dynamicIds.forEach(async (dynamicId: number) => {
          try {
            const res = await updateEndpoint(buildingId, dynamicId, value, updateType);
            if(res.status === 200) {
              updatePromise.push(
                 {
                  success: true,
                  endpoint: res.data
                 }
              )
            }
          } catch (error) {
            updatePromise.push(
              {
                success: false,
                endpoint: null
              }
            )
          }
        })
        const result = await Promise.all(updatePromise);
        const allSuccess = result.every((el) => el.success === true);
        if(allSuccess){
          return {success: true, data: result};
        }
        else {
          return {success: false, data: result};
        }

      } else {
        
            let updatePromise: any[]  = [];
            for (let [key, value] of formData.entries()) {
              try {
                const res = await updateEndpoint(buildingId, parseInt(key), value, updateType);
                if(res.status === 200) {
                  updatePromise.push(
                     {
                      success: true,
                      endpoint: res.data
                     }
                  )
                }
              } catch (error) {
                updatePromise.push(
                  {
                    success: false,
                    endpoint: null
                  }
                )
                console.error(error);
              }
            }
            const result = await Promise.all(updatePromise);
            const allSuccess = result.every((el) => el.success === true);
            if(allSuccess){
              return {success: true, data: result};
            }
            else {
              return {success: false, data: result};
            }
        
      }
},

async [ActionTypes.GET_CONTROL_POINT_MULTIPLE]({commit, state}: any, {buildingId, dynamicIds,} : {buildingId: string, dynamicIds: number[]} ) {
  const result: any[] = await getControlEndpointListMultiple(buildingId, dynamicIds);

  return result;
},

async [ActionTypes.ENABLE_SOCKET]({dispatch ,commit, state, rootState}: any, {enable} : {enable: boolean} ) { 
  commit(MutationTypes.SET_REAL_TIME, enable);
  if(enable) {
    // Vérifions si le socket est déjà connecté
    if(!state.socket || !state.socket.connected) {
      const socketInstance = connectSocket();
      commit(MutationTypes.SET_SOCKET, socketInstance);

      // Connexion au socket
      socketInstance.connect();


      //Récupération des nodeId pour la souscription au socket
      let elementContext_alt: any[] = [];
      const buildingId = localStorage.getItem('idBuilding');
      const context = await getContextId(buildingId);
      //context ID
      const contextId = context[0].dynamicId;
      if(rootState.appDataStore.data.length > 0) {
          const children = rootState.appDataStore.data
      children.map((item: any) => {
          item.children.map((el: any) => {
            const value = el.endpoint.dynamicId;
            elementContext_alt.push(`${contextId}/${value}`);
          })
      })
      commit(MutationTypes.SET_ELEMENT_CONTEXT, elementContext_alt); 
        
        const requestOption = {
          subscribeChildren: true,
          subscribeChildScope: 'tree_in_context',
        }
        const events = await subscribe(state.socket, state.elementContext, requestOption);
        try{
          for await (const event of events) {
            state.socket.on(event.toString(), (data: any) => {
              const value = {
                dynamicId: data.data.node.dynamicId,
                name: data.data.node.element.name,
                value: data.data.node.element.currentValue,
                unit: data.data.node.element.unit
              }
              console.log('value', value);
              
              const stateupdate = dispatch(ActionTypes.WEBSOCKET_CALLBACK, {data: value});
              commit(MutationTypes.SET_ENDPOINT, stateupdate)

            })
          }
        } catch (error) {

        }

      } {
      
  }
  return true;
 }
 else {
  // Déconnexion du socket
    state.socket.disconnect();
    console.log('socket disconnected');
    return false;
 }
}
},


async [ActionTypes.WEBSOCKET_CALLBACK]({commit, state, rootState}: any, {data} : {data: any} ) {


  // on parcours le state pour voir si on a des données qui correspondent à celles reçues afin de les mettre à jour
  state.data.forEach((el: any) => {
    el.children.forEach((child: any) => { 
        if(child.endpoint.dynamicId === data.dynamicId) {
          child.endpoint.value = data.value;
          rootState.appDataStore.reloadData = true;
        }
        
    })
  })
  return state;
},

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
    console.log("ADD_SPRITES", items, buildingId);    
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
  [ActionTypes.ADD_CURRENT_CARD](
    { commit, dispatch, state },
    { items, buildingId, component }: any
  ) {
    console.log("ADD_SPRITES", items, buildingId);    
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

  [ActionTypes.SET_ENDPOINT](
    { commit, dispatch, state },
    children: any[]
  ) {
    return commit(MutationTypes.SET_ENDPOINT, children);
  }

};
