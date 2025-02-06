import { HTTP } from "./http-constants";
import { HOST } from "./http-constants";
import io from 'socket.io-client';
import config from './../config'


let count = 0;
export let tab = [];

const options = { auth: { clientId: "XXX", secretId: "XXX" }, transports: ["websocket"] }
const socket = io(HOST, options);

if (config.config.enableWebSocket == true) {
  socket.on("connect", () => {
    getDataApi(config.config.groupingCategory, config.config.bimObjectGroup, config.config.context)
    console.log("la connexion au serveur a été établie avec succès")
  });
  socket.on("disconnect", (reason) => { console.log("Déconnexion du serveur pour la raison :", reason) });
  socket.on("connect_error", (err) => { console.log(err.message) });
} else {
  getDataApi(config.config.groupingCategory, config.config.bimObjectGroup, config.config.context)
}

socket.on("subscribed", (result) => {
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

function subscribe(elementsToSubscribe) {
  alreadysubscribe = true;
  const requestOptions = {
    subscribeChildren: true,
    subscribeChildScope: "tree_not_in_context",
  };
  socket.emit.apply(socket, ["subscribe", ...elementsToSubscribe, requestOptions]);
}

export async function getDataApi(ApiGroupingCategory, ApiBIMObjectGroup, ApiContext) {
  // let valeur = "rom"
  const context = await HTTP.get(`/groupContext/list`);
  const idContext = context.data.find(children => children.name === ApiContext)?.dynamicId;
  if (!idContext) return;
  const category = await HTTP.get(`/groupeContext/${idContext}/category_list`);
  const idCategory = category.data.find(child => child.name === ApiGroupingCategory)?.dynamicId;
  if (!idCategory) return;
  const groupe = await HTTP.get(`/groupeContext/${idContext}/category/${idCategory}/group_list`);
  const idGroupe = groupe.data.find(child => child.name === ApiBIMObjectGroup)?.dynamicId;
  if (!idGroupe) return;

  let objectList;

  if (config.config.contextType == "room") {
    objectList = await HTTP.get(`roomsGroup/${idContext}/category/${idCategory}/group/${idGroupe}/roomList`);
  } else {
    objectList = await HTTP.get(`equipementsGroup/${idContext}/category/${idCategory}/group/${idGroupe}/equipementList`);
  }
  let nbEquipement = objectList.data.length;;
  const elementsToSubscribe = [];
  for (let i = 0; i < nbEquipement; i++) {
    if (count == 0) {
      let element = {
        name: objectList.data[i].name,
        dynamicId: objectList.data[i].dynamicId
      };
      tab.push(element)
    }

    const oneElement = objectList.data[i];
    elementsToSubscribe.push(`${idContext}/${oneElement.dynamicId}`);
  }
  await getDataEquipement();
  if (config.config.enableWebSocket == true)
    subscribe(elementsToSubscribe);
}


export async function getBuildingName(id_batiment) {
  let building = await HTTP.get(`/building/read`);
  return building.data.name
}

async function getDataEquipement() {
  if (count == 0) {
    for (const [index, objet] of tab.entries()) {
      const dynamicId = objet.dynamicId;
      let controlEndpointData = null;
      let endpointData = null;

      try {
        for (const header of config.config.headers) {
          if (header.type == "controle point" && !controlEndpointData) {
            const response = await HTTP.get(`/node/${dynamicId}/control_endpoint_list`);
            controlEndpointData = response.data;
          }

          if (header.type == "endpoint" && !endpointData) {
            const response2 = await HTTP.get(`/node/${dynamicId}/endpoint_list`);
            endpointData = response2.data;
          }

          if (header.type == "controle point" && controlEndpointData) {
            for (let i = 0; i < controlEndpointData.length; i++) {
              const { endpoints } = controlEndpointData[i];
              for (const endpoint of endpoints) {
                if (header.value == endpoint.name) {
                  objet[header.value] = endpoint.currentValue;
                }
              }
            }
          }

          if (header.type == "endpoint" && endpointData) {
            for (const endpoint of endpointData) {
              if (header.value.replace("endpoint/", "") === endpoint.name) {
                objet[header.value] = endpoint.currentValue;
              }
            }
          }
        }

        tab.splice(index, 1, objet);
      } catch (error) {
        console.error(error);
      }
    }

    count++;
  }
}