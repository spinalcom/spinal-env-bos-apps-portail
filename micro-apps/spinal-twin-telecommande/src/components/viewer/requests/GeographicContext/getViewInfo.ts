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

import { SpinalAPI } from '../SpinalAPI';
import { getSceneList, sceneDefaut } from '../BIM/sceneDefault';
import { getBIMFileContext } from '../BIM/BIMFileContext';
import { IPlayload } from '../../interfaces/IPlayload';
import { IConfig } from "../../../../interfaces/IConfig";
// import { config } from "../../../../config";
import { ActionTypes } from "../../../../interfaces/vuexStoreTypes";
import { MutationTypes } from "../../../../services/store/appDataStore/mutations";
import { store } from "../../../../services/store";

const Store = store;

export interface IViewInfoBody {
  dynamicId: number | number[];
  floorRef?: boolean;
  roomRef?: boolean;
  equipements?: boolean;
}

export interface IViewInfoRes {
  dynamicId: number;
  data: IViewInfoItemRes[];
}

export interface IViewInfoItemRes {
  bimFileId: string;
  dbIds: number[];
}
export interface IViewInfoTmpRes {
  bimFileId: string;
  dbIds: Set<number>;
}




export async function fetchAdditionalData(config: IConfig, buildingId: string): Promise<Map<string, any>> {
  //récupérer le tablette Id dans la route 
  let tabletteId = window.parent.routerFontion.apps[0]._route.query.spaceSelectedId

  //si il n'y a pas d'id va chercher dans la config
  if (tabletteId == undefined)
    tabletteId = store.state.appDataStore.appConfig.tabletteId


  const spinalAPI = SpinalAPI.getInstance();

  buildingId = undefined

  // récuperer la position de la tablette room floor
  // const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/equipment/${tabletteId}/get_position`);
  // let result = await spinalAPI.get<{ [key: string]: any[] }>(url);

  const GroupContextList = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/groupContext/list`);
  let resultGroupContextList = await spinalAPI.get<{ [key: string]: any[] }>(GroupContextList);

  const Idcommand = resultGroupContextList.data.find(group => group.name === store.state.appDataStore.appConfig.roomContext)?.dynamicId;

  const groupcontext = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/groupeContext/${Idcommand}/category_list`);
  let resultgroupcontext = await spinalAPI.get<{ [key: string]: any[] }>(groupcontext);

  const contextGroup = resultgroupcontext.data.find(group => group.name === store.state.appDataStore.appConfig.roomCat)?.dynamicId;


  const grpList = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/groupeContext/${Idcommand}/category/${contextGroup}/group_list`);
  let resultgrpList = await spinalAPI.get<{ [key: string]: any[] }>(grpList);


  const roomListPromises = resultgrpList.data.map(async (group) => {
    const roomListUrl = spinalAPI.createUrlWithPlatformId(
      buildingId,
      `/api/v1/roomsGroup/${Idcommand}/category/${contextGroup}/group/${group.dynamicId}/roomList`
    );
    return spinalAPI.get<{ [key: string]: any[] }>(roomListUrl);
  });

  let allRoomLists = await Promise.all(roomListPromises);

  const roomTablette = localStorage.getItem('room_tablette');
  const parentDynamicId = roomTablette // Dynamic ID de l'open space

  // Trouver l'index du matchingGroup
  let matchingGroupIndex = -1; // Initialisation de l'index
  const matchingGroup = allRoomLists.find((group, index) => {
    const found = group.data.some((room: any) => room.dynamicId == parentDynamicId);
    if (found) matchingGroupIndex = index; // Met à jour l'index si trouvé
    return found;
  });


  localStorage.setItem('room_tablette_name', resultgrpList.data[matchingGroupIndex].name);

  let filteredOpenSpaces;
  if (matchingGroup) {
    filteredOpenSpaces = {
      parentDynamicId,
      rooms: matchingGroup.data,
    };
  } else {
    filteredOpenSpaces = {
      parentDynamicId,
      rooms: [],
    };
  }


  const roomDetailsPromises = filteredOpenSpaces.rooms.map(async (room: any) => {
    const roomDetailsUrl = spinalAPI.createUrlWithPlatformId(
      buildingId,
      `/api/v1/node/${room.dynamicId}/children`
    );
    return spinalAPI.get<{ [key: string]: any[] }>(roomDetailsUrl);
  });

  let allRoomDetails = await Promise.all(roomDetailsPromises);


  store.commit(
    MutationTypes.SET_DATA_ROOM,
    {
      name: resultgrpList.data[matchingGroupIndex].name,
      rooms: filteredOpenSpaces.rooms.map((room: any) => ({
        dynamicId: room.dynamicId
      }))
    }
  );


  let allWorkPositions: any[][];

  //store.commit(MutationTypes.SET_PILOTABLE, roomInfos);

  let rawEquipments: { roomId: number, dynamicId: number, name: string }[] = [];

  let sols: number[] = [];
  let equipements: number[] = [];
  let equipementPilotable: any = []
  if (store.state.appDataStore.appConfig.show_equipements == "selected") {
    let allSelectedEquipements: any[] = [];

    for (const selection of store.state.appDataStore.appConfig.equipementSelections) {
      const listEquipmentgroup = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/equipementsGroup/list`);
      let resultlistEquipmentgroup = await spinalAPI.get<{ [key: string]: any[] }>(listEquipmentgroup);

      const DynamicIdContext = resultlistEquipmentgroup.data.find(group => group.name === selection.equipementContext)?.dynamicId;
      if (!DynamicIdContext) continue;

      const categoryEquipementGroup = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/equipementsGroup/${DynamicIdContext}/category_list`);
      let resultcategoryEquipementGroup = await spinalAPI.get<{ [key: string]: any[] }>(categoryEquipementGroup);
      const DynamicIdCategory = resultcategoryEquipementGroup.data.find(group => group.name === selection.equipementCat)?.dynamicId;
      if (!DynamicIdCategory) continue;


      const GroupList = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/equipementsGroup/${DynamicIdContext}/category/${DynamicIdCategory}/group_list`);
      let resultcGroupList = await spinalAPI.get<{ [key: string]: any[] }>(GroupList);
      const IdgrpList = resultcGroupList.data.find(group => group.name === selection.equipementsGroup)?.dynamicId;
      if (!IdgrpList) continue;


      const Equipement = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/equipementsGroup/${DynamicIdContext}/category/${DynamicIdCategory}/group/${IdgrpList}/equipementList`);
      let resultEquipement = await spinalAPI.get<{ [key: string]: any[] }>(Equipement);

      allSelectedEquipements.push(...resultEquipement.data);

      if (selection.isControlable) {

        equipementPilotable.push(
          ...resultEquipement.data.map(result => result.dynamicId)
        );
        console.warn('equipement controlage', equipementPilotable);

      }

    }

    allWorkPositions = allRoomDetails.flatMap((roomDetail: any, index: number) => {
      const roomId = filteredOpenSpaces.rooms[index]?.dynamicId;
      return roomDetail.data.filter((equipment: any) => {
        const isEquipement = allSelectedEquipements.some(
          (workPosition: any) => workPosition.dynamicId === equipment.dynamicId
        );
        const isSol = equipment.name && equipment.name.includes("Sol");

        if ((isEquipement || isSol) && roomId) {
          rawEquipments.push({
            roomId,
            dynamicId: equipment.dynamicId,
            name: equipment.name
          });
        }

        if (isEquipement) equipements.push(equipment.dynamicId);
        if (isSol) sols.push(equipment.dynamicId);

        return isEquipement || isSol;
      });
    });

  }
  else if (store.state.appDataStore.appConfig.show_equipements == "all") {
    allWorkPositions = allRoomDetails.flatMap((roomDetail: any, index: number) => {
      const roomId = filteredOpenSpaces.rooms[index]?.dynamicId;
      return roomDetail.data.map((equipment: any) => {
        const isSol = equipment.name && equipment.name.includes("Sol");

        if (roomId) {
          rawEquipments.push({
            roomId,
            dynamicId: equipment.dynamicId,
            name: equipment.name
          });
        }

        if (isSol) sols.push(equipment.dynamicId);
        else equipements.push(equipment.dynamicId);

        return equipment;
      });
    });

  } else {
    allWorkPositions = allRoomDetails.flatMap((roomDetail: any, index: number) => {
      const roomId = filteredOpenSpaces.rooms[index]?.dynamicId;
      return roomDetail.data.filter((equipment: any) => {
        const isSol = equipment.name && equipment.name.includes("Sol");

        if (isSol && roomId) {
          rawEquipments.push({
            roomId,
            dynamicId: equipment.dynamicId,
            name: equipment.name
          });
        }

        if (isSol) sols.push(equipment.dynamicId);

        return isSol;
      });
    });
  }



  const equipementDynamicIds = allWorkPositions.map(equipement => equipement.dynamicId);

  const static_details_multiple = spinalAPI.createUrlWithPlatformId(buildingId, '/api/v1/equipment/read_static_details_multiple');
  let result_static_details = await spinalAPI.post(static_details_multiple, equipementDynamicIds);

  // on remplace les arrays simples par des objets enrichis
  const solsFinal: { dynamicId: number, bimFileId: string, dbId: number, roomId: number }[] = [];
  const equipementsFinal: { dynamicId: number, bimFileId: string, dbId: number, roomId: number }[] = [];


  const groupedByBimFileIds: { bimFileId: string, dbIds: number[] }[] = [];

  result_static_details.data.forEach(item => {
    const match = rawEquipments.find(e => e.dynamicId === item.dynamicId);
    if (!match) return;

    const enriched = {
      dynamicId: item.dynamicId,
      bimFileId: item.bimFileId,
      dbId: item.dbid,
      roomId: match.roomId
    };

    if (match.name.includes("Sol")) {
      solsFinal.push(enriched);
    } else {
      equipementsFinal.push(enriched);
    }

    // groupedByBimFileIds comme avant
    let group = groupedByBimFileIds.find(g => g.bimFileId === item.bimFileId);
    if (!group) {
      group = { bimFileId: item.bimFileId, dbIds: [] };
      groupedByBimFileIds.push(group);
    }
    group.dbIds.push(item.dbid);
  });

  const roomInfos = {
    sols: solsFinal,
    equipements: equipementsFinal
  };

  store.commit(MutationTypes.SET_ROOM_REF, roomInfos);
  store.commit(MutationTypes.SET_PILOTABLE, equipementPilotable);
  return groupedByBimFileIds;

}

const buildingDefaultScenes = {};
let Add_value = null

export async function getViewInfo(buildingId: string, options: IViewInfoBody): Promise<IViewInfoRes[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, 'api/v1/geographicContext/viewInfo');

  if (Add_value == null) {
    Add_value = await fetchAdditionalData(store.state.appDataStore.appConfig, buildingId);
  }

  const modifiedOptions = {
    ...options,
    roomRef: true,
    floorRef: true,
    equipements: false, // désactivé ici mais tu gères les équipements manuellement ensuite
  };

  // Vérifie qu'un ID dynamique est fourni
  if (!modifiedOptions.dynamicId || modifiedOptions.dynamicId[0] == null) {
    return [];
  }

  let result = await spinalAPI.post<IViewInfoRes[]>(url, modifiedOptions);

  // Cas 1 : Afficher tout le bâtiment (config.showAllFloor == true)
  if (store.state.appDataStore.appConfig.showAllFloor) {
    if (Array.isArray(result.data[0].data)) {
      Add_value.forEach(item => {
        result.data[0].data.push(item);
      });
    }
    return result.data;
  }

  // Cas 2 : Afficher uniquement la pièce avec les équipements
  return [{
    dynamicId: result.data[0].dynamicId,
    data: Add_value
  }];
}


// export async function getViewInfo(buildingId: string, options: IViewInfoBody): Promise<IViewInfoRes[]> {

//   if (Add_value == null)
//     Add_value = await fetchAdditionalData(config, buildingId);

//   const modifiedOptions = {
//     ...options, // Conserve les autres propriétés
//     roomRef: true,
//     floorRef: true,
//     equipements: false,
//   };

//   if (modifiedOptions.dynamicId[0] == null)
//     return []

//   const spinalAPI = SpinalAPI.getInstance();
//   const url = spinalAPI.createUrlWithPlatformId(buildingId, 'api/v1/geographicContext/viewInfo');

//   let result = await spinalAPI.post<IViewInfoRes[]>(url, modifiedOptions);

//   const ensemble = [{
//     dynamicId: result.data[0].dynamicId,
//     data: Add_value

//   }]

//   return ensemble;
// }


// export async function getViewInfo(buildingId: string, options: IViewInfoBody): Promise<IViewInfoRes[]> {

//   if (Add_value == null)
//     Add_value = await fetchAdditionalData(config, buildingId);

//   const modifiedOptions = {
//     ...options, // Conserve les autres propriétés
//     roomRef: true,
//     floorRef: true,
//     equipements: false,
//   };

//   if (modifiedOptions.dynamicId[0] == null)
//     return []

//   const spinalAPI = SpinalAPI.getInstance();
//   const url = spinalAPI.createUrlWithPlatformId(buildingId, 'api/v1/geographicContext/viewInfo');

//   let result = await spinalAPI.post<IViewInfoRes[]>(url, modifiedOptions);

//   console.warn(result);

//   if (Array.isArray(result.data[0].data)) {
//     Add_value.forEach(item => {
//       result.data[0].data.push(item);
//     });
//   }

//   return result.data;
// }

export function mergeIViewInfoTmpRes(resBody: IViewInfoTmpRes[], bimFileId: string, dbId: number): void {
  let found = false;
  for (const item of resBody) {
    if (item.bimFileId === bimFileId) {
      found = true;
      item.dbIds.add(dbId);
      break;
    }
  }

  if (found === false) {
    resBody.push({
      bimFileId,
      dbIds: new Set([dbId]),
    });
  }
}

export function mergeIViewInfo(resBody: IViewInfoTmpRes[], sources: IViewInfoItemRes[]): void {
  for (const source of sources) {
    for (const dbIds of source.dbIds) {
      mergeIViewInfoTmpRes(resBody, source.bimFileId, dbIds);
    }
  }
}


export async function getViewInfoFormatted(buildingId: string, res: IViewInfoTmpRes[], floor: IPlayload) {
  const defaultScene = await getDefaultOrFirstScene(buildingId);

  const models = await getAndFormatModels(buildingId, res, floor.dynamicId as any);
  const data = {
    item: floor,
    buildingId: buildingId,
    loadingType: defaultScene.sceneAlignMethod,
    models
  }

  return data;
}


export async function getAndFormatModels(buildingId: string, res: IViewInfoTmpRes[], floorId: string) {
  const obj = convertViewerInfoToObj(res);
  const bimFiles = await getBIMFileContext(buildingId);

  return bimFiles.reduce((list, itm) => {
    const dbids = obj[itm.staticId];
    if (dbids) {
      list.push({
        bimFileId: itm.staticId,
        id: floorId,
        name: itm.name,
        path: getPath(itm),
        aecPath: getAecPath(itm),
        dbids
      })
    }

    return list;

  }, [])
}

export async function getDefaultOrFirstScene(buildingId: string) {

  if (!buildingDefaultScenes[buildingId]) {
    const spinalAPi = SpinalAPI.getInstance();
    let def = await sceneDefaut(spinalAPi, buildingId);
    if (!def || Object.keys(def || {}).length === 0) def = await getFirstScene(spinalAPi, buildingId);

    buildingDefaultScenes[buildingId] = def;
  }

  return buildingDefaultScenes[buildingId];
}


async function getFirstScene(spinalAPi: SpinalAPI, buildingId: string) {
  const sceneList = await getSceneList(spinalAPi, buildingId);
  return sceneList?.scenes[0];
}

// export async function getAndFormatModels(res: IViewInfoTmpRes[]) {
//   return res.map((it: IViewInfoTmpRes) => {
//     console.log(it);
//     return {
//       id: it.bimFileId,
//       dbIds: Array.from(it.dbIds),
//     };
//   });
// }

export function convertViewerInfoToObj(res: IViewInfoTmpRes[]) {
  return res.reduce((obj, item) => {
    obj[item.bimFileId] = item.dbIds;
    return obj;
  }, {})
}

function getPath(itm: any) {
  const path: string = itm.items[0]?.path || "";

  return path.replace("/html/viewerForgeFiles", "");
}

function getAecPath(itm: any) {
  const path: string = itm.items[0]?.aecPath || "";

  return path.replace("/html/viewerForgeFiles", "");
}