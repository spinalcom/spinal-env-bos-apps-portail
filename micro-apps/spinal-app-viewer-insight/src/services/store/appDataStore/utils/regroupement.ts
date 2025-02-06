/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

import { ISpaceSelectorItem } from "../../../../../../../global-components/SpaceSelector";
import { IConfig } from "../../../../interfaces/IConfig";


export function getItemsToRegroup(map: Map<string, any>, item: ISpaceSelectorItem) {
   const type = item.type;
   const obj = map.get(type);
   const data = obj[item.dynamicId];

   if (!data) return [];

   if (data.type === map.get("groupType")) return [data];
   return data?.children || [];
}

export function regroupByGeographicItem(map, key, itemsToRegroup) {
   const obj = map.get(key) || {};
   const objCopy = {};

   for (const item of itemsToRegroup) {
      const id = key === "geographicFloor" ? item.floorId : item.roomId;

      if (objCopy[id]) objCopy[id].children.push(item);
      else {
         objCopy[id] = Object.assign({}, obj[id]);
         objCopy[id].children = [item]; 
      }
   }
   
   return Array.from(Object.values(objCopy));
}

export async function regroupByGeograhicGroup(parents: any[], itemsToRegroup: any[]) {

   const parentsObj = _convertParentToObj(parents)   
   const obj = {};


   for (const item of itemsToRegroup) {
      const parent = _getParent(item, parentsObj);
      if (obj[parent.dynamicId]) {
         obj[parent.dynamicId].children.push(item);
      } else {
         parent.children.push(item);
         obj[parent.dynamicId] = parent;
      }
   }

   return Array.from(Object.values(obj));
   
}


function _getParent(item, parentsObj) {
   const ids = item.groups || [];

   for (const id of ids) {
      if (parentsObj[id]) return parentsObj[id];
   }


   return {
      dynamicId: 0,
      name: "Non regroupé",
      children : []
   }

}


function _convertParentToObj(parents) {
   return parents.reduce((obj, item) => {
      item.children = [];
      obj[item.dynamicId] = item;
      return obj;
   }, {})
}