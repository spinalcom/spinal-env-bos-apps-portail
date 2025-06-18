



import { SpinalAPI } from "./spinalAPI/SpinalAPI"
// import { config } from '../../config'
import * as lodash from 'lodash'
import { store } from './store'
import { MutationTypes } from "./store/appDataStore/mutations";
import { IContext, ICategory, IGroup, ItemInGroup, ItemPositon } from "../interfaces/IGetAllBuildingsRes";
import { ISpaceSelectorItem } from "../components/SpaceSelector/index";
import { IConfig } from "../interfaces/IConfig";



export async function getBuilding() {
  const buildingId = localStorage.getItem("idBuilding");
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId!, `/api/v1/building/read`);
  const result = await spinalAPI.get(url);
  
  // const result = await HTTP.get(`building/read`);
  return result.data;
}

async function getReadStaticdetailsMultiple(buildingId: string, dynamicIds: number[]) {
  const spinalAPI = SpinalAPI.getInstance();
  store.commit(MutationTypes.SET_LOADER, true)
  store.commit(MutationTypes.SET_LOADING, {
    total: dynamicIds.length,
    
    message: `Récupération des controls point`,
  })
  console.log("type: ", store.state);
  let type = (store.state.appDataStore.appConfig.entryPoint && store.state.appDataStore.appConfig.entryPoint.type) ?? store.state.appDataStore.context.type;
  if(type !== "equipement" && type !== "room") {
    const test = type.includes("BIMObject");
    test ? type = "equipement" : type = "room";
  }
  const url = type === "equipement" ? `/api/v1/equipment/read_static_details_multiple` : `/api/v1/room/read_static_details_multiple`;
  const res = await sendListMultipleRequest(buildingId, dynamicIds, url)
  store.commit(MutationTypes.SET_LOADER, false)
  return res;
}


export async function getAttributeListMultiple(buildingId: string, dynamicIds: number[]) {
  const urlatt = `/api/v1/node/attribute_list_multiple`;
  const attributeList = await sendListMultipleRequest(buildingId, dynamicIds, urlatt);  
  // Si aucun attribut n'est retourné, renvoyer un tableau vide 
  if (attributeList.length === 0) {
      return [];
  }
  
  let attribut: any = [];
 
  
  // Parcours des attributs récupérés
  for (const attribute of attributeList) {
      // On parcourt les catégories d'attributs
      const category = attribute.categoryAttributes.map((el: any) => {
        const sources = store.state.appDataStore.appConfig.sources.find((src) => src.type === "attribute");
        
          if (el.name === sources?.categoryName) {
              // Vérification si 'a    console.log("data.groupItems", equipement );
              
              if (!el.attributs || !Array.isArray(el.attributs)) {
                return null;
                
              }
              
              
              
              const nameAttribut = el.attributs.find((attr: any) => attr.label.toString().toLowerCase() === sources?.name.toLocaleLowerCase());

              if (nameAttribut) {
               
                  const value = {
                    dynamicId: attribute.dynamicId,
                    attribute: nameAttribut,
                  }
                  return value;
              }
          }
          return null; 
      }).filter(Boolean);

      if (category.length > 0) {
          attribut.push(...category);
      }
  }
  
  return {attribut, attributList : attribut};
}


export async function getControlpointList(buildingId: string, item: any[]) {
  const spinalAPI = SpinalAPI.getInstance();
  const dynamicIds = item.map((el) => el.dynamicId);

  const url = `/node/control_endpoint_list_multiple`;
  const res: any = await sendListMultipleRequest(buildingId, dynamicIds, url);

  const type = "controlPoint";
  const sources = store.state.appDataStore.appConfig.sources.filter(
    (src) => src.type.toLowerCase() === type.toLowerCase()
  );
  const data = item.map((el) => {
    let endpoints: any[] = [];

    for (const ctl of res) {
      for (const controlpoint of ctl) {
        if (controlpoint.dynamicId === el.dynamicId) {
          for (const src of sources) {
            if (src.profileName === controlpoint.profileName) {
              // Récupérer tous les endpoints qui correspondent
              const matchingItems = controlpoint.endpoints
                .filter((match: any) => match.name === src.name); 

              endpoints.push(...matchingItems);
            }
          }
        }
      }
    }

    return {
      ...el,
      endpoints: endpoints.length > 0 ? endpoints : undefined, 
    };
  });  
  return data;
}

export async function getData(buildingId: string, config: IConfig, space: ISpaceSelectorItem){
  const context_name = config.entryPoint.context;
  
  const category_name = config.entryPoint.category;
  
  const groups: string[] = config.entryPoint.group
  // if(!context || !category_store || !group_store) {
  if(space.type === "geographicBuilding") {

    const rq = (await getContextList(buildingId)).find((el) => el.name === context_name) as {dynamicId: number, name: string};
    const rqC = await getCategoryList(buildingId, rq.dynamicId);
    const category = await rqC.find((el) => el.name === category_name);
    const rqG = await getGroupList(buildingId, rq.dynamicId, category.dynamicId);
    console.log("group List: ", rqG);
    const groupList: IGroup[] = rqG.filter((el: IGroup) => groups.includes(el.name))
    const groupItems = await getGroupAllItem(buildingId, rq.dynamicId, category.dynamicId, groupList.map((grp) => grp.dynamicId));
     const finalData =  groupItems.map((el: any) => {
        const itemGroup = groupList.find((item: any) => item.dynamicId === el.group);
        return {
          group: {
              name: itemGroup.name,
              type: itemGroup.type,
              dynamicId: itemGroup.dynamicId,
          },
          name: el.name,
          type: el.type,
          dynamicId: el.dynamicId,
        }
    
    }
    )
    return finalData.flat();
  }
  else {
    console.log("groups: ", groups)
     const dataItem = await getInventory(buildingId, space.dynamicId, config.entryPoint.context, config.entryPoint.category, groups);
     console.log('dataItem:', dataItem)
      const finalData =  dataItem.map((el: any) => {
       return el.groupItems.map((item: any) => {
        return {
          group: {
              name: el.name,
              type: el.type,
              dynamicId: el.dynamicId,
          },
          name: item.name,
          type: item.type,
          dynamicId: item.dynamicId,
        }
       });
    })
    return finalData.flat();
  }
  // }
  // else {
  //   const response = await getGroupAllItem(buildingId, category_store.dynamicId, category_store.dynamicId, group_store.dynamicId);
  //   return response;
  // }

 


  // const categoryName = config.entryPoint?.category ?? store.state.appDataStore.categoriesContext.name;
  // const category = await rqC.find((el) => el.name === categoryName);
  // const rqG = await getGroupList(buildingId, context.dynamicId, category.dynamicId);
  // const groupName = config.entryPoint?.group ?? store.state.appDataStore.groupEquipement;
  // const group = rqG.find((el) => el.name === groupName) 
  // const groupItems = await getGroupItems(buildingId, context.dynamicId, category.dynamicId, group.dynamicId);
  // return groupItems;
}

export async function getContext(buildingId: string) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/groupContext/list`);
  const res = await spinalAPI.get(url);
  const context = res.data.filter(el => el.type === "geographicRoomGroupContext"  || el.type === "BIMObjectGroupContext")
  return context;
}

async function getContextList(buildingId: string): Promise<any[]> {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/groupContext/list`);
  const res = await spinalAPI.get(url);
  return res.data;
}


export async function getCategoryList(buildingId: string, contextId: number){
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/groupeContext/${contextId}/category_list`);
  const res = await spinalAPI.get(url);
  return res.data;
}


export async function getGroupList(buildingId: string, contextId: number, categoryId: number)  {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, `/api/v1/groupeContext/${contextId}/category/${categoryId}/group_list`);
  const res = await spinalAPI.get(url);
  return res.data;
}

export async function getGroupAllItem(buildingId: string, contextId: number, categoryId: number, grouIds: number[]) {
  const spinalAPI = SpinalAPI.getInstance();
  let type = store.state.appDataStore.appConfig.entryPoint?.type ?? store.state.appDataStore.context.type;
  if(type !== "equipement" && type !== "room") {
    const test = type.includes("BIMObject");
    test ? type = "equipement" : type = "room";
  }

  const promise = grouIds.map(async (groupID) =>{
      const url_group = type === "equipement" ? `/api/v1/equipementsGroup/${contextId}/category/${categoryId}/group/${groupID}/equipementList` : `/api/v1/roomsGroup/${contextId}/category/${categoryId}/group/${groupID}/roomList`;
      const groupItems = await spinalAPI.get(spinalAPI.createUrlWithPlatformId(buildingId, url_group));
      const group = grouIds.find((el: any) => el === groupID);
       // Intègré le groupe à chaque item
  const itemsWithGroup = groupItems.data.map((item: any) => ({
    ...item,
    group
  }));

  return itemsWithGroup;
});
const result = await Promise.all(promise);

const allItems = result.flat();
return allItems;
}
export async function getGroupAllData(buildingId: string, group: IGroup[], space: ISpaceSelectorItem) {
  // if(config.entryPoint) {
  //   const context_alt = config.entryPoint?.context;
  //   // Récuperation de la liste des contextes
  //   const dataContext = await getContextList(buildingId);
  //   // Récuperation du contexte correspondant
  //   const context = dataContext.find((el) => el.name === context_alt);
  //   // Récuperation de la liste des categories
  //   const dataCategory = await getCategoryList(buildingId, context.dynamicId);
  //   const category_alt = config.entryPoint?.category;
  //   // Récuperation de la categorie correspondante
  //   const category = dataCategory.find((el) => el.name === category_alt);
  //   // Récuperation de la liste des groupes
  //   const dataGroup = await getGroupList(buildingId, context.dynamicId, category.dynamicId);
  //   // Récuperation du groupe correspondant
  //   const group_alt = config.entryPoint?.group;    
  //   const group = dataGroup.find((el) => el.name === group_alt);

  //   //  Récuperation de tous les items du groupe 
    

  // }

  if(space.type === "geographicBuilding") { 
    const context = store.state.appDataStore.context;
    const category = store.state.appDataStore.categoriesContext;
    const groups = store.state.appDataStore.groupEquipement;

    const dataItem = await getGroupAllItem(buildingId, context.dynamicId, category.dynamicId, groups.map((el: IGroup) => el.dynamicId));
    const finalData =  dataItem.map((el: any) => {
        const itemGroup = groups.find((item: any) => item.dynamicId === el.group);
        return {
          group: {
              name: itemGroup.name,
              type: itemGroup.type,
              dynamicId: itemGroup.dynamicId,
          },
          name: el.name,
          type: el.type,
          dynamicId: el.dynamicId,
        }
    
    }
    )
    return finalData.flat();

  }
  else  {
    const context = store.state.appDataStore.context?.name;
    const category = store.state.appDataStore.categoriesContext?.name;
    const groups = store.state.appDataStore.groupEquipement.map((el: IGroup) => el.name);
 
    const dataItem = await getInventory(buildingId, space.dynamicId,  context, category, groups);
    const finalData =  dataItem.map((el: any) => {
       return el.groupItems.map((item: any) => {
        return {
          group: {
              name: el.name,
              type: el.type,
              dynamicId: el.dynamicId,
          },
          name: item.name,
          type: item.type,
          dynamicId: item.dynamicId,
        }
       });
    })
    return finalData.flat();
  }

}









export async function getAllDataInContextSpatial(buildingId: string, space: ISpaceSelectorItem, group: IGroup[]) {
  const data = await getGroupAllData(buildingId, group ,  space);
  store.commit(MutationTypes.SET_LOADER, true)

 
 
     const dynamicIds = data.map((el) => el.dynamicId);
     let itemPosition: ItemPositon[] = [];
     if(space.type === "geographicBuilding") {
      itemPosition = await getPositionMultiple(buildingId, dynamicIds);
     }



     const read = await getReadStaticdetailsMultiple(buildingId, dynamicIds);
    let attributList: any = [];
    let contropointList: any = [];
    
     const finaldata = read.map((el: any) => {
      if(!attributList.includes(el)){
        attributList.push(el);
      }
      if(!contropointList.includes(el.dynamicId)){
        contropointList.push(el);
      }

        const group = data.find((grp: any) => grp.dynamicId === el.dynamicId);
     
        let floorName = "";
        if(space.type === "geographicBuilding") {
          const itemPositionFind = itemPosition.find((item) => item.dynamicId === el.dynamicId);
          if(itemPositionFind && itemPositionFind.info && itemPositionFind.info.floor) {
            floorName = itemPositionFind.info.floor.name;
          }
          else {
            floorName = space.name;
          }

        }
        else {
          space.type === "geographicFloor" ? floorName = space.name : floorName = "undefined";
        }
        return {
       
            attributs: el.attributsList.map((item: any) => {
               return {
                name: item.name,
                dynamicId: item.dynamicId,
                attributs: item.attributs.map((attrs: any) => {
                  return {
                    name: attrs.label,
                    dynamicId: attrs.dynamicId,
                    value: attrs.value ? attrs.value : "non défini",
                    unit: attrs.unit ? attrs.unit : "",
                  }
                })
               }
            }),
            controlEndpoint: el.controlEndpoint.map((ctl: any ) => {
              return {
                profileName: ctl.profileName,
                endpoints: ctl.endpoints.map((end: any) => {
                  return {
                    name: end.name,
                    dynamicId: end.dynamicId,
                    value: end.value ? end.value : "non défini",
                    unit: end.unit ? end.unit : "",
                  }
                })
              }
            }),
            name : el.name,
            dynamicId: el.dynamicId,
            type: el.type,
            floor: floorName,
            group: group.group.name,
            groupDynamicId: group.group.dynamicId,
        
       
          
          

        }


     });

     const finalListattr = attributList.map((el: any) => {
  if (el.attributsList) {
    return el.attributsList.map((attr: any) => {
      return {
        name: attr.name,
        dynamicId: attr.dynamicId,
        children: attr.attributs.map((attrs: any) => ({
          name: attrs.label,
          dynamicId: attrs.dynamicId
        }))
      };
    });
  }
  return []; // Retourner un tableau vide si pas d'attributsList
}).flat(); // Aplatis les tableaux imbriqués en un seul niveau

      let ctl_dynamicId = 0;
     const finalListct = contropointList.map((el: any) => {
       if(el.controlEndpoint) {
         return el.controlEndpoint.map((ctl: any) => {
            ctl_dynamicId++;
            return {
              name: ctl.profileName,
              dynamicId: ctl_dynamicId,
              children: ctl.endpoints.map((end: any) => {
                return {
                  name: end.name,
                  dynamicId: end.dynamicId,
                  value: end.value ? end.value : "undefined",
                  unit: end.unit ? end.unit : "",
                }
              })
            }
          })
        }
     }).flat(); // Aplatis les tableaux imbriqués en un seul niveau
     const finalAttributs = mergeAttributesByName(finalListattr);
    const finalControlPoint = mergeAttributesByName(finalListct);

     console.log("final attributs: ", finalAttributs);
     console.log("final control point: ", finalControlPoint);
    
     
     return {
      data: finaldata,
      sources: [...finalAttributs, ...finalControlPoint],
     };

  
} 



function mergeAttributesByName(attributes: any[]) {
  const map = new Map<string, any>()

  for (const attr of attributes) {
    const existing = map.get(attr.name)

    if (existing) {
      // Fusionner les enfants en évitant les doublons par `name`
      const childMap = new Map<string, any>()

      for (const child of existing.children) {
        childMap.set(child.name, child)
      }

      for (const child of attr.children) {
        if (!childMap.has(child.name)) {
          childMap.set(child.name, child)
        }
      }

      existing.children = Array.from(childMap.values())
    } else {
      // Ajouter une copie de l'attribut
      map.set(attr.name, {
        ...attr,
        children: [...attr.children],
      })
    }
  }

  return Array.from(map.values())
}



async function getInventory(buildingId, floorId, context: string, category: string, group: string[]) {
  const spinalApi = SpinalAPI.getInstance();
  const url = spinalApi.createUrlWithPlatformId(buildingId, `/api/v1/floor/${floorId}/inventory`);
  const response = await spinalApi.post(url, {
    context: context,
    category: category,
    groups: group,
  });
  const data = response.data;
  return data;

}





async function getGroupItems(buildingId: string, contextId: number, categoryId: number, groupId: number): Promise<ItemInGroup[]> {
  const spinalAPI = SpinalAPI.getInstance();
  let type = store.state.appDataStore.appConfig.entryPoint?.type ?? store.state.appDataStore.groupEquipement.type;
  if(type !== "equipement" && type !== "room") {
    const test = type.includes("BIMObject");
    test ? type = "equipement" : type = "room";
  }
  const url = type === "equipement" ? `/api/v1/equipementsGroup/${contextId}/category/${categoryId}/group/${groupId}/equipementList` : `/api/v1/roomsGroup/${contextId}/category/${categoryId}/group/${groupId}/roomList`;
  const res = await spinalAPI.get(spinalAPI.createUrlWithPlatformId(buildingId, url));
  return res.data as ItemInGroup[];
}


export async function getDataInContextSpatial(buildingId: string, space: ISpaceSelectorItem, config: IConfig) {
  console.log("space selected: ", space)
    const data = await getData(buildingId, config, space);
    store.commit(MutationTypes.SET_LOADER, true)
     
     const dynamicIds = data.map((el) => el.dynamicId);
     let itemPosition: ItemPositon[] = [];
     if(space.type === "geographicBuilding") {
      itemPosition = await getPositionMultiple(buildingId, dynamicIds);
     }



     const read = await getReadStaticdetailsMultiple(buildingId, dynamicIds);
    let attributList: any = [];
    let contropointList: any = [];
    
     const finaldata = read.map((el: any) => {
      if(!attributList.includes(el)){
        attributList.push(el);
      }
      if(!contropointList.includes(el.dynamicId)){
        contropointList.push(el);
      }

        const group = data.find((grp: any) => grp.dynamicId === el.dynamicId);
     
        let floorName = "";
        if(space.type === "geographicBuilding") {
          const itemPositionFind = itemPosition.find((item) => item.dynamicId === el.dynamicId);
          if(itemPositionFind && itemPositionFind.info && itemPositionFind.info.floor) {
            floorName = itemPositionFind.info.floor.name;
          }
          else {
            floorName = space.name;
          }

        }
        else {
          space.type === "geographicFloor" ? floorName = space.name : floorName = "undefined";
        }
        return {
       
            attributs: el.attributsList.map((item: any) => {
               return {
                name: item.name,
                dynamicId: item.dynamicId,
                attributs: item.attributs.map((attrs: any) => {
                  return {
                    name: attrs.label,
                    dynamicId: attrs.dynamicId,
                    value: attrs.value ? attrs.value : "non défini",
                    unit: attrs.unit ? attrs.unit : "",
                  }
                })
               }
            }),
            controlEndpoint: el.controlEndpoint.map((ctl: any ) => {
              return {
                profileName: ctl.profileName,
                endpoints: ctl.endpoints.map((end: any) => {
                  return {
                    name: end.name,
                    dynamicId: end.dynamicId,
                    value: end.value ? end.value : "non défini",
                    unit: end.unit ? end.unit : "",
                  }
                })
              }
            }),
            name : el.name,
            dynamicId: el.dynamicId,
            type: el.type,
            floor: floorName,
            group: group.group.name,
            groupDynamicId: group.group.dynamicId,
        
       
          
          

        }


     });

     const finalListattr = attributList.map((el: any) => {
  if (el.attributsList) {
    return el.attributsList.map((attr: any) => {
      return {
        name: attr.name,
        dynamicId: attr.dynamicId,
        children: attr.attributs.map((attrs: any) => ({
          name: attrs.label,
          dynamicId: attrs.dynamicId
        }))
      };
    });
  }
  return []; // Retourner un tableau vide si pas d'attributsList
}).flat(); // Aplatis les tableaux imbriqués en un seul niveau

      let ctl_dynamicId = 0;
     const finalListct = contropointList.map((el: any) => {
       if(el.controlEndpoint) {
         return el.controlEndpoint.map((ctl: any) => {
            ctl_dynamicId++;
            return {
              name: ctl.profileName,
              dynamicId: ctl_dynamicId,
              children: ctl.endpoints.map((end: any) => {
                return {
                  name: end.name,
                  dynamicId: end.dynamicId,
                  value: end.value ? end.value : "non défini",
                  unit: end.unit ? end.unit : "",
                }
              })
            }
          })
        }
     }).flat(); // Aplatis les tableaux imbriqués en un seul niveau
     const finalAttributs = mergeAttributesByName(finalListattr);
    const finalControlPoint = mergeAttributesByName(finalListct);

     console.log("final attributs: ", finalAttributs);
     console.log("final control point: ", finalControlPoint);
    
     
     return {
      data: finaldata,
      sources: [...finalAttributs, ...finalControlPoint],
     };
} 

async function getPositionMultiple(buildingId: string, dynamicIds: number[]): Promise<ItemPositon[]> {
  const spinalAPI = SpinalAPI.getInstance();
  let type = store.state.appDataStore.appConfig.entryPoint?.type ?? store.state.appDataStore.context.type;
  if(type !== "equipement" && type !== "room") {
    const test = type.includes("BIMObject");
    test ? type = "equipement" : type = "room";
  }


  const url = type === "equipement" ? `/api/v1/equipment/get_position_multiple`: `/api/v1/room/get_position_multiple`;
  const message = type === "equipement" ? "Détection des emplacements des équipements" : " Détection des positions des pièces";
  store.commit(MutationTypes.SET_LOADING, {
    message: message,
  });
  const res = await sendListMultipleRequest(buildingId, dynamicIds, url);
  return res as ItemPositon[];
 }



 async function sendListMultipleRequest(
  buildingId: string,
  dynamicIds: number[],
  argUrl: string,
  size: number = 200
) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, argUrl);

 
  const total = dynamicIds.length;

  // Initialisation de l'état du loader dans le store
  store.commit(MutationTypes.SET_LOADING, {
    total,  // Total d'IDs à traiter
    completed: 0,  // Initialisation du nombre d'IDs traités à 0
    percent: 0,  // Pourcentage initial à 0
    isError: false,
    logs: [],  // Initialisation des logs
  });

  // Découper dynamicIds en chunks de la taille spécifiée
  const chunked = lodash.chunk(dynamicIds, size);
  let completed = 0;  // Nombre d'IDs traités
  let results: any[] = [];
  const logs: { chunk: number; status: 'success' | 'error'; message: string }[] = [];

  // Création des promesses pour chaque chunk
  const promises = chunked.map(async (ids, index) => {
    try {
      const response = await spinalAPI.post<any>(url, ids);
      if (response.status === 200 || response.status === 206) {
        // Si la requête réussit, on ajoute les données aux résultats
        results.push(...response.data);
        // Ajouter un log de succès
        logs.push({ chunk: index + 1, status: 'success', message: `Chunk ${index + 1} traité avec succès` });
      } else {
        // Log pour le chunk échoué
        logs.push({ chunk: index + 1, status: 'error', message: `Chunk échoué avec le statut ${response.status}` });
      }
    } catch (error) {
      // Log en cas d'erreur
      logs.push({ chunk: index + 1, status: 'error', message: `Chunk échoué` });
      store.commit(MutationTypes.SET_LOADING, {
        isError: true,
        message: `Erreur sur le chunk ${index + 1}`,
      });
    }

    // Mise à jour de la progression après chaque chunk
    completed += ids.length;  // On ajoute le nombre d'IDs traités dans ce chunk
    const percent = Math.round((completed / total) * 100);  // Pourcentage de progression

    // Mise à jour de l'état du loader
    store.commit(MutationTypes.SET_LOADING, {
      completed,
      percent,
      logs: [...logs],  // Mise à jour des logs
    });
  });

  // Attendre que toutes les promesses soient résolues
  await Promise.all(promises);
  
  // Après le traitement de tous les chunks, on met à jour l'état du loader pour indiquer que tout est terminé
  store.commit(MutationTypes.SET_LOADING, {
    completed: 0,  // Le nombre total d'IDs est maintenant traité
    percent: 0,  // Le pourcentage est maintenant à 100%
    total: 0,
    message: `Compiltation des données`,
    isError: false,
    logs: [...logs],  // On affiche tous les logs finaux
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));  // Attendre 1 seconde avant de mettre à jour l'état
  store.commit(MutationTypes.SET_LOADER, false);  // On cache le loader

  return results;
}

 

 export function parseRegex(value: any) {
  const match = value.match(/^\/(.*)\/([gimuy]*)$/);
  if(match) {
    const pattern = match[1].replace(/\\\\/g, "\\")
    const flags = match[2];
    const regex = new RegExp(pattern, flags);
    return regex;
  } 
  else {
    return new RegExp(value);
  }
 }