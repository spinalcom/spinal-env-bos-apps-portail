import type { GetterTree } from 'vuex';
import type { StateAppData } from './state';

export const getters: GetterTree<StateAppData, StateAppData> = {
  getTickets: (state) => (dynamicId: number) => {
    if (!dynamicId || dynamicId === state.building.dynamicId)
      return state.building.tickets;

    const found = state.building.children.find(
      (f: any) => f.dynamicId === dynamicId
    );

    if (found && found.loaded) return found.tickets;
    return [];
  }
};
