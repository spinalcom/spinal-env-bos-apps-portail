<template>
  <v-breadcrumbs v-if="etage" divider=">">
    <div class="breadcrumb-item" @click="setPosition(id_etage, etage)">
      <v-breadcrumbs-item v-if="etage">
        {{ etage }}
      </v-breadcrumbs-item>
    </div>
    <div v-if="piece" @click="setPosition(id_piece, piece)" class="breadcrumb-item">
      <v-breadcrumbs-item >
        {{ piece }}
      </v-breadcrumbs-item>
    </div>
    <div v-if="equipement" @click="setPosition('equipement')" class="breadcrumb-item">
      <v-breadcrumbs-item >
        {{ equipement }}
      </v-breadcrumbs-item>
    </div>
  </v-breadcrumbs>
</template>


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


<script lang="ts">
import { defineComponent, watch } from 'vue';
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
} from "spinal-viewer-event-manager";


export default defineComponent({
  props: {
    type: {
      type: String,
      required: true
    },
    ids: {
      type: Number,
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
    };
  },
  // async mounted() {
  //   // console.error('////////////////////////////////////////////////');
  //   // console.error('////////////////////////////////////////////////');
  // },
  watch: {
    ids: {
      handler: async function (newIds) {
        const buildingId = localStorage.getItem("idBuilding");

        try {
          if (this.type === 'BIMObject') {
            const parentPromise = [
              this.$store.dispatch(ActionTypes.GET_POSTION_EQUIPEMENT, {
                buildingId: buildingId,
                referenceIds: newIds,
              }),
            ];
            const resultParent = await Promise.all(parentPromise);
            this.etage = resultParent[0].info.floor.name;
            this.id_etage = resultParent[0].info.floor.dynamicId
            this.id_piece = resultParent[0].info?.room?.dynamicId
            this.piece = resultParent[0].info?.room?.name;
            this.equipement = resultParent[0].name;

            console.log('Résultat Équipement:', resultParent);
          } else if (this.type === 'geographicRoom') {
            const parentPromise = [
              this.$store.dispatch(ActionTypes.GET_POSTION_ROOM, {
                buildingId: buildingId,
                referenceIds: newIds,
              }),
            ];
            const resultParent = await Promise.all(parentPromise);

            this.etage = resultParent[0].info.floor.name;
            this.id_etage = resultParent[0].info.floor.dynamicId
            this.id_piece = resultParent[0].dynamicId
            this.piece = resultParent[0].name;
            this.equipement = null;
          } else {
            this.etage = null
            this.piece = null
            this.equipement = null
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
        }
      },
      immediate: true
    }
  }
  ,
  methods: {
    setPosition(id, position: string) {
      const buildingId = localStorage.getItem("idBuilding");
      const item = {
        color: '#ded638',
        dynamicId: id,
        buildingId: buildingId,
        // dbid: dbid,
        // bimFileId: bimFileId,
        name: position,
      }
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.emit(VIEWER_SPRITE_CLICK, { navigate: 'la page', node: item });
      this.currentPosition = position;
      console.log('Nouvelle position:', window.parent.router.query.app);


      const query = {
        app: window.parent.router.query.app,
        buildingId: buildingId,
        spaceSelectedId: id,
        name: position
      };

      window.parent.routerFontion.customPush(window.parent.router.path, query)

    }
  }
});
</script>
