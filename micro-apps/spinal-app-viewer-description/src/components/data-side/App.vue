<!--
Copyright 2023 SpinalCom - www.spinalcom.com

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

  <div class="appli">
    <div style="width: 55%; height: 100%; background: #14202c;" v-show="showDocvalue">
      <ShowDocumentation :referenceId="idDoc" :file_prop="nameFile" :closecomp="ActiveData" @closeDialog="closeVueDoc" />
    </div>
    <!-- style="['height: calc(100vh - 160px); background-color: red', " -->
    <div
      style="max-height: 100%; display:flex; overflow: hidden ; overflow-y: auto; flex-direction: column; align-content:space-between;"
      :class="{ 'doc-content': showDocvalue, 'w-full': !showDocvalue }">
      <SpriteComponentMobile @close="handleClose"
        style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999;"
        v-if="displaySprite" :data="isSmallScreen">
      </SpriteComponentMobile>

      <BreadcrumbSelector :ids="referencedId" :type="referencedType" />

      <div class="hide" @click="() => {
        gestionBouton()
      }"
        style="background-color: white;width: 50px;height: 50px;position: absolute;bottom: 20px;right: 20px;z-index: 9999;border-radius: 5px;border: 2px solid #14202c;justify-content: center;align-items: center;display: flex;">
        <v-icon v-if="modefull && !displaySprite">mdi-text-box</v-icon>
        <v-icon v-else-if="!modefull && !displaySprite">mdi-video-3d</v-icon>
        <v-icon v-else>mdi-close-circle-outline</v-icon>
      </div>

      <div class="el3d">
        <button @click="() => {
          $emit('buttonClicked');
          resize();
        }
          " style="
          position: absolute;
          top: 47.5%;
          left: -20px;
          background-color: white;
          border-radius: 10px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 5px;
          border-left: 2px solid gainsboro;
          
        " :style="{ left: DActive ? '-35px' : '-20px' }">
          <v-icon v-if="DActive"> mdi-chevron-double-left </v-icon>
          <v-icon v-else-if="ActiveData">mdi-chevron-right</v-icon>
          <v-icon v-else>mdi-chevron-left</v-icon>
        </button>
        <button @click="() => {
          $emit('buttonClicked3D');
          resize();
        }
          " style="
          position: absolute;
          top: 52.5%;
          background-color: white;
          border-radius: 10px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 5px;
          border-left: 2px solid gainsboro;
          
          " :style="{ left: DActive ? '-35px' : '-20px' }">
          <v-icon v-if="ActiveData">mdi-chevron-double-right</v-icon>
          <v-icon v-else-if="DActive">mdi-chevron-left</v-icon>
          <v-icon v-else>mdi-chevron-right</v-icon>
        </button>
      </div>

      <div>
        <div class="title">
          <div class="button  adaptative" style="">
            <v-select label="Details" v-model="selection" :items="dynamicItems"></v-select>
          </div>

          <div v-if="ActiveData && selection == 'Indicateur' && labelsChart"
            style="display: flex ; flex-wrap: nowrap ; align-items: center;margin-left: 15px; margin-right: 15px;">
            <v-btn style="margin: 10px;" elevation="0" fab small @click="t_index--">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <div style="white-space: nowrap;">{{ timeactuelle }}</div>
            <v-btn style="margin: 10px;" elevation="0" fab small @click="t_index++">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>

          <div
            style="justify-content: flex-end;align-items: center;display: flex;padding-right: 12px;white-space: nowrap;"
            v-if="floorstaticDetails.length && floorstaticDetails[0].attributsList.length">
            <div style="" v-for="(item, index) in floorstaticDetails[0].attributsList[0].attributs">
              <div v-if="item.label == 'area'">
                {{ item.value }} m²
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="inventory">
        <div v-if="selection == 'Vue Globale'">
          <div v-if="inventoyList">
            <div v-if="inventoyList.length > 0" class="blocInformation">
              <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;">Inventaire
                des équipements ({{ config.inventory }})</span>
              <div>
                <div v-if="inventoyList == null"
                  style="justify-content: center;align-items: center;width: 100%;display: flex; margin-top: 10px; margin-bottom: 10px;">
                  PAS DE DONNÉES DISPONIBLE
                </div>
                <div v-else class="inventory-container">
                  <div v-for="(item, index) in inventoyList" :key="index" class="inventory-item">
                    <li>{{ item }}</li>
                    <div style="margin-left: 5px;">
                      <v-icon v-if="eyes.indexOf(index) === -1" @click="() => { hideelement(item); closeeyes(index) }"
                        style="cursor: pointer">mdi-eye-outline</v-icon>
                      <v-icon v-else @click="() => { hideelement(item); closeeyes(index) }"
                        style="cursor: pointer">mdi-eye-off-outline</v-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="blocInformation">
            <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;">Liste des
              attributs</span>
            <div v-if="attributProfil == null"
              style="justify-content: center;align-items: center;width: 100%;display: flex; margin-top: 10px ; margin-bottom: 10px;">
              <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </div>
            <div v-else class="inventory-container">
              <div
                style="color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                class="inventory-item" v-for="(item, index) in attributProfil">
                <li> {{ item.label }}: {{ item.value }}</li>

              </div>
            </div>
          </div>
          <!-- endpoint -->
          <div v-if="endpointProfil && endpointProfil.length > 0" class="blocInformation">


            <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;">Indicateur
            </span>
            <div class="inventory-container">
              <div v-if="endpointProfil == null"
                style="justify-content: center;align-items: center;width: 100%;display: flex; margin-top: 10px; margin-bottom: 10px;">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
              </div>
              <div
                style="color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                class="inventory-item" v-for="endpoint in endpointProfil">
                <div> <span>{{ endpoint.name }}: </span>
                  <span v-if="typeof endpoint.value === 'number'">{{ endpoint.value.toFixed(2) }}</span>
                  <span v-else>{{ endpoint.value }} </span>
                  <span v-if="endpoint.unit">{{ endpoint.unit }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="blocInformation">
            <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;">Tickets
            </span>
            <div v-if="ticketsList && ticketsList[0]" class="inventory-container">
              <div
                style="color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                class="inventory-item">
                <div>Nombre de tickets : {{ ticketsList[0].length }} </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ONGLET attribut (attribut)-->
        <div v-if="selection == 'Attribut'">
          <h3>Attribut de la selection</h3>

          <div v-for="(item, index) in floorstaticDetails[0].attributsList" class="blocInformation">
            <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif; font-weight: bold;">{{ item.name
              }}</span>
            <div v-if="floorstaticDetails[0].attributsList == null"
              style="justify-content: center; align-items: center; width: 100%; display: flex; margin-top: 10px; margin-bottom: 10px;">
              <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </div>
            <div v-else class="inventory-container">
              <div class="inventory-item"
                style="color:#14202c; padding: 16px; border-radius: 5px; padding-left: 6px; background-color: #f9f9f9; box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                v-for="(attr, index2) in item.attributs">
                <li v-if="isLink(attr.value)">
                  {{ attr.label }}:
                  <a :href="attr.value" target="_blank" style="color: #3498db;">{{ attr.value }}</a>
                </li>
                <li v-else>
                  {{ attr.label }}: {{ attr.value }}
                </li>
              </div>
            </div>
          </div>

          <h3 style="margin-top: 48px; border-bottom: 1px solid #dbdbdb;">Attribut des parents</h3>

          <!-- Section pour afficher les parentAttribut -->
          <div v-for="(parentItem, parentIndex) in parentAttribut" class="parentInformation" :key="parentIndex">
            <div v-for="(parentItems, parentIndexs) in parentItem">
              <div class="blocInformation" v-if="parentItems.documentation.categoryAttributes.length > 0">
                <h3>{{ parentItems.name }}</h3>
                <div v-for="(category, catIndex) in parentItems.documentation.categoryAttributes"
                  class="category-container" :key="catIndex">
                  <h3
                    style="font-size: 19px; font-family: Arial, Helvetica, sans-serif; font-weight: bold; margin-top: 10px;">
                    {{ category.name }}
                  </h3>
                  <div class="category-attributes"
                    style="color:#14202c;margin: 5px; padding: 16px; border-radius: 5px; padding-left: 6px; background-color: #f9f9f9; box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                    <li v-for="(attr, attrIndex) in category.attributs" :key="attrIndex">{{ attr.label }}: {{
                      attr.value
                      }}
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ONGLET TICKETS -->
        <div v-if="selection == 'Tickets'">
          <Alert :type_alert="type_alert" :show="alert" :text="alert_ind" />
          <!-- Vérification si les tickets existent -->
          <AddTicketBtn @open-dialog="ShowDialog()" />
          <div v-if="ticketsList">
            <FormTicket :value="showFormTicket" @close-dialog="ShowDialog()" :selectedZone="selectedZone"
              @add-ticket="showAlert" />
            <!-- Button d'ajout d'un ticket  -->

            <!-- Boucle sur chaque ticket -->
            <div v-for="(ticket, index) in ticketsList" :key="index" class="blocInformation">
              <div class="">
                <div>
                  <!-- Affichage des informations principales du ticket -->
                  <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;"> {{
                    ticket.name }}</span>
                  <div class="back_blanc">
                    <li><strong>Description :</strong> {{ ticket.description }}</li>
                    <li><strong>Date de création :</strong> {{ new Date(ticket.creationDate).toLocaleString() }}</li>
                    <li><strong>Priorité :</strong> {{ ticket.priority }}</li>
                    <li><strong>Étape actuelle :</strong> {{ ticket.step.name }}</li>
                    <li><strong>Processus :</strong> {{ ticket.process.name }}</li>
                    <li><strong>Nom du workflow :</strong> {{ ticket.workflowName }}</li>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Affichage lorsqu'il n'y a pas de tickets -->
          <div v-if="ticketsList && ticketsList.length === 0"
            style="width: 100%; height: 200px; font-size: 20px ; display: flex; justify-content: center; align-items: center">
            <p>Aucun ticket disponible.</p>
          </div>
        </div>


        <!-- ONGLET POINT DE MESURE (endpoints)-->
        <div v-if="selection == 'Points de mesures'">
          <div v-for="(item, index) in floorstaticDetails[0].endpoints" :key="index" class="blocInformation">
            <div v-if="!floorstaticDetails[0].endpoints">
              <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </div>
            <div v-else class="inventory-container">
              <div class="inventory-item"
                style="color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;width: 100%;">
                <li> {{ item.name }}: {{ item.value }} {{ item.unit || '' }}</li>
              </div>
            </div>
          </div>
        </div>


        <!-- ONGLET INDICATEUR (controleEndpoint) indicateur -->
        <div style="display: flex">
          <div v-if="ActiveData && selection == 'Indicateur' && labelsChart" class="graphContainer">

            <LineCardComponent :title="'Donnée Insight'" :labels="labelsChart" :datasets="chartData"
              :step="labelsChart.length" :tooltipCallbacks="{
                title: (context) => { },
                label: (tooltipItem) =>
                  `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(
                    2
                  )} `,
                footer: (data) => { },
              }"></LineCardComponent>
            <!-- </sc-line-card> -->
          </div>
          <div style="width: 100%;" v-if="selection == 'Indicateur'">

            <div v-for="(item, index) in floorstaticDetails[0].controlEndpoint" class="blocInformation">
              <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;">{{
                item.profileName }}</span>
              <div v-if="floorstaticDetails[0].controlEndpoint == null"
                style="justify-content: center;align-items: center;width: 100%;display: flex; margin-top: 10px ; margin-bottom: 10px;">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
              </div>
              <div v-else>
                <div class="inventory-container"
                  v-for="(item, index2) in floorstaticDetails[0].controlEndpoint[index].endpoints" :key="index2">
                  <div class=" inventory-item"
                    :style="{ width: '100%', color: '#14202c', padding: '16px', borderRadius: '5px', paddingLeft: '6px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px' }">
                    <li>{{ item.name }}: {{ item.value }}</li>
                    <v-icon @click="() => {
                      fullData()
                      addOrRemove(item.dynamicId);
                      resize();
                    }"
                      v-if="cpIdToDraw.includes(item.dynamicId) && !activeChart.includes(item.dynamicId)">mdi-chart-line</v-icon>
                    <v-icon @click="() => {
                      addOrRemove(item.dynamicId);
                    }" v-if="activeChart.includes(item.dynamicId)">mdi-close</v-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>




        <!-- ONGLET DOCUMENTATION -->
        <div v-if="selection == 'Documentation'"
          style="display: flex; flex-direction: column; overflow: hidden !important; overflow-y: auto !important ;">
          <!-- Notification -->
          <Alert :type_alert="type_alert" :show="alert" :text="alert_ind" />
          <!-- Box pour afficher le document -->
          <!-- Boutton d'ajout d'un document -->
          <v-row style="padding: 20px;">
            <AddBtn @open-dialog="ShowFormDoc" />
          </v-row>
          <FormDoc :isDialogOpen="show_formdoc" @close-dialog="ShowFormDoc" @add-doc="showAlert"
            :referenceid="this.selectedZone.dynamicId" />
          <div style="width: 100%; flex-direction: column;">
            <h3>{{ floorstaticDetails[0].name }}</h3>
            <div class="blocInformation">
              <div v-if="documentation.element != 0">

                <div style="display: flex; justify-content: space-between; align-items: center;  width: 100%;"
                  v-for="(item, index) in documentation.element">
                  <div class="inventory-item"
                    style="width: 100%;  overflow: hidden; color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">

                    <li style="list-style: none;">
                      <v-icon :style="{ 'color': getIcon(item.Name).color }">{{ getIcon(item.Name).name }}</v-icon>

                      {{ item.Name }}

                    </li>

                  </div>

                  <v-row
                    style="display: flex; flex-wrap: nowrap; align-items: center; justify-content: flex-end; gap: 10px; padding: 10px; width: max-content;">
                    <v-icon
                      style="width: max-content; height: max-content; background-color: rgba(203 213 225 0.5); border-radius: 50%; padding: 4px; color: #14202c; cursor: pointer;"
                      @click="showDoc(item.dynamicId, item.Name);">
                      mdi-eye
                    </v-icon>
                    <v-icon @click="downloadFile(item.dynamicId)" style="cursor: pointer; font-size: 40px;"
                      color="green">
                      mdi-download-box
                    </v-icon>
                  </v-row>
                </div>
                <Loader :showLoader="showLoader" />
              </div>
              <div v-else style="width: 100%; text-align: center;">
                <p>Aucun document</p>
              </div>
              <!-- fin -->
            </div>
          </div>

          <h3 style="border-bottom: 1px solid #d7d7d7; margin-top: 48px">Documents des Parents</h3>
          <br>
          <div v-for="(parent, index) in documentation.parents" :key="index">
            <div v-if="parent.documentation && parent.documentation.length > 0">
              <h3>{{ parent.name }}</h3>
              <div class="blocInformation">
                <div style="display: flex;" v-for="(item, index2) in parent.documentation" :key="index2">
                  <div class="inventory-item"
                    style="max-width: 100%; width: 99%;  overflow: hidden; color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                    <li style="list-style: none;">
                      <v-icon :style="{ 'color': getIcon(item.Name).color }">{{ getIcon(item.Name).name }}</v-icon>
                      {{ item.Name }}
                    </li>
                  </div>
                  <v-row
                    style="display: flex; flex-wrap: nowrap; align-items: center; justify-content: flex-end; padding: 10px; width: max-content; gap: 10px">
                    <v-icon
                      style="width: max-content; height: max-content; background-color: rgba(203 213 225 0.5); border-radius: 50%; padding: 4px; color: #14202c; cursor: pointer;"
                      @click="showDoc(item.dynamicId, item.Name)">
                      mdi-eye
                    </v-icon>
                    <v-icon @click="downloadFile(item.dynamicId)" style="cursor: pointer; font-size: 40px;"
                      color="green">
                      mdi-download-box
                    </v-icon>
                  </v-row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="description">
        <span
          style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold; margin-left: 9px;">Accès
          aux
          applications</span>

        <div class="container_cards">
          <div v-for="item in appTab" class="cardDescription">
            <div @click="() => {
              $emit('changeRoute', item.id);
            }" class="data_cardDescription">
              <div class="description_data_cardDescription">
                {{ item.name }}
              </div>
            </div>
            <div class="gotoApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="#14202c" class="bi bi-chevron-right"
                viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Watch } from "vue-property-decorator";
import { PAGE_STATES } from "../../interfaces/pageStates";
import Component from "vue-class-component";
import SpriteComponentMobile from "./SpriteComponentMobile.vue";
import { IConfig, ITemporality } from "../../interfaces/IConfig";
import { ISpaceSelectorItem } from "global-components";
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import lodash from "lodash";
import { State } from "vuex-class";
import { MutationTypes } from "../../services/store/appDataStore/mutations";
import { mapState } from "vuex";
import SpriteComponent from "./SpriteComponent.vue"
import GroupDataView from "./groupDataView.vue";
import BreadcrumbSelector from "./breadcrumb.vue";
import { computed } from 'vue';
import Alert from '../Alert.vue'
import ShowDocumentation from '../Documentation.vue'
import {
  EmitterViewerHandler,
  VIEWER_AGGREGATE_SELECTION_CHANGED,
} from "spinal-viewer-event-manager";
import { log, warn } from "console";
import { getParent } from "../../services/spinalAPI/GeographicContext/geographicContext";
import LineCardComponent from "./LineCardComponent.vue";
import moment from 'moment';
import FormTicket from "../FormTicket.vue";
import AddTicketBtn from "../ButtonAddticket.vue";
import FormDoc from "../FormDoc.vue";
import AddBtn from '../ButtonAdd.vue';
import Loader from "../Loader.vue";
import Loader from "../Loader.vue";
import getIcon from "../../services/function/getIcon";

@Component({
  components: {
    GroupDataView,
    SpriteComponentMobile,
    BreadcrumbSelector,
    LineCardComponent,
    FormTicket,
    AddTicketBtn,
    Alert,
    ShowDocumentation,
    FormDoc,
    AddBtn,
    Loader
  },
  filters: {},
})
class dataSideApp extends Vue {

  @Prop() config!: IConfig;
  @Prop() selectedZone: ISpaceSelectorItem;
  @Prop() data: any[];
  @Prop() floor: any;
  @Prop() DActive: boolean;
  @Prop() ActiveData: boolean;

  showFormTicket: boolean = false;
  showDocvalue: boolean = false;
  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  isBuildingSelected: boolean = true;
  retry: Function;
  referenceObjects: any[];
  inventory: any;
  appTab: any[] = [];
  inventoyList: any = null;
  inventoryDbids: any = null;
  floorstaticDetails: any = [];
  endpointProfil: any = null;
  buildingInfo: any;
  attributProfil: any = null;
  selection: string = 'Vue Globale';
  documentation: any;
  modefull = false;
  isSmallScreen: any;
  displaySprite: boolean = false;
  parentAttribut: any = [];
  ticketsList: any = [];
  eyes: [] = [];
  ink: [] = [];
  referencedId: any = 0;
  referencedType: any = 'building';
  cpIdToDraw: [];
  beginDate: any = null
  endDate: any = null
  dataTable: any = [];
  activeChart: any = []
  labelsChart: any = null
  chartData: any = null
  t_index: number = 0;
  timeactuelle: string = "date ?"
  listWorkFlow: any = null;
  alert_ind = ''
  type_alert = ''
  alert = false
  idDoc: number = 0
  nameFile = ''
  show_formdoc = false
  showLoader = false
  getIcon = getIcon

  get dynamicItems(): string[] {
    let items = ['Vue Globale', 'Attribut', 'Documentation', 'Tickets'];

    if (this.floorstaticDetails.some(detail =>
      detail?.controlEndpoint?.some(endpoint => endpoint?.endpoints?.length > 0)
    )) {
      items.push('Indicateur');
    }

    if (this.floorstaticDetails.some(detail =>
      detail?.endpoints && detail.endpoints.length > 0
    )) {
      items.push('Points de mesures');
    }

    return items;
  }

  get temporality() {
    return this.$store.state.appDataStore.temporalitySelected.name;
  }

  ShowDialog() {
    this.showFormTicket = !this.showFormTicket;
  }
  ShowFormDoc() {
    this.show_formdoc = !this.show_formdoc;
  }
  async showAlert(v) {
    const buildingId = localStorage.getItem("idBuilding");
    if (v.status === 'success') {
      this.alert = true
      this.alert_ind = v.message
      this.type_alert = v.status

      switch (v.context) {
        case 'ticket':
          const parentPromise = [
            this.$store.dispatch(ActionTypes.GET_TICKET, {
              buildingId: buildingId,
              referenceIds: this.selectedZone.dynamicId,
            }),
          ];
          const resultParent = await Promise.all(parentPromise);
          const tickets = resultParent;
          this.ticketsList = tickets[0].reverse();
          break;
        case 'document':
          const parentPromiseDoc = [
            this.$store.dispatch(ActionTypes.GET_PARENT, {
              buildingId: buildingId,
              referenceIds: this.selectedZone.dynamicId,
            }),
          ];
          const resultParentDoc = await Promise.all(parentPromiseDoc);
          const parents = resultParentDoc[0];

          const documentationPromise = [
            this.$store.dispatch(ActionTypes.GET_DOCUMENTATION, {
              buildingId: buildingId,
              referenceIds: this.selectedZone.dynamicId,
            }),
          ];
          const result = await Promise.all(documentationPromise);
          const documentation = result[0];

          let parentDocumentation = {};
          for (let parent of parents) {
            const parentDocPromise = [
              this.$store.dispatch(ActionTypes.GET_DOCUMENTATION, {
                buildingId: buildingId,
                referenceIds: parent.dynamicId,
              }),
            ];
            const parentDocResult = await Promise.all(parentDocPromise);
            parentDocumentation[parent.dynamicId] = {
              name: parent.name,
              documentation: parentDocResult[0]
            };
          }

          this.documentation = {
            element: documentation,
            parents: parentDocumentation
          };
          break;
        default:
          break;
      }

    } else {
      this.alert = true
      this.alert_ind = v.message
      this.type_alert = v.status
    }

  }
  showDoc(referencedId, nameFile) {
    if (!this.showDocvalue) {
      this.$emit('buttonClicked', 'vueDoc')
    }
    this.nameFile = nameFile
    this.idDoc = referencedId
    this.showDocvalue = true;
  }
  closeVueDoc() {
    this.showDocvalue = false;
    this.$emit('buttonClicked', 'vueDocClose')
  }
  resize() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  changeIcon() {
    this.modefull = !this.modefull
  }

  isLink(value) {
    return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
  }

  hideelement(item) {
    this.$store.commit(MutationTypes.REMOVE_ITEM_TO_HIDE);
    const itemType = item.substring(item.indexOf(' ') + 1);
    const numbers = this.inventoryDbids[itemType] || [];
    this.$store.commit(MutationTypes.SET_ITEM_TO_HIDE, numbers);
    const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query };
    const data = {
      buildingId: this.selectedZone.staticId,
      dynamicId: currentQuery.spaceSelectedId,
      itemToHIde: numbers
    };

    this.$store.dispatch(ActionTypes.HIDE_ITEMS, {
      items: data,
      buildingId: this.selectedZone.staticId,
    });
  }

  gestionBouton() {
    if (!this.displaySprite) {
      this.$emit('full3D');
      this.resize();
      this.changeIcon()
    } else {
      this.displaySprite = false
    }
  }


  async mounted() {
    this.timeactuelle = this.getFormattedDateFromTemporalData();
    await this.getBuildingInfo();

    if (this.selectedZone.type == "building" || window.parent.router.query.spaceSelectedId == this.buildingInfo[0].dynamicId) {
      this.loadBuildingInfo()
    }

    const emitterHandler = EmitterViewerHandler.getInstance();
    emitterHandler.on(VIEWER_AGGREGATE_SELECTION_CHANGED, (data) => {

      if (data)
        this.findDynamicIdByDbid(data[0].dbIds[0], data[0]);

    });
    this.pageSate = PAGE_STATES.loaded;
    this.isBuildingSelected = true;
  }

  async loadBuildingInfo() {
    await this.getBuildingInfo();
    if (this.buildingInfo[0].dynamicId) {

      const result = await this.getBuildingStaticDetails();

      this.floorstaticDetails = result
      this.filteredEndpoints('building')
      this.getDocumentation(result)
      this.getTicket(result)
      this.filtredAttribut('building')
      this.$forceUpdate();
    }
  }


  async getTicket(data) {
    const buildingId = localStorage.getItem("idBuilding");
    const elementDynamicId = data[0].dynamicId

    const parentPromise = [
      this.$store.dispatch(ActionTypes.GET_TICKET, {
        buildingId: buildingId,
        referenceIds: elementDynamicId,
      }),
    ];

    const resultParent = await Promise.all(parentPromise);

    const tickets = resultParent;
    this.ticketsList = tickets[0].reverse();


  }



  getFormattedDateFromTemporalData() {
    // Assurer une valeur par défaut de 0 pour t_index si ce n'est pas défini
    const temporality = this.$store.state.appDataStore.temporalitySelected.name;
    const t_index = this.t_index || 0;
    let formattedDate;

    switch (temporality) {
      case ITemporality.hour:
        formattedDate = moment().add(t_index, 'hours').startOf('hour').format('DD-MM-YYYY HH:mm:ss');
        break;
      case ITemporality.day:
        formattedDate = moment().add(t_index, 'days').startOf('day').format('DD-MM-YYYY');
        break;
      case ITemporality.week:
        // Pour les semaines, afficher la semaine entière, ex: "15-11-2024 au 21-11-2024"
        const weekStart = moment().add(t_index, 'weeks').startOf('week').format('DD-MM-YYYY');
        const weekEnd = moment().add(t_index, 'weeks').endOf('week').format('DD-MM-YYYY');
        formattedDate = `${weekStart} au ${weekEnd}`;
        break;
      case ITemporality.month:
        // Afficher le mois et l'année, ex: "Novembre 2023"
        formattedDate = moment().add(t_index, 'months').startOf('month').format('MMMM YYYY');
        break;
      case ITemporality.year:
        // Afficher uniquement l'année, ex: "2024"
        formattedDate = moment().add(t_index, 'years').format('YYYY');
        break;
      default:
        // Si la temporalité est inconnue, retourner la date du jour par défaut
        formattedDate = moment().add(t_index, 'days').startOf('day').format('DD-MM-YYYY');
        break;
    }

    return formattedDate;
  }


  async getDocumentation(data) {

    const buildingId = localStorage.getItem("idBuilding");
    const elementDynamicId = data[0].dynamicId;

    const parentPromise = [
      this.$store.dispatch(ActionTypes.GET_PARENT, {
        buildingId: buildingId,
        referenceIds: elementDynamicId,
      }),
    ];
    const resultParent = await Promise.all(parentPromise);
    const parents = resultParent[0];

    const documentationPromise = [
      this.$store.dispatch(ActionTypes.GET_DOCUMENTATION, {
        buildingId: buildingId,
        referenceIds: elementDynamicId,
      }),
    ];
    const result = await Promise.all(documentationPromise);

    const documentation = result[0];

    let parentDocumentation = {};
    for (let parent of parents) {
      const parentDocPromise = [
        this.$store.dispatch(ActionTypes.GET_DOCUMENTATION, {
          buildingId: buildingId,
          referenceIds: parent.dynamicId,
        }),
      ];
      const parentDocResult = await Promise.all(parentDocPromise);
      parentDocumentation[parent.dynamicId] = {
        name: parent.name,
        documentation: parentDocResult[0]
      };
    }

    this.documentation = {
      element: documentation,
      parents: parentDocumentation
    };

    this.$forceUpdate();
  }

  fullData() {
    const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query };

    if (currentQuery.mode != 'data') {
      this.$emit('buttonClicked');
    }
  }

  async getBuildingStaticDetails() {

    const promises = [
      this.$store.dispatch(ActionTypes.GET_BUILDING_STATIC_DETAILS, {
        buildingId: localStorage.getItem("idBuilding"),
        referenceIds: this.buildingInfo[0].dynamicId
      }),
    ];
    const result = await Promise.all(promises);
    return result
  }
  async downloadFile(referenceIds) {
    const promises = [
      this.$store.dispatch(ActionTypes.POST_DOWNLOAD_FILE, {
        buildingId: localStorage.getItem("idBuilding"),
        referenceIds: referenceIds
      }),
    ];
    const result = await Promise.all(promises);

    result.forEach(blob => {
      const type = blob.type.split('/', 2);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'filename.' + type[1]);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    });

    return result;
  }


  async getBuildingInfo() {
    const buildingId = localStorage.getItem("idBuilding");

    const promises = [
      this.$store.dispatch(ActionTypes.GET_BUILDING_INFO, {
        buildingId,
      }),
    ];
    const result = await Promise.all(promises);
    this.buildingInfo = [...result]
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


  checkForReferenceObjectRoom(list) {
    return list.some(item => item.name === "hasReferenceObject.ROOM");
  }


  async findDynamicIdByDbid(dbidToFind, data) {
    const buildingId = localStorage.getItem("idBuilding");
    const BimObject = [
      {
        "bimFileId": data.modelId.bimFileId,
        "dbids": data.dbIds
      }
    ]
    const referenceResult = await this.getBIMInfo(BimObject)

    const isRoom = this.checkForReferenceObjectRoom(referenceResult[0][0].bimObjects[0].parent_relation_list)

    if (isRoom) {
      const objects = this.referenceObjects;
      for (const obj of objects[0]) {
        if (Array.isArray(obj.infoReferencesObjects)) {
          for (const ref of obj.infoReferencesObjects) {
            if (ref.dbid === dbidToFind && data.modelId.bimFileId == obj.bimFileId) {
              const referenceIds = obj.dynamicId
              const promises = [
                this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS, {
                  buildingId,
                  referenceIds
                }),
              ];
              const result = await Promise.all(promises);
              this.forgeItem(result, buildingId, ref.dbid, obj.bimFileId, data.center)
              return;
            }
          }
        }
      }
      return null;
    }
    else {
      const referenceIds = referenceResult[0][0].bimObjects[0].dynamicId
      const promises = [
        this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
          buildingId,
          referenceIds
        }),
      ];


      const result = await Promise.all(promises);
      this.forgeItem(result, buildingId, data.dbIds[0], data.modelId.bimFileId[0], data.center)
      return;
    }
  }

  async getfloorstaticdetails(id) {
    const buildingId = localStorage.getItem("idBuilding");

    const promises = [
      this.$store.dispatch(ActionTypes.GET_FLOOR_STATIC_DETAILS, {
        buildingId,
        referenceIds: id
      }),
    ];
    const result = await Promise.all(promises);
    this.floorstaticDetails = result
    this.filteredEndpoints('floor')
    this.getDocumentation(result)
    this.filtredAttribut('floor')
    this.getTicket(result)
    this.createApp(result)
    this.$forceUpdate();
  }

  async getroomstaticdetails(id) {

    const buildingId = localStorage.getItem("idBuilding");
    const promises_node = [
      this.$store.dispatch(ActionTypes.GET_NODE_READ, {
        buildingId,
        referenceIds: [id]
      }),
    ];

    const node_read = await Promise.all(promises_node);

    if (node_read[0].type == "geographicRoom") {

      const promises = [
        this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS, {
          buildingId,
          referenceIds: [id]
        }),
      ];

      this.referencedType = node_read[0].type
      this.referencedId = id

      const result = await Promise.all(promises);

      this.floorstaticDetails = result
      this.filteredEndpoints('room')
      this.getDocumentation(result)
      this.getTicket(result)
      this.filtredAttribut('room')
      this.createApp(result)

    } else if (node_read[0].type == 'BIMObject') {


      this.referencedType = 'BIMObject'
      this.referencedId = id

      const promises = [
        this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
          buildingId,
          referenceIds: [id]
        }),
      ];

      const result = await Promise.all(promises);

      this.floorstaticDetails = result
      this.filteredEndpoints('equipement')
      this.getDocumentation(result)
      this.getTicket(result)
      this.filtredAttribut('equipement')
      this.$forceUpdate();
    } else {
      this.referencedType = 'etage'
      this.referencedId = id
    }

  }


  createApp(tab) {
    let objetApp = [];
    if (!this.config || !this.config.application) {
      // console.warn("Configuration manquante");
      return [];
    }

    this.config.application.forEach(application => {
      const { name, id, type, targetValue, profileName, unit } = application;
      let appObject = { name, id, value: null, unit: unit };

      if (type === "controlEndpoint") {
        const matchedProfile = tab[0].controlEndpoint.find(profile => profile.profileName === profileName);
        if (matchedProfile) {
          if (targetValue) {
            const targetEndpoint = matchedProfile.endpoints.find(endpoint => endpoint.name === targetValue);
            if (targetEndpoint) {
              appObject.value = targetEndpoint.value;
              if (targetEndpoint.unit) {
                appObject.unit = targetEndpoint.unit;
              }
            } else {
              console.warn("Aucun endpoint correspondant trouvé pour la targetValue donnée.");
            }
          } else {
            appObject.value = matchedProfile.endpoints?.length || 5
          }
        } else {
          console.warn('Pas de profil qui match');
        }
      } else if (type === "tickets") {
        if (!targetValue) {

          appObject.value = tab[0]?.tickets?.length;
        } else {
          console.warn('Pas de donnée disponible pour les tickets avec targetValue.');
        }
      } else {
        console.warn('Type non supporté, valeur non définie');
      }

      objetApp.push(appObject);
    });
    this.appTab = [...objetApp];
    return objetApp;
  }


  async getParentAttribut() {
    const buildingId = localStorage.getItem("idBuilding");
    const elementDynamicId = this.floorstaticDetails[0].dynamicId;

    const parentPromise = [
      this.$store.dispatch(ActionTypes.GET_PARENT, {
        buildingId: buildingId,
        referenceIds: elementDynamicId,
      }),
    ];

    const resultParent = await Promise.all(parentPromise);
    const parents = resultParent[0];

    const parentDynamicIds = parents.map(parent => parent.dynamicId);

    const parentDocPromise = [
      this.$store.dispatch(ActionTypes.GET_ATTRIBUT_LIST_MULTIPLE, {
        buildingId,
        referenceIds: parentDynamicIds,
      }),
    ];

    const parentDocResult = await Promise.all(parentDocPromise);
    const parentDocumentationResult = parentDocResult[0];

    let parentDocumentation = {};
    parents.forEach((parent, index) => {
      parentDocumentation[parent.dynamicId] = {
        name: parent.name,
        documentation: parentDocumentationResult[index]
      };
    });

    this.parentAttribut = {
      parents: parentDocumentation
    };

  }

  filtredAttribut(type) {
    this.getParentAttribut();
    let data = this.floorstaticDetails[0].attributsList
    let attributProfil = [];

    if (type === "floor") {
      const floorDetail = data.find(detail => detail.name.toLowerCase() === this.config.floor.profileNameAttribut.toLowerCase());
      if (floorDetail) {
        attributProfil = floorDetail.attributs;
      }
    }
    else if (type === "room") {
      const buildingDetail = data.find(detail => detail.name.toLowerCase() === this.config.room.profileNameAttribut.toLowerCase());
      if (buildingDetail) {
        attributProfil = buildingDetail.attributs;
      }
    }
    else if (type === "equipement") {
      const buildingDetail = data.find(detail => detail.name.toLowerCase() === this.config.equipement.profileNameAttribut.toLowerCase());
      if (buildingDetail) {
        attributProfil = buildingDetail.attributs;
      }
    }
    else {
      const buildingDetail = data.find(detail => detail.name.toLowerCase() === this.config.batiment.profileNameAttribut.toLowerCase());
      if (buildingDetail) {
        attributProfil = buildingDetail.attributs;
      }
    }
    this.attributProfil = attributProfil

  }


  filteredEndpoints(type) {
    if (type == "floor") {
      const profile = this.floorstaticDetails[0].controlEndpoint.find(profile => profile.profileName === this.config.floor.profileNameControlePts);
      this.endpointProfil = profile ? profile.endpoints : [];
    } else if (type == "building") {
      const profile = this.floorstaticDetails[0].controlEndpoint.find(profile => profile.profileName === this.config.batiment.profileNameControlePts);
      this.endpointProfil = profile ? profile.endpoints : [];
    } else if (type == "equipement") {
      const profile = this.floorstaticDetails[0].controlEndpoint.find(profile => profile.profileName === this.config.equipement.profileNameControlePts);
      this.endpointProfil = profile ? profile.endpoints : [];
    } else {
      const profile = this.floorstaticDetails[0].controlEndpoint.find(profile => profile.profileName === this.config.room.profileNameControlePts);
      this.endpointProfil = profile ? profile.endpoints : [];
    }
  }

  forgeItem(result, buildingId, dbid, bimFileId, center) {

    let X = center.x;
    let Y = center.y;
    let Z = center.z;

    const item = {
      color: '#ded638',
      dynamicId: result[0].dynamicId,
      buildingId: buildingId,
      dbid: dbid,
      bimFileId: bimFileId,
      name: result[0].name,
      position: new THREE.Vector3(Number(X), Number(Y), Number(Z)),
      data: result[0],
      config: this.config
    }
    this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);

    const screenWidth = window.innerWidth;
    if (screenWidth <= 700) {
      this.displaySprite = false;
      this.isSmallScreen = item;
      this.displaySprite = true;
    } else {
      this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
        items: item,
        buildingId: buildingId,
        component: SpriteComponent,
      });
    }
  }

  handleClose() {
    this.displaySprite = false;
  }

  extractUniqueInventoryNames() {
    let uniqueNames = new Set();
    const dataArray = this.inventory[0]
    dataArray.forEach(data => {
      if (data.inventories) {
        data.inventories.forEach(inventory => {
          if (inventory.name) {
            uniqueNames.add(inventory.name);
          }
        });
      }
    });
    return Array.from(uniqueNames);
  }

  async retriveData() {
    try {
      this.pageSate = PAGE_STATES.loading;
      const buildingId = localStorage.getItem("idBuilding");
      const patrimoineId = JSON.parse(localStorage.getItem("patrimoine"))?.id;
      const promises = [
        this.$store.dispatch(ActionTypes.GET_ROOMS, {
          buildingId,
          patrimoineId,
          floorId: this.selectedZone.staticId,
          id: this.selectedZone.dynamicId,
        }),
      ];
      const result = await Promise.all(promises);

      this.$store.commit(MutationTypes.SET_DATA, result[0]);
      this.pageSate = PAGE_STATES.loaded;
    } catch (err) {
      console.log(err);
      this.retry = this.retriveData;
      this.pageSate = PAGE_STATES.error;
    }
  }

  selectDataView(item) {
    this.$emit("clickOnDataView", item);
  }

  getDataDynamicIdtab() {
    const dynamicIds = this.data.map(obj => obj.dynamicId);

    this.fetchReferenceObjects(dynamicIds)
    this.getInventoryObject(dynamicIds)
  }
  async fetchReferenceObjects(referenceIds) {
    const buildingId = localStorage.getItem("idBuilding");

    const promises = [
      this.$store.dispatch(ActionTypes.GET_REFERENCE_OBJECT_LIST_MULTIPLE, {
        buildingId,
        referenceIds
      }),
    ];
    const result = await Promise.all(promises);
    this.referenceObjects = [...result];

  }
  async getInventoryObject(referenceIds) {
    const buildingId = localStorage.getItem("idBuilding");
    const promises = [
      this.$store.dispatch(ActionTypes.GET_INVENTORY_MULTIPLE, {
        buildingId,
        referenceIds
      }),
    ];
    const result = await Promise.all(promises);
    this.inventory = [...result];
    this.countInventoryTypes([...result]);
  }

  async addOrRemove(dyn) {

    if (this.activeChart.includes(dyn)) {
      this.dataTable = this.dataTable.filter(item => item.dynamicId !== dyn);
      this.activeChart = this.activeChart.filter(id => id !== dyn);
      this.removegraphInfoCp(dyn)
    }
    else {
      this.addgraphInfoCp(dyn)
      this.activeChart.push(dyn);
    }
  }
  async removegraphInfoCp(dyn) {
    const datatable = this.dataTable
    this.chartData = this.chartDataObject(datatable)
  }

  parseDateString(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    return new Date(`${year}-${month}-${day}T${timePart}`);
  }

  async addgraphInfoCp(dyn) {
    if (!this.cpIdToDraw.includes(dyn)) return;

    const { begintime, endtime } = this.getBeginAndEndTime();
    const buildingId = localStorage.getItem("idBuilding");
    const beginTimestamp = this.parseDateString(begintime).getTime();
    const endTimestamp = this.parseDateString(endtime).getTime();

    const result = await this.$store.dispatch(ActionTypes.GET_TIMES_SERIES, {
      buildingId,
      referenceIds: dyn,
      begin: begintime,
      end: endtime,
    });

    const timeStep = 60000; // Une minute en millisecondes
    const seenMinutes = new Map();

    result.forEach(({ date, value }) => {
      const minuteTimestamp = Math.floor(new Date(date).getTime() / timeStep) * timeStep;
      seenMinutes.set(minuteTimestamp, value);
    });

    const processedResult = Array.from({ length: Math.floor((endTimestamp - beginTimestamp) / timeStep) + 1 }, (_, i) => {
      const date = beginTimestamp + i * timeStep;
      return {
        date,
        value: seenMinutes.get(date) ?? NaN,
      };
    });


    // Mettre à jour le tableau de données
    const actuelleTable = {
      dynamicId: dyn,
      data: processedResult.map(({ date, value }) => ({ x: date, y: value })),
      unit: "kwh",
      name: "le nom du graph",
    };

    this.dataTable = [...this.dataTable, actuelleTable];
    this.labelsChart = this.labels(begintime, endtime).map(this.toDate);
    this.chartData = this.chartDataObject(this.dataTable);
  }

  //fonction pour retourner la date string ( beging et end )
  getBeginAndEndTime() {
    const temporality = this.$store.state.appDataStore.temporalitySelected.name;
    const t_index = this.t_index || 0; // Assurer une valeur par défaut de 0 si t_index n'est pas défini
    let begintime, endtime;

    switch (temporality) {
      case ITemporality.hour:
        begintime = moment().add(t_index, 'hours').startOf('hour').format('DD-MM-YYYY HH:mm:ss');
        endtime = moment().add(t_index, 'hours').endOf('hour').format('DD-MM-YYYY HH:mm:ss');
        break;
      case ITemporality.day:
        begintime = moment().add(t_index, 'days').startOf('day').format('DD-MM-YYYY HH:mm:ss');
        endtime = moment().add(t_index, 'days').endOf('day').format('DD-MM-YYYY HH:mm:ss');
        break;
      case ITemporality.week:
        begintime = moment().add(t_index, 'weeks').startOf('week').format('DD-MM-YYYY HH:mm:ss');
        endtime = moment().add(t_index, 'weeks').endOf('week').format('DD-MM-YYYY HH:mm:ss');
        break;
      case ITemporality.month:
        begintime = moment().add(t_index, 'months').startOf('month').format('DD-MM-YYYY HH:mm:ss');
        endtime = moment().add(t_index, 'months').endOf('month').format('DD-MM-YYYY HH:mm:ss');
        break;
      case ITemporality.year:
        begintime = moment().add(t_index, 'years').startOf('year').format('DD-MM-YYYY HH:mm:ss');
        endtime = moment().add(t_index, 'years').endOf('year').format('DD-MM-YYYY HH:mm:ss');
        break;
      default:
        // Retourner la journée actuelle par défaut, ajustée avec t_index
        begintime = moment().add(t_index, 'days').startOf('day').format('DD-MM-YYYY HH:mm:ss');
        endtime = moment().add(t_index, 'days').endOf('day').format('DD-MM-YYYY HH:mm:ss');
        break;
    }

    return { begintime, endtime };
  }



  toDate(date) {
    switch (this.$store.state.appDataStore.temporalitySelected.name) {
      case ITemporality.hour:
        return moment(date).format('HH:mm');
      case ITemporality.day:
        return moment(date).format('HH[h]');
      case ITemporality.week:
        return moment(date).format('dd');
      case ITemporality.month:
        return moment(date).format('D/M/YY');
      case ITemporality.year:
        return moment(date).format('MMM');
      case ITemporality.custom:
        const { begin, end } =
          this.$store.state.appDataStore.temporalitySelected.range;
        const duration = moment.duration(
          moment(end, 'DD-MM-YYYY HH:mm:ss').diff(
            moment(begin, 'DD-MM-YYYY HH:mm:ss')
          )
        );
        if (duration.asMonths() > 2) return moment(date).format('MMM');
        if (duration.asDays() > 1) return moment(date).format('D/M/YY');
        if (duration.asHours() > 1) return moment(date).format('HH[h]');
        return moment(date).format('HH:mm');
      default:
        return moment(date).format('D/M/YY');
    }
  }

  labels(begin, end) {
    if (!this.dataTable) {
      return [];
    }

    const parseDate = (dateStr) => {
      const [day, month, yearTime] = dateStr.split('-');
      const [year, time] = yearTime.split(' ');
      const [hours, minutes, seconds] = time.split(':');


      return new Date(
        parseInt(year, 10),      // Année
        parseInt(month, 10) - 1, // Mois (0 = janvier, donc on soustrait 1)
        parseInt(day, 10),       // Jour
        parseInt(hours, 10),     // Heures
        parseInt(minutes, 10),   // Minutes
        parseInt(seconds, 10)    // Secondes
      );
    };

    const beginDate = parseDate(begin);
    const endDate = parseDate(end);

    const dates = [];
    const interval = 60 * 1000; // Intervalle d'une journée en millisecondes

    for (let date = beginDate; date <= endDate; date = new Date(date.getTime() + interval)) {
      dates.push(new Date(date)); // Ajoute une nouvelle date au tableau
    }

    return dates;
  }

  async reloadNewChartData() {
    this.dataTable = [];

    for (const id of this.activeChart) {
      await this.addgraphInfoCp(id);
    }
  }



  chartDataObject(dataTable) {
    const l1: any = []
    dataTable.forEach((el, index) => {
      l1.push({ data: [...el.data], label: 'graph 1' + index, color: 'blue', dynamicId: el.dynamicId, specialAxis: index });
    });

    return l1;
  }


  closeeyes(index) {
    const indexPosition = this.eyes.indexOf(index);
    if (indexPosition === -1) {
      this.eyes.push(index);
    } else {
      this.eyes.splice(indexPosition, 1);
    }
  }
  closeink(index) {
    const indexPosition = this.ink.indexOf(index);
    if (indexPosition === -1) {
      this.ink.push(index);
    } else {
      this.ink.splice(indexPosition, 1);
    }
  }

  countInventoryTypes(floors) {
    const inventoryCounts = {};
    const inventoryDbids = {};

    floors[0].forEach(floor => {
      if (floor.inventories) {
        const typologyInventory = floor.inventories.find(inventory => inventory.name === this.config.inventory);

        if (typologyInventory) {
          typologyInventory.inventory.forEach(group => {
            if (inventoryCounts[group.name]) {
              inventoryCounts[group.name] += group.equipments?.length;
            } else {
              inventoryCounts[group.name] = group.equipments?.length;
            }

            group.equipments.forEach(equipment => {
              const bimFileId = equipment.bimFileId;

              if (!inventoryDbids[group.name]) {
                inventoryDbids[group.name] = {};
              }

              if (!inventoryDbids[group.name][bimFileId]) {
                inventoryDbids[group.name][bimFileId] = [];
              }

              inventoryDbids[group.name][bimFileId].push(equipment.dbid);
            });
          });
        } else {
          console.warn(`Aucun inventaire trouvé pour le type "${this.config.inventory}" dans cet étage.`);
        }
      } else {
        console.warn(`Aucun inventaire trouvé pour cet étage :`, floor);
      }
    });

    const results = [];
    for (const [key, value] of Object.entries(inventoryCounts)) {
      results.push(`${value} ${key}`);
    }

    this.inventoyList = results;
    this.inventoryDbids = inventoryDbids;
    this.$forceUpdate();

    return results;
  }


  /**
   * Watch
   */

  @Watch('temporality')
  @Watch('t_index')
  onTemporalDataChanged() {
    this.timeactuelle = this.getFormattedDateFromTemporalData();
    //ajouter le nouvelle fonction qui va chercher ledonnées 
    this.reloadNewChartData();
  }

  @Watch("documentation")
  watchDocumentation(newVal) {
    this.documentation = newVal;
  }

  @Watch("alert")
  watchAlert(newVal) {
    if (newVal) {
      this.showLoader = true;
      setTimeout(() => {
        this.alert = false;
        this.showLoader = false;
      }, 5000);
    }
  }
  @Watch("selectedZone")
  watchSelectedZone() {
    if (this.selectedZone.type === "building") {
      this.loadBuildingInfo()
      this.isBuildingSelected = true;
      this.$store.commit(MutationTypes.SET_DATA, []);
      return;
    } else {
      this.isBuildingSelected = false;
      this.retriveData();
    }
  }
  @Watch("showDocvalue")
  watchShowDocvalue(newVal) {
    this.showDocvalue = newVal;
  }
  @Watch("floorstaticDetails")
  async watchFloorstaticDetails(newVal, oldVal) {
    const dynamicIds = newVal[0].controlEndpoint.flatMap(profile => profile.endpoints.map(endpoint => endpoint.dynamicId));
    const buildingId = localStorage.getItem("idBuilding");
    const parentDocPromise = [
      this.$store.dispatch(ActionTypes.GET_ATTRIBUT_LIST_MULTIPLE, {
        buildingId,
        referenceIds: dynamicIds,
      }),
    ];
    const attribut = await Promise.all(parentDocPromise);
    const attributs = attribut[0]
      .filter(element =>
        element.categoryAttributes.some(category =>
          category.attributs.some(attribute => attribute.label === "saveTimeSeries" && attribute.value === 1)
        )
      )
      .map(element => element.dynamicId);

    this.cpIdToDraw = attributs

  }

  @Watch("data")
  watchData() {
    this.referencedId = 0;
    this.referencedType = ''
    if (this.selectedZone.type != "building") {
      if (this.data.length == 0) {
        this.getroomstaticdetails(this.selectedZone.dynamicId)
        this.getInventoryObject([this.selectedZone.dynamicId])
      } else {
        this.getfloorstaticdetails(this.floor)
        this.getDataDynamicIdtab()
      }
    }
    else {
      this.inventoyList = []
    }
  }
}

export { dataSideApp };
export default dataSideApp;
</script>
<style lang="scss">
.graphDataContainer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;

}

.graphContainer {
  border-radius: 0px;
  width: 160%;
  height: 100%;
  display: flex;
  padding: 10px;
}


.back_blanc {
  margin: 6px;
  color: #14202c;
  padding: 9px;
  border-radius: 5px;
  padding-left: 6px;
  background-color: #f9f9f9;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}

.title_attribut {
  font-size: 1.5rem;
}

.cardContainer {
  padding: 10px;
}

.displaydataCss {
  display: none;
}

.entrence {
  -webkit-animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

}

@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.area {
  transform: translate(0, -15px);
}

.w-full {
  width: 100%;
}

.inactiveTable {
  -webkit-animation: fade-out 0.3s ease-out both;
  animation: fade-out 0.3s ease-out both;
}

@-webkit-keyframes fade-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

a {
  text-decoration: none;

}

.inventory-container {
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 260px);
  //padding: 40px;
  margin-top: 5px;
}

.attribut {
  position: relative;
  font-size: 18px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  padding-left: 20px;
  cursor: pointer;
}

// W-full
.appli>div>div {
  // height: calc(100% - 45%);
  // background-color: rgb(57, 119, 45) !important;

}

.attribut::before {
  content: "";
  position: absolute;
  top: -10px;
  bottom: 0;
  left: 0;
  width: 2px;
  height: 176%;
  background-color: rgb(223, 223, 223);
  transform: rotate(25deg);
  transform-origin: left top;
}

.inventory-item {
  width: 48%;
  margin: 5px;
  height: 18px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  justify-content: space-between;
  background-color: white;
}

.v-select__selection--comma {
  font-size: 1.5rem !important;
  font-family: Arial, Helvetica, sans-serif;
  overflow: visible !important;
}


@media (max-width: 960px) {
  .inventory-item {
    width: 100%;
  }

  .area {
    transform: translate(10px, -15px);
  }

  .el3d {
    display: none;
  }
}

.doc-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  width: calc(100% - 55%)
}

.blocInformation {
  background-color: #f8f8f8d0;
  border-radius: 2px;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 11px;
  padding: 5px;
  box-shadow: 0 6px 24px #0000000d, 0 0 0 1px #00000014;
  border: 2px dashed #dbdbdb;
  border-radius: 6px;
}

.Spinal_card {
  font-family: Charlevoix Pro !important;
  cursor: pointer;
  width: 250px;
  height: 100px;
  border-radius: 5px;
  background: linear-gradient(45deg, rgb(209, 209, 209) 0%, rgb(233, 233, 233) 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  margin: 5px
}

.inventory:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 120px;
  border-top: 2px solid rgb(235, 234, 234);
  width: auto;
}

.Spinal_card::before {
  content: "";
  height: 100px;
  width: 100px;
  position: absolute;
  top: -100%;
  left: 100%;
  background: url('../../assets/tets.svg') no-repeat center center;
  background-size: contain;
  transition: all .4s ease;
  filter: invert(1) saturate(5) hue-rotate(200deg) opacity(0.1);
  filter: blur(.5rem);
}

.Spinal_card:hover::before {
  top: 50%;
  left: 50%;
  transform: translate(30%, -0%);
  filter: blur(0rem);
  /* Pour centrer */
}

.Spinal_card:hover::before {
  width: 140px;
  height: 140px;
  top: -30%;
  left: 50%;
  filter: blur(0rem);
}

.text {
  flex-grow: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  color: #14202c;
  font-weight: 900;
  font-size: 1.2em;
  height: 30px
}

.subtitle {
  font-size: .6em;
  font-weight: 300;
  color: #14202c;
}

.icons {
  display: flex;
  justify-items: center;
  align-items: center;
  width: 250px;
  border-radius: 0px 0px 5px 5px;
  overflow: hidden;
}

.btn {
  z-index: 1;
  border: none;
  width: 100%;
  height: 35px;
  background-color: #ececec;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.4s
}

.adaptative {
  width: 80%;
  overflow: hidden;
  height: 50px;
  position: relative;
  right: 0px;
}

.svg-icon {
  width: 25px;
  height: 25px;
  stroke: #14202c;
}

.btn:hover {
  background-color: rgb(199, 199, 199);
}

.button {
  display: inline-block;
  padding: 5px;
  text-decoration: none;
  height: 59px;
  padding-left: 10px;
  padding-right: 10px;
  transition: 0.2s;
  white-space: nowrap;
  margin-left: 20px;
  margin-top: 6px;
  margin-bottom: 18px;
  font-size: xx-large;
  cursor: pointer;
  padding-left: 0px;
}

.button:hover {
  background-color: rgb(228, 228, 228);
}

.v-text-field>.v-input__control>.v-input__slot:before {
  border-style: none !important;
}

.parallelogram {
  transform: skew(-20deg);
}

.skew-fix {
  display: inline-block;
  transform: skew(30deg);
  font-size: 14px;
}

.appli {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: #fff;
  width: 100%;
  height: calc(100% - 10px);
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-content: space-between;
}

.title {
  position: relative;
  width: 100%;
  display: flex;
}

.inventory {
  position: relative;
  padding: 10px;
  height: calc(100% - 30%);
  overflow: auto;
  overflow-x: hidden
}

.inventory:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  border-top: 1px solid rgb(212, 212, 212);
  width: 100%;
}

.description {
  padding: 10px;
  padding-top: 15px;
  background-color: #fff;
  border-top: 2px solid rgb(201, 201, 201);
  overflow: hidden;
  overflow-y: auto;
  height: 30%;
}

.container_cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 10px;
}

.cardDescription {
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  background-color: #fff;
  border-radius: 5px;
  width: 100%;
  height: 50px;
  margin-top: 8px;
  margin-bottom: 14px;
  transition: all .2s;
  display: flex;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 2px #3c40434d, 0 1px 3px 1px #3c404326;
  margin-left: 10px;
}

@media (max-width: 970px) {
  .cardDescription {
    width: 100vw;
  }
}

@media (min-width: 970px) {
  .hide {
    display: none;
    visibility: hidden;
  }
}

.cardDescription:hover {
  background-color: rgb(221, 221, 221);
}

.cardDescription:hover .gotoApp {
  background-color: rgb(218, 218, 218);
}

.data_cardDescription {
  border-right: 1px solid rgb(202, 202, 202);
  // width: 87%;
  width: 100%;
  height: 100%;
  display: flex;
  padding-left: 30px;
}

.gotoApp {
  justify-content: center;
  align-items: center;
  display: flex;
  // width: 13%;
  width: 50px;
  background-color: rgb(243, 243, 243);
  transition: 0.2s;
  z-index: 1;
}

.nombre_data_cardDescription {
  width: 40%;
  display: flex;
  align-items: center;
  font-size: 40px;
  height: 100%;

}

.description_data_cardDescription {
  width: 90%;
  justify-content: center;
  align-items: center;
  display: flex;
  color: #14202c;
  padding-right: 5px;
}

.microinfo {
  margin-bottom: 40px;
  font-size: 9px;
  transform: translate(-20px);
  white-space: nowrap;
  font-weight: bold;
}

.cardDescription::before {
  content: "";
  height: 100px;
  width: 100px;
  position: absolute;
  top: -100%;
  left: 100%;
  background-size: contain;
  transition: all .4s ease;
  filter: invert(1) saturate(5) hue-rotate(200deg) opacity(0.1);
  filter: blur(.5rem);
}

.cardDescription:hover::before {
  top: 50%;
  left: 50%;
  transform: translate(30%, -0%);
  filter: blur(0rem);
}

.cardDescription:hover::before {
  width: 140px;
  height: 140px;
  top: -10%;
  left: 50%;
  filter: blur(0.05rem);
}
</style>