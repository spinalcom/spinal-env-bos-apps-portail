import { HTTP } from "./http-constants";
import moment from 'moment';
import fr from 'moment/locale/fr'
import io from 'socket.io-client';


export let toto = [];

// const options = { auth: { clientId: "XXX", secretId: "XXX" }, transports: ["websocket"] } /* Pour plus de details sur les options, consulter la documentation */

// const socket = io("https://api-demo-spinal-tower.spinalcom.com", options);

// socket.on("connect", () => { console.log("la connexion au serveur a été établie avec succès") });

/* Exécutée en cas de déconnexion au serveur */
// socket.on("disconnect", (reason) => { console.log("Déconnexion du serveur pour la raison :", reason) });

/* Exécutée en cas d'erreur de connexion au serveur */
// socket.on("connect_error", (err) => { console.log(err.message) });
const options = { auth: { clientId: "XXX", secretId: "XXX" }, transports: ["websocket"] } /* Pour plus de details sur les options, consulter la documentation */

const socket = io("https://api-demo-spinal-tower.spinalcom.com", options);

  socket.on("connect", () => { console.log("la connexion au serveur a été établie avec succès") });

  socket.on("disconnect", (reason) => { console.log("Déconnexion du serveur pour la raison :", reason) });

  socket.on("connect_error", (err) => { console.log(err.message) });

  const requestOptions = {
    subscribeChildren: true,
    subscribeChildScope: "tree_not_in_context",
  };

function subscribe(elementToSubscribe, index, name) {

  // console.log(index,elementToSubscribe , name);
  

  socket.emit("subscribe", elementToSubscribe, requestOptions);

  socket.on("subscribed", (result) => {
    if (!Array.isArray(result)) result = [result];
    console.log('res',result);
    result.map(({ error, eventNames }) => {
      if (error) {
        console.error(error);
        return;
      }
      eventNames.forEach(eventName => {
        socket.on(eventName, onChangeCallback)
        // console.log('eventname',name,eventName);
        
      });
    });
  })


  function onChangeCallback(data) {
    // console.log(data)
    let element = {
      name: name,
      power: "",
      consigne: "",
      luminosité: "",
    };

    let existingElement = toto.find((e) => e.name === name);
    if (existingElement) {

      if (existingElement.consigne !== "") {
        element.consigne = existingElement.consigne;
      }
      if (existingElement.luminosité !== "") {
        element.luminosité = existingElement.luminosité;
      }
      if (existingElement.power !== "") {
        element.power = existingElement.power;
      }
    }
    if (data.data.node.element.name == 'Power') {
      element.power = data.data.node.element.currentValue;
    } else if (data.data.node.element.name == "Luminosité") {
      element.luminosité = data.data.node.element.currentValue;
    } else if (data.data.node.element.name == "Consigne Luminosité") {
      element.consigne = data.data.node.element.currentValue;
    }

    let index = toto.findIndex((e) => e.name === name);
    if (index === -1) {
      toto.push(element);
    } else {
      toto.splice(index, 1, element);
    }
  }

}

export async function getequipementGroup(id_batiment) {
  let equipementsGroup = await HTTP.get(`/equipementsGroup/list`);
  equipementGroupId = equipementsGroup.data[0].dynamicId
  let equipement = await HTTP.get(`/equipementsGroup/${equipementGroupId}/tree`);
  
  console.log('ele',equipement.data.children[0].children[0].children);

  for (let i = 0; i < 1; i++) {
    let oneelement = equipement.data.children[0].children[0].children[i].dynamicId;
    // console.log(equipement.data.children[0].children[0].children[i]);
    elementToSubscribe = equipementGroupId + "/" + oneelement;
    console.log(equipement.data.children[0].children[0].children[i].staticId);
    subscribe(elementToSubscribe, i, equipement.data.children[0].children[0].children[i].name);
  }

  // equipement.data.children[0].children[0].children.forEach((child, index) => {
  //   let oneelement = child.dynamicId;
  //   elementToSubscribe = equipementGroupId + "/" + oneelement;
  //   subscribe(elementToSubscribe, index, child.name);
  // });

}

export async function getBuildingName(id_batiment) {
  let building = await HTTP.get(`/building/read`);
  // console.log(building.data.dynamicId);
  return building.data.name
}



// export function showdata() {
//   console.log("show data");
//   return toto;
// }