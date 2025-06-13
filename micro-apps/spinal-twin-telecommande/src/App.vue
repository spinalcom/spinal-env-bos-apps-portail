<!--
Copyright 2021 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->
<template>

  <v-app v-if="pageSate === PAGE_STATES.loaded" class="app">

    <div class="navbar">
      <div><span class="mdi mdi-map-marker"></span>{{ spaceName }}</div>
      <div style="color: #DDECF4;">
        <div style="font-size: 65px;height: 70px;font-weight: bold ;display: flex;justify-content:flex-end">{{
          currentTime }}</div>
        <div style="font-size: 25px;">{{ currentDate }}</div>
      </div>
    </div>

    <Télécommande v-if="config && displayTelecommande" @close="handleClose"
      style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 99999;"
      :selectedItem="selectedItem" :typeTelecommande="typeTelecommande" :data="''">
    </Télécommande>

    <div  v-if="config && config.SelectionType == 'button' || config.SelectionType == 'multiple'"
      @click="displayTelecommande = true" class="btn_pilotage">
      PILOTAGE PIÈCE
    </div>

    <div class="dataBody">
      <viewerApp :class="{ 'active3D': true }" class="viewerContainer"></viewerApp>
    </div>

    <!-- <div class="space">
      <space-selector ref="space-selector" :open.sync="openSpaceSelector" :maxDepth="2" v-model="selectedZone"
        label="ESPACE" :spaceSelectorItemButtons="spaceSelectorButtons" :viewButtonsType="config.viewButtons"
        @onActionClick="onActionClick" />
    </div> -->
  </v-app>

  <v-container class="loading" v-else-if="pageSate === PAGE_STATES.loading" fluid>
    <v-progress-circular :size="70" :width="3" color="purple" indeterminate></v-progress-circular>
  </v-container>


</template>

<script lang="ts">
import {
  ISpaceSelectorItem,
  // SpaceSelector,
} from "../../../global-components/SpaceSelector/index";
import { Vue, Watch } from "vue-property-decorator";
import { ActionTypes } from "./interfaces/vuexStoreTypes";
import Component from "vue-class-component";
import type { Store } from "./services/store";
import { MutationTypes } from "./services/store/appDataStore/mutations";
import type {
  IButton,
  IZoneItem,
  TGeoItem,
} from "./components/SpaceSelector/interfaces/IBuildingItem";
import viewerApp from "./components/viewer/viewer.vue";
// import { ViewerButtons } from "./components/SpaceSelector/spaceSelectorButtons";
import Télécommande from "./components/data-side/Télécommande.vue"
import SpriteComponent from "./components/data-side/SpriteComponent.vue"
// import SpriteComponentArret from "./components/data-side/SpriteComponentArret.vue"
// import { config } from "./config";
import { IConfig } from "./interfaces/IConfig";
import { PAGE_STATES } from "./interfaces/pageStates";
import {
  EmitterViewerHandler,
  VIEWER_SPRITE_CLICK,
  VIEWER_AGGREGATE_SELECTION_CHANGED,
} from "spinal-viewer-event-manager";

import {
  VIEWER_REM_SPHERE,

} from "spinal-viewer-event-manager";

import "spinal-components/dist/spinal-components.css";


interface IItemData {
  platformId: string;
  id: number | number[];
}

interface IItemDatatmp {
  platformId: string;
  id: Set<number>;
}

@Component({
  components: {
    // SpaceSelector,
    viewerApp,
    Télécommande,
    SpriteComponent
  },
})
class App extends Vue {
  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  $store: Store;
  openSpaceSelector: boolean = false;
  // config: IConfig = config;
  // spaceSelectorButtons: IButton[] = ViewerButtons[config.viewButtons];
  $refs: { spaceSelector };
  displayTelecommande: boolean = false;
  query: { config: string; app: string; mode: string; name: string; spaceSelectedId: string; buildingId: string } = {
    app: '',
    mode: 'null',
    name: '',
    spaceSelectedId: '',
    buildingId: '',
    config: ''
  };
  selectedItem: Number = 0;
  currentTime: String = '';
  currentDate: String = '';
  spaceName: String = '';
  floor: any = null;
  typeTelecommande: String = '';

  public get config(): IConfig {
    return this.$store.state.appDataStore.appConfig;
  }

  public get loadedinformation() {
    return this.$store.state.appDataStore.loadedinformation;
  }
  updateDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    this.currentDate = now.toLocaleDateString('fr-FR', options);
  }
  updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;
  }
  async youAreHere() {
    let referenceIds = this.config.tabletteId
    if (window.parent.routerFontion.apps[0]._route.query.spaceSelectedId != undefined) {
      referenceIds = window.parent.routerFontion.apps[0]._route.query.spaceSelectedId
    }

    const buildingId = localStorage.getItem("idBuilding");
    const promises = [
      this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
        buildingId,
        referenceIds
      }),
    ];
    const result = await Promise.all(promises);
    this.setTabletteSprite(result, buildingId)
    this.setOtherTabletteSprite();
  }

  // setOtherTabletteSprite() {
  //   //context / categori / group /readstaticdetail multiple /foreach  /XYZ center /ADD_COMPONENT_AS_SPRITES

  //   // const buildingId = localStorage.getItem("idBuilding");
  //   // const contextCible = this.config.tabletteContext;
  //   // const categorieCible = this.config.tabletteContext;
  //   // const groupeCible = this.config.tabletteContext;

  //   // const contextList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_LIST, { buildingId });

  //   // for (const ctxName of allContexts) {
  //   //   const context = contextList.find(contextCible === ctxName);



  //   // const categories = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_LIST, {
  //   //       buildingId,
  //   //       contextId,
  //   //     });


  //   //find categrory avec la cible

  //   // const groupList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_GROUP_LIST, {
  //   //       buildingId,
  //   //       contextId,
  //   //       categoryDynId: category.dynamicId,
  //   //     });


  //   //find le groupe avec la cible
  //   // récuperer les 3 dynamicID chercher les equipement

  //   // const equipementList = await this.$store.dispatch(ActionTypes.GET_EQUIPEMENT_LIST, {
  //   //       buildingId,
  //   //       contextDynId, 
  //   //       categoryDynId, 
  //   //       groupDynId
  //   //     });


  //   // pour chaque equipement
  //   //
  //   // let X;
  //   //   let Y;
  //   //   let Z;

  //   //   result[0].attributsList.forEach(category => {
  //   //     category.attributs.forEach(attribute => {
  //   //       if (attribute.label === "XYZ center") {
  //   //         let coordinates = attribute.value.split(";");
  //   //         X = coordinates[0];
  //   //         Y = coordinates[1];
  //   //         Z = coordinates[2];
  //   //       }
  //   //     });
  //   //   });

  //   //   const item = {
  //   //     color: '#ded638',
  //   //     dynamicId: result[0].dynamicId,
  //   //     buildingId: buildingId,
  //   //     dbid: result[0].dbid,
  //   //     bimFileId: result[0].bimFileId,
  //   //     name: result[0].name,
  //   //     position: new THREE.Vector3(Number(X), Number(Y), Number(Z)),
  //   //     data: result[0],
  //   //     config: this.config
  //   //   }
  //   //   

  //   //   this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
  //   //     items: item,
  //   //     buildingId: buildingId,
  //   //     component: SpriteComponent,
  //   //   });



  // }

  async setOtherTabletteSprite() {
    const buildingId = localStorage.getItem("idBuilding");
    const contextCible = this.config.tabletteContext;
    const categorieCible = this.config.tabletteCat;
    const groupeCible = this.config.tabletteGroup;

    try {
      const contextList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_LIST, { buildingId });
      const context = contextList.find(c => c.name === contextCible);


      if (!context) return;

      const categories = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_LIST, {
        buildingId,
        contextId: context.dynamicId,
      });

      const category = categories.find(cat => cat.name === categorieCible);
      if (!category) return;

      const groupList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_GROUP_LIST, {
        buildingId,
        contextId: context.dynamicId,
        categoryDynId: category.dynamicId,
      });

      const group = groupList.find(g => g.name === groupeCible);
      if (!group) return;

      const equipementList = await this.$store.dispatch(ActionTypes.GET_EQUIPEMENT_LIST, {
        buildingId,
        contextDynId: context.dynamicId,
        categoryDynId: category.dynamicId,
        groupDynId: group.dynamicId,
      });


      for (const equipement of equipementList) {
        const referenceIds = [equipement.dynamicId];

        const [result] = await Promise.all([
          this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
            buildingId,
            referenceIds,
          }),
        ]);

        let X, Y, Z;

        result?.attributsList?.forEach(category => {
          category.attributs?.forEach(attribute => {
            if (attribute.label === "XYZ center") {
              const [x, y, z] = attribute.value.split(";");
              X = parseFloat(x);
              Y = parseFloat(y);
              Z = parseFloat(z);
            }
          });
        });

        if (X != null && Y != null && Z != null) {
          const item = {
            color: '#14202c',
            dynamicId: equipement.dynamicId,
            buildingId,
            dbid: equipement.dbid,
            bimFileId: equipement.bimFileId,
            name: equipement.name,
            position: new THREE.Vector3(X, Y, Z),
            data: equipement,
            config: this.config,
          };


          await this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
            items: item,
            buildingId,
            component: SpriteComponent,
          });
        }
      }
    } catch (error) {
      console.error("Erreur dans setOtherTabletteSprite :", error);
    }
  }



  watchViewerLoaded() {
    const interval = setInterval(() => {
      const viewerLoaded = localStorage.getItem("viewer_loaded");
      const viewer = (window.parent as any).viewer;

      if (viewerLoaded === "loaded" && viewer) {
        this.youAreHere()
        clearInterval(interval);
        this.onViewerLoadedTriggered();
      }
    }, 500);
  }


  async setViewCubeAndFit(viewer) {
    try {
      viewer.navigation.setRequestTransition(false);
      setTimeout(async () => {
        const a = await viewer.loadExtension('Autodesk.ViewCubeUi')
        a.displayViewCube(true, true)
        a.setViewCube('right');
      }, 3000);
      setTimeout(async () => {
        const a = await viewer.loadExtension('Autodesk.ViewCubeUi')
        a.displayViewCube(true, true)
        a.setViewCube('top');

      }, 4000);
      await new Promise(resolve => setTimeout(resolve, 5000));
      viewer.unloadExtension("Autodesk.ViewCubeUi");
      viewer.navigation.fitBounds(true, viewer.impl.getFitBounds());
      viewer.setNavigationLock(true);

    } catch (error) {
      console.error("Erreur lors de l'exécution de ViewCube:", error);
    }
  }

  async onViewerLoadedTriggered() {
    const buildingId = localStorage.getItem('idBuilding');
    const roomTablette = localStorage.getItem('room_tablette');
    const room_tablette_dbid = localStorage.getItem('room_tablette_dbid');

    // console.warn('le fit to view to tablette', roomTablette);

    const item = {
      dynamicId: roomTablette,
      staticId: "SpinalNode-4be0192e-562d-1f3c-2d9c-1d558ca6b5ff-186df7cd6ff",
      name: "Sol [415087]",
      type: "BIMObject",
      version: 1,
      externalId: "154cec60-8d56-4126-8ada-aac07f24c66e-0006556f",
      dbid: room_tablette_dbid,
      buildingId: buildingId,
    };

    this.$store.dispatch(ActionTypes.FIT_TO_VIEW_ITEMS, item);

    const toto = !this.config.rotation

    if (!toto) {
      const viewer = window.parent.viewer
      viewer.navigation.setRequestTransition(false);
      setTimeout(async () => {
        await viewer.loadExtension('Autodesk.ViewCubeUi');

        const nav = viewer.navigation;
        const target = nav.getTarget();
        const up = new THREE.Vector3(1, 0, 0);
        const eye = target.clone().add(new THREE.Vector3(0, 0, 1));

        nav.setView(eye, target);
        nav.setCameraUpVector(up);

        viewer.impl.invalidate(true, true, true);

        setTimeout(async () => {
          viewer.unloadExtension("Autodesk.ViewCubeUi");
          viewer.setNavigationLock(true);
        }, 1000);
      });

      //fonctionne
      // const viewer = window.parent.viewer
      // viewer.navigation.setRequestTransition(false);
      // setTimeout(async () => {
      //   const a = await viewer.loadExtension('Autodesk.ViewCubeUi')
      //   a.displayViewCube(true, true)
      //   a.setViewCube('right');
      // }, 2000);
      // setTimeout(async () => {
      //   const a = await viewer.loadExtension('Autodesk.ViewCubeUi')
      //   a.displayViewCube(true, true)
      //   a.setViewCube('top');

      // }, 3000);

      // setTimeout(async () => {
      //   viewer.unloadExtension("Autodesk.ViewCubeUi");
      //   viewer.setNavigationLock(true);
      // }, 4000);


    }
    else if (toto == true) {
      setTimeout(async () => {
        const viewCube = await window.parent.viewer.loadExtension('Autodesk.ViewCubeUi');
        viewCube.displayViewCube(true, true);
        viewCube.setViewCube('top');
      }, 3000);

      setTimeout(async () => {
        window.parent.viewer.setNavigationLock(true);
        await window.parent.viewer.unloadExtension('Autodesk.ViewCubeUi');
      }, 4000);
    }

  }



  async mounted() {
    console.log('aaaa' , window.parent.routerFontion.apps[0]._route.query);
    
    // if (window.parent.routerFontion.apps[0]._route.query?.buildingId != undefined) {
    
    //   localStorage.setItem('idBuilding', window.parent.routerFontion.apps[0]._route.query.buildingId)
    // }
    // else {
    //   console.log('ccc');
    
    //   console.log('le building n est pas declaré ');
    //   localStorage.setItem('idBuilding', this.config.idBuilding || '0')
    // }


    const buildingId = localStorage.getItem("idBuilding");
    const resultParent = await this.$store.dispatch(ActionTypes.GET_POSTION_EQUIPEMENT, {
      buildingId,
      referenceIds: window.parent.routerFontion.apps[0]._route.query.spaceSelectedId,
    });

    localStorage.setItem('room_tablette', resultParent.info.room.dynamicId);
    localStorage.setItem('room_tablette_dbid', resultParent.info.room.dbId);
    localStorage.setItem('floor_tablette_id', resultParent.info.floor.dynamicId);
    localStorage.setItem('floor_tablette_name', resultParent.info.floor.name);
    localStorage.setItem("viewer_loaded", 'initialize');


    this.watchLocalStorageForFloorId();
    this.watchViewerLoaded();
    this.configTypeTablette()

    this.updateTime();
    this.updateDate();
    setInterval(this.updateTime, 60000);

    const navPickerApp = window.parent.document.querySelector('.navbar');

    const viewcube = document.querySelector('.viewcubeWrapper');
    if (viewcube) {
      viewcube.style.display = "none"
    }

    const appLoadContainer = window.parent.document.querySelector('.appLoadContainer');
    if (navPickerApp) {
      navPickerApp.style.display = 'none';
      if (appLoadContainer) {
        appLoadContainer.style.setProperty('padding', '0px', 'important');
      }
    }


    try {
      this.pageSate = PAGE_STATES.loading;
      this.listenSpritesEvent();
      this.pageSate = PAGE_STATES.loaded;
    } catch (error) {
      this.pageSate = PAGE_STATES.error;
    }

    //clique sur equipement
    if (this.config.SelectionType == "room" || this.config.SelectionType == "equipement" || this.config.SelectionType == "multiple") {
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.on(VIEWER_AGGREGATE_SELECTION_CHANGED, (data) => {
        if (data) {

          this.findDynamicIdByDbid(data[0]);
        }
      });
    }


    this.$nextTick(() => {
      // this.query.app = "eyJuYW1lIjoic3BpbmFsLWVudi1wYW0tdmlld2VyLWFwcC10ZWxlY29tbWFuZGUiLCJ0eXBlIjoiQnVpbGRpbmdBcHAiLCJpZCI6Ijg0ZDgtNzgyMS0yZTI2LTE5MjAwNmI4MDJmIiwiZGlyZWN0TW9kaWZpY2F0aW9uRGF0ZSI6MTcyNjU4MzkxOTM1NSwiaW5kaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzI2NTgzODk4MTU5LCJpY29uIjoiIiwiZGVzY3JpcHRpb24iOiIiLCJ0YWdzIjpbXSwiY2F0ZWdvcnlOYW1lIjoiIiwiZ3JvdXBOYW1lIjoiIiwiaGFzVmlld2VyIjpmYWxzZSwicGFja2FnZU5hbWUiOiJzcGluYWwtZW52LXBhbS12aWV3ZXItYXBwLXRlbGVjb21tYW5kZSIsImlzRXh0ZXJuYWxBcHAiOmZhbHNlLCJsaW5rIjoiIiwicmVmZXJlbmNlcyI6e30sInBhcmVudCI6eyJwb3J0b2ZvbGlvSWQiOiIzN2RlLTAyYjgtZTE4Yi0xODUwNjQzYjY4YSIsImJ1aWxkaW5nSWQiOiI1OTMyLTYwODYtOWUxYS0xODUwNjQ3ODQ2MCJ9fQ"
      window.parent.routerFontion.apps[0]._route.query.app = this.query.app
      // const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query }
      // this.applyURLParam();
      // this.asynctoto()
    });
  }

  async getTelecommandeType(type) {
    this.displayTelecommande = true;
  }

  async findDynamicIdByDbid(data) {
    const roomRef = this.$store.state.appDataStore.roomRef;
    const selectedbimfileId = data.modelId.bimFileId;
    const selecteddbId = data.dbIds[0];

    // Recherche dans les sols
    const matchSol = roomRef.sols.find(
      sol => sol.bimFileId === selectedbimfileId && sol.dbId === selecteddbId
    );

    if (matchSol && this.config.SelectionType === 'room' || this.config.SelectionType === 'multiple') {
      this.typeTelecommande = 'room'
      this.selectedItem = matchSol.roomId;
      this.getTelecommandeType('room')
      return matchSol.roomId;
    }

    // Recherche dans les équipements
    const matchEquip = roomRef.equipements.find(
      equip => equip.bimFileId === selectedbimfileId && equip.dbId === selecteddbId
    );

    if (matchEquip && this.config.SelectionType === "equipement") {
      console.warn('Équipement trouvé:', matchEquip);
      this.typeTelecommande = 'equipement'
      this.selectedItem = matchEquip.dynamicId;
      if (matchEquip.dynamicId) {
        const isInList = this.$store.state.appDataStore.iscontrolable.includes(matchEquip.dynamicId);
        console.warn('is in list', isInList);

        if (!isInList) return null;

      }
      this.getTelecommandeType('equipement')
      return matchEquip.dynamicId;
    }

    if (!matchSol && this.config.SelectionType === 'room' || this.config.SelectionType === 'multiple') {

      // console.log('avant de retourn un truc ??', matchEquip);
      this.typeTelecommande = 'room'
      this.selectedItem = matchEquip.roomId;
      this.getTelecommandeType('room')
      return matchEquip.roomId;
    }


    console.log('Aucun objet correspondant trouvé.');
    return null;
  }

  // async configTypeTablette() {
  //   console.log('🔧 Démarrage de configTypeTablette');

  //   const buildingId = localStorage.getItem("idBuilding");
  //   const commandItem = this.config.commandItem;


  //   // Étape 1 : Récupération des contextes
  //   const contextList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_LIST, { buildingId });

  //   const dynamicContextMap = {}; // ctx => dynamicId
  //   for (const [cmdKey, cmdValues] of Object.entries(commandItem)) {
  //     const ctxName = cmdValues[0]; // 'Gestion des espaces'
  //     const context = contextList.find((ctx) => ctx.name === ctxName);
  //     if (context) {
  //       dynamicContextMap[ctxName] = context.dynamicId;
  //     } else {
  //       console.warn(`⚠️ Contexte "${ctxName}" non trouvé.`);
  //     }
  //   }

  //   // Étape 2 : Récupération des catégories par contexte
  //   const categoryMap = {}; // ctx => [categories...]
  //   const categoryPromises = Object.entries(dynamicContextMap).map(async ([ctx, contextId]) => {
  //     const categories = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_LIST, {
  //       buildingId,
  //       contextId,
  //     });
  //     categoryMap[ctx] = categories;
  //   });

  //   await Promise.all(categoryPromises);

  //   // Étape 3 : Récupération des groupes par catégorie
  //   const result = {}; // cmd_key => dynamicId du groupe

  //   for (const [cmdKey, cmdValues] of Object.entries(commandItem)) {
  //     const [ctxName, catName, grpName] = cmdValues;
  //     const contextId = dynamicContextMap[ctxName];
  //     if (!contextId) continue;

  //     const category = categoryMap[ctxName]?.find((cat) => cat.name === catName);
  //     if (!category) {
  //       console.warn(`⚠️ Catégorie "${catName}" non trouvée dans le contexte "${ctxName}".`);
  //       continue;
  //     }

  //     const groupList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_GROUP_LIST, {
  //       buildingId,
  //       contextId,
  //       categoryDynId: category.dynamicId,
  //     });

  //     const matchingGroup = groupList.find((grp) => grp.name === grpName);

  //     if (!matchingGroup) {
  //       console.warn(`⚠️ Groupe "${grpName}" non trouvé dans la catégorie "${catName}".`);
  //       continue;
  //     }

  //     result[cmdKey] = matchingGroup.dynamicId;
  //   }


  //   // Résultat final avec les dynamicId des groupes
  //   // this.dynamicCommandMap = result;
  //   this.$store.commit(MutationTypes.SET_TELECOMMAND_TYPE, result);
  // }

  async configTypeTablette() {
    console.log('🔧 Démarrage de configTypeTablette');

    const buildingId = localStorage.getItem("idBuilding");
    const commandItem = this.config.commandItem;

    // Étape 1 : Récupération des contextes
    const contextList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_LIST, { buildingId });

    const dynamicContextMap = {}; // ctx => dynamicId
    const allContexts = new Set();

    // Récupérer tous les noms de contextes à partir de la nouvelle config
    for (const entries of Object.values(commandItem)) {
      for (const entry of entries) {
        allContexts.add(entry.context);
      }
    }

    for (const ctxName of allContexts) {
      const context = contextList.find((ctx) => ctx.name === ctxName);
      if (context) {
        console.warn('CONTEXT TROUVÉ');

        dynamicContextMap[ctxName] = context.dynamicId;
      } else {
        console.warn(`⚠️ Contexte "${ctxName}" non trouvé.`);
      }
    }

    // Étape 2 : Récupération des catégories par contexte
    const categoryMap = {}; // ctx => [categories...]
    const categoryPromises = Object.entries(dynamicContextMap).map(async ([ctx, contextId]) => {
      const categories = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_LIST, {
        buildingId,
        contextId,
      });
      categoryMap[ctx] = categories;
    });

    await Promise.all(categoryPromises);

    // Étape 3 : Récupération des groupes par catégorie
    const result = {}; // cmd_key => [dynamicId...]

    for (const [cmdKey, entries] of Object.entries(commandItem)) {
      result[cmdKey] = [];

      for (const { context, category, group: groupNames } of entries) {
        const contextId = dynamicContextMap[context];
        if (!contextId) continue;

        const categoryObj = categoryMap[context]?.find((cat) => cat.name === category);
        if (!categoryObj) {
          console.warn(`⚠️ Catégorie "${category}" non trouvée dans le contexte "${context}".`);
          continue;
        }

        const groupList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_GROUP_LIST, {
          buildingId,
          contextId,
          categoryDynId: categoryObj.dynamicId,
        });

        for (const groupName of groupNames) {
          const matchingGroup = groupList.find((grp) => grp.name === groupName);
          if (!matchingGroup) {
            console.warn(`⚠️ Groupe "${groupName}" non trouvé dans la catégorie "${category}".`);
            continue;
          }

          result[cmdKey].push(matchingGroup.dynamicId);
        }
      }
    }


    // Résultat final avec les dynamicId des groupes
    this.$store.commit(MutationTypes.SET_TELECOMMAND_TYPE, result);
  }



  watchLocalStorageForFloorId() {
    const interval = setInterval(() => {
      const dynamicId = localStorage.getItem("floor_tablette_id");
      if (dynamicId) {
        clearInterval(interval);
        this.applyURLParam(); // on peut éventuellement passer un `query` si nécessaire
        // this.youAreHere()
      }
    }, 500); // toutes les 500ms
  }

  handleClose() {
    this.displayTelecommande = false;
    this.typeTelecommande = ''
  }


  setTabletteSprite(result, buildingId) {

    let X;
    let Y;
    let Z;

    result[0].attributsList.forEach(category => {
      category.attributs.forEach(attribute => {
        if (attribute.label === "XYZ center") {
          let coordinates = attribute.value.split(";");
          X = coordinates[0];
          Y = coordinates[1];
          Z = coordinates[2];
        }
      });
    });

    const item = {
      color: 'orange',
      dynamicId: result[0].dynamicId,
      buildingId: buildingId,
      dbid: result[0].dbid,
      bimFileId: result[0].bimFileId,
      name: result[0].name,
      position: new THREE.Vector3(Number(X), Number(Y), Number(Z)),
      data: result[0],
      config: this.config
    }
    this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);

    this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
      items: item,
      buildingId: buildingId,
      component: SpriteComponent,
    });

  }

  forgeItem(result, buildingId) {
    this.selectedItem = result[0].dynamicId
    this.displayTelecommande = false;
    // this.isSmallScreen = item;
    this.displayTelecommande = true;
  }

  async getBIMInfo(referenceIds) {
    const buildingId = localStorage.getItem("idBuilding");
    const promises = [
      this.$store.dispatch(ActionTypes.GET_BIM_OBJECT_INFO, {
        buildingId,
        referenceIds
      }),
    ];
    const result = await Promise.all(promises);
    return [...result]
  }

  changeApp(e) {
    this.query.app = e
    this.changeRoute();
  }

  public get selectedZone(): ISpaceSelectorItem {
    return this.$store.state.appDataStore.zoneSelected;
  }

  public get temporalitySelected(): ISpaceSelectorItem {
    return this.$store.state.appDataStore.temporalitySelected;
  }

  public set temporalitySelected(v: ISpaceSelectorItem) {
    this.$store.commit(MutationTypes.SET_TEMPORALITY, v);
  }

  applyURLParam() {
    const buildingId = localStorage.getItem("idBuilding");
    const dynamicId = localStorage.getItem("floor_tablette_id"); //TODO
    const name = localStorage.getItem("floor_tablette_name");
    const item = {
      buildingId: buildingId,
      dynamicId: dynamicId,
    };
    const button = {
      "title": "charger",
      "icon": "mdi-video-3d",
      "onclickEvent": "OPEN_VIEWER",
      "isShownTypes": [
        "geographicFloor"
      ]
    }
    this.onActionClick({ button, item })



    this.openSpaceSelector = false
  }

  replaceRoute() {
    window.parent.routerFontion.customReplace(window.parent.router.path, this.query);
  }
  changeRoute() {
    window.parent.routerFontion.customPush(window.parent.router.path, this.query);
  }


  onActionClick({ button, item }) {
    const buildingId = localStorage.getItem("idBuilding");

    const data = {
      "isOpen": false,
      "loading": false,
      buildingId: buildingId,
      dynamicId: item.dynamicId,
      parents: item.parents,
    };

    switch (button.onclickEvent) {

      case ActionTypes.OPEN_VIEWER:
        this.$store.dispatch(button.onclickEvent, {
          onlyThisModel: true,
          config: this.config,
          item: data,
        });
        break;
      case ActionTypes.ISOLATE_ITEMS:
        this.$store.dispatch(button.onclickEvent, {
          onlyThisModel: true,
          config: this.config,
          item: data,
        });
        break;
      case "OPEN_VIEWER_PLUS":
        this.$store.dispatch(ActionTypes.OPEN_VIEWER, {
          onlyThisModel: false,
          config: this.config,
          item: data,
        });
        break;
      default:
        this.$store.dispatch(button.onclickEvent, data);
        break;
    }
  }

  listenSpritesEvent() {
    const emitterHandler = EmitterViewerHandler.getInstance();
    emitterHandler.on(VIEWER_SPRITE_CLICK, (result: any) => {
      this.$store.commit(MutationTypes.SET_ITEM_SELECTED, result.node);
      if (result.navigate) {

        this.query.spaceSelectedId = result.node.dynamicId
        this.query.name = result.node.name
        this.query.buildingId = result.node.buildingId

        const item = {
          buildingId: result.node.buildingId,
          dynamicId: result.node.dynamicId,
          name: result.node.name
        };
        const button = {
          "title": "charger",
          "icon": "mdi-video-3d",
          "onclickEvent": "OPEN_VIEWER",
          "isShownTypes": [
            "geographicFloor"
          ]
        }
        // this.onActionClick({ button, item })

        // const itemToSelect = {
        //   "isOpen": false,
        //   "loading": false,
        //   "dynamicId": result.node.dynamicId,
        //   "name": result.node.name,
        //   "buildingId": result.node.buildingId,
        //   "type": "geographicFloor",
        // }

        // if (this.$refs['space-selector']) {
        //   this.$refs['space-selector'].select(itemToSelect);
        // }
      }
      else if (result.node?.dynamicId) {
        const a = document.createElement("a");
        a.setAttribute("href", `#${result.node.dynamicId}`);
        a.click();
      }

    });
  }

  public get displayedData() {
    return this.$store.state.appDataStore.data;
  }

  @Watch("loadedinformation", { deep: true })
  async watchSelectedChartItems(select, old) {
    this.spaceName = localStorage.getItem("room_tablette_name");
    // this.youAreHere()
  }

}

export default App;
</script>


<style scoped lang="scss">
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  margin: none;
  width: 100%;
  background-color: white;
  z-index: 9999;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 50px;
  font-size: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
  // border: 1px solid black;
  // transform: translate(-10px);
}

.app {
  width: 100%;
  height: 100%;
  $selectorHeight: 60px;
  overflow: hidden;

  ::v-deep .card-colored {
    background-color: #14202c !important;
    border-radius: 8px !important;
  }


  .dataBody {
    height: calc(100% - #{$selectorHeight + 30px});
    margin: 130px 8px 0 8px;

    .viewerContainer {
      width: 60%;
      height: 100%;
      float: left;
    }

    .appContainer {
      width: 40%;
      z-index: 7;
      float: right;
      transition: 0.5s;
      position: absolute;
      margin-right: 6px;
      height: 91%;
      right: 0px;
    }

    .active {
      width: 98.5%;
      // height: 100%;
      position: absolute;
      z-index: 7;
      right: 0px;
      margin-right: 6px;
      height: 92%;
    }

    @media (max-width: 960px) {
      .active {
        height: 83vh;
      }

      .inactive {
        height: 83vh !important;
      }
    }

    .inactive {
      // display: none;
      position: absolute;
      width: 0%;
      height: 92%;
      right: 0px;
      transition: 0.1;
    }

    .active3D {
      width: 99vw;
      height: 90%;
      float: left;
      position: absolute;
    }

  }
}

.loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style>
.btn_pilotage {
  cursor: pointer;
  background-color: #14202c;
  color: white;
  width: 280px;
  height: 55px;
  z-index: 999999;
  position: absolute;
  bottom: 5%;
  margin-left: 100px;
  border-radius: 30px;
  font-weight: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
}


.forge-spinner {
  /* background-color: rgba(146, 70, 70, 0.63) !important; */
  width: 800px !important;
}

.forge-spinner img {
  display: none !important;
}

#app>div>div.dataBody>div.viewer-div-container.viewerContainer>div>div.forge-spinner {
  width: 800px !important;
}

.forge-spinner {
  background: url('./assets/spinalcore.png') center/contain no-repeat !important;
  width: 1500px;
  height: 800px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: transparent;
  height: 100%;
  width: 100%;
}

html {
  overflow-y: hidden !important;
  background: transparent;
}

body {
  margin: 0;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background: transparent;
}

.app-content {
  width: calc(100% - 16px);
  height: calc(100% - 80px);
  overflow-y: hidden;
  display: flex;
  position: relative;
  margin: 80px 8px 8px 8px;
}

.list-container {
  overflow-y: auto;
  height: calc(100% - 51px);
  padding: 8px;
}

.spinal-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.spinal-scrollbar::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: rgba(169, 169, 169, 0.9);
}

.spinal-scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

.appContainer .dataContainer .calcul_content .calcul .select .v-text-field.v-text-field--solo .v-input__control {
  min-height: unset !important;
}
</style>