import { HTTP } from "./http-constants";
import io from 'socket.io-client';
import config from './../config'
import { forEach, get } from "lodash";

let count = 0;
export let tab = [];

const options = { auth: { clientId: "XXX", secretId: "XXX" }, transports: ["websocket"] }
// const socket = io("https://api-demo-spinal-tower.spinalcom.com", options);
const socket = io("http://51.91.214.36:19056", options);
socket.on("connect", () => {
  // tab = [];
  getequipementGroup(config.config.GroupingCategory, config.config.BIMObjectGroup, config.config.Context)
  console.log("la connexion au serveur a été établie avec succès")
});
socket.on("disconnect", (reason) => { console.log("Déconnexion du serveur pour la raison :", reason) });
socket.on("connect_error", (err) => { console.log(err.message) });
 
function subscribe(elementsToSubscribe) {
  console.log('subscribe');
  const requestOptions = {
    subscribeChildren: true,
    subscribeChildScope: "tree_not_in_context",
    
  };

  socket.emit.apply(socket, ["subscribe", ...elementsToSubscribe, requestOptions]);

  socket.on("subscribed", (result) => {
    // console.log('subscribe',result);
    if (!Array.isArray(result)) result = [result];
    result.map(({ error, eventNames }) => {
      if (error) {
        console.error(error);
        return;
      }
      eventNames.forEach(eventName => {
        socket.on(eventName, onChangeCallback)
      });
    });
  })

  function onChangeCallback(data) {
    console.log('l');
    console.log('data',data); 
    let element = {};
    let existingElement = tab.find((e) => e.dynamicId == data.data.subscription_data[0].nodeId);
    if (existingElement) {
      element = Object.assign({}, existingElement);
    }
    for (let endpoint of config.config.headers) {
      if (data.data.node.element?.name === endpoint.value) {
        element[endpoint.value] = data.data.node.element.currentValue;
        break;
      }
    }
    let index = tab.findIndex((e) => e.dynamicId == data.data.subscription_data[0].nodeId);
    if (index === -1) {
      tab.push(element);
    } else {
      tab.splice(index, 1, element);
    }
  }
}

async function getDataEquipement() {

  // console.log(count);
  if (count == 0) {


    for (const [index, objet] of tab.entries()) {
      const dynamicId = objet.dynamicId;
      // console.log('Élément actuel de tab:', objet); // Afficher l'élément actuel de tab
      try {
        const response = await HTTP.get(`/node/${dynamicId}/control_endpoint_list`);
        // console.log(response);
        // const { endpoints } = response.data[0];
        // console.log('response.data.lenght',response.data.length);
        for (i = 0; i < response.data.length; i++) {
          const { endpoints } = response.data[i]
          for (const endpoint of endpoints) {
            for (const header of config.config.headers) {
              if (header.value == endpoint.name) {
                objet[header.value] = endpoint.currentValue;
                // console.log('Valeur actuelle de l\'endpoint:', endpoint.currentValue);
              }
            }
          }
        }
        // console.log(tab[index]);
        // Vérifier les correspondances entre les endpoints et les headers

        tab.splice(index, 1, objet);
      } catch (error) {
        console.error(error);
      }
    }
    count ++;
  }
}


export async function getequipementGroup(ApiGroupingCategory, ApiBIMObjectGroup, ApiContext) {
  const context = await HTTP.get(`/context/list`);
  const idContext = context.data.find(children => children.name === ApiContext)?.dynamicId; //va chercher si il y a le nom du context
  if (!idContext) return;
  const equipement = await HTTP.get(`/context/${idContext}/tree`);
  const groupingCategory = equipement.data.children.find(child => child.name === ApiGroupingCategory);//va chercher ou le est = ApiGroupingCategory (ubigreen)
  if (!groupingCategory) return;
  const bimObjectGroup = groupingCategory.children.find(child => child.name === ApiBIMObjectGroup);//grp All
  if (!bimObjectGroup) return;
  const elementsToSubscribe = [];
  // bimObjectGroup.children.length;
  let nbEquipement = bimObjectGroup.children.length; 
  if (count == 0) {
    for (let i = 0; i < nbEquipement; i++) {
      let element = {
        name: bimObjectGroup.children[i].name,
        dynamicId: bimObjectGroup.children[i].dynamicId
      };
      tab.push(element) 
    }
    // count++;
  }
  for (let i = 0; i < nbEquipement; i++) {
    const oneElement = bimObjectGroup.children[i];
    elementsToSubscribe.push(`${idContext}/${oneElement.dynamicId}`);
  }

  await getDataEquipement();
  subscribe(elementsToSubscribe);
}

export async function getBuildingName(id_batiment) {
  let building = await HTTP.get(`/building/read`);
  return building.data.name
}
