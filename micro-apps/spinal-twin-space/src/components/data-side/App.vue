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
  <v-card elevation="4" class="cardContainer">
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
    <div class="dataContainer" >
      <SpinalTable class="entrence" :class="{ 'inactiveTable': DActive, 'displaydataCss': displaydata }"
        :selectedItemTab="element_clicked"
        @item-selected="selectDataView"
        @fit-to-view="fitToView"
        @allFiltredData="putAllFiltredData"
        :headers="[]" :id="0" :label="'test'" :reference="''"
        :unit="''" :contexts="tableData" :ctx_list="$store.state.appDataStore.user_selection_list.ctx"
        :cat_list="$store.state.appDataStore.user_selection_list.cat"
        :grp_list="$store.state.appDataStore.user_selection_list.grp" 
        :ActiveData="ActiveData" :DActive="DActive"
        @itemSelected="handleItemSelected"
        @buttonClicked="buttonClicked"
        
        />

    </div>

  </v-card>
</template>

<script lang="ts">
import { Prop, Vue, Watch } from "vue-property-decorator";
import { PAGE_STATES } from "../../interfaces/pageStates";
import Component from "vue-class-component";
import SpinalTable from "../../components/component-test/SpinalTable.vue"
import { IConfig } from "../../interfaces/IConfig";
import { ISpaceSelectorItem } from "global-components";
import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import lodash from "lodash";
import { State } from "vuex-class";
import { MutationTypes } from "../../services/store/appDataStore/mutations";
import { mapState } from "vuex";
import SpriteComponent from "./SpriteComponent.vue"

@Component({
  components: {
    // CapacityTable,
    SpinalTable
  },
  filters: {},

})
class dataSideApp extends Vue {
  // @State data!: any[];

  @Prop() config!: IConfig;
  @Prop() selectedZone: ISpaceSelectorItem;
  @Prop() tableData: any;
  @Prop() element_clicked: any;
  @Prop() selected_attr: any;
  @Prop() DActive: boolean;
  @Prop() ActiveData: boolean;

  PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
  pageSate: PAGE_STATES = PAGE_STATES.loading;
  isBuildingSelected: boolean = true;
  retry: Function;
  selectedItem2: string;
  allFilteredData: any;
  CurrentLoading: boolean;
  displaydata: boolean = false


  resize() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }
  
  buttonClicked(payload) {
    console.log("buttonClicked payload", payload);
    this.$emit('buttonClicked', payload);
  }

  async mounted() {
    localStorage.setItem("viewer_loaded", 'initialize');
    // -> update contexts
    await this.getAndUpdateRoomContexts();
    await this.updateTableData();
    

    //- Set Data to contexts




    this.pageSate = PAGE_STATES.loaded;
    this.isBuildingSelected = true;

  }

  // double = computed(() => count.value * 2)

  async handleItemSelected(payload) {
    if(payload.listType == "ctx" && !payload.value) {
      this.$store.commit(MutationTypes.SET_USER_SELECTED, { key: "ctx", value: null });
      this.$store.commit(MutationTypes.SET_USER_SELECTED, { key: "cat", value: null });
      this.$store.commit(MutationTypes.SET_USER_SELECTED, { key: "grp", value: null });
      await this.getAndUpdateRoomContexts();
      await this.updateTableData();
      return;
    }

    if (payload.listType == "ctx") {
      this.$store.commit(MutationTypes.SET_USER_SELECTED, { key: "ctx", value: payload.value.name });
      this.$store.commit(MutationTypes.SET_USER_SELECTED, { key: "cat", value: null });
      this.$store.commit(MutationTypes.SET_USER_SELECTED, { key: "grp", value: null });
      await this.getAndUpdateRoomCategories();
      await this.updateTableData();
      return;
    }

    if (payload.listType == "cat") {
      this.$store.commit(MutationTypes.SET_USER_SELECTED, { key: "cat", value: payload.value.name });
      this.$store.commit(MutationTypes.SET_USER_SELECTED, { key: "grp", value: null });
      await this.getAndUpdateRoomGroups();
      await this.updateTableData();
      return;
    }

    if (payload.listType == "grp"){
      this.$store.commit(MutationTypes.SET_USER_SELECTED, { key: "grp", value: payload.value.name });
      await this.getAndUpdateRoomList();
      await this.updateTableData();
    }
    return;
  }

  async getAndUpdateRoomContexts(){
    this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
    this.$store.commit(MutationTypes.SET_LOADING_TEXT, `Chargement des contextes d'équipements...`);
    let dispatchObject = {
      buildingId: localStorage.getItem("idBuilding"),
      patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id
    } as any;
    dispatchObject.forceUpdate = true;

    try {
      const result = await this.$store.dispatch(ActionTypes.GET_ROOM_GROUP_CONTEXT, dispatchObject);
      this.$store.commit(MutationTypes.SET_USER_SELECTION, { "ctx": result });
      this.pageSate = PAGE_STATES.loaded;
    } catch (err) {
      console.log(err);
      this.retry = this.getAndUpdateRoomContexts;
      this.pageSate = PAGE_STATES.error;
    } finally {
      this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
    }
  }

  async getAndUpdateRoomCategories(){
    const matchingContext = this.$store.state.appDataStore.user_selection_list.ctx.find(ctx => ctx.name === this.$store.state.appDataStore.user_selected.ctx);
    this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
    this.$store.commit(MutationTypes.SET_LOADING_TEXT, `Chargement des catégories de ${matchingContext.name}...`);
    let actionType = ActionTypes.GET_CATEGORY_LIST
    let dispatchObject = {
      buildingId: localStorage.getItem("idBuilding"),
      patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,
      contextDynId: matchingContext.dynamicId
    } as any;
    dispatchObject.forceUpdate = true;

    try {
      const result = await this.$store.dispatch(actionType, dispatchObject);
      this.$store.commit(MutationTypes.SET_USER_SELECTION, {...this.$store.state.appDataStore.user_selection_list, "cat": result });

      this.pageSate = PAGE_STATES.loaded;
    } catch (err) {
      console.log(err);
      this.retry = this.getAndUpdateRoomCategories;
      this.pageSate = PAGE_STATES.error;
    } finally {
      this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
    }

  }

  async getAndUpdateRoomGroups(){
    if(!this.$store.state.appDataStore.user_selected.ctx || !this.$store.state.appDataStore.user_selected.cat) return;
    const matchingContext = this.$store.state.appDataStore.user_selection_list.ctx.find(ctx => ctx.name === this.$store.state.appDataStore.user_selected.ctx);
    const matchingCategory = this.$store.state.appDataStore.user_selection_list.cat.find(cat => cat.name === this.$store.state.appDataStore.user_selected.cat);
    if(this.selectedZone.type === "building"){
      this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
      this.$store.commit(MutationTypes.SET_LOADING_TEXT, `Chargement des groupes de ${matchingCategory.name}...`);
  
      try {
        const result = await this.$store.dispatch(ActionTypes.GET_GROUP_LIST, {buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,forceUpdate: true});

        await Promise.all(result.map(async (grp) => {
          const groupItems = await this.$store.dispatch(ActionTypes.GET_ROOM_LIST, {buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,groupDynId: grp.dynamicId,forceUpdate: true});

          const enrichedWithArea = await this.enrichItemsWithCoordinates(groupItems);
          grp.groupItems = enrichedWithArea;

          grp.area = 0;
          grp.groupItems.forEach((item) => {
            if (item.area) {
              grp.area += parseFloat(item.area);
            }
          });
          grp.area = grp.area.toFixed(2);
        }));

        console.log('RESULT GROUPS', result);

        this.$store.commit(MutationTypes.SET_USER_SELECTION, {...this.$store.state.appDataStore.user_selection_list, "grp": result });
  
        this.pageSate = PAGE_STATES.loaded;
      } catch (err) {
        console.log(err);
        this.retry = this.getAndUpdateRoomGroups;
        this.pageSate = PAGE_STATES.error;
      } finally {
        this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);

      }
      return;
    }

    if(this.selectedZone.type==="geographicFloor"){
      let actionType = ActionTypes.GET_FLOOR_INVENTORY
      let dispatchObject = {
        id: this.selectedZone.dynamicId,
        body : {
          context: matchingContext.name,
          category: matchingCategory.name
        },
        onlyDynamicId: false,
        includeArea: true
        
      } as any;  
      try {
        const result = await this.$store.dispatch(actionType, dispatchObject);
        result.forEach((grp) => {
          grp.nbr_rooms =grp.groupItems?.length || 'NaN'
        })
        result.forEach((grp) => {
          grp.area = 0;
          grp.groupItems.forEach((item) => {
            if(item.area){
              grp.area += parseFloat(item.area);
            }
            // remove the dbid and bimFileId because it causes problems for coloration and selection
            // item.dbid = undefined;
            // item.bimFileId = undefined;
          });
          grp.area = grp.area.toFixed(2);
        })
        this.$store.commit(MutationTypes.SET_USER_SELECTION, {...this.$store.state.appDataStore.user_selection_list, "grp": result });
        this.$store.commit(MutationTypes.SET_INVENTORY_DATA, result); // Set the inventory data, will be enriched later
        
        console.log('RESULT INVENTORY', this.$store.state.appDataStore.inventory);
        
        this.pageSate = PAGE_STATES.loaded;
      } catch (err) {
        console.log(err);
        this.retry = this.getAndUpdateRoomGroups;
        this.pageSate = PAGE_STATES.error;
      }

    }

    if(this.selectedZone.type === 'geographicRoom'){
      
      try {
        const positionInContext = await this.$store.dispatch(ActionTypes.GET_NODE_POSITION_IN_CONTEXT, {
                                                    buildingId: localStorage.getItem("idBuilding"),
                                                    contextDynId: matchingContext.dynamicId,
                                                    nodeDynId: this.selectedZone.dynamicId
                                                  }
        );

        const groupList = await this.$store.dispatch(ActionTypes.GET_GROUP_LIST, {buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,forceUpdate: true});


        const groups = positionInContext.parentsInContext;
        let correctGroup : any = null;
        for(const group of groups) {
          const groupName = group.name;
          const groupId = group.dynamicId;
          const matchingGroup = groupList.find(grp => grp.name === groupName && grp.dynamicId === groupId);
          if(matchingGroup) {
            correctGroup = matchingGroup;
            break;
          }
        }
        if(!correctGroup) {
          console.error("No correct group found");
          return;
        }

        
        correctGroup.nbr_rooms = 1;
        const enrichedWithArea = await this.enrichItemsWithCoordinates([this.selectedZone]);
        if(enrichedWithArea.length != 1){
          console.error("Enriched data is not valid");
          return;
        }
        correctGroup.area = enrichedWithArea[0].area;
        correctGroup.groupItems = enrichedWithArea;

        console.log('RESULT GROUPS', [correctGroup]);
        this.$store.commit(MutationTypes.SET_USER_SELECTION, {...this.$store.state.appDataStore.user_selection_list, "grp": [correctGroup] });
        this.$store.commit(MutationTypes.SET_INVENTORY_DATA, [correctGroup]);
      } catch (err) {
        console.error(err);
      }
    }

  }

  async getAndUpdateRoomList(){
    const matchingContext = this.$store.state.appDataStore.user_selection_list.ctx.find(ctx => ctx.name === this.$store.state.appDataStore.user_selected.ctx);
    const matchingCategory = this.$store.state.appDataStore.user_selection_list.cat.find(cat => cat.name === this.$store.state.appDataStore.user_selected.cat);
    const matchingGroup = this.$store.state.appDataStore.user_selection_list.grp.find(grp => grp.name === this.$store.state.appDataStore.user_selected.grp);
    
    this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
    this.$store.commit(MutationTypes.SET_LOADING_TEXT, `Chargement des équipements de ${matchingGroup.name}...`);
    
    try {
      let result: any[] = [];
      if(this.$store.state.appDataStore.zoneSelected.type === 'building'){
        result = await this.$store.dispatch(ActionTypes.GET_ROOM_LIST, { buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,groupDynId: matchingGroup.dynamicId, forceUpdate: true });
      }
      else {
        result = this.$store.state.appDataStore.inventory.find(it => it.dynamicId === matchingGroup.dynamicId).groupItems;
      }

      result = result.map(eq => {
        return {
          ...eq,
          color: matchingGroup.color,
          group: matchingGroup.name

        };
      });
      // all of these 3 are important
      result = await this.enrichItemsWithChildrenReadings(result);
      result = await this.enrichItemsWithPositions(result);
      result = await this.enrichItemsWithCoordinates(result);
      
      this.$store.commit(MutationTypes.SET_DATA, result);
      this.pageSate = PAGE_STATES.loaded;
    } catch (err) {
      console.log(err);
      this.retry = this.getAndUpdateRoomList;
      this.pageSate = PAGE_STATES.error;
    } finally {
      this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
    }
  }

  async updateTableData(){
    if (!this.$store.state.appDataStore.user_selected.ctx) {
      let dispatchObject = {
      buildingId: localStorage.getItem("idBuilding"),
      patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,
      nodeIds: this.$store.state.appDataStore.user_selection_list.ctx.map(ctx => ctx.dynamicId),
      includeChildrenRelations : true,
      includeParentRelations : false
    } as any;
      dispatchObject.forceUpdate = true;
      const result = await this.$store.dispatch(ActionTypes.READ_NODE_MULTIPLE, dispatchObject);
      const futurData = this.$store.state.appDataStore.user_selection_list.ctx.map(ctx => {
        const read = result.find((node) => node.dynamicId === ctx.dynamicId);
        const hasCategoryRelation = read.children_relation_list.find(relation => relation.name === "hasCategory")
        return { ...ctx, nbr_categories: hasCategoryRelation.children_number }
      })
      this.$store.commit(MutationTypes.SET_DATA, futurData);
      return;
    }

    if (!this.$store.state.appDataStore.user_selected.cat) {
      let dispatchObject = {
      buildingId: localStorage.getItem("idBuilding"),
      patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,
      nodeIds: this.$store.state.appDataStore.user_selection_list.cat.map(cat => cat.dynamicId),
      includeChildrenRelations : true,
      includeParentRelations : false
      } as any;
      dispatchObject.forceUpdate = true;
      const result = await this.$store.dispatch(ActionTypes.READ_NODE_MULTIPLE, dispatchObject);
      const futurData = this.$store.state.appDataStore.user_selection_list.cat.map(cat => {
        const read = result.find((node) => node.dynamicId === cat.dynamicId);
        const hasGroupRelation = read.children_relation_list.find(relation => relation.name === "hasGroup")
        return { ...cat, nbr_groups: hasGroupRelation.children_number }
      })
      this.$store.commit(MutationTypes.SET_DATA, futurData);
      return;
    }

    if (!this.$store.state.appDataStore.user_selected.grp) {
      if(this.selectedZone.type === "building"){ // otherwise we would already have the info from calling inventory
        let dispatchObject = {
        buildingId: localStorage.getItem("idBuilding"),
        patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,
        nodeIds: this.$store.state.appDataStore.user_selection_list.grp.map(grp => grp.dynamicId),
        includeChildrenRelations : true,
        includeParentRelations : false
        } as any;
        dispatchObject.forceUpdate = true;
        const result = await this.$store.dispatch(ActionTypes.READ_NODE_MULTIPLE, dispatchObject);
        const futurData = this.$store.state.appDataStore.user_selection_list.grp.map(grp => {
          const read = result.find((node) => node.dynamicId === grp.dynamicId);
          const hasBimObjectRelations = read.children_relation_list.filter(relation => relation.name === "groupHasgeographicRoom")
          let nbrOfRooms = 0 ;
          hasBimObjectRelations.forEach(relation => {
            nbrOfRooms += relation.children_number
          })
          return { ...grp, nbr_rooms: nbrOfRooms }
        })
        this.$store.commit(MutationTypes.SET_DATA, futurData);
        console.log('UPDATE TABLE DATA WITH : ', this.$store.state.appDataStore.data);
        return;
      }
      else if (this.selectedZone.type === "geographicFloor") {
        this.$store.commit(MutationTypes.SET_DATA, this.$store.state.appDataStore.inventory);
        console.log('UPDATE TABLE DATA WITH : ', this.$store.state.appDataStore.data);
      }
      else {
        this.$store.commit(MutationTypes.SET_DATA, this.$store.state.appDataStore.user_selection_list.grp);
        console.log('UPDATE TABLE DATA WITH : ', this.$store.state.appDataStore.data);
      }

    }

    

  }

  async enrichItemsWithChildrenReadings(items){
    const readings = await this.$store.dispatch(ActionTypes.READ_NODE_MULTIPLE, {
    buildingId: localStorage.getItem("idBuilding"),
    patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,
    nodeIds: items.map(eq => eq.dynamicId),
    includeChildrenRelations : true,
    includeParentRelations : false
    });
    

    const enrichedItems = items.map(eq => {
      const reading = readings.find(rd => rd.dynamicId === eq.dynamicId);
      if(reading){
        const response = reading.children_relation_list;
        const relation_tickets = response.find(relation => relation.name === "SpinalSystemServiceTicketHasTicket")
        const count_tickets = relation_tickets ? relation_tickets.children_number : 0;
        const relation_ep = response.find(relation => relation.name === "hasEndPoint")
        const count_ep = relation_ep ? relation_ep.children_number : 0;
        const relation_cp = response.find(relation => relation.name === "hasControlPoints")
        const count_cp = relation_cp ? relation_cp.children_number : 0;
        const relation_notes = response.find(relation => relation.name === "hasNotes")
        const count_notes = relation_notes ? relation_notes.children_number : 0;
        const relation_category_attributes = response.find(relation => relation.name === "hasCategoryAttributes")
        const count_category_attributes = relation_category_attributes ? relation_category_attributes.children_number : 0;
        const relation_files = response.find(relation => relation.name === "hasFiles")
        const count_files = relation_files ? relation_files.children_number : 0;
        return {
          ...eq,
          nbr_tickets: count_tickets, nbr_ep: count_ep, nbr_cp: count_cp, nbr_notes: count_notes, nbr_category_attributes: count_category_attributes, nbr_files: count_files
        }
      }
      return eq;
    });
    return enrichedItems;
  }

  async enrichItemsWithPositions(items){

    const itemsPositions = await this.$store.dispatch(ActionTypes.GET_ROOM_POSITION_MULTIPLE, {
      buildingId: localStorage.getItem("idBuilding"),
      roomIds: items.map(eq => eq.dynamicId)
    });

    return items.map((eq) => {
      const position = itemsPositions.find((pos) => pos.dynamicId == eq.dynamicId);
      if(!position || position.error){
        return eq
      }
      else{
        return {
          ...eq,
          floor: position.info.floor
        };
      }
    });
  }

  //also enrich with area
  async enrichItemsWithCoordinates(items){
    const roomAttributes = await this.$store.dispatch(ActionTypes.GET_ATTRIBUT_LIST_MULTIPLE, {
      buildingId: localStorage.getItem("idBuilding"),
      referenceIds: items.map(eq => eq.dynamicId)
    });
    // enrich roomList with coordinates and color
    return items.map(eq => {
      const matchingResult = roomAttributes.find( res => res.dynamicId === eq.dynamicId)
      return {
        ...eq,
        position : this.getCoordinatesFromAttributes(matchingResult.categoryAttributes),
        area: this.getAreaFromAttributes(matchingResult.categoryAttributes)
      }
      });
  }

  getCoordinatesFromAttributes(attributes){
    let spatial = attributes.find(cat => cat.name === "Spatial");
    let position;
    if (spatial) {
      let xyz = spatial.attributs.find(attr => attr.label === "XYZ center");
      if (xyz) {
        let [x, y, z] = xyz.value.split(';').map(Number);
        position = { x, y, z };
      }
    }
    return position;
  }

  getAreaFromAttributes(attributes){
    let spatial = attributes.find(cat => cat.name === "Spatial");
    let area = "0";
    if (spatial) {
      let areaAttr = spatial.attributs.find(attr => attr.label === "area");
      if (areaAttr) {
        area = Number(areaAttr.value).toFixed(2);
      }
    }
    return area;

  }

  async putAllFiltredData(allFilteredData) {
    this.allFilteredData = allFilteredData;

  }

  selectDataView(item) {
    this.$emit("clickOnDataView", item);
  }
  fitToView(item){
    this.$emit("fit-to-view", item);
  }


  updateComponentProp(updatedValue) {
    this.selectedItem2 = updatedValue;
  }






  /**
   * Watch
   */


  @Watch('DActive')
  onDActivate(newVal, oldVal) {

    if (newVal == true) {
      setTimeout(() => {
        this.displaydata = true;
      }, 500);
    }
    this.displaydata = false;
  }


  @Watch("selectedZone")
  async watchSelectedZone() {
    if(!this.$store.state.appDataStore.user_selection_list.ctx) return;
    if (['geographicFloor','building'].includes(this.selectedZone.type) ){
      this.$store.commit(MutationTypes.SET_LAST_LOADED_ZONE, this.selectedZone);
    }

    console.log('SELECTED ZONE CHANGED TO : ', structuredClone(this.selectedZone));
    await this.getAndUpdateRoomGroups();
    await this.updateTableData();
    
  }

  @Watch('element_clicked', { immediate: true, deep: true })
  onElementClickedChange(newVal, oldVal) {
    this.updateComponentProp(newVal);
  }

}

export { dataSideApp };
export default dataSideApp;
</script>
<style lang="scss">
.cardContainer {
  padding: 10px;
}

.dataContainer {
  overflow: hidden;
  width: 100% !important
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
</style>