<template>
  <div
    class="main-tab"
    style="
      width: 100%;
      font-size: 14px !important;
      background-color: rgb(255, 255, 255);
      border-radius: 10px !important;
      border-color: black !important;
    "
  >


    <div style="width: 100%;
                display: flex;
                justify-content: flex-end;"> 
      <div style="display: flex;
        flex-direction: column;
        justify-content: space-between; 
        min-width: 39vw; 
        overflow-x: hidden;
        ">

        <!-- BREADCRUMBS -->
        <SpinalbreadCrumb
          @itemSelected="emitValue($event.listType, $event.value)"
          @goBack="goBack"
          @deselectItem="unselectDataView()"
          :ctx_list="ctx_list"
          :cat_list="cat_list"
          :grp_list="grp_list"
          :selected_item="selected_data_item_name"
        ></SpinalbreadCrumb>

        <div
            style="
              margin-top: 20px;
              margin-left: 2px;
              display: flex;
            "
          >
            <div>
              <v-select
                v-model="vSelectedTab"
                :items="vSelectDynamic"
                :label="vSelectLabel"
                outlined
                
                :menu-props="{ offsetY: true, nudgeTop: -20 }"
              ></v-select>
              
            </div>
            <div>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 10px;
                  margin-left: 10px;
                  margin-top: 10px;
                "
              >
                <v-icon
                  large
                  title="Recadrer sur l'espace sélectionné"
                  v-if="$store.state.appDataStore.user_selected.cat"
                  @click="globalFitToView()"
                >
                  mdi-fit-to-screen
                </v-icon>

                <v-icon
                  large
                  title="Ajouter tous les sprites"
                  :class="{ 'disabled-icon': loadingState }"
                  v-if="$store.state.appDataStore.user_selected.cat"
                  @click="globalAddAllSprites()"
                >
                  {{
                    globalSprite
                      ? 'mdi-map-marker-off-outline'
                      : 'mdi-map-marker-outline'
                  }}
                </v-icon>

                <v-icon
                  large
                  title="Colorier tous les éléments"
                  v-if="$store.state.appDataStore.user_selected.cat"
                  @click="globalColorAllGroups()"
                >
                  {{
                    globalColored ? 'mdi-invert-colors-off' : 'mdi-invert-colors'
                  }}
                </v-icon>

                <v-icon
                  large
                  v-if="
                    $store.state.appDataStore.user_selected.cat &&
                    !$store.state.appDataStore.user_selected.grp
                  "
                  @click.stop="globalHideAllGroups()"
                  :title="
                    globalHidden
                      ? 'Afficher tous les groupes dans la 3D'
                      : 'Masquer tous les groupes dans la 3D'
                  "
                >
                  {{ globalHidden ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
                </v-icon>
              </div>
            </div>
        </div>

      </div>

    </div>


    <Alert :type_alert="type_alert" :show="alert" :text="alert_ind" />
    <LoadingSpinner
      :loading="loadingState"
      :message="loadingText"
      :loadingCount="loadingCount"
    />

    <div
      v-show="vSelectedTab === 'Equipements'"
      style="padding: 2px"
      class="scrollable-table-container"
    >
      <DataTable
        ref="dataTable"
        :selectedItemTab="selectedItemTab"
        :height="'64vh'"
        :items="filteredContexts"
        :headers="dynamicHeaders()"
        :contexts="contexts"
        :selections="selections"
        @item-selected="selectDataView($event)"
        @table-item-selected="emitValue($event.listType, $event.value)"
        @unselect-data-view="unselectDataView($event)"
        @fit-to-view="fitToView($event)"
        @filter="filtercolumn($event)"
      />
    </div>

    
    <!-- ONGLET attribut (attribut)-->
    <div v-if="vSelectedTab == 'Attributs'" class="scrollable-content">
      <FormDocAttr
        :isDialogOpen="ShowFormDocAttrs == true"
        @close-dialog="ShowFormDocAttr"
        @validated="handleValidated"
        :item="selectedAttribut"
        :id="idEl"
        :itemOp="itemOp"
      />

      <FormDocCateAttr
        :isDialogOpen="ShowFormDocCat == true"
        @close-dialog="ShowFormDocCate"
        @validatedcate="handleValidatedCate"
        :item="selectedCategory"
        :id="idCatEl"
      />

      <AddBtn
        name="Ajouter un attribut"
        icon="mdi-tag-plus-outline"
        @open-dialog="ShowFormAttribute"
      />
      <FormAttribute
        :show="showFormAttributeValue"
        :referenceId="currentTargetItemId"
        @close-dialog="ShowFormAttribute"
        @add-attribute="showAlert"
      />

      <h3>Attribut de la selection</h3>
      <div
        v-for="(item, index) in vSelectItemAttributes"
        class="blocInformation"
      >
        <div
          style="
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-inline: 10px;
            border-radius: 10px;
            position: relative;
          "
        >
          <span
            style="
              font-size: 19px;
              font-family: Arial, Helvetica, sans-serif;
              font-weight: bold;
            "
            >{{ item.name }}</span
          >
          <div
            v-if="item.name != 'Revit-Autodesk properties'"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              position: relative;
              padding-right: 10px;
            "
          >
            <OverMenu
              :show="itemOverflowMenu == item.dynamicId"
              @close="closeOverMenu"
              :item="item"
              @showDoc="showDoc"
              @editFile="editCattattr(currentTargetItemId, item)"
              @downloadFile="downloadFile"
              :showDocs="false"
              :showDownload="false"
              :editable="true"
              @DeleteFile="
                deleteCateAttr(currentTargetItemId, item.dynamicId, 'parent')
              "
              @changeOverflowItemMenu="changeOverflowItemMenu"
            >
            </OverMenu>
          </div>
        </div>
        <div
          v-if="vSelectItemAttributes == null"
          style="
            justify-content: center;
            align-items: center;
            width: 100%;
            display: flex;
            margin-top: 10px;
            margin-bottom: 10px;
          "
        >
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-else class="inventory-container">
          <div
            class="inventory-item"
            style="
              width: 100%;
              color: #14202c;
              overflow: visible;
              padding: 16px;
              border-radius: 5px;
              padding-left: 6px;
              box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
                rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
            "
            v-for="(attr, index2) in item.attributs"
          >
            <li
              v-if="isLink(attr.value)"
              style="list-style: none; background-color: red; width: 95%"
            >
              {{ attr.label }}:
              <a :href="attr.value" target="_blank" style="color: #3498db">{{
                attr.value
              }}</a>
            </li>
            <li
              v-else
              style="
                list-style: none;
                width: 100%;
                overflow: hidden;
                overflow-x: auto;
              "
            >
              <span style="font-weight: 600"> {{ attr.label }}: </span>
              <span style="font-weight: 400">
                {{ attr.value }} {{ attr.unit }}
              </span>
            </li>
            <div
              v-if="item.name != 'Revit-Autodesk properties'"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 20px;
                position: relative;
              "
            >
              <OverMenu
                :show="
                  itemOverflowMenu == index2 &&
                  itemOverflowMenuAttr == item.dynamicId
                "
                @close="closeOverMenu"
                :item="attr"
                @showDoc="showDoc"
                @editFile="editattr(attr, currentTargetItemId, item)"
                @downloadFile="downloadFile"
                :showDocs="false"
                :showDownload="false"
                :editable="true"
                @DeleteFile="
                  DeleteAttribut(
                    currentTargetItemId,
                    item.dynamicId,
                    attr.label
                  )
                "
                @changeOverflowItemMenu="
                  changeOverflowItemMenuAttr(index2, item.dynamicId)
                "
              >
              </OverMenu>
            </div>
          </div>
        </div>
      </div>

      <h3 style="margin-top: 48px; border-bottom: 1px solid #dbdbdb"
        >Attribut des parents</h3
      >
      <!-- Section pour afficher les parentAttribut -->
      <div
        v-for="(parentItem, parentIndex) in parentAttribut"
        class="parentInformation"
        :key="parentIndex"
      >
        <div v-for="(parentItems, parentIndexs) in parentItem">
          <div
            class="blocInformation"
            v-if="parentItems.documentation.categoryAttributes.length > 0"
          >
            <h3>{{ parentItems.name }}</h3>
            <div
              v-for="(category, catIndex) in parentItems.documentation
                .categoryAttributes"
              class="category-container"
              :key="catIndex"
            >
              <h3
                style="
                  font-size: 19px;
                  font-family: Arial, Helvetica, sans-serif;
                  font-weight: bold;
                  margin-top: 10px;
                "
              >
                {{ category.name }}
              </h3>
              <div
                class="category-attributes"
                style="
                  color: #14202c;
                  margin: 5px;
                  padding: 16px;
                  border-radius: 5px;
                  padding-left: 6px;
                  background-color: #f9f9f9;
                  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
                    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
                "
              >
                <li
                  v-for="(attr, attrIndex) in category.attributs"
                  :key="attrIndex"
                  >{{ attr.label }}: {{ attr.value }}
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ONGLET Documentation -->
    <div v-if="vSelectedTab == 'Documentation'"
      class="scrollable-content"
      :style="{ display: showDocvalue ? 'flex' : '', flexDirection: showDocvalue ? 'row' : '' }"
    >
      <div style="flex-grow: 1" v-show="showDocvalue">
        <ShowDocumentation
          :referenceId="idDoc"
          :file_prop="nameFile"
          @closeDialog="closeVueDoc"
        />
      </div>
      <div>
        <v-row style="padding: 20px">
          <AddBtn @open-dialog="ShowFormDoc" />
        </v-row>
        <FormDoc
          :isDialogOpen="show_formdoc"
          @close-dialog="ShowFormDoc"
          @add-doc="showAlert"
          :referenceid="currentTargetItemId"
        />

        <div
          v-if="vSelectItemDocumentation && vSelectItemDocumentation.length > 0"
        >

            <div class="blocInformation">
              <div
                v-for="(item, index) in vSelectItemDocumentation"
                :key="index"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                  position: relative;
                "
              >
                <div
                  class="inventory-item"
                  style="max-width: 100%; width: 99%;  overflow: hidden; color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                  <li style="list-style: none">
                    <v-icon :style="{ color: getIcon(item.Name).color }">{{
                      getIcon(item.Name).name
                    }}</v-icon>

                    {{ item.Name }}
                  </li>
                  <OverMenu
                    :show="itemOverflowMenu == item.dynamicId"
                    @close="closeOverMenu"
                    :item="item"
                    @showDoc="showDoc"
                    @downloadFile="downloadFile"
                    @DeleteFile="
                      DeleteFile(item.dynamicId, currentTargetItemId, 'child')
                    "
                    @changeOverflowItemMenu="changeOverflowItemMenu"
                  >
                  </OverMenu>
                </div>
              </div>
            </div>
        
        </div>
        <div v-else>
          <p>Aucune documentation disponible.</p>
        </div>


        
        <h3 style="border-bottom: 1px solid #d7d7d7; margin-top: 48px">Documents des Parents</h3>
          <br>
          <div v-for="(parent, index) in parentDocumentation.parents" :key="index">
            <div v-if="parent.documentation && parent.documentation.length > 0">
              <h3>{{ parent.name }}</h3>
              <div class="blocInformation">
                <div style="display: flex; position: relative; align-items: center "
                  v-for="(item, index2) in parent.documentation" :key="index2">
                  <div class="inventory-item"
                    style="max-width: 100%; width: 99%;  overflow: hidden; color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                    <li style="list-style: none;">
                      <v-icon :style="{ 'color': getIcon(item.Name).color }">{{ getIcon(item.Name).name }}</v-icon>
                      {{ item.Name }}
                    </li>
                  </div>

                  <OverMenu :show="itemOverflowMenu == item.dynamicId" @close="closeOverMenu" :item="item"
                    @showDoc="showDoc" @downloadFile="downloadFile"
                    @DeleteFile="DeleteFile(item.dynamicId, parent.dynamicId, 'parent')"
                    @changeOverflowItemMenu="changeOverflowItemMenu">
                  </OverMenu>

                </div>
                <!-- <Loader :showLoader="showLoader_in_parent" /> -->
              </div>
            </div>
          </div>




      </div>
    </div>

    <!-- ONGLET TICKETS -->
    <div v-if="vSelectedTab == 'Tickets'" class="scrollable-content">
      <AddTicketBtn @open-dialog="ShowDialog()" />
      <FormTicket
        :value="showFormTicket"
        @close-dialog="ShowDialog()"
        :selectedZone="currentTargetItemId"
        @add-ticket="showAlert"
      />
      <!-- Vérification si les tickets existent -->

      <TicketTable :data="vSelectItemTickets" :config="''" @locate="" @display="" />

      <div v-if="vSelectItemTickets && vSelectItemTickets.length === 0"
        style="width: 100%; height: 200px; font-size: 20px ; display: flex; justify-content: center; align-items: center">
        <p>Aucun ticket disponible.</p>
      </div>
      
    </div>

    <!-- ONGLET Notes -->
    <div v-if="vSelectedTab == 'Notes'" class="scrollable-content">
      <!-- Vérification si les notes existent -->
      <div v-if="vSelectItemNotes && vSelectItemNotes.length > 0">
        <!-- Boucle sur chaque note -->
        <div
          v-for="(note, index) in vSelectItemNotes"
          :key="index"
          class="blocInformation"
        >
          <div class="">
            <div>
              <!-- Affichage des informations principales de la note -->
              <span
                style="
                  font-size: 19px;
                  font-family: Arial, Helvetica, sans-serif;
                  font-weight: bold;
                "
              >
                {{ new Date(note.date).toLocaleString() }}</span
              >
              <div v-if="note.type != 'img'" class="back_blanc">
                <li><strong>Message :</strong> {{ note.message }}</li>
              </div>
              <div v-else>
                <img
                  :src="note.fileUrl"
                  alt="Preview"
                  class="item-preview-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Affichage lorsqu'il n'y a pas de notes -->
      <div v-else>
        <p>Aucune note disponible.</p>
      </div>
    </div>

    <!-- ONGLET INDICATEUR (controleEndpoint) et Points de mesures -->
    <div
      v-if="vSelectedTab == 'Indicateur' || vSelectedTab == 'Points de mesures'"
      style="display: flex;"
    >
    <!-- Contains t_index selector and graph -->
    <div v-if="
              ActiveData &&
              labelsChart &&
              ['Indicateur', 'Points de mesures'].includes(vSelectedTab)
            " style="display: flex; flex-direction: column; width: 100% ; align-items: center;">
      <div
            style="
              display: flex;
              flex-wrap: nowrap;
              align-items: center;
              margin-left: 15px;
              margin-right: 15px;
            "
          >
            <v-btn
              style="margin: 10px"
              elevation="0"
              fab
              small
              @click="t_index--"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <div style="white-space: nowrap">{{ timeactuelle }}</div>
            <v-btn
              style="margin: 10px"
              elevation="0"
              fab
              small
              @click="t_index++"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
      </div>

      <div v-if="ActiveData && labelsChart" class="graphContainer">
        <!-- <LineCardComponent :title="'Donnée Insight'" :labels="labelsChart" :datasets="chartData"
            :step="labelsChart.length" :tooltipCallbacks="{
              title: (context) => { },
              label: (tooltipItem) =>
                `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(
                  2
                )} `,
              footer: (data) => { },
      }"></LineCardComponent> -->

        <FastLineCardComponent
          :title="'Donnée Insight'"
          :labels="labelsChart"
          :datasets="chartData"
          :step="labelsChart.length"
          :tooltipCallbacks="{
            title: (context) => {},
            label: (tooltipItem) =>
              `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(
                2
              )} `,
            footer: (data) => {},
          }"
        ></FastLineCardComponent>
      </div>
    </div>

      <!-- ONGLET INDICATEUR -->
      <div style="width: 100%" v-if="vSelectedTab == 'Indicateur'" class="scrollable-content">
        <!-- <div
            v-if="vSelectItemInsights.length === 0"
            style="
              justify-content: center;
              align-items: center;
              width: 100%;
              display: flex;
              margin-top: 10px;
              margin-bottom: 10px;
            "
          >
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div> -->
        
        <div v-if="vSelectItemInsights.length === 0">
          <p>Aucun indicateur disponible.</p>
        </div>
        <div
          v-for="(item, index) in vSelectItemInsights"
          class="blocInformation"
        >
          <span
            style="
              font-size: 19px;
              font-family: Arial, Helvetica, sans-serif;
              font-weight: bold;
            "
            >{{ item.profileName }}</span
          >
          <div>
            <div
              v-for="(item, index2) in vSelectItemInsights[index].endpoints"
              class="inventory-container"
              :key="index2"
            >
              <div
                class="inventory-item"
                :style="{
                  width: '100%',
                  color: '#14202c',
                  padding: '16px',
                  borderRadius: '5px',
                  paddingLeft: '6px',
                  boxShadow:
                    'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                }"
              >
                <li
                  >{{ item.name }}: {{ item.currentValue }}
                  {{ item.unit || '' }}</li
                >
                <v-icon
                  @click="
                    () => {
                      fullData();
                      addOrRemove(item.dynamicId);
                      resize();
                    }
                  "
                  v-if="
                    cpIdToDraw.includes(item.dynamicId) &&
                    !activeChart.includes(item.dynamicId)
                  "
                  >mdi-chart-line</v-icon
                >
                <v-icon
                  @click="
                    () => {
                      addOrRemove(item.dynamicId);
                    }
                  "
                  v-if="activeChart.includes(item.dynamicId)"
                  >mdi-close</v-icon
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ONGLET POINT DE MESURE (endpoints)-->
      <div style="width: 100%" v-if="vSelectedTab == 'Points de mesures'" class="scrollable-content">
        <div v-if="vSelectItemEndpoints.length === 0">
          <p>Aucun point de mesure disponible.</p>
        </div>
        <div
          v-for="(item, index) in vSelectItemEndpoints"
          :key="index"
          class="blocInformation"
        >
          <div v-if="!vSelectItemEndpoints">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
          <div v-else class="inventory-container">
            <div
              class="inventory-item"
              style="
                color: #14202c;
                padding: 16px;
                border-radius: 5px;
                padding-left: 6px;
                background-color: #f9f9f9;
                box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
                  rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
                width: 100%;
              "
            >
              <li>
                {{ item.name }}: {{ item.currentValue }}
                {{ item.unit || '' }}</li
              >
              <v-icon
                @click="
                  () => {
                    fullData();
                    addOrRemove(item.dynamicId);
                    resize();
                  }
                "
                v-if="
                  cpIdToDraw.includes(item.dynamicId) &&
                  !activeChart.includes(item.dynamicId)
                "
                >mdi-chart-line</v-icon
              >
              <v-icon
                @click="
                  () => {
                    addOrRemove(item.dynamicId);
                  }
                "
                v-if="activeChart.includes(item.dynamicId)"
                >mdi-close</v-icon
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="vSelectedTab == 'Radar'" class="scrollable-content">
      <Radar :data="radarData" :options="radarOptions" />
    </div>
  </div>
</template>

<script>
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
import SmallLegend from './SmallLegend.vue';
import { MutationTypes } from '../../services/store/appDataStore/mutations';
import SpinalComparaison from './SpinalComparaison.vue';
import SpinalbreadCrumb from './SpinalbreadCrumb.vue';
import DataTable from './SpinalDataTable';
import { ActionTypes } from '../../interfaces/vuexStoreTypes';
import LineCardComponent from './LineCardComponent.vue';
import FastLineCardComponent from './FastLineCardComponent.vue';
import { IConfig, ITemporality } from '../../interfaces/IConfig';
import moment from 'moment';

import Alert from './Alert.vue';
import LoadingSpinner from './Loading.vue';
import ShowDocumentation from './Documentation.vue';
import FormDoc from './FormDoc.vue';
import AddBtn from './ButtonAdd.vue';
import getIcon from '../../services/function/getIcon';
import Loader from './Loader.vue';
import FormTicket from './FormTicket.vue';
import TicketTable from "./TicketTable.vue";
import AddTicketBtn from './ButtonAddticket.vue';
import OverMenu from './OverMenu.vue';
import getIcon from '../../services/function/getIcon';
import { Radar } from 'vue-chartjs';
import FormDocAttr from './FormDocAttr.vue';
import FormDocCateAttr from './FormDocCateAttr.vue';
import FormAttribute from './FormAttribute.vue';
export default {
  components: {
    SmallLegend,
    SpinalComparaison,
    SpinalbreadCrumb,
    DataTable,
    LineCardComponent,
    Alert,
    LoadingSpinner,
    ShowDocumentation,
    FormDoc,
    FormDocAttr,
    FormDocCateAttr,
    FormAttribute,
    AddBtn,
    Loader,
    FormTicket,
    AddTicketBtn,
    OverMenu,
    Radar,
    FastLineCardComponent,
    TicketTable,
  },
  props: [
    'contexts',
    'unit',
    'label',
    'reference',
    'selectedItemTab',
    'ctx_list',
    'cat_list',
    'grp_list',
    'ActiveData',
    'DActive',
  ],
  data: () => ({
    selections: {}, // for table header selection -- useless now, remove when possible
    tableData: [],
    selectedAttribute: null,
    filteredAttributes: [],
    filteredItem: [],
    selectedKeys: [],
    keyselected: {},
    showattribut: false,
    selected_id: null,
    selected_data_item_name: '',
    selectedEquipement: null,

    importAttr: false,
    checked: false,
    allFilteredData: [],
    currentfilter: null,
    order: false,
    vSelectedTab: 'Equipements',
    vSelectItemAttributes: [],
    vSelectItemAutodeskAttributes: [],
    vSelectItemDocumentation: [],
    vSelectItemNotes: [],
    vSelectItemTickets: [],
    vSelectItemInsights: [],
    vSelectItemEndpoints: [],
    cpIdToDraw: [],
    beginDate: (any = null),
    endDate: (any = null),
    dataTable: (any = []),
    activeChart: (any = []),
    labelsChart: (any = null),
    chartData: (any = null),
    t_index: (number = 0),
    timeactuelle: (string = 'date ?'),
    show_formdoc: false,
    showFormTicket: false,
    showDocvalue: false,
    showLoader: false,
    alert_ind: '',
    type_alert: '',
    alert: false,
    idDoc: 0,
    nameFile: '',

    itemOverflowMenu: null,
    itemOverflowMenuAttr: null,
    showFormAttributeValue: false,
    selectedAttribut: null,
    ShowFormDocAttrs: false,
    ShowFormDocCat: false,
    idEl: null,
    itemOp: null,
    selectedCategory: null,
    idCatEl: null,

    getIcon: getIcon,
    radarOptions: {
      responsive: true,
      scales: {
        r: {
          angleLines: { display: true }, // Affiche les lignes des angles
          suggestedMin: 0, // Valeur minimale
          suggestedMax: 100, // Valeur maximale
        },
      },
      plugins: {
        legend: {
          position: 'top', // Position de la légende
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}`;
            },
          },
        },
      },
    },

    globalColored: false,
    globalSprite: false,
    globalHidden: false,
    parentAttribut: [],
    parentDocumentation: [],

  }), // end of data

  mounted() {
    this.timeactuelle = this.getFormattedDateFromTemporalData();
    this.$nextTick(() => {
      const headers = document.querySelectorAll(
        '#my-data-table .v-data-table-header '
      );
      headers.forEach((header) => {
        header.addEventListener('click', (e) => {
          this.onHeaderClick(e.target.textContent.trim());
        });
      });
    });
  },
  computed: {
    vSelectLabel() {
      let itemName = '';
      if (this.selected_data_item_name) {
        itemName = this.selected_data_item_name;
      } else if (this.$store.state.appDataStore.user_selected.grp) {
        itemName = this.$store.state.appDataStore.user_selected.grp;
      } else if (this.$store.state.appDataStore.user_selected.cat) {
        itemName = this.$store.state.appDataStore.user_selected.cat;
      } else if (this.$store.state.appDataStore.user_selected.ctx) {
        itemName = this.$store.state.appDataStore.user_selected.ctx;
      }
      if (itemName) {
        return 'Onglet selectionné sur ' + itemName;
      }
      return 'Onglet selectionné';
    },

    filteredContexts() {
      if (this.contexts) {
        this.$emit('allFiltredData', this.contexts); // will make sprites appear
        return this.contexts;
      }
    },

    currentTargetItemId() {
      let dynamicId = null;
      if (this.selected_id) {
        dynamicId = this.selected_id;
      } else if (this.$store.state.appDataStore.user_selected.grp) {
        let found = this.grp_list.find(
          (grp) => grp.name === this.$store.state.appDataStore.user_selected.grp
        );
        dynamicId = found.dynamicId;
      } else if (this.$store.state.appDataStore.user_selected.cat) {
        let found = this.cat_list.find(
          (cat) => cat.name === this.$store.state.appDataStore.user_selected.cat
        );
        dynamicId = found.dynamicId;
      } else if (this.$store.state.appDataStore.user_selected.ctx) {
        let found = this.ctx_list.find(
          (ctx) => ctx.name === this.$store.state.appDataStore.user_selected.ctx
        );
        dynamicId = found.dynamicId;
      }
      return dynamicId;
    },

    loadingState() {
      return this.$store.state.appDataStore.loading;
    },

    loadingCount() {
      return this.$store.state.appDataStore.loadingCount;
    },

    loadingText() {
      return this.$store.state.appDataStore.loadingText;
    },

    vSelectDynamic() {
      let vSelectTabs = [
        'Equipements',
        'Attributs',
        'Documentation',
        'Notes',
        'Tickets',
        'Indicateur',
        'Points de mesures',
        'Radar',
      ];
      if (!this.$store.state.appDataStore.user_selected.ctx) {
        return ['Equipements'];
      }
      if (this.selectedEquipement) {
        if (this.selectedEquipement.nbr_cp == 0) {
          vSelectTabs = vSelectTabs.filter((tab) => tab !== 'Indicateur');
        }
        if (this.selectedEquipement.nbr_ep == 0) {
          vSelectTabs = vSelectTabs.filter(
            (tab) => tab !== 'Points de mesures'
          );
        }
        if (this.selectedEquipement.nbr_notes == 0) {
          vSelectTabs = vSelectTabs.filter((tab) => tab !== 'Notes');
        }
      }

      if (this.selected_id) {
        return vSelectTabs.filter((tab) => tab !== 'Radar');
      } else if (this.$store.state.appDataStore.user_selected.grp) {
        return vSelectTabs.filter((tab) => tab !== 'Radar');
      } else if (this.$store.state.appDataStore.user_selected.cat) {
        return vSelectTabs;
      }

      return vSelectTabs;
    },

    radarData() {
      console.log('selection', this.filteredContexts);
      const groupCounts = {};
      for(const group of this.filteredContexts){
        // if(!Object.keys(groupCounts).includes(group.name)){
        if(!groupCounts[group.name]){
          groupCounts[group.name]= group.nbr_equipments || group.groupItems.length || 0;
        } else {
          console.warn('group already exists, weird occurance, please investigate');
        }
      }

      // // Extraire les groupes (labels) et les valeurs (counts)
      const labels = Object.keys(groupCounts); // Les noms des groupes
      const data = Object.values(groupCounts); // Le nombre d'équipements par groupe

      return {
        labels, // Les groupes uniques
        datasets: [
          {
            label: "Nombre d'équipements par groupe",
            data, // Les valeurs correspondant à chaque groupe
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
    },

    temporality() {
      return this.$store.state.appDataStore.temporalitySelected;
    },

    storeItemSelected(){
      return this.$store.state.appDataStore.itemSelected;
    }

    // t_index() {
    //   return this.$store.state.appDataStore.t_index;
    // },
  },

  methods: {
    fullData() {
      if (!this.ActiveData) {
        this.$emit('buttonClicked');
      }
    },

    resize() {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 1);
    },

    handleSuccess() {
      this.importAttr = false;
      this.$emit('updateSuccess');
    },

    filtercolumn(item) {
      this.order = !this.order;
      this.currentfilter = item.text;
    },

    sortDataByAttribute(categoryAttributePair, dataArray) {
      const [attributeName, categoryName] = categoryAttributePair.split('/');

      const findAttributeValue = (item) => {
        const category = item.categoryAttributes.find(
          (cat) => cat.name === categoryName
        );
        const attribute = category?.attributs.find(
          (attr) => attr.label === attributeName
        );
        return attribute ? attribute.value : '';
      };

      const sortOrder = this.order ? 1 : -1;

      dataArray.sort((a, b) => {
        const aValue = findAttributeValue(a);
        const bValue = findAttributeValue(b);

        if (!isNaN(aValue) && !isNaN(bValue)) {
          return (Number(aValue) - Number(bValue)) * sortOrder;
        }
        return aValue.localeCompare(bValue) * sortOrder;
      });

      return dataArray;
    },

    goBack() {
      if (this.$store.state.appDataStore.user_selected.grp) {
        const cat = this.$store.state.appDataStore.user_selection_list.cat.find(
          (cat) => cat.name === this.$store.state.appDataStore.user_selected.cat
        );
        this.emitValue('cat', cat);
      } else if (this.$store.state.appDataStore.user_selected.cat) {
        const ctx = this.$store.state.appDataStore.user_selection_list.ctx.find(
          (ctx) => ctx.name === this.$store.state.appDataStore.user_selected.ctx
        );
        this.emitValue('ctx', ctx);
      } else if (this.$store.state.appDataStore.user_selected.ctx) {
        this.emitValue('ctx', null);
      }
      this.vSelectedTab = 'Equipements';
    },
    emitValue(listType, value) {
      if (listType == 'item') {
        this.selected_id = null;
        this.selected_data_item_name = null;
        return;
      }
      this.$refs.dataTable.clearAllSprites();
      this.globalSprite = false;
      if (listType == 'ctx' || listType == 'cat') {
        this.selected_grp = '';
      }
      if (listType == 'ctx') {
        this.selected_cat = '';
      }
      this.$emit('itemSelected', { listType, value });
    },

    onHeaderClick(headerName) {
      console.log('onHeaderClick de-activated uncomment to activate');
      // if (headerName.length > 0)
      //   this.$store.commit(MutationTypes.SET_ATTR, headerName);
    },

    getAttributeValueDL(item, attrLabel) {
      const [childName, parentName] = attrLabel.split('/');
      const category = item.categoryAttributes.find(
        (cat) => cat.name === parentName
      );
      if (category) {
        const attribute = category.attributs.find((a) => a.label === childName);
        if (attribute) {
          return attribute.value;
        }
      }
      return '';
    },

    getAttributeValue(item, attrLabel) {
      for (const category of item.categoryAttributes) {
        const attribute = category.attributs.find((a) => a.label === attrLabel);
        if (attribute) {
          return attribute.value;
        }
      }
      return '';
    },

    selectDataView(item) {
      console.log('SELECTED ITEM : ', item);
      this.selected_id = item.dynamicId;
      this.selected_data_item_name = item.name;
      this.selectedEquipement = item;
      this.$emit('item-selected', item);
    },

    unselectDataView() {
      this.$refs.dataTable.clearSelectedItem();
      this.selected_id = null;
      this.selected_data_item_name = null;
      this.selectedEquipement = null;

      this.$store.commit(MutationTypes.SET_ITEM_SELECTED, null);
      this.$store.dispatch(ActionTypes.SELECT_SPRITES, []);
      this.$store.dispatch(ActionTypes.FIT_TO_VIEW_ITEMS, {
        dynamicId:
          this.$store.state.appDataStore.zoneSelected.dynamicId ||
          this.$store.state.appDataStore.buildingInfo.dynamicId,
      });
      this.vSelectedTab='Equipements';
    },

    fitToView(item) {
      this.$emit('fit-to-view', item);
    },

    dynamicHeaders() {
      // Headers depend on user selected context, category or group
      // if context is selected , show categories.
      // if category is selected, show groups.
      // if group is selected, show equipments as we used to do.

      if (!this.$store.state.appDataStore.user_selected.ctx) {
        // Show Contexts
        return [
          { text: 'Nom', value: 'name', sortable: true },
          {
            text: 'Nombre de catégories',
            value: 'nbr_categories',
            sortable: true,
          },
        ];
      }

      if (!this.$store.state.appDataStore.user_selected.cat) {
        // Show Categories
        return [
          { text: 'Nom', value: 'name', sortable: true },
          { text: 'Nombre de groupes', value: 'nbr_groups', sortable: true },
        ];
      }

      if (!this.$store.state.appDataStore.user_selected.grp) {
        // Show Groups
        return [
          { text: 'Nom', value: 'name', sortable: true },
          { text: 'Actions', value: 'actions', sortable: false },
          {
            text: "Nombre d'équipements",
            value: 'nbr_equipments',
            sortable: true,
          },
        ];
      }

      // Show Equipments

      return [
        { text: 'Nom', value: 'name', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false },
        { text: 'Etage', value: 'floor', sortable: true },
        { text: 'Pièce', value: 'room', sortable: true },
        { text: 'Nombre de tickets', value: 'nbr_tickets', sortable: true },
        { text: 'Nombre de notes', value: 'nbr_notes', sortable: true },
        { text: 'Nombre de documents', value: 'nbr_files', sortable: true },
        { text: 'Nombre de points de mesure', value: 'nbr_ep', sortable: true },
        {
          text: "Nombre d'insights (profils)",
          value: 'nbr_cp',
          sortable: true,
        },
        {
          text: "Nombre de catégories d'attributs",
          value: 'nbr_category_attributes',
          sortable: true,
        },
      ];
    },

    async downloadFile(referenceIds, filename) {
      const promises = [
        this.$store.dispatch(ActionTypes.POST_DOWNLOAD_FILE, {
          buildingId: localStorage.getItem('idBuilding'),
          referenceIds: referenceIds,
        }),
      ];
      const result = await Promise.all(promises);

      result.forEach((blob) => {
        const type = blob.type.split('/', 2);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      });

      return result;
    },

    async addOrRemove(dyn) {
      if (this.activeChart.includes(dyn)) {
        this.dataTable = this.dataTable.filter(
          (item) => item.dynamicId !== dyn
        );
        this.activeChart = this.activeChart.filter((id) => id !== dyn);
        this.removegraphInfoCp(dyn);
        if (this.activeChart.length == 0) {
          this.$emit('buttonClicked', 'closeVueDoc');
        }
      } else {
        this.addgraphInfoCp(dyn);
        this.activeChart.push(dyn);
      }
    },
    async removegraphInfoCp(dyn) {
      const datatable = this.dataTable;
      this.chartData = this.chartDataObject(datatable);
    },

    parseDateString(dateString) {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-');
      return new Date(`${year}-${month}-${day}T${timePart}`);
    },

    async reloadNewChartData() {
      console.log(this.activeChart, '5');
      this.dataTable = [];

      for (const id of this.activeChart) {
        await this.addgraphInfoCp(id);
      }
    },

    async addgraphInfoCp(dyn) {
      if (!this.cpIdToDraw.includes(dyn)) return;

      const { begintime, endtime } = this.getBeginAndEndTime();
      const buildingId = localStorage.getItem('idBuilding');
      const beginTimestamp = this.parseDateString(begintime).getTime();
      const endTimestamp = this.parseDateString(endtime).getTime();

      const result = await this.$store.dispatch(ActionTypes.GET_TIMES_SERIES, {
        buildingId,
        referenceIds: dyn,
        begin: begintime,
        end: endtime,
      });

      // const timeStep = 60000; // Une minute en millisecondes
      // const seenMinutes = new Map();

      // result.forEach(({ date, value }) => {
      //   const minuteTimestamp =
      //     Math.floor(new Date(date).getTime() / timeStep) * timeStep;
      //   seenMinutes.set(minuteTimestamp, value);
      // });

      // const processedResult = Array.from(
      //   { length: Math.floor((endTimestamp - beginTimestamp) / timeStep) + 1 },
      //   (_, i) => {
      //     const date = beginTimestamp + i * timeStep;
      //     return {
      //       date,
      //       value: seenMinutes.get(date) ?? NaN,
      //     };
      //   }
      // );
      let findEp = this.vSelectItemEndpoints.find(
        (item) => item.dynamicId == dyn
      );
      if (!findEp) {
        for (const profil of this.vSelectItemInsights) {
          findEp = profil.endpoints.find((ep) => ep.dynamicId == dyn);
          if (findEp) break;
        }
      }
      // Mettre à jour le tableau de données
      const actuelleTable = {
        dynamicId: dyn,
        data: result.map(({ date, value }) => ({ x: date, y: value })),
        unit: findEp.unit,
        name: findEp.name,
      };

      this.dataTable = [...this.dataTable, actuelleTable];
      this.labelsChart = this.labels(begintime, endtime).map(this.toDate);
      this.chartData = this.chartDataObject(this.dataTable);
      //this.chartData = actuelleTable;
      console.log('*****', this.chartData);
      // this.chartData = [{x: 1, y:1},
      //   {x: 2, y:2},
      //   {x: 3, y:3},
      //   {x: 4, y:4},
      // ]
    },

    //fonction pour retourner la date string ( beging et end )
    getBeginAndEndTime() {
      const temporality =
        this.$store.state.appDataStore.temporalitySelected.name;
      const t_index = this.t_index || 0;
      let begintime, endtime;

      switch (temporality) {
        case ITemporality.hour:
          begintime = moment()
            .add(t_index, 'hours')
            .startOf('hour')
            .format('DD-MM-YYYY HH:mm:ss');
          endtime = moment()
            .add(t_index, 'hours')
            .endOf('hour')
            .format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.day:
          begintime = moment()
            .add(t_index, 'days')
            .startOf('day')
            .format('DD-MM-YYYY HH:mm:ss');
          endtime = moment()
            .add(t_index, 'days')
            .endOf('day')
            .format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.week:
          begintime = moment()
            .add(t_index, 'weeks')
            .startOf('week')
            .format('DD-MM-YYYY HH:mm:ss');
          endtime = moment()
            .add(t_index, 'weeks')
            .endOf('week')
            .format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.month:
          begintime = moment()
            .add(t_index, 'months')
            .startOf('month')
            .format('DD-MM-YYYY HH:mm:ss');
          endtime = moment()
            .add(t_index, 'months')
            .endOf('month')
            .format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.year:
          begintime = moment()
            .add(t_index, 'years')
            .startOf('year')
            .format('DD-MM-YYYY HH:mm:ss');
          endtime = moment()
            .add(t_index, 'years')
            .endOf('year')
            .format('DD-MM-YYYY HH:mm:ss');
          break;
        default:
          // Retourner la journée actuelle par défaut, ajustée avec t_index
          begintime = moment()
            .add(t_index, 'days')
            .startOf('day')
            .format('DD-MM-YYYY HH:mm:ss');
          endtime = moment()
            .add(t_index, 'days')
            .endOf('day')
            .format('DD-MM-YYYY HH:mm:ss');
          break;
      }

      return { begintime, endtime };
    },

    getFormattedDateFromTemporalData() {
      // Assurer une valeur par défaut de 0 pour t_index si ce n'est pas défini
      const temporality =
        this.$store.state.appDataStore.temporalitySelected.name;
      const t_index = this.t_index || 0;
      let formattedDate;

      switch (temporality) {
        case ITemporality.hour:
          formattedDate = moment()
            .add(t_index, 'hours')
            .startOf('hour')
            .format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.day:
          formattedDate = moment()
            .add(t_index, 'days')
            .startOf('day')
            .format('DD-MM-YYYY');
          break;
        case ITemporality.week:
          // Pour les semaines, afficher la semaine entière, ex: "15-11-2024 au 21-11-2024"
          const weekStart = moment()
            .add(t_index, 'weeks')
            .startOf('week')
            .format('DD-MM-YYYY');
          const weekEnd = moment()
            .add(t_index, 'weeks')
            .endOf('week')
            .format('DD-MM-YYYY');
          formattedDate = `${weekStart} au ${weekEnd}`;
          break;
        case ITemporality.month:
          // Afficher le mois et l'année, ex: "Novembre 2023"
          formattedDate = moment()
            .add(t_index, 'months')
            .startOf('month')
            .format('MMMM YYYY');
          break;
        case ITemporality.year:
          // Afficher uniquement l'année, ex: "2024"
          formattedDate = moment().add(t_index, 'years').format('YYYY');
          break;
        default:
          // Si la temporalité est inconnue, retourner la date du jour par défaut
          formattedDate = moment()
            .add(t_index, 'days')
            .startOf('day')
            .format('DD-MM-YYYY');
          break;
      }

      return formattedDate;
    },

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
    },

    labels(begin, end) {
      if (!this.dataTable) {
        return [];
      }

      const parseDate = (dateStr) => {
        const [day, month, yearTime] = dateStr.split('-');
        const [year, time] = yearTime.split(' ');
        const [hours, minutes, seconds] = time.split(':');

        return new Date(
          parseInt(year, 10), // Année
          parseInt(month, 10) - 1, // Mois (0 = janvier, donc on soustrait 1)
          parseInt(day, 10), // Jour
          parseInt(hours, 10), // Heures
          parseInt(minutes, 10), // Minutes
          parseInt(seconds, 10) // Secondes
        );
      };

      const beginDate = parseDate(begin);
      const endDate = parseDate(end);

      const dates = [];
      const interval = 60 * 1000; // Intervalle d'une journée en millisecondes

      for (
        let date = beginDate;
        date <= endDate;
        date = new Date(date.getTime() + interval)
      ) {
        dates.push(new Date(date)); // Ajoute une nouvelle date au tableau
      }
      return dates;
    },

    chartDataObject(dataTable) {
      console.log('dataTable', dataTable);
      return dataTable.map((el, index) => ({
        data: [...el.data],
        label: el.unit ? `${el.name} (${el.unit})` : el.name,
        dynamicId: el.dynamicId,
        specialAxis: index,
      }));
    },

    changeOverflowItemMenu(index) {
      console.log('index: ', index);
      const latItem = this.itemOverflowMenu;
      if (latItem === index) {
        this.itemOverflowMenu = null;
      } else {
        this.itemOverflowMenu = index;
        console.log('itemOverflowMenu: ', this.itemOverflowMenu);
      }
    },

    changeOverflowItemMenuAttr(index, item) {
      console.log(`index: ${index} item: ${item}`);
      const latItem = this.itemOverflowMenu;
      const itemCateg = item;
      if (
        latItem === this.itemOverflowMenu &&
        this.itemOverflowMenuAttr === itemCateg
      ) {
        this.itemOverflowMenuAttr = null;
      } else {
        this.itemOverflowMenuAttr = itemCateg;
        this.itemOverflowMenu = index;
      }
    },

    ShowDialog() {
      this.showFormTicket = !this.showFormTicket;
    },
    ShowFormDoc() {
      this.show_formdoc = !this.show_formdoc;
    },

    ShowFormDocAttr() {
      this.ShowFormDocAttrs = !this.ShowFormDocAttrs;
      if (!this.ShowFormDocAttrs) {
        this.updateAttributes();
      }
    },
    ShowFormDocCate() {
      this.ShowFormDocCat = !this.ShowFormDocCat;
    },
    ShowFormAttribute() {
      this.showFormAttributeValue = !this.showFormAttributeValue;
    },

    async editattr(attr, id, item) {
      this.ShowFormDocAttrs = true;
      this.selectedAttribut = attr;
      this.idEl = id;
      this.itemOp = item;
    },

    async editCattattr(id, item) {
      this.ShowFormDocCat = true;
      this.selectedCategory = item;
      this.idCatEl = id;
    },

    async DeleteFile(fileId, referenceId, space) {
      // console.log('DeleteFile space: ', space);
      const buildingId = localStorage.getItem('idBuilding');
      // console.log('parent: ', referenceId, 'fileId: ', fileId);

      const result = await this.$store.dispatch(ActionTypes.DELETE_FILE, {
        buildingId: localStorage.getItem('idBuilding'),
        referenceId: referenceId,
        fileId: fileId,
      });
      result.status == 200
        ? this.showAlert({
            status: 'success',
            message: 'Document supprimé avec succès',
            context: 'document',
          })
        : this.showAlert({
            status: 'error',
            message: 'Erreur lors de la suppression du document',
            context: 'document',
            space_context: space,
          });
      this.updateDocumentation();
    },

    async DeleteAttribut(referenceId, cateId, name) {
      const result = await this.$store.dispatch(ActionTypes.DELETE_ATTRIBUT, {
        buildingId: localStorage.getItem('idBuilding'),
        referenceId: referenceId,
        cateId: cateId,
        name: name,
      });
      result.status == 200
        ? this.showAlert({
            status: 'success',
            message: 'Attribut supprimé avec succès',
            context: 'Attribut',
          })
        : this.showAlert({
            status: 'error',
            message: "Erreur lors de la suppression de l'attribut",
            context: 'document',
            space_context: name,
          });
      // this.getdataofelement()
      this.updateAttributes();
    },

    async UpdateAttribut(referenceId, cateId, name, item) {
      console.warn(referenceId, cateId, name, item);

      const result = await this.$store.dispatch(ActionTypes.UPDATE_ATTRIBUT, {
        buildingId: localStorage.getItem('idBuilding'),
        referenceId: referenceId,
        cateId: cateId,
        name: name,
        item: item,
      });
      result.status == 200
        ? this.showAlert({
            status: 'success',
            message: 'Attribut modifié avec succès',
            context: 'Attribut',
          })
        : this.showAlert({
            status: 'error',
            message: "Erreur lors de la mise à jour de l'attribut",
            context: 'document',
            space_context: name,
          });
      // this.getdataofelement()
      this.updateAttributes();
    },

    async deleteCateAttr(referenceId, cateId, name) {
      console.log(referenceId, cateId, name);

      const result = await this.$store.dispatch(
        ActionTypes.DELETE_CATE_ATTRIBUT,
        {
          buildingId: localStorage.getItem('idBuilding'),
          referenceId: referenceId,
          cateId: cateId,
        }
      );
      result.status == 200
        ? this.showAlert({
            status: 'success',
            message: 'Catégory supprimé avec succès',
            context: 'catégory attribut',
          })
        : this.showAlert({
            status: 'error',
            message: 'Erreur lors de la suppression de la catégorie',
            context: 'cétegory',
            space_context: name,
          });
      // this.getdataofelement()
      this.updateAttributes();
    },

    async updateCateAttr(referenceId, cateId, name, item) {
      console.log(referenceId, cateId, name);

      const result = await this.$store.dispatch(
        ActionTypes.UPDATE_CATE_ATTRIBUT,
        {
          buildingId: localStorage.getItem('idBuilding'),
          referenceId: referenceId,
          cateId: cateId,
          item: item,
        }
      );
      result.status == 200
        ? this.showAlert({
            status: 'success',
            message: 'Catégory edité avec succès',
            context: 'catégory attribut',
          })
        : this.showAlert({
            status: 'error',
            message: "Erreur lors de l'edit de la catégorie",
            context: 'cétegory',
            space_context: name,
          });
      //this.getdataofelement()
      this.updateAttributes();
    },

    showDoc(referencedId, nameFile) {
      if (!this.showDocvalue) {
        this.$emit('buttonClicked', 'vueDoc');
      }
      this.nameFile = nameFile;
      this.idDoc = referencedId;
      this.showDocvalue = true;
    },

    closeVueDoc() {
      this.showDocvalue = false;
      this.$emit('buttonClicked', 'vueDocClose');
    },

    closeOverMenu() {
      this.itemOverflowMenu = null;
    },

    handleValidated(updatedItem, el, dyn, item) {
      console.warn(
        'Objet reçu après validation :',
        item,
        el.dynamicId,
        dyn.label,
        updatedItem
      );
      // console.log(updatedItem , el , dyn );
      const formattedItem = {
        attributeLabel: updatedItem.label,
        attributeUnit: updatedItem.unit,
        attributeValue: updatedItem.value,
      };

      this.UpdateAttribut(item, el.dynamicId, dyn.label, formattedItem);
    },

    handleValidatedCate(id, cateId, item) {
      // console.log(updatedItem , el , dyn );
      const formattedItem = {
        categoryName: item.name,
      };

      console.warn(
        'Objet reçu après validation :::::::',
        id,
        cateId,
        'category',
        formattedItem
      );
      this.updateCateAttr(id, cateId, 'category', formattedItem);
    },

    async updateParentAttribut() {
      const buildingId = localStorage.getItem('idBuilding');
      const elementDynamicId = this.currentTargetItemId;

      const parentPromise = [
        this.$store.dispatch(ActionTypes.GET_PARENT, {
          buildingId: buildingId,
          referenceIds: elementDynamicId,
        }),
      ];

      const resultParent = await Promise.all(parentPromise);
      const parents = resultParent[0];

      const parentDynamicIds = parents.map((parent) => parent.dynamicId);

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
          documentation: parentDocumentationResult[index],
        };
      });

      this.parentAttribut = {
        parents: parentDocumentation,
      };
    },

    async updateParentDocumentation(){
      const buildingId = localStorage.getItem('idBuilding');
      const elementDynamicId = this.currentTargetItemId;

      const parentPromise = [
        this.$store.dispatch(ActionTypes.GET_PARENT, {
          buildingId: buildingId,
          referenceIds: elementDynamicId,
        }),
      ];

      const resultParent = await Promise.all(parentPromise);
      const parents = resultParent[0];

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
          dynamicId: parent.dynamicId,
          documentation: parentDocResult[0]
        };
      }
      this.parentDocumentation = {
        parents: parentDocumentation,
      };
    },

    async showAlert(v) {
      if (v.status === 'success') {
        this.alert = true;
        this.alert_ind = v.message;
        this.type_alert = v.status;
      } else {
        this.alert = true;
        this.alert_ind = v.message;
        this.type_alert = v.status;
      }
    },

    async updateAttributes() {
      this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
      this.$store.commit(
        MutationTypes.SET_LOADING_TEXT,
        'Chargement des attributs...'
      );
      const buildingId = localStorage.getItem('idBuilding');
      const dynamicId = this.currentTargetItemId;
      try {
        this.updateParentAttribut();
        const attributs = await this.$store.dispatch(
          ActionTypes.GET_ATTRIBUT_LIST_MULTIPLE,
          {
            buildingId,
            referenceIds: [dynamicId],
          }
        );
        const response = attributs.find(
          (response) => response.dynamicId === dynamicId
        );
        this.vSelectItemAttributes = response.categoryAttributes;
        if (this.selectedEquipement?.dynamicId == dynamicId) {
          //
          // get autodesk viewer properties
          console;
          const properties = await this.$store.dispatch(
            ActionTypes.GET_VIEWER_OBJECT_PROPERTIES,
            this.selectedEquipement.dbid
          );

          const newAttributs = properties.properties.map((prop) => {
            return {
              label: prop.displayName,
              value: prop.displayValue,
            };
          });

          const revitCategory = {
            name: 'Revit-Autodesk properties',
            attributs: newAttributs,
          };
          this.vSelectItemAttributes.push(revitCategory);
        }
      } catch (error) {
        console.error('Error fetching attributes');
      } finally {
        this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
      }
    },
    async updateDocumentation() {
      this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
      this.$store.commit(
        MutationTypes.SET_LOADING_TEXT,
        'Chargement des documents...'
      );
      const buildingId = localStorage.getItem('idBuilding');
      const dynamicId = this.currentTargetItemId;
      try {
        const documentation = await this.$store.dispatch(
          ActionTypes.GET_DOCUMENTATION,
          {
            buildingId: buildingId,
            referenceIds: dynamicId,
          }
        );
        await this.updateParentDocumentation();

        this.vSelectItemDocumentation = await Promise.all(
          documentation.map(async (item) => {
            // Check for image file extensions
            const isImage = /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(item.Name);

            if (isImage) {
              const fileBlob = await this.$store.dispatch(
                ActionTypes.POST_DOWNLOAD_FILE,
                {
                  buildingId: buildingId,
                  referenceIds: item.dynamicId,
                }
              );
              return {
                ...item,
                fileUrl: URL.createObjectURL(fileBlob), // Attach fileUrl for image preview
              };
            }

            // Return the item as-is for non-image files
            return item;
          })
        );
      } catch (error) {
        console.error('Error fetching documentation');
      } finally {
        this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
      }
    },
    async updateNotes() {
      this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
      this.$store.commit(
        MutationTypes.SET_LOADING_TEXT,
        'Chargement des notes...'
      );
      const buildingId = localStorage.getItem('idBuilding');
      const dynamicId = this.currentTargetItemId;
      try {
        const notes = await this.$store.dispatch(ActionTypes.GET_NOTES, {
          buildingId: buildingId,
          referenceIds: dynamicId,
        });

        const documentation = await this.$store.dispatch(
          ActionTypes.GET_DOCUMENTATION,
          {
            buildingId: buildingId,
            referenceIds: dynamicId,
          }
        );

        this.vSelectItemNotes = await Promise.all(
          notes.map(async (item) => {
            if (item.type == 'img') {
              const findDoc = documentation.find(
                (doc) => doc.Name === item.message
              );
              const fileBlob = await this.$store.dispatch(
                ActionTypes.POST_DOWNLOAD_FILE,
                {
                  buildingId: buildingId,
                  referenceIds: findDoc.dynamicId,
                }
              );
              return {
                ...item,
                fileUrl: URL.createObjectURL(fileBlob), // Attach fileUrl for image preview
              };
            }
            return item;
          })
        );
      } catch {
        console.error('Error fetching notes');
      } finally {
        this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
      }
    },
    async updateTickets() {
      this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
      this.$store.commit(
        MutationTypes.SET_LOADING_TEXT,
        'Chargement des tickets...'
      );
      const buildingId = localStorage.getItem('idBuilding');
      const dynamicId = this.currentTargetItemId;
      try {
        const tickets = await this.$store.dispatch(ActionTypes.GET_TICKET, {
          buildingId: buildingId,
          referenceIds: dynamicId,
        });
        this.vSelectItemTickets = tickets;
      } catch {
        console.error('Error fetching tickets');
      } finally {
        this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
      }
    },
    async updateIndicateur() {
      this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
      this.$store.commit(
        MutationTypes.SET_LOADING_TEXT,
        'Chargement des indicateurs...'
      );
      const buildingId = localStorage.getItem('idBuilding');
      const dynamicId = this.currentTargetItemId;
      try {
        const control_endpoints = await this.$store.dispatch(
          ActionTypes.GET_NODE_CONTROL_ENDPOINT_LIST,
          {
            buildingId: buildingId,
            referenceIds: dynamicId,
          }
        );
        const tmpLst = [];
        control_endpoints.map((profil) =>
          profil.endpoints
            .filter((ep) => ep.saveTimeSeries == 1)
            .map((item) => tmpLst.push(item.dynamicId))
        );
        this.cpIdToDraw = tmpLst;
        this.vSelectItemInsights = control_endpoints;
      } catch {
        console.error('Error fetching control endpoints');
      } finally {
        this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
      }
    },

    async updateEndpoints() {
      this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
      this.$store.commit(
        MutationTypes.SET_LOADING_TEXT,
        'Chargement des points de mesures...'
      );
      const buildingId = localStorage.getItem('idBuilding');
      const dynamicId = this.currentTargetItemId;
      try {
        const endpoints = await this.$store.dispatch(
          ActionTypes.GET_NODE_ENDPOINT_LIST,
          {
            buildingId: buildingId,
            referenceIds: dynamicId,
          }
        );
        const tmpLst = [];
        endpoints
          .filter((ep) => ep.saveTimeSeries == 1)
          .map((item) => tmpLst.push(item.dynamicId));
        this.cpIdToDraw = tmpLst;
        this.vSelectItemEndpoints = endpoints;
      } catch {
        console.error('Error fetching endpoints');
      } finally {
        this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
      }
    },

    globalFitToView() {
      this.$store.dispatch(ActionTypes.FIT_TO_VIEW_ITEMS, {
        dynamicId:
          this.$store.state.appDataStore.zoneSelected.dynamicId ||
          this.$store.state.appDataStore.buildingInfo.dynamicId,
      });
    },

    globalColorAllGroups() {
      if (!this.globalColored) {
        this.$refs.dataTable.colorAllGroups();
        this.globalColored = true;
      } else {
        this.$refs.dataTable.clearAllGroupColors();
        this.globalColored = false;
      }
    },

    globalAddAllSprites() {
      if (!this.globalSprite) {
        this.$refs.dataTable.addSpriteAllGroups();
        this.globalSprite = true;
      } else {
        this.$refs.dataTable.clearAllSprites();
        this.globalSprite = false;
      }
    },

    globalHideAllGroups() {
      if (!this.globalHidden) {
        this.$refs.dataTable.hideAllGroups();
        this.globalHidden = true;
      } else {
        this.$refs.dataTable.unHideAllGroups();
        this.globalHidden = false;
      }
    },

    isLink(value) {
      return (
        typeof value === 'string' &&
        (value.startsWith('http://') || value.startsWith('https://'))
      );
    },
  },
  watch: {
    allFilteredData(newVal, oldVal) {
      this.$emit('allFiltredData', newVal);
    },

    async vSelectedTab(newVal, oldVal) {
      console.log('vSelectedTab', newVal);
      if (newVal === 'Attributs') {
        await this.updateAttributes();
        // this.$forceUpdate()
      }
      if (newVal === 'Documentation') {
        await this.updateDocumentation();
      }
      if (newVal === 'Notes') {
        await this.updateNotes();
      }
      if (newVal === 'Tickets') {
        await this.updateTickets();
      }
      if (newVal === 'Indicateur') {
        await this.updateIndicateur();
      }
      if (newVal === 'Points de mesures') {
        this.updateEndpoints();
      }
    },

    temporality(newVal, oldVal) {
      console.log('TEMPORALITY CHANGED !!!!');
      if (this.t_index != 0) {
        this.t_index = 0;
        return;
      }

      this.timeactuelle = this.getFormattedDateFromTemporalData();
      this.reloadNewChartData();
    },

    t_index(newVal, oldVal) {
      this.timeactuelle = this.getFormattedDateFromTemporalData();
      this.reloadNewChartData();
    },

    alert(newVal) {
      if (newVal) {
        this.showLoader = true;
        setTimeout(() => {
          this.alert = false;
          this.showLoader = false;
        }, 5000);
      }
    },
    storeItemSelected(newVal,oldVal){
      this.selected_id = newVal.dynamicId;
      this.selected_data_item_name = newVal.name;
      this.selectedEquipement = newVal;
    },

    '$store.state.appDataStore.dl_data_option': {
      handler(newValue, oldValue) {
        //this.extractData();
      },
      deep: true,
      immediate: false,
    },

    selectedKeys(newVal, oldVal) {
      //this.extractData();
      const resultat = {};
      newVal.forEach((s) => {
        const dernierTiretIndex = s.lastIndexOf('-');
        const nom = s.substring(0, dernierTiretIndex);
        const numero = s.substring(dernierTiretIndex + 1);

        if (!resultat[nom]) {
          resultat[nom] = [];
        }
        resultat[nom].push(numero);
      });
      return resultat;
    },
  },
};
</script>

<style scoped>
.graphContainer {
  border-radius: 0px;
  min-width: 58vw;
  min-height: 50vh;
  display: flex;
  padding: 10px;
}

.blue-background {
  background-color: #14202c !important;
  color: white !important;
}

.scrollable-content {
  max-height: 69vh;
  min-height: 69vh;
  overflow-y: scroll;
}

.scrollable-table-container {
  overflow-x: auto;
  overflow-y: auto;
  max-height: fit-content;
}

.red-background {
  background-color: rgb(255, 255, 255) !important;
  color: #14202c !important;
  border: 1px solid #14202c !important;
}

::v-deep .theme--light.menuable__content__active {
  background-color: red !important;
  z-index: 99999999 !important;
}

::v-deep .v-chip {
  height: 22px !important;
  margin: 3px !important;
  transform: translate(0, -10%);
  overflow: visible;
}

::v-deep .v-breadcrumbs__divider {
  background-color: red !important;
}

.blur-background {
  background-color: rgba(0, 0, 0, 0.528);
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99999;
  content: '';
}

::v-deep .v-breadcrumbs {
  padding: 2px !important;
}

.animate {
  -webkit-animation: scale-in-ver-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: scale-in-ver-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@-webkit-keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}

@keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }

  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}

.select-attr {
  -webkit-animation: fade-in 1.2s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  animation: fade-in 1.2s cubic-bezier(0.39, 0.575, 0.565, 1) both;
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

.line {
  position: relative;
  width: 0;
  top: 16px;
  height: 1px;
  background-color: rgb(143, 143, 143);
  animation: expandLine 0.5s forwards;
}

@keyframes expandLine {
  to {
    width: 46px;
  }
}

.text {
  font-size: 14px;
  font-family: Charlevoix;
  letter-spacing: 0.7px;
  color: #214353;
  opacity: 1;
  font-size: 14px;
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
.inventory-container {
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 260px);
  margin-top: 5px;
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

.btn:hover {
  background-color: rgb(199, 199, 199);
}


.disabled-icon {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

.item-preview-image {
  max-width: 100%;
  max-height: 200px; /* Limit height for large images */
  margin-top: 10px;
  border-radius: 4px; /* Add a slight border radius for aesthetics */
  object-fit: contain; /* Maintain aspect ratio */
}

.icon-rounded-square {
  margin-bottom: 5px;
  margin-left: 5px;
  background-color: #14202c; /* Background color for the square */
  color: #fff; /* Makes the icon white */
  border-radius: 8px; /* Adjust for rounded corners */
  padding: 8px; /* Space between the icon and the square's border */
  width: 40px; /* Fixed width for the square */
  height: 40px; /* Fixed height for the square */
  display: flex; /* Center the icon horizontally and vertically */
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: adds a subtle shadow */
}

.icons-global-actions {
  display: flex;
  gap: 8px; /* Adjust spacing between icons */
  align-items: center;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
}

.sub-icons-global-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  width: max-content;
  justify-content: center;
}

::v-deep .scrollable-content {
  padding-right: 5px; /* Adds space on the right to simulate a margin */
}

::v-deep .scrollable-content::-webkit-scrollbar-thumb {
  background: #e8e8e8;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 1px solid rgb(195, 195, 195);
  transition: 1s;
}

::v-deep .scrollable-content::-webkit-scrollbar {
  width: 10px;
  margin-left: 10px;
}

::v-deep .scrollable-content::-webkit-scrollbar-track {
  background: #ffffff;
}

::v-deep .scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #dedede;
}
</style>
