import Vue from 'vue';
import type { IViewInfoRes } from './getviewinfo';

const state = Vue.observable({
  viewInfo: [] as IViewInfoRes[]
});

export function setViewInfo(newData: IViewInfoRes[]) {
    for (const newItem of newData) {
      const index = state.viewInfo.findIndex(item => item.dynamicId === newItem.dynamicId);
      if (index === -1) {
        // Pas trouvé : on push
        state.viewInfo.push(newItem);
      } else {
        // Trouvé : on remplace
        Vue.set(state.viewInfo, index, newItem);
      }
    }
  }
export function getViewInfoReactive() {
  return state;
}
