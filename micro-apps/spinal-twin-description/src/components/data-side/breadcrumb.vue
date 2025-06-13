<template>
  <v-breadcrumbs v-if="etage || piece || equipement || show" divider=">">
    <div class="breadcrumb-item" @click="setPosition(id_building, building, 'building');">
      <v-breadcrumbs-item v-if="building">
        {{ building }}
      </v-breadcrumbs-item>
    </div>
    <div class="breadcrumb-item" @click="setPosition(id_etage, etage, 'geographicFloor');">
      <v-breadcrumbs-item v-if="etage">
        {{ etage }}
      </v-breadcrumbs-item>
    </div>
    <div v-if="piece" @click="setPosition(id_piece, piece, 'geographicRoom')" class="breadcrumb-item">
      <v-breadcrumbs-item>
        {{ piece }}
      </v-breadcrumbs-item>
    </div>
    <div v-if="equipement" class="breadcrumb-item">
      <v-breadcrumbs-item>
        {{ equipement }}
      </v-breadcrumbs-item>
    </div>
  </v-breadcrumbs>
</template>





<script lang="ts">
import { defineComponent, watch } from 'vue';
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
} from "spinal-viewer-event-manager";
import { error, warn } from 'console';


export default defineComponent({
  props: {
    type: {
      type: String,
      required: true
    },
    ids: {
      required: true
    }
  },
  data() {
    return {
      currentPosition: '',
      elementDynamicId: null,
      etage: null,
      piece: null,
      equipement: null,
      id_etage: null,
      id_piece: null,
      building: null,
      id_building: null,
      show: false
    };
  },
  async mounted() {

    if (!window.parent.routerFontion.apps[0]._route.query.SpaceSelectedType) {
      const buildingId = sessionStorage.getItem("idBuilding");

      const results = await Promise.all([
        this.$store.dispatch(ActionTypes.GET_NODE_READ, {
          buildingId,
          referenceIds: [window.parent.routerFontion.apps[0]._route.query.spaceSelectedId]
        }),
      ]);

      const node = results[0];
      this.handleBreadcrumbUpdate(window.parent.routerFontion.apps[0]._route.query.spaceSelectedId, node.type)

    }

  },
  watch: {
    '$store.state.appDataStore.zoneSelected.dynamicId'(newType, oldType) {
      // console.log('Changement de type détecté depuis le store !');
      // const [newIds, newSpaceSelectedId] = this.combinedIdsAndQuery;
      this.handleBreadcrumbUpdate(this.$store.state.appDataStore.zoneSelected.dynamicId || window.parent.routerFontion.apps[0]._route.query.spaceSelectedId, this.$store.state.appDataStore.zoneSelected.type || window.parent.routerFontion.apps[0]._route.query.SpaceSelectedType);
    }
  }

  ,
  methods: {

    async handleBreadcrumbUpdate(newSpaceSelectedId, currentType) {

      try {
        const buildingId = sessionStorage.getItem("idBuilding");
        const res1 = await this.$store.dispatch(ActionTypes.GET_BUILDING_INFO, { buildingId });
        this.id_building = res1.dynamicId;
        this.building = res1.name;


        switch (currentType) {
          case 'BIMObject': {

            const result = await this.$store.dispatch(ActionTypes.GET_POSTION_EQUIPEMENT, {
              buildingId,
              referenceIds: newSpaceSelectedId,
            });

            this.etage = result.info.floor?.name || null;
            this.id_etage = result.info.floor?.dynamicId || null;
            this.piece = result.info.room?.name || null;
            this.id_piece = result.info.room?.dynamicId || null;
            this.equipement = result.name || null;
            this.building = result.info.building?.name || null;


            break;
          }

          case 'geographicRoom': {
            const result = await this.$store.dispatch(ActionTypes.GET_POSTION_ROOM, {
              buildingId,
              referenceIds: newSpaceSelectedId,
            });
            // console.warn("✅ [Room] Résultat :", result);

            this.etage = result.info.floor?.name || null;
            this.id_etage = result.info.floor?.dynamicId || null;
            this.piece = result.name || null;
            this.id_piece = result.dynamicId || null;
            this.equipement = null;
            this.building = result.info.building?.name || null;
            break;
          }
          case undefined:
          case 'building': {

            this.etage = null;
            this.id_etage = null;
            this.piece = null;
            this.equipement = null;
            this.show = false;
            this.building = null
            break;
          }

          case 'etage':
          case 'geographicFloor': {

            const result = await this.$store.dispatch(ActionTypes.GET_NODE_READ, {
              buildingId,
              referenceIds: [newSpaceSelectedId],
            });

            const element = [
              {
                dynamicId: result.dynamicId,
                relations: ["hasGeographicFloor"]
              }
            ];

            const resultRaw = await this.$store.dispatch(ActionTypes.GET_NODE_PARENTS, {
              buildingId,
              referenceIds: element
            });

            const geographicBuilding = resultRaw[0].nodes.find(node => node.type === "geographicBuilding");
            // console.warn(resultRaw[0].nodes , 'LE RESULT ROWWWWWWWWWWW!!!!!');

            // return resultRaw?.[0]

            if (result.type === 'geographicFloor') {
              this.etage = result.name || null;
              this.id_etage = result.dynamicId || null;
              this.piece = null;
              this.equipement = null;
              this.show = true;
              this.building = geographicBuilding.name
            } else {
              this.show = false;
            }
            break;
          }

          default:
            // console.warn("❓ Type non pris en charge :", currentType);
            this.etage = null;
            this.piece = null;
            this.equipement = null;
            break;
        }
      } catch (error) {
        console.error('❌ Erreur breadcrumb:', error);
      }


    }
    ,


    setPosition(id, position: string, type: string) {

      if (sessionStorage.getItem("viewer_loaded") == 'unload')
        return
      if (id == this.$store.state.appDataStore.zoneSelected.dynamicId)
        return
      const buildingId = sessionStorage.getItem("idBuilding");
      const item = {
        color: '#ded638',
        dynamicId: id,
        buildingId: buildingId,
        // dbid: dbid,
        // bimFileId: bimFileId,
        name: position,
        type: type,
      }
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.emit(VIEWER_SPRITE_CLICK, { navigate: 'la page', node: item });
      this.currentPosition = position;

      console.warn('JE SUIS GAB :', );

      const query = {
        app: window.parent.routerFontion.apps[0]._route.query.app,
        buildingId: buildingId,
        spaceSelectedId: id,
        name: position,
        SpaceSelectedType: type,
        config : window.parent.routerFontion.apps[0]._route.query.config
      };
      if (window.parent.routerFontion.apps[0]._route.query.spaceSelectedId != this.$store.state.appDataStore.zoneSelected.dynamicId)
        window.parent.routerFontion.customReplace(window.parent.router.path, query)


    }
  }
});
</script>

<style scoped>
.v-breadcrumbs {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 19px;
  margin-right: 10px;
  padding: 0;
}

.v-breadcrumbs__divider {
  color: #9e9e9e;
  margin: 0 8px;
}

.breadcrumb-item {
  cursor: pointer;
  color: #14202C;
  transition: color 0.3s ease;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid rgb(206, 206, 206);
  height: 40px;
  background-color: rgb(241, 241, 241);
  flex: 1 1 0;
  min-width: 0;
  width: 20px;
}

.breadcrumb-item:hover {
  color: #14202C;
  text-decoration: underline;
  background-color: rgb(214, 214, 214);
}

.breadcrumb-item:active {
  color: #0d47a1;
}
</style>
