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

import { SpinalAPI } from "../SpinalAPI";
import * as lodash from "lodash";
import type {
  IBuildingItem,
  IZoneItem,
  IEquipmentItem,
  IRefItem,
} from "../../../components/SpaceSelector/interfaces/IBuildingItem";

export async function getBuilding(platformId: string) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    "api/v1/building/read"
  );
  let result = await spinalAPI.get<IBuildingItem>(url);
  Object.assign(result.data, { color: "#2693ff" });
  return result.data;
}

export async function getFloors(
  patrimoineId: string,
  buildingId: string
): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    buildingId,
    "api/v1/floor/list"
  );
  let result = await spinalAPI.get<IZoneItem[]>(url);
  const res = result.data.map((obj) => {
    Object.assign(obj, { buildingId, patrimoineId, color: "#D138DE" });
    return obj;
  });
  return res;
}

export async function getRooms(
  patrimoineId: string,
  buildingId: string,
  floorId: string,
  floorDynId: number
): Promise<IZoneItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `api/v1/floor/${floorDynId}/room_list`
  );
  let result = await spinalAPI.get<IZoneItem[]>(url);
  const res = result.data.map((obj) => {
    Object.assign(obj, { patrimoineId, buildingId, floorId, color: "#ded638" });
    return obj;
  });
  return res;
}

export async function getContext(
  patrimoineId: string,
  buildingId: string
): Promise<any> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `api/v1/context/list`
  );
  let result = await spinalAPI.get<any>(url);
  // const res = result.data.map((obj) => {
  //   Object.assign(obj, { patrimoineId, buildingId, floorId, color: '#ded638' });
  //   return obj;
  // });
  return result.data;
}
export async function getchildren(
  patrimoineId: string,
  buildingId: string,
  nodeId: number
): Promise<any> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `api/v1/node/${nodeId}/children`
  );
  let result = await spinalAPI.get<any>(url);
  // const res = result.data.map((obj) => {
  //   Object.assign(obj, { patrimoineId, buildingId, floorId, color: '#ded638' });
  //   return obj;
  // });
  return result.data;
}

export async function getGroupes(
  patrimoineId: string,
  buildingId: string,
  context: string,
  category: string
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url_context_id = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `api/v1/groupContext/list`
  );

  let result_context = await spinalAPI.get<IEquipmentItem[]>(url_context_id);
  const context_id = result_context.data.find(
    (c) => c.name === context
  ).dynamicId;
  const url_category_id = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `api/v1/groupeContext/${context_id}/category_list`
  );
  let result_category = await spinalAPI.get<IEquipmentItem[]>(url_category_id);
  const category_id = result_category.data.find(
    (c) => c.name === category
  ).dynamicId;

  const url = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `api/v1/groupeContext/${context_id}/category/${category_id}/group_list`
  );
  let result = await spinalAPI.get<IEquipmentItem[]>(url);
  //return list of names
  const res = result.data.map((obj) => {
    Object.assign(obj, {
      patrimoineId,
      buildingId,
      color: "#2693ff",
    });
    return obj;
  });
  return res;
}

export async function getEquipments(
  patrimoineId: string,
  buildingId: string,
  floorId: string,
  roomId: string,
  roomDynId: number
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `api/v1/room/${roomDynId}/equipement_list`
  );
  let result = await spinalAPI.get<IEquipmentItem[]>(url);
  const res = result.data.name.map((obj) => {
    Object.assign(obj, {
      patrimoineId,
      buildingId,
      floorId,
      roomId,
      color: "#2693ff",
    });
    return obj;
  });
  return res;
}

export async function getEquipmentListMultiple(
  patrimoineId: string,
  buildingId: string,
  roomIds: number[]
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `/api/v1/room/equipment_list_multiple`
  );
  const body = roomIds;
  let result = await spinalAPI.post(url, body);
  return result.data;
}
export async function gethildrenRelationNode(
  patrimoineId: string,
  buildingId: string,
  nodeId: number,
  relation: any
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `/api/v1/node/${nodeId}/children`
  );

  const body = [relation];
  let result = await spinalAPI.post(url, body);
  return result.data;
}
export async function gethildrenRelationContextNode(
  patrimoineId: string,
  buildingId: string,
  contextId: number,
  nodeId: number,
  relation: any
): Promise<IEquipmentItem[]> {

  const spinalAPI = SpinalAPI.getInstance();

    const url = spinalAPI.createUrlWithPlatformId(
      buildingId,
      `/api/v1/context/${contextId}/node/${nodeId}/children`
    );
    const body = [relation];
    let result = await spinalAPI.post(url, body);
    console.warn("gethildrenRelationContextNode result", result.data);
    return result.data;

}

export async function getMultipleParentRelationNode(
  patrimoineId: string,
  buildingId: string,
  relations: { dynamicId: number; relation: any }[],
  size = 200
): Promise<IEquipmentItem[]> {
  const apiRoute = "/api/v1/node/parents_multiple";

  // Divide the relations into chunks of the specified size
  const promises = lodash
    .chunk(relations, size)
    .map((chunk) =>
      getMultipleParentRelationNodeRequest(buildingId, chunk, apiRoute)
    );

  return Promise.allSettled(promises).then((results) => {
    // Flatten the array of results and filter only fulfilled promises
    return results.reduce((list, { status, value }) => {
      if (status === "fulfilled") list.push(...value);
      return list;
    }, []);
  });
}

async function getMultipleParentRelationNodeRequest(
  buildingId: string,
  relations: { dynamicId: number; relation: any }[],
  apiRoute: string
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, apiRoute);

  let body = relations.map(({ dynamicId, relation }) => ({
    dynamicId,
    relation,
  }));
  let result = await spinalAPI.post(url, body);
  let parents = result.data;
  const neededParents = parents
    .map((parent) => {
      return {
        dynamicId: parent.dynamicId,
        nodes: parent.nodes
          .filter((node) => node.type === "networkTreeContext")
          .map((node) => ({
            name: node.name,
            realid: node.dynamicId,
          })),
      };
    })
    .filter((parent) => parent.nodes.length > 0);
  return neededParents;
}

export async function getPositionMultiple(
  patrimoineId: string,
  buildingId: string,
  ids: any[],
  size = 200
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const apiRoute = `/api/v1/equipment/get_position_multiple`;

  // Function to process each chunk of relations
  async function processChunk(chunkIds: number[]) {
    const url = spinalAPI.createUrlWithPlatformId(buildingId, apiRoute);
    let body = chunkIds;
    let result = await spinalAPI.post(url, body);
    return result.data;
  }
  // Process the initial chunk of relations
  let results = await Promise.all(
    lodash.chunk(ids, size).map((chunk) => processChunk(chunk))
  );

  results = results.flat();

  const filteredResult = results.map((item) => ({
    dynamicId: item.dynamicId,
    room: item.info,
    bimFileId: item.bimFileId || null,
    version: item.version || null,
    externalId: item.externalId || null,
    dbid: item.dbid || null,
  }));

  return filteredResult;
}

export async function getMultipleChildrenRelationNode(
  patrimoineId: string,
  buildingId: string,
  relations: { dynamicId: number; relation: any }[],
  size = 200
): Promise<IEquipmentItem[]> {
  let realresult: any[] = [];
  const spinalAPI = SpinalAPI.getInstance();
  const apiRoute = `/api/v1/node/children_multiple`;

  // Function to process each chunk of relations
  async function processChunk(
    chunkRelations: { dynamicId: number; relation: any }[]
  ) {
    const url = spinalAPI.createUrlWithPlatformId(buildingId, apiRoute);
    let body = chunkRelations.map(({ dynamicId, relation }) => ({
      dynamicId,
      relation,
    }));
    let result = await spinalAPI.post(url, body);
    return result.data;
  }

  // Process the initial chunk of relations
  let results = await Promise.all(
    lodash.chunk(relations, 200).map((chunk) => processChunk(chunk))
  );

  results = results.flat();
  // Extract next level dynamic IDs and filter for "BIMObject" type nodes
  let nextIds = results
    .map((r) => (Array.isArray(r.nodes) ? r.nodes.map((e) => e.dynamicId) : []))
    .flat();

  realresult = results.flat();
  realresult.forEach((item) => {
    if (Array.isArray(item.nodes)) {
      item.nodes = item.nodes.filter((node) => node.type === "BIMObject");
    } else {
      console.warn("item.nodes is not an array or is undefined", item);
    }
  });

  // Continue processing while there are still relations to process
  while (nextIds.length > 0) {
    relations = nextIds.map((dynamicId) => {
      return { dynamicId, relation: ["hasNetworkTreeBimObject"] };
    });

    results = await Promise.all(
      lodash.chunk(relations, size).map((chunk) => processChunk(chunk))
    );

    results = results.flat();
    let newNodes: any[] = [];
    results.forEach((e) => {
      if (
        Array.isArray(e.nodes) &&
        e.nodes.some((node) => node.type === "BIMObject")
      ) {
        newNodes.push(e);
      }
    });
    // Remove nodes that are not of type "BIMObject" and prepare new relations
    let listOfObjects: any[] = [];
    newNodes.forEach((e) => {
      let newnodesFiltered = {
        dynamicId: e.dynamicId,
        nodes: [],
      };
      e.nodes.forEach((node) => {
        if (node.type === "BIMObject") {
          newnodesFiltered.nodes.push(node);
        }
      });
      listOfObjects.push(newnodesFiltered);
    });

    nextIds = listOfObjects.map((r) => r.nodes.map((e) => e.dynamicId)).flat();

    // Concatenate the new nodes to the existing results
    listOfObjects.forEach((obj) => {
      findAndAppendNodes(obj.dynamicId, realresult, obj.nodes);
    });
  }
  return realresult;
}

// export async function getMultipleChildrenRelationNode(
//   patrimoineId: string,
//   buildingId: string,
//   relations: { dynamicId: number, relation: any }[],
//   size = 200
// ): Promise<IEquipmentItem[]> {
//   let realresult: any[] = [];
//   const spinalAPI = SpinalAPI.getInstance();
//   const apiRoute = `/api/v1/node/children_multiple`;

//   // Function to process each chunk of relations
//   async function processChunk(chunkRelations: { dynamicId: number, relation: any }[]) {
//     const url = spinalAPI.createUrlWithPlatformId(buildingId, apiRoute);
//     let body = chunkRelations.map(({ dynamicId, relation }) => ({ dynamicId, relation }));
//     let result = await spinalAPI.post(url, body);
//     return result.data;
//   }

//   // Process the initial chunk of relations
//   let results = await Promise.all(
//     lodash.chunk(relations, 200).map(chunk => processChunk(chunk))
//   );

//   results = results.flat();
//   // Extract next level dynamic IDs and filter for "BIMObject" type nodes
//   let nextIds = results
//   .map(r => (Array.isArray(r.nodes) ? r.nodes.map(e => e.dynamicId) : []))
//   .flat();

//   realresult = results.flat();
//   realresult.forEach(item => {
//   if (Array.isArray(item.nodes)) {
//     item.nodes = item.nodes.filter(node => node.type === "BIMObject");
//   } else {
//     console.warn("item.nodes is not an array or is undefined", item);
//   }
// });

//   // Continue processing while there are still relations to process
//   while (nextIds.length > 0) {
//     relations = nextIds.map(dynamicId => {
//       return { dynamicId, relation: ["hasNetworkTreeBimObject"] };
//     });

//     results = await Promise.all(
//       lodash.chunk(relations, size).map(chunk => processChunk(chunk))
//     );

//     results = results.flat();
//     let newNodes: any[] = [];
//     results.forEach(e => {
//       if (Array.isArray(e.nodes) && e.nodes.some(node => node.type === "BIMObject")) {
//         newNodes.push(e);
//       }
//     });
//     // Remove nodes that are not of type "BIMObject" and prepare new relations
//     let listOfObjects: any[] = [];
//     newNodes.forEach(e => {
//       let newnodesFiltered = {
//         dynamicId: e.dynamicId,
//         nodes: [],
//       };
//       e.nodes.forEach(node => {
//         if (node.type === "BIMObject") {
//           newnodesFiltered.nodes.push(node);
//         }
//       });
//       listOfObjects.push(newnodesFiltered);
//     });

//     nextIds = listOfObjects.map(r => r.nodes.map(e => e.dynamicId)).flat();

//     // Concatenate the new nodes to the existing results
//     listOfObjects.forEach(obj => {
//       findAndAppendNodes(obj.dynamicId, realresult, obj.nodes);
//     });
//   }
//   return realresult;
// }

function findAndAppendNodes(
  dynamicId: number,
  nodes: any[],
  nodesToAdd: any[]
) {
  for (let node of nodes) {
    if (node.dynamicId === dynamicId) {
      // If the dynamicId matches, append nodesToAdd to the nodes array of this object
      if (!node.nodes) {
        node.nodes = [];
      }
      node.nodes = node.nodes.concat(nodesToAdd);
      return true;
    }
    // If the current node has children (nodes), recursively search within them
    if (node.nodes && node.nodes.length > 0) {
      if (findAndAppendNodes(dynamicId, node.nodes, nodesToAdd)) {
        return true;
      }
    }
  }
  return false;
}

export async function getAttributsMultiple(
  buildingId: string,
  dynamicIds: number[],
  size = 200
) {
  let apiRoute = "/api/v1/node/attribute_list_multiple";

  const promises = lodash
    .chunk(dynamicIds, size)
    .map((ids) => getAttributsMultipleRequest(buildingId, ids, apiRoute));

  return Promise.allSettled(promises).then((result) => {
    return result.reduce((list, { status, value }) => {
      if (status === "fulfilled") list.push(...value);
      return list;
    }, []);
  });
}

async function getAttributsMultipleRequest(
  buildingId: string,
  dynamicIds: string[],
  apiRoute: string
) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, apiRoute);
  let result = await spinalAPI.post<any>(url, dynamicIds);

  return result.data || [];
}

export async function readStaticDetailsMultiple(
  buildingId: string,
  dynamicIds: number[],
  size = 200
): Promise<IEquipmentItem[]> {
  const apiRoute = `/api/v1/equipment/read_static_details_multiple`;

  // Divide the dynamicIds into chunks and map each chunk to a request promise
  const promises = lodash
    .chunk(dynamicIds, size)
    .map((ids) => readStaticDetailsMultipleRequest(buildingId, ids, apiRoute));

  // Wait for all promises to settle, then collect results from the fulfilled promises
  return Promise.allSettled(promises).then((result) => {
    return result.reduce((list, { status, value }) => {
      if (status === "fulfilled") list.push(...value);
      return list;
    }, []);
  });
}

async function readStaticDetailsMultipleRequest(
  buildingId: string,
  dynamicIds: number[],
  apiRoute: string
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, apiRoute);
  let result = await spinalAPI.post(url, dynamicIds);
  return result.data || [];
}

export async function updateMultipleAttributes(
  buildingId: string,
  formattedData: any[],
  size = 200
): Promise<any[]> {
  const apiRoute = "/api/v1/node/attribute/update_multiple";

  // Divide the formattedData into chunks and map each chunk to a request promise
  const promises = lodash
    .chunk(formattedData, size)
    .map((dataChunk) =>
      updateMultipleAttributesRequest(buildingId, dataChunk, apiRoute)
    );

  // Wait for all promises to settle, then collect results from the fulfilled promises
  return Promise.allSettled(promises).then((result) => {
    return result.reduce((list, { status, value }) => {
      if (status === "fulfilled") list.push(...value);
      return list;
    }, []);
  });
}

async function updateMultipleAttributesRequest(
  buildingId: string,
  formattedDataChunk: any[],
  apiRoute: string
): Promise<any[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, apiRoute);

  try {
    const response = await spinalAPI.post<any[]>(url, formattedDataChunk);
    return response.data || [];
  } catch (error) {
    console.error("Error updating attributes:", error);
    throw error;
  }
}

export async function getFloorRef(
  platformId: string,
  floorDynId: number
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/floor/${floorDynId}/reference_Objects_list`
  );
  let result = await spinalAPI.get<IRefItem>(url);
  return result.data.infoReferencesObjects;
}

export async function getRoomsRef(
  platformId: string,
  roomDynId: number
): Promise<IEquipmentItem[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/room/${roomDynId}/reference_Objects_list`
  );
  let result = await spinalAPI.get<IRefItem>(url);
  return result.data.infoReferencesObjects;
}

// ////////////////// CONTEXT //////////////////////////

export async function getMultipleChildrenRelationContextNode(
  patrimoineId: string,
  buildingId: string,
  contextId: number,
  relations: { dynamicId: number; relation: any }[],
  size = 200
): Promise<IEquipmentItem[]> {
  let realresult: any[] = [];
  const spinalAPI = SpinalAPI.getInstance();
  // const apiRoute = `/api/v1/node/children_multiple`;
  const apiRoute = `/api/v1/context/${contextId}/node/children_multiple`;

  // Function to process each chunk of relations
  async function processChunk(
    chunkRelations: { dynamicId: number; relation: any }[]
  ) {
    const url = spinalAPI.createUrlWithPlatformId(buildingId, apiRoute);
    let body = chunkRelations.map(({ dynamicId, relation }) => ({
      dynamicId,
      relation,
    }));
    let result = await spinalAPI.post(url, body);
    return result.data;
  }

  // Process the initial chunk of relations
  let results = await Promise.all(
    lodash.chunk(relations, 200).map((chunk) => processChunk(chunk))
  );


  results = results.flat();
  // Extract next level dynamic IDs and filter for "BIMObject" type nodes
  let nextIds = results
    .map((r) => (Array.isArray(r.nodes) ? r.nodes.map((e) => e.dynamicId) : []))
    .flat();

  realresult = results.flat();
  realresult.forEach((item) => {
    if (Array.isArray(item.nodes)) {
      item.nodes = item.nodes.filter((node) => node.type === "BIMObject");
    } else {
      console.warn("item.nodes is not an array or is undefined", item);
    }
  });

  // Continue processing while there are still relations to process
  while (nextIds.length > 0) {
    relations = nextIds.map((dynamicId) => {
      return { dynamicId, relation: ["hasNetworkTreeBimObject"] };
    });

    results = await Promise.all(
      lodash.chunk(relations, size).map((chunk) => processChunk(chunk))
    );

    results = results.flat();
    let newNodes: any[] = [];
    results.forEach((e) => {
      if (
        Array.isArray(e.nodes) &&
        e.nodes.some((node) => node.type === "BIMObject")
      ) {
        newNodes.push(e);
      }
    });
    // Remove nodes that are not of type "BIMObject" and prepare new relations
    let listOfObjects: any[] = [];
    newNodes.forEach((e) => {
      let newnodesFiltered = {
        dynamicId: e.dynamicId,
        nodes: [],
      };
      e.nodes.forEach((node) => {
        if (node.type === "BIMObject") {
          newnodesFiltered.nodes.push(node);
        }
      });
      listOfObjects.push(newnodesFiltered);
    });
    nextIds = listOfObjects.map((r) => r.nodes.map((e) => e.dynamicId)).flat();

    // Concatenate the new nodes to the existing results
    listOfObjects.forEach((obj) => {
      findAndAppendNodes(obj.dynamicId, realresult, obj.nodes);
    });
  }
  return realresult;
}
