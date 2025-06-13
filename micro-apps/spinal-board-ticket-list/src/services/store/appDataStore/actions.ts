/*
 * Copyright 2025 SpinalCom - www.spinalcom.com
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

import { ActionContext, ActionTree } from 'vuex';
import { getBuildings } from '../../spinalAPI/GeographicContext/getBuildings';
import { IGetAllBuildingsRes } from '../../../interfaces/IGetAllBuildingsRes';
import { SpinalAPI } from '../../spinalAPI/SpinalAPI';
import { MutationsAppData, MutationTypes } from './mutations';
import type { StateAppData } from './state';
import {
  getBuildingAsync,
  getFloorListAsync,
  getPositionAsync,
  getProcessListAsync,
  getRoomListAsync,
  getStepListAsync,
  getTicketDetailsAsync,
  getTicketListAsync,
  getWorkflowListAsync,
} from '../../../api-requests';
import {
  getEquipments,
  getFloors,
  getRooms,
} from '../../spinalAPI/GeographicContext/geographicContext';
import type {
  IEquipmentItem,
  ISpaceSelectorItem,
  IZoneItem,
} from 'src/components/SpaceSelector';
import {
  getViewInfo,
  IViewInfoItemRes,
  IViewInfoTmpRes,
  mergeIViewInfo,
} from '../../spinalAPI/GeographicContext/getViewInfo';
import {
  EmitterViewerHandler,
  ViewerEventWithData,
  VIEWER_OBJ_FIT_TO_VIEW,
  VIEWER_OBJ_ISOLATE,
  VIEWER_OBJ_SELECT,
} from 'spinal-viewer-event-manager';

export type AugmentedActionContextAppData = {
  commit<K extends keyof MutationsAppData>(
    key: K,
    payload: Parameters<MutationsAppData[K]>[1]
  ): ReturnType<MutationsAppData[K]>;
} & Omit<ActionContext<StateAppData, StateAppData>, 'commit'>;

export enum ActionTypes {
  GET_BUILDINGS = 'GET_BUILDINGS',
  OPEN_VIEWER = 'OPEN_VIEWER',
  GET_VIEWER_INFO = 'GET_VIEWER_INFO',
  SELECT_ITEMS = 'SELECT_ITEMS',
  FIT_TO_VIEW_ITEMS = 'FIT_TO_VIEW_ITEMS',
  ISOLATE_ITEMS = 'ISOLATE_ITEMS',
}
export enum ActionRecordTypes {
  GET_FLOORS = 'GET_FLOORS',
  GET_ROOMS = 'GET_ROOMS',
  GET_EQUIPMENTS = 'GET_EQUIPMENTS',
}

type TFctViewerIteract = (
  stateContext: AugmentedActionContextAppData,
  payload: {
    platformId: string;
    id: number | number[];
  }
) => Promise<void>;
type TFctGeoAPICall<Payload, FctReturn> = (
  stateContext: AugmentedActionContextAppData,
  payload: Payload
) => Promise<FctReturn>;
interface IFctGeoCallPayload {
  platformId: string;
  id: number;
  forceUpdate?: boolean;
}

export interface Actions {
  [ActionTypes.GET_BUILDINGS](
    { commit, state }: AugmentedActionContextAppData,
    forceUpdate?: boolean
  ): Promise<IGetAllBuildingsRes[]>;

  [ActionRecordTypes.GET_FLOORS]: TFctGeoAPICall<
    { platformId: string; forceUpdate?: boolean },
    IZoneItem[]
  >;

  [ActionRecordTypes.GET_ROOMS]: TFctGeoAPICall<
    IFctGeoCallPayload,
    IZoneItem[]
  >;
  [ActionRecordTypes.GET_EQUIPMENTS]: TFctGeoAPICall<
    IFctGeoCallPayload,
    IEquipmentItem[]
  >;

  [ActionTypes.OPEN_VIEWER](
    { commit, state }: AugmentedActionContextAppData,
    payload: ISpaceSelectorItem
  ): Promise<void>;

  [ActionTypes.GET_VIEWER_INFO](
    { commit, state }: AugmentedActionContextAppData,
    payload: {
      platformId: string;
      id: number | number[];
      forceUpdate?: boolean;
    }
  ): Promise<IViewInfoItemRes[]>;
  [ActionTypes.SELECT_ITEMS]: TFctViewerIteract;
  [ActionTypes.FIT_TO_VIEW_ITEMS]: TFctViewerIteract;
  [ActionTypes.ISOLATE_ITEMS]: TFctViewerIteract;
}

type ApiIteratorStoreType = {
  [ActionIt in ActionTypes]?: AsyncGenerator<
    Awaited<ReturnType<Actions[ActionIt]>>
  >;
};
type ApiIteratorStoreRecordStringType = {
  [ActionIt in ActionRecordTypes]?: Record<
    string,
    AsyncGenerator<Awaited<ReturnType<Actions[ActionIt]>>>
  >;
};
type ApiIteratorStoreRecordNumberType = {
  [ActionIt in ActionRecordTypes]?: Record<
    number,
    AsyncGenerator<Awaited<ReturnType<Actions[ActionIt]>>>
  >;
};
const ApiIteratorStore: ApiIteratorStoreType &
  ApiIteratorStoreRecordStringType &
  ApiIteratorStoreRecordNumberType = {};

const viewerStartedList = new Set<string>();

async function FctViewerIteract(
  eventName: keyof ViewerEventWithData,
  { dispatch }: AugmentedActionContextAppData,
  payload: {
    platformId: string;
    id: number | number[];
  }
): Promise<void> {
  const data: IViewInfoItemRes[] = await dispatch(
    ActionTypes.GET_VIEWER_INFO,
    payload
  );
  const emitter = EmitterViewerHandler.getInstance();
  const res = data.map((it) => {
    return {
      dbIds: it.dbIds,
      modelId: it.bimFileId,
    };
  });
  emitter.emit(eventName, res);
}
export const actions: ActionTree<StateAppData, StateAppData> & Actions = {
  async [ActionTypes.GET_BUILDINGS](
    { commit, state }: AugmentedActionContextAppData,
    forceUpdate: boolean = false
  ): Promise<IGetAllBuildingsRes[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionTypes.GET_BUILDINGS] === 'undefined' ||
      forceUpdate === true
    ) {
      ApiIteratorStore[ActionTypes.GET_BUILDINGS] =
        spinalAPI.createIteratorCall(getBuildings);
    }

    const buildings = await ApiIteratorStore[ActionTypes.GET_BUILDINGS]!.next();
    commit(MutationTypes.SET_BUILDINGS, buildings.value);
    return buildings.value;
  },

  async [ActionRecordTypes.GET_FLOORS](
    { commit }: AugmentedActionContextAppData,
    { platformId, forceUpdate }
  ): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (typeof ApiIteratorStore[ActionRecordTypes.GET_FLOORS] === 'undefined') {
      ApiIteratorStore[ActionRecordTypes.GET_FLOORS] = {};
    }
    const floorObjStore = ApiIteratorStore[ActionRecordTypes.GET_FLOORS]!;
    if (
      typeof floorObjStore[platformId] === 'undefined' ||
      forceUpdate === true
    ) {
      floorObjStore[platformId] = spinalAPI.createIteratorCall(
        getFloors,
        platformId
      );
    }
    const floors = await floorObjStore[platformId].next();
    commit(MutationTypes.SET_FLOORS, { id: platformId, items: floors.value });
    return floors.value;
  },

  async [ActionRecordTypes.GET_ROOMS](
    { commit }: AugmentedActionContextAppData,
    { platformId, id, forceUpdate }: IFctGeoCallPayload
  ): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (typeof ApiIteratorStore[ActionRecordTypes.GET_ROOMS] === 'undefined') {
      ApiIteratorStore[ActionRecordTypes.GET_ROOMS] = {};
    }
    const floorObjStore = ApiIteratorStore[ActionRecordTypes.GET_ROOMS]!;
    if (typeof floorObjStore[id] === 'undefined' || forceUpdate === true) {
      floorObjStore[id] = spinalAPI.createIteratorCall(
        getRooms,
        platformId,
        id
      );
    }
    const floors = await floorObjStore[id].next();
    commit(MutationTypes.SET_ROOMS, {
      id: id,
      items: floors.value,
    });
    return floors.value;
  },

  async [ActionRecordTypes.GET_EQUIPMENTS](
    { commit }: AugmentedActionContextAppData,
    { platformId, id, forceUpdate }: IFctGeoCallPayload
  ): Promise<IEquipmentItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    if (
      typeof ApiIteratorStore[ActionRecordTypes.GET_EQUIPMENTS] === 'undefined'
    ) {
      ApiIteratorStore[ActionRecordTypes.GET_EQUIPMENTS] = {};
    }
    const roomObjStore = ApiIteratorStore[ActionRecordTypes.GET_EQUIPMENTS]!;
    if (typeof roomObjStore[id] === 'undefined' || forceUpdate === true) {
      roomObjStore[id] = spinalAPI.createIteratorCall(
        getEquipments,
        platformId,
        id
      );
    }
    const equipments = await roomObjStore[id].next();
    commit(MutationTypes.SET_EQUIPMENTS, {
      id: id,
      items: equipments.value,
    });
    return equipments.value;
  },

  async [ActionTypes.OPEN_VIEWER](
    { commit, state }: AugmentedActionContextAppData,
    item: ISpaceSelectorItem
  ): Promise<void> {
    // TODO redo this func to use the state
    if (!item.platformId || viewerStartedList.has(item.platformId)) return;
    viewerStartedList.add(item.platformId);
    await startViewer(item.platformId);
  },

  async [ActionTypes.GET_VIEWER_INFO](
    { commit, state }: AugmentedActionContextAppData,
    {
      platformId,
      id,
    }: {
      platformId: string;
      id: number | number[];
    }
  ): Promise<IViewInfoItemRes[]> {
    const ids = Array.isArray(id) ? id : [id];
    const res: IViewInfoTmpRes[] = [];
    const nodeTofetech: number[] = [];
    for (const dynId of ids) {
      if (state.buildingInfo[dynId]) {
        mergeIViewInfo(res, state.buildingInfo[dynId]);
      } else {
        nodeTofetech.push(dynId);
      }
    }
    if (nodeTofetech.length > 0) {
      const datas = await getViewInfo(platformId, {
        dynamicId: nodeTofetech,
        floorRef: false,
        roomRef: true,
        equipements: true,
      });
      for (const item of datas) {
        commit(MutationTypes.SET_VIEWINFO, {
          id: item.dynamicId,
          items: item.data,
        });
        mergeIViewInfo(res, item.data);
      }
    }
    return res.map((it: IViewInfoTmpRes): IViewInfoItemRes => {
      return { bimFileId: it.bimFileId, dbIds: Array.from(it.dbIds) };
    });
  },
  [ActionTypes.SELECT_ITEMS]: FctViewerIteract.bind(null, VIEWER_OBJ_SELECT),
  [ActionTypes.ISOLATE_ITEMS]: FctViewerIteract.bind(null, VIEWER_OBJ_ISOLATE),
  [ActionTypes.FIT_TO_VIEW_ITEMS]: FctViewerIteract.bind(
    null,
    VIEWER_OBJ_FIT_TO_VIEW
  ),


  async loadTickets({ commit, state }) {
    console.log('hahaha laction se fait  ,???????????????');
    
    const closedSteps = state.appConfig?.steps?.closed || [];
    const workflow_list = state.appConfig?.workflowList || [];
  
    commit(MutationTypes.SET_BUILDING, await getBuildingAsync());
  
    const nodeIds: number[] = [];
    const workflows = await getWorkflowListAsync();
  
    for (const workflow of workflows.filter((w: any) =>
      workflow_list.includes(w.name)
    )) {
      const domains = await getProcessListAsync(workflow.dynamicId);
      for (const domain of domains) {
        const steps = await getStepListAsync(workflow.dynamicId, domain.dynamicId);
        for (const step of steps.filter((s: any) => !closedSteps.includes(s.name))) {
          if (!nodeIds.includes(step.dynamicId)) nodeIds.push(step.dynamicId);
        }
      }
    }
  
    const ticketGroups = await getTicketListAsync(nodeIds);
    const allTicketIds: number[] = [];
  
    for (const group of ticketGroups) {
      if (group.tickets?.length) {
        for (const ticket of group.tickets) {
          allTicketIds.push(ticket.dynamicId);
        }
      }
    }
  
    const ticketDetails: any[] = [];
    const batchSize = 50;
    for (let i = 0; i < allTicketIds.length; i += batchSize) {
      try {
        const batch = await getTicketDetailsAsync(allTicketIds.slice(i, i + batchSize));
        ticketDetails.push(...batch);
      } catch (e) {
        console.error('Error loading batch', e);
      }
    }
  
    commit(MutationTypes.SET_TICKETS, ticketDetails.filter(Boolean));
  },
  

  async getFloorList({ state, commit }) {
    if (!state.building.children || state.building.children.length === 0) {
      const floors = await getFloorListAsync();
      floors.forEach((f: any) => {
        f.loaded = false;
        f.tickets = [];
      });
      commit(MutationTypes.SET_BUILDING, {
        ...state.building,
        children: floors,
      });
    }
    return state.building.children;
  },

  async setFloorTickets({ state, commit }, floorId: number) {
    if (!floorId || floorId === state.building.dynamicId) return;

    const found = state.building.children.find((f: any) => f.dynamicId === floorId);
    if (!found || found.loaded) return;

    const rooms = (await getRoomListAsync(floorId)).map((r: any) => r.dynamicId);
    const tickets: any[] = [];

    for (const t of state.tickets) {
      if (!t.elementSelected) continue;

      if (t.elementSelected.type === 'BIMObject') {
        const pos = await getPositionAsync(t.elementSelected.dynamicId);
        if (pos?.info?.floor?.dynamicId === floorId) {
          tickets.push(t);
        }
      } else if (
        t.elementSelected.dynamicId &&
        (t.elementSelected.dynamicId === floorId ||
          rooms.includes(t.elementSelected.dynamicId))
      ) {
        tickets.push(t);
      }
    }

    commit(MutationTypes.SET_FLOOR_TICKETS, { floorId, tickets });
  },

};



