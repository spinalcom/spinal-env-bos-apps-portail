<template>
  <div v-show="show_command">
    <div class="blur_background">
    </div>
    <div class="total">
      <div class="menu">
        <div style="display: flex;">
          <div class="text_title">
            <span class="mdi mdi-map-marker marker"></span>
            {{ postion_name }}
          </div>
          <div id="curved-corner-topleft"></div>
          <div class="fermer" @click="close()"> X</div>
        </div>
        <div v-if="configCommand" class="command_container">
          <EditCommande :symbole="configCommand.temperature.symbole" :activable="activable" @update="handleUpdate"
            :step="configCommand.temperature.step" :commandName="'COMMAND_TEMPERATURE'"
            :currentData="COMMAND_TEMPERATURE" :modeString="configCommand.temperature.modeString"
            :objet="configCommand.temperature.format" :unit="configCommand.temperature.unit" :icon="'thermometer'"
            :color="'#FF9685'" style="border-right: 2px dashed #a1a1a1;
    padding-right: 3%;"></EditCommande>
          <EditCommande :symbole="configCommand.cmd_Light_percent.symbole"
            v-if="matchedCommandKeys.includes('cmd_Light_percent')" :activable="activable" @update="handleUpdate"
            :step="configCommand.cmd_Light_percent.step" :commandName="'COMMAND_LIGHT'" :currentData="COMMAND_LIGHT"
            :objet="configCommand.cmd_Light_percent.format" :modeString="configCommand.cmd_Light_percent.modeString"
            :unit="configCommand.cmd_Light_percent.unit" :icon="'ampoule'" :color="'#EDE474'" :style="{
              marginLeft: '6%',
              borderRight: matchedCommandKeys.includes('cmd_store_off') ? 'none' : '2px dashed #a1a1a1',
              paddingRight: '3%'
            }"></EditCommande>
          <EditCommande :symbole="configCommand.cmd_Light_star.symbole" v-else :activable="activable"
            @update="handleUpdate" :step="configCommand.cmd_Light_star.step" :commandName="'COMMAND_LIGHT'"
            :currentData="COMMAND_LIGHT" :modeString="configCommand.cmd_Light_star.modeString"
            :objet="configCommand.cmd_Light_star.format" :unit="configCommand.cmd_Light_star.unit" :icon="'ampoule'"
            :color="'#EDE474'" :style="{
              marginLeft: '6%',
              borderRight: matchedCommandKeys.includes('cmd_store_off') ? 'none' : '2px dashed #a1a1a1',
              paddingRight: '3%'
            }"></EditCommande>
          <EditCommande :symbole="configCommand.cmd_store_on.symbole"
            v-if="!matchedCommandKeys.includes('cmd_store_off')" :activable="activable" @update="handleUpdate"
            :step="configCommand.cmd_store_on.step" :modeString="configCommand.cmd_store_on.modeString"
            :commandName="'COMMAND_BLIND'" :currentData="COMMAND_BLIND" :objet="configCommand.cmd_store_on.format"
            :unit="'%'" :icon="'store'" :color="'#A8DDF4'" style="margin-left: 6%;"></EditCommande>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import EditCommande from "./EditCommande.vue"
// import { config } from "../../config";
// import type { Store } from "../../services/store";
export default {
  props: {
    data: {},
    selectedItem: null,
    typeTelecommande: ''
  },
  components: {
    EditCommande,
  },

  data: () => ({
    COMMAND_TEMPERATURE: null,
    COMMAND_LIGHT: null,
    COMMAND_BLIND: null,
    postion_name: null,
    postion_id: null,
    activable: false,
    show_command: false,
    matchedCommandKeys: [],
    configCommand: '',
    multirooms: false,
    // $store: Store,
    temp: [
      { value: 2, color: '#F0715C' },
      { value: 1, color: '#FF9685' },
      { value: 0, color: '#FFA685' },
      { value: -1, color: '#FFB985' },
      { value: -2, color: '#FAD9AD' },
    ],
    lumi: [
      { value: 100, color: '#EDE474' },
      { value: 75, color: '#B7B362' },
      { value: 50, color: '#818250' },
      { value: 25, color: '#4A513E' },
      { value: 0, color: '#14202C' },
    ],
    store: [
      { value: 100, color: '#A8DDF4' },
      { value: 75, color: '#85B0C4' },
      { value: 50, color: '#628395' },
      { value: 25, color: '#3E5665' },
      { value: 0, color: '#14202C' },
    ],
    etoile: [
      { value: 3, color: '#EDE474', string: "***" },
      { value: 2, color: '#B7B362', string: "**" },
      { value: 1, color: '#818250', string: "*" },
      { value: 0, color: '#14202C', string: "0" },
    ],
  }),
  mounted() {
    this.configCommand = this.$store.state.appDataStore.appConfig.configCommand

    if (this.typeTelecommande == 'equipement') {
      this.handleSelectedEquipement(this.selectedItem)
    }
    else if (this.typeTelecommande == 'room') {
      this.handleSelectedRoom(this.selectedItem)

    } else {
      this.handleSelectedMultipleRoom()
    }
  },
  methods: {
    handleUpdate({ command, value }) {
      this.postCommand(command, value)
    },

    async postCommand(command, value) {
      console.log(this.$store.state.appDataStore.roomData.rooms);

      const buildingId = localStorage.getItem("idBuilding");

      let propertyReference = [];

      if (this.multirooms === true) {
        // Multicommande : une entrée pour chaque pièce
        propertyReference = this.$store.state.appDataStore.roomData.rooms.map(room => ({
          dynamicId: room.dynamicId,
          keys: [
            {
              key: command,
              value: value.toString()
            }
          ]
        }));
      } else {
        // Commande unique
        propertyReference = [
          {
            dynamicId: this.postion_id,
            keys: [
              {
                key: command,
                value: value.toString()
              }
            ]
          }
        ];
      }

      const referenceIds = {
        propertyReference: propertyReference
      };

      const promises = [
        this.$store.dispatch(ActionTypes.POST_NODE_COMMAND, {
          buildingId,
          referenceIds
        })
      ];

      const result = await Promise.all(promises);
    },

    extractCommandValues(controleEndpoint) {

      const commandProfile = controleEndpoint.find(profile => profile.profileName === "Command");

      if (!commandProfile) {
        console.log("Aucun profil 'Command' trouvé.");
        return;
      }

      const commands = {
        "COMMAND_TEMPERATURE": "COMMAND_TEMPERATURE",
        "COMMAND_LIGHT": "COMMAND_LIGHT",
        "COMMAND_BLIND": "COMMAND_BLIND"
      };

      commandProfile.endpoints
        .filter(endpoint => Object.keys(commands).includes(endpoint.name))
        .forEach(endpoint => {
          this[commands[endpoint.name]] = endpoint.value;
        });

      console.warn('LE 23', this.COMMAND_TEMPERATURE, this.COMMAND_LIGHT, this.COMMAND_BLIND);

    },





    getIfActivable(controlEndpoint) {
      // Trouver le profil avec profileName === "Command" à changer dans la config
      const Profile = controlEndpoint.find(profile => profile.profileName === "Command");

      if (!Profile) {
        console.log("Aucun profil trouvé.");
        return false;
      }
      // Trouver l'endpoint avec le nom "CONTROLABLE" à changer dna sla config
      const controlableEndpoint = Profile.endpoints.find(endpoint => endpoint.name === "STORE_CONTROLABLE");

      if (!controlableEndpoint) {
        console.log("Aucun endpoint CONTROLABLE trouvé.");
        return false;
      }
      return controlableEndpoint.value;
    },

    close() {
      this.show_command = false
      this.multirooms = false
      this.$emit('close');
    },

    async handleSelectedEquipement(newVal) {
      const buildingId = localStorage.getItem("idBuilding");

      // 1. Récupérer les détails de l’équipement
      const equipement = await this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
        buildingId,
        referenceIds: [newVal]
      });

      this.postion_name = equipement.name;
      this.postion_id = equipement.dynamicId;
      this.activable = !this.getIfActivable(equipement.controlEndpoint);
      this.extractCommandValues(equipement.controlEndpoint);

      try {
        // 2. Récupérer la position pour obtenir la room associée
        const position = await this.$store.dispatch(ActionTypes.GET_POSITION, {
          buildingId,
          referenceIds: newVal
        });

        console.log('555 la room trouvé :', position);

        const room = position?.info?.room;
        const roomId = room?.dynamicId;

        console.log('555 la room id :', roomId);
        if (!roomId) {
          console.warn("⚠️ Aucun room trouvé pour cet équipement.");
          this.matchedCommandKeys = [];
          this.show_command = true;
          return;
        }

        // 3. Comme pour les rooms, on récupère les groupes liés à cette pièce
        const groupResult = await this.$store.dispatch(ActionTypes.POST_PARENT_LIST_MULTIPLE, {
          buildingId,
          inputList: [
            {
              dynamicId: roomId,
              relations: ['groupHasgeographicRoom'],
            },
          ],
        });

        console.log('555 grp result:', groupResult);

        const groupNodes = groupResult?.[0]?.nodes || [];
        const availableGroupNames = groupNodes.map(g => g.name);

        const commandMap = this.$store.state.appDataStore.telecommandeType;
        const matchingCommandKeys = [];

        for (const [cmdKey, dynamicIds] of Object.entries(commandMap)) {
          const matchedGroup = groupNodes.find(g => dynamicIds.includes(g.dynamicId));
          if (matchedGroup && availableGroupNames.includes(matchedGroup.name)) {
            matchingCommandKeys.push(cmdKey);
          }
        }

        console.log("✅  555 Commandes correspondantes à la pièce de l’équipement :", matchingCommandKeys);
        this.matchedCommandKeys = matchingCommandKeys;

      } catch (err) {
        console.error('❌ Erreur lors du traitement des groupes de l’équipement :', err);
        this.matchedCommandKeys = [];
      }

      this.show_command = true;
    }
    ,
    async handleSelectedMultipleRoom() {
      this.multirooms = true
      const buildingId = localStorage.getItem("idBuilding");
      console.warn('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', this.$store.state.appDataStore.roomData.rooms[0].dynamicId);
      this.postion_name = this.$store.state.appDataStore.roomData.name;

      const rooms = this.$store.state.appDataStore.roomData.rooms;

      const promises = rooms.map(room =>
        this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_ROOM, {
          buildingId,
          referenceIds: [room.dynamicId],
        })
      );

      const results = await Promise.all(promises);


      // Appel de getIfActivable pour chaque controlEndpoint
      const activableChecks = await Promise.all(
        results.map(result => this.getIfActivable(result.controlEndpoint))
      );

      this.extractCommandValues(results[0].controlEndpoint);


      console.log("Activables:", activableChecks);

      // Exemple : vérifier s’il y a au moins un true
      const auMoinsUnActivable = activableChecks.includes(true);
      if (auMoinsUnActivable) {
        console.log("✅ Au moins une pièce est activable !");
        this.activable = false
      } else {
        console.log("❌ Aucune pièce activable.");
        this.activable = true
      }


      try {
        const groupResult = await this.$store.dispatch(ActionTypes.POST_PARENT_LIST_MULTIPLE, {
          buildingId,
          inputList: [
            {
              "dynamicId": this.$store.state.appDataStore.roomData.rooms[0].dynamicId,
              "relations": ['groupHasgeographicRoom'],
            },
          ],
        });


        const groupNodes = groupResult?.[0]?.nodes || [];
        const availableGroupNames = groupNodes.map(g => g.name);

        const commandMap = this.$store.state.appDataStore.telecommandeType;

        const matchingCommandKeys = [];

        for (const [cmdKey, dynamicIds] of Object.entries(commandMap)) {
          const matchedGroup = groupNodes.find(g => dynamicIds.includes(g.dynamicId));
          if (matchedGroup && availableGroupNames.includes(matchedGroup.name)) {
            matchingCommandKeys.push(cmdKey);
          }
        }


        console.log("✅ Commandes correspondantes aux groupes :", matchingCommandKeys);
        this.matchedCommandKeys = matchingCommandKeys;

      } catch (err) {
        console.error('❌ Erreur lors du fetch des groupes liés à la room :', err);
      }

      this.show_command = true
      console.warn('hihi', results);
    },

    async handleSelectedRoom(newVal) {
      const buildingId = localStorage.getItem("idBuilding");

      const promises = [
        this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_ROOM, {
          buildingId,
          referenceIds: [newVal],
        }),
      ];

      const result = await Promise.all(promises);

      this.postion_name = result[0].name;
      this.postion_id = result[0].dynamicId;
      this.activable = this.getIfActivable(result[0].controlEndpoint);
      this.extractCommandValues(result[0].controlEndpoint);

      console.warn('55555555555555555555555555555555555', newVal);

      // 🔍 ici faire le contrôle des groupes
      try {
        const groupResult = await this.$store.dispatch(ActionTypes.POST_PARENT_LIST_MULTIPLE, {
          buildingId,
          inputList: [
            {
              "dynamicId": newVal,
              "relations": ['groupHasgeographicRoom'],
            },
          ],
        });


        const groupNodes = groupResult?.[0]?.nodes || [];
        const availableGroupNames = groupNodes.map(g => g.name);

        // On récupère le mapping complet depuis le store
        const commandMap = this.$store.state.appDataStore.telecommandeType;

        // On cherche les clés dont le groupe est présent dans la liste
        const matchingCommandKeys = [];



        for (const [cmdKey, dynamicIds] of Object.entries(commandMap)) {
          const matchedGroup = groupNodes.find(g => dynamicIds.includes(g.dynamicId));
          if (matchedGroup && availableGroupNames.includes(matchedGroup.name)) {
            matchingCommandKeys.push(cmdKey);
          }
        }

        console.log("✅ Commandes correspondantes aux groupes :", matchingCommandKeys);
        this.matchedCommandKeys = matchingCommandKeys;

        // Tu peux stocker dans this.groups ou autre selon ton besoin
        // this.groups = groupResult?.[0] || [];
      } catch (err) {
        console.error('❌ Erreur lors du fetch des groupes liés à la room :', err);
      }
      this.show_command = true
    }



  },

  watch: {
    selectedItem(newVal) {
      // TODO
      // this.handleSelectedEquipement(newVal);
    }
  }
};

</script>

<style scoped>
.menu {
  position: absolute;
  overflow: visible;
  left: 50%;
  top: 50%;
  width: 90%;
  max-height: 850px;
  max-width: 1200px;
  /* height: 80vh; */
  background-color: white;
  border: 1px solid rgb(204, 204, 204);
  transform: translate(-50%, -50%);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  background: transparent linear-gradient(242deg, #EAEEF0 0%, #DAECF5 100%) 0% 0% no-repeat padding-box;
  /* overflow: hidden; */
}

.total {
  width: 100vw;
  height: 100vh;
  top: 0px;
  left: 0px;
}

.text_title {
  width: 80%;
  height: 120px;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border-bottom-right-radius: 30px;
  display: flex;
  align-items: center;
  font-size: 36px;
  color: #14202c;
}

#curved-corner-topleft:before {
  top: 0;
  left: 0;
  box-shadow: -50px -50px 0 0 rgb(255, 255, 255);
}

#curved-corner-topleft:before {
  content: "";
  display: block;
  width: 200%;
  height: 200%;
  position: absolute;
  border-radius: 25%;
}

#curved-corner-topleft {
  width: 50px;
  height: 50px;
  overflow: hidden;
  position: relative;
}

.marker {
  font-size: 50px;
  width: 50px;
  margin: 25px;
}

.fermer {
  position: absolute;
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  border: 1px solid #C8C8C8;
  font-weight: 900;
  font-size: 23px;
  right: 0;
  transform: translate(20px, -20px);
}

.blur_background {
  backdrop-filter: blur(4px);
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  position: absolute;
}

.command_container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
</style>