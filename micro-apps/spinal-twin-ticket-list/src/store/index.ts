import Vue from "vue";
import Vuex from "vuex";
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
} from "../api-requests";

import config from "../../config.js";
const closedSteps = config.steps.closed;
const workflow_list = config.workflowList;

Vue.use(Vuex);

export function displayDate(dateTime: number) {
  const date = new Date(dateTime);

  let day = "" + date.getDate(),
    month = "" + (date.getMonth() + 1),
    year = "" + date.getFullYear();

  if (day.length == 1) day = "0" + day;
  if (month.length == 1) month = "0" + month;

  return `${day}/${month}/${year}`;
}

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

export default new Vuex.Store({
  state: {
    building: {
      dynamicId: 0,
      tickets: <any[]>[],
      children: <any[]>[],
    },
    tickets: [],
  },
  getters: {
    getTickets: (state) => (dynamicId: number) => {
      if (!dynamicId || dynamicId === state.building.dynamicId)
        return state.building.tickets;
      const found = state.building.children.find(
        (f: any) => f.dynamicId === dynamicId
      );
      if (found && found.loaded) return found.tickets;
      return [];
    },
  },
  mutations: {
    SET_BUILDING(state, payload) {
      payload.tickets = [];
      state.building = payload;
    },
    SET_FLOORS(state, payload) {
      state.building.children = payload;
    },
    SET_TICKETS(state, payload) {
      state.tickets = payload;
      state.building.tickets = payload.map((t: any) => toManageableTicket(t));
    },
    SET_FLOOR_TICKETS(state, payload) {
      const found = state.building.children.find(
        (f: any) => f.dynamicId === payload.floorId
      );
      if (found) {
        found.tickets = payload.tickets.map((t: any) => toManageableTicket(t));
        found.loaded = true;
      }
    },
  },
  actions: {
    async loadTickets({ commit }) {
      commit("SET_BUILDING", await getBuildingAsync());
      const promises = [];
      try {
        const nodeIds: number [] = [];
        const workflows = await getWorkflowListAsync();
        for (const workflow of workflows.filter((w: any) =>
          workflow_list.includes(w.name)
        )) {
          const domains = await getProcessListAsync(workflow.dynamicId);
          for (const domain of domains) {
            const steps = await getStepListAsync(
              workflow.dynamicId,
              domain.dynamicId
            );
            for (const step of steps.filter(
              (s: any) => !closedSteps.includes(s.name)
            )) {
              // on ne traite que les tickets en cours
              if (!nodeIds.includes(step.dynamicId)) nodeIds.push(step.dynamicId);
             
            }
          }
        }
        const tickets = await getTicketListAsync(nodeIds);
        const tiketsId = [];
        for (const t of tickets) {
          if(t.tickets.length != 0) {
            for(const ticket of t.tickets) {
              tiketsId.push(ticket.dynamicId);
            }
          }
        }
        for(let i = 0; i < tiketsId.length; i += 50) {
        
          promises.push(
            getTicketDetailsAsync(tiketsId.slice(i, i + 50)).catch((error) =>
              console.log(error)
          )
        );
      }
        Promise.all(promises)
        .then((ret) => {
          const ticketsList = [];
        for(const rest of ret) {
            ticketsList.push(...rest);
            commit(
              "SET_TICKETS",
              ticketsList.filter((t: any) => t)
            );
        
        }
          })
          .then();  
      } catch (error) {
        console.log(error);
      }
    },
    async getFloorList({ state, commit }) {
      if (!state.building.children) {
        const floors = await getFloorListAsync();
        floors.forEach((f: any) => {
          f.loaded = false;
          f.tickets = <any[]>[];
        });
        commit("SET_FLOORS", floors);
      }
      return this.state.building.children;
    },
    async setFloorTickets({ state, commit }, floorId) {
      if (!floorId || floorId === state.building.dynamicId) return;
      const found = state.building.children.find(
        (f: any) => f.dynamicId === floorId
      );

      if (!found || found.loaded) return;
      const rooms = (await getRoomListAsync(floorId)).map(
        (r: any) => r.dynamicId
      );
      const tickets = <any[]>[];
      for (const t of state.tickets) {
        if (!t.elementSelected) continue;
        if (t.elementSelected.type === "BIMObject") {
          const p = await getPositionAsync(t.elementSelected.dynamicId);
          if (p.info.floor.dynamicId === floorId) tickets.push(t);
        } else if (
          t.elementSelected.dynamicId &&
          (t.elementSelected.dynamicId === floorId ||
            rooms.includes(t.elementSelected.dynamicId))
        )
          tickets.push(t);
        state.tickets.splice(state.tickets.indexOf(t), 1);
      }
      commit("SET_FLOOR_TICKETS", { floorId, tickets });
    },
  },
  modules: {},
});