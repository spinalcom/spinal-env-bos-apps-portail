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

import type {
  IEquipmentItem,
  IZoneItem,
  ISpaceSelectorItem,
} from 'src/components/SpaceSelector';
import type { IGetAllBuildingsRes } from 'src/interfaces/IGetAllBuildingsRes';
import { IViewInfoItemRes } from 'src/services/spinalAPI/GeographicContext/getViewInfo';
import type { MutationTree } from 'vuex';
import type { StateAppData } from './state';
// import { toManageableTicket } from './utils'


export enum MutationTypes {
  SET_BUILDINGS = 'SET_BUILDINGS',
  SET_SELECTED_ZONE = 'SET_SELECTED_ZONE',
  SET_FLOORS = 'SET_FLOORS',
  SET_ROOMS = 'SET_ROOMS',
  SET_EQUIPMENTS = 'SET_EQUIPMENTS',
  SET_VIEWINFO = 'SET_VIEWINFO',
  SET_APP_CONFIG = 'SET_APP_CONFIG',
  SET_BUILDING = 'SET_BUILDING',
  SET_TICKETS = 'SET_TICKETS',
  SET_FLOOR_TICKETS = 'SET_FLOOR_TICKETS',

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
  [MutationTypes.SET_APP_CONFIG](state: StateAppData, payload: any): void;
  [MutationTypes.SET_BUILDING](state: S, payload: any): void;
  [MutationTypes.SET_TICKETS](state: S, payload: any[]): void;
  [MutationTypes.SET_FLOOR_TICKETS](state: S, payload: { floorId: number; tickets: any[] }): void;

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
  [MutationTypes.SET_APP_CONFIG](state: StateAppData, payload: any): void {
    state.appConfig = payload;
  },
  [MutationTypes.SET_BUILDING](state: StateAppData, payload: any): void {
    payload.tickets = [];
    state.building = payload;
  },
  [MutationTypes.SET_TICKETS](state: StateAppData, payload: any[]): void {
    state.tickets = payload;
    state.building.tickets = payload.map((t: any) => toManageableTicket(t));
  },
  [MutationTypes.SET_FLOOR_TICKETS](
    state: StateAppData,
    { floorId, tickets }: { floorId: number; tickets: any[] }
  ): void {
    const found = state.building.children.find(
      (f: any) => f.dynamicId === floorId
    );
    if (found) {
      found.tickets = tickets.map((t: any) => toManageableTicket(t));
      found.loaded = true;
    }
  },
};


function toManageableTicket(ticket: any) {
    return {
        id: ticket.dynamicId,
        Nom: ticket.name,
        Étape: ticket.step.name,
        Domaine: ticket.process.name,
        "Date de création": displayDate(
            ticket.creationDate || ticket.log_list[0]?.date || 0
        ),
        "Dernière modification": displayDate(
            ticket.directModificationDate ||
            ticket.log_list[ticket.log_list?.length - 1]?.date ||
            0
        ),
        Déclarant: ticket.userName || "ADMIN",
        color: ticket.step.color,
        attachement: ticket.file_list.length > 0,
    };
}

function displayDate(dateTime: number) {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
