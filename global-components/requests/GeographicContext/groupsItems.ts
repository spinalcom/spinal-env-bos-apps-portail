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

import { INodeItem, IGroupTreeRec } from "../../interfaces/INodeItem";
import { SpinalAPI } from '../SpinalAPI';
import { IConfig, EntryPoint, ISource } from "../../interfaces/IConfig";
import * as lodash from "lodash";


export async function getGroupsItems(config: IConfig): Promise<Map<string,any>> {
   let tree;
   if (config.entryPoint.context && !config.entryPoint.category) tree = await getGroupContextTree(config.entryPoint.context);
   else tree = await getGroupContextTreeByNames(config.entryPoint);

   const items = getItemsInTree(tree);
   // map.set("items", itemsObj);
   return classifyItemsByGeographicTypes(items);

}


export async function getAllCategoriesTree( contextName: string) {
   let contexts = await _getContextRequest( contextName);
   if(!contexts) throw new Error(`[regroupment] - No group context found for ${contextName}`);
   
   contexts = Array.isArray(contexts) ? contexts : [contexts];
   const geoGroupContexts = contexts.filter(el => ["BIMObjectGroupContext", "geographicRoomGroupContext"].indexOf(el.type) !== -1);
   const promises = geoGroupContexts.map(async el => _getTree(el.dynamicId));
   
   return Promise.all(promises).then((result) => {
      return result.flat().reduce((obj, context) => {
         const categories = context.children;
         for (const category of categories) {
            if (!obj[category.name]) obj[category.name] = [];
            obj[category.name].push(..._formatGroups(category.children, context.dynamicId, category.dynamicId));
         }
         return obj;
      }, {});

   })


}


/////////////////////////////////////////////////////////////////

function _formatGroups(groups, contextId: string, categoryId: string) {
   return groups.map(el => {
            el.categoryId = categoryId;
            el.contextId = contextId;
            return el;
         })
}

function getItemsInTree(tree) {
   let categories = tree.children || [];

   return categories.reduce((list, category) => {
      const groups = category.children ||[];
      const items = groups.map(group => group.children || []);
      list.push(...(items.flat()));
      // items.flat().forEach(item => obj[item.dynamicId] = item);
      // return obj;
      return list;
   }, [{}])

}


async function getGroupContextTree(contextName): Promise<INodeItem[]> {
   const context = await _getContextRequest(contextName);
   if (!context) throw `No group context found with name ${contextName}`;

   const spinalAPI = SpinalAPI.getInstance();
   const url = spinalAPI.createUrl(`/api/v1/groupContext/${context.dynamicId}/tree`);
   let result = await spinalAPI.get<any>(url);
   return result.data;

}

async function getGroupContextTreeByNames(entryPoint: EntryPoint) {
   const context = await _getContextRequest(entryPoint.context);
   if (!context) throw `No group context found with name ${entryPoint.context}`;
   
   (context as any).children = await getGroupTreeFromCategory(context.dynamicId, entryPoint);
   return context;
}

async function getGroupTreeFromCategory(contextId: number, entryPoint: EntryPoint) {
   const categories = await _getCategoriesRequest(contextId, entryPoint.category);

   const promises = categories.map(async el => {
      (el as any).children = await getGroupTreeFromGroup(contextId, el.dynamicId, entryPoint);
      return el;
   })

   return Promise.all(promises);
}

async function getGroupTreeFromGroup(contextId: number, categoryId: number, entryPoint: EntryPoint) {
   const groups = await _getGroupsRequest(contextId, categoryId, entryPoint.group);

   const promises = groups.map(async el => {
      (el as any).children = await _getGroupsItemsRequest(contextId, categoryId, el);
      return el;
   })

   return Promise.all(promises);
}

////////////////////////////////////////////////

async function classifyItemsInGroupContext(tree: any) {
   const map: Map<string, any> = new Map();

   let categories = tree.children || [];
   let contextCopy = _createCopyWithoutChildren(tree, null);

   for (const category of categories) {
      const cateCopy = _createCopyWithoutChildren(category, contextCopy);
      addToMap(map, "categories", cateCopy);
      for (const group of category.children) {
         const groupCopy = _createCopyWithoutChildren(group, cateCopy);
         addToMap(map, "groups", groupCopy);
         for (const item of group.children) {
            item.parent = groupCopy;
            item.groupId = groupCopy.dynamicId;
            item.category = cateCopy.dynamicId;
            item.contextId = contextCopy.dynamicId;

            groupCopy.children.push(item);
            cateCopy.children.push(item);
            addToMap(map, "items", item);
         }
      }
   }

   return map;
}

async function classifyItemsByGeographicTypes(items: any[]) {
   
   const { dynamicIds, type, obj } = items.reduce((data, item) => {
      if (typeof item?.dynamicId === "undefined") return data;
      data.type = item.type;
      data.dynamicIds.push(item.dynamicId);
      data.obj[item.dynamicId] = item;
      return data;
   }, { dynamicIds: [], type: undefined, obj: {} });


   const positions = await getPositionMultiple(dynamicIds, type, 200);
   let map: Map<string, any> = new Map();
   map.set(type, obj);
   map.set("groupType", type);

   return _classifyGeographicPosition(positions, map, obj);   
}

////////////////////////////////////////////////


function addToMap(map: Map<string,any>, type: string, item: any) {
   let value = map.get(type);
   if (!value) value = {};

   value[item.dynamicId] = item;

   map.set(type, value);
}


async function reverseTree(tree: any): Promise<IGroupTreeRec[]> {
   let categories = tree.children || [];
   let list: IGroupTreeRec[] = [];
   let contextCopy = _createCopyWithoutChildren(tree, null);

   for (const category of categories) {
      const cateCopy = _createCopyWithoutChildren(category, contextCopy);
      for (const group of category.children) {
         const groupCopy = _createCopyWithoutChildren(group, cateCopy);
         for (const item of group.children) {
            item.parent = groupCopy;
            list.push(item);
         }
      }
   }

   return list;
}


function _createCopyWithoutChildren(objToCopy: any, parent: any) {
   const obj = Object.assign({}, objToCopy);
   for (const key in objToCopy) {
      if (Object.prototype.hasOwnProperty.call(objToCopy, key) && key !== "children") {
         const value = objToCopy[key];
         obj[key] = value;
      }
   }

   obj.children = [];
   return obj;
}

/////////////////////////////////////////////////////////////////////////////////

async function _getContextRequest(contextName?: string)  {
   const spinalAPI = SpinalAPI.getInstance();
   const url = spinalAPI.createUrl('/api/v1/groupContext/list');
   let result = await spinalAPI.get<INodeItem[]>(url);
   
   if (!contextName) return result.data;

   return result.data.find((el) => el.name === contextName)
}

async function _getTree(contextId: number) {
   const spinalAPI = SpinalAPI.getInstance();
   const url = spinalAPI.createUrl(`/api/v1/context/${contextId}/tree/2/depth`);
   let result = await spinalAPI.get<INodeItem[]>(url);
   return result.data;
}

async function _getCategoriesRequest(contextId: number, categoryName?: string) {
   const spinalAPI = SpinalAPI.getInstance();
   const url = spinalAPI.createUrl(`/api/v1/groupeContext/${contextId}/category_list`);
   let result = await spinalAPI.get<INodeItem[]>(url);
   if (!categoryName) return result.data;
   return result.data.filter((el) => el.name === categoryName);
}

async function _getGroupsRequest(contextId: number, categoryId: number, groupName?: string): Promise<(INodeItem & { categoryId: number;  contextId: number})[]> {
   const spinalAPI = SpinalAPI.getInstance();
   const url = spinalAPI.createUrl(`/api/v1/groupeContext/${contextId}/category/${categoryId}/group_list`);
   let result = await spinalAPI.get<INodeItem[]>(url);
   if (!groupName) {
      return result.data.map((el) => {
         el["categoryId"] = categoryId;
         el["contextId"] = contextId;
         return el as (INodeItem & { categoryId: number;  contextId: number});
      });
   }

   return result.data.reduce((list: (INodeItem & { categoryId: number;  contextId: number})[], el,index, arr) => {
      if (el.name === groupName) {
         el["categoryId"] = categoryId;
         el["contextId"] = contextId;
         list.push(el as INodeItem & { categoryId: number; contextId: number });
         arr.slice(index - 1);
      }

      return list;
   }, []);
}

async function _getGroupsItemsRequest(contextId: number, categoryId: number, group: INodeItem) {
   let endpoint;
   if (group.type === "geographicRoomGroup") endpoint = `/api/v1/roomsGroup/${contextId}/category/${categoryId}/group/${group.dynamicId}/roomList`;
   if (group.type === "BIMObjectGroup") endpoint = `/api/v1/equipementsGroup/${contextId}/category/${categoryId}/group/${group.dynamicId}/equipementList`;

   if (endpoint) {
      const spinalAPI = SpinalAPI.getInstance();
      const url = spinalAPI.createUrl(endpoint);
      let result = await spinalAPI.get<INodeItem[]>(url);
      return result.data ||[];
   }

   return [];
}

/////////////////////////////////////////////////////////////////////////////////////

function getPositionMultiple(dynamicIds : number[], type: string, size = 500) {

   let apiRoute = "/api/v1/equipment/get_position_multiple";
   if (type === "geographicRoom") apiRoute = "/api/v1/room/get_position_multiple";

   const promises = lodash.chunk(dynamicIds, size).map(ids => getPositionMultipleRequest(ids, apiRoute));

   return Promise.allSettled(promises).then((result) => {
      return result.reduce((list, { status, value }) => {
         if (status === "fulfilled") list.push(...value);
         return list;
     }, []) 
   })
}

async function getPositionMultipleRequest(dynamicIds : string[],  apiRoute: string) {
   const spinalAPI = SpinalAPI.getInstance();
   const url = spinalAPI.createUrl(apiRoute);
   let result = await spinalAPI.post<any>(url,dynamicIds);
   return result.data || [];
}

function _classifyGeographicPosition(positions, map, itemsObj) {
   const buildings = {}
   const floors = {}
   const rooms = {}

   for (const { info, dynamicId } of positions) {
      if (!info) continue;
      
      const item = itemsObj[dynamicId];
      const { building, floor, room } = info;

      item.floorId = floor?.dynamicId;
      item.roomId = room?.dynamicId;
      
      addToObj(buildings, building, item);
      addToObj(floors, floor, item);
      addToObj(rooms, room, item);
   }

   browseAndAddToMap("geographicBuilding", buildings);
   browseAndAddToMap("geographicFloor", floors);
   browseAndAddToMap("geographicRoom", rooms);

   return map;

   function browseAndAddToMap(type: string, obj: any) {
      for (const key in obj) {
         if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            addToMap(map, type, element);
         }
      }
   }

   function addToObj(obj, node, itemToAdd ) {
      if (!node) return;
      if (!obj[node.dynamicId]) {
         node.children = [];
         obj[node.dynamicId] = node
      }
      obj[node.dynamicId].children.push(itemToAdd);
   }

}