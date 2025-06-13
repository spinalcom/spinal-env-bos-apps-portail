<template>
  <v-data-table
    id="my-data-table"
    ref="table"
    @click=""
    class="fixed-first-column"
    style="
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
        rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
      overflow: auto;
      max-height: 75vh;
      background: transparent !important;
      overflow: hidden;
    "
    mobile-breakpoint="0"
    no-data-text="Pas de données disponibles"
    :headers="headers"
    :items="items"
    :items-per-page="8000"
    :height="height"
    fixed-header
  >
    <!-- Header -->
    <template
      v-for="header in headers"
      v-slot:[`header.${header.value}`]="{ header }"
    >
      <div
        @click=""
        :class="{ 'selected-class': selected_header === header.text }"
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          height: 40px;
        "
      >
        <div
          style="
            width: 35px;
            overflow: hidden;
            transform: translate(-10px, -3px);
          "
        >
          
        </div>
        <span
          id="headerName"
          >{{ header.text }}</span
        >
        <div
          title="Cliquez pour ordonner"
          style="
            width: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
          ">
          <v-icon
            v-if="header.sortable && arrow == header.text && hasSelectedGroup"
            @click="sort(header)"
            color="black"
            >mdi-arrow-up-thin</v-icon
          >
          <v-icon
            v-if="header.sortable && arrow != header.text && hasSelectedGroup"
            @click="sort(header)"
            color="black"
            >mdi-arrow-down-thin</v-icon
          >
        </div>
        <div
          style="
            border-right: 2px solid #d9d9d9;
            height: 100%;
            background-color: white;
            position: absolute;
            transform: translate(-16px);
          "
        >
        </div>
      </div>
    </template>

    <!-- Rows -->
    <template v-slot:item="{ item }">
    <tr :key="selected_id === item.dynamicId ? `selected-${item.dynamicId}` : `row-${item.dynamicId}`"
      :class="{ colortd: selected_id === item.dynamicId }"
      @mouseenter="handleMouseEnter" 
      @mouseleave="handleMouseLeave" 
      :ref="`row-${item.dynamicId}`"
      @click="selectDataView(item)"
      @dblclick="fitToView(item)"
      @contextmenu.prevent="handleRightClick(item, $event)"
      >
      
    <!-- First Column -->
    <td :class="{ colortd: selected_id === item.dynamicId, 'sticky-column': true }">
      <v-icon :color="item.color" v-if="item.expanded" small :title="getExpandedRoomTitle(item)">
          mdi-arrow-right-bottom-bold
      </v-icon>
      <span v-else
        :style="{ 
          backgroundColor: item.color, 
          display: 'inline-block', 
          width: '10px', 
          height: '10px', 
          borderRadius: '50%', 
          marginRight: '8px' 
        }"
      ></span>
      {{ item.name }}

    </td>

    <!-- Second Column: Action Icons -->
    <td v-if="hasActions" :class="{ colortd: selected_id === item.dynamicId }">
      <div v-if="item.type==='geographicRoom'" style="display:flex;  justify-content: center; gap:10px  ">
        <v-icon  @click.stop="fitToView(item)" title="Cadrer sur l'espaces">
          mdi-fit-to-screen
        </v-icon>
        <v-icon  @click.stop="viewerSelectItems(item)" title="Sélectionner l'espaces dans le viewer 3D">
          mdi-select-place
        </v-icon>
        <v-icon :color="getTargetColor(item)"  @click.stop="handleArrowSelectionClick(item)" title="Sélectionner l'espaces">
          mdi-arrow-top-right-thick
        </v-icon>
      </div>
      <div v-else style="display:flex;  justify-content: center; gap:10px  ">
        <v-icon v-if="expandedGroups.includes(item.dynamicId)" :color="item.color"  @click.stop="unloadRooms(item)" title="Décharger les espaces">
          mdi-arrow-up-thick
        </v-icon>
        <v-icon  v-else  @click.stop="loadAndDisplayRooms(item)" title="Charger et afficher les espaces">
          mdi-arrow-down-thick
        </v-icon>
        <v-icon :color="getDisplayedSpriteColor(item)" @click.stop="addOrRemoveSpriteGroup(item)" title="Afficher les sprites">
          mdi-map-marker-outline
        </v-icon>
        <v-icon v-if="isDisplayedColorIconColor(item)" :color="item.color" @click.stop="removeColor(item)" title="Colorier les espaces du groupe">
          mdi-invert-colors
        </v-icon>
        <v-icon v-else @click.stop="addColor(item)" title="Colorier les espaces du groupe">
          mdi-invert-colors
        </v-icon>

        <!-- <v-icon 
          @click.stop="hideOrDisplayGroup(item)" 
          :title="isHiddenGroup(item) ? 'Afficher les équipements du groupe' : 'Masquer les équipements du groupe'"
        >
          {{ isHiddenGroup(item) ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
        </v-icon> -->

        <v-icon @click.stop="viewerSelectItems(item)" title="Sélectionner les espaces du groupe">
          mdi-select-place
        </v-icon>

      </div>
    </td>

    <!-- Other Columns -->
    <td v-for="(header, index) in normalHeaders" 
        :key="`td-${index}-${item.id}`" 
        style="text-align: center;"
        :class="{ colortd: selected_id === item.dynamicId }" 
      >
      <template v-if="isUrl(getAttributeValue(item, header.value))">
        <a :href="getAttributeValue(item, header.value)" target="_blank">
          {{ getAttributeValue(item, header.value) }}
        </a>
      </template>
      <template v-else>
        {{ getAttributeValue(item, header.value) }}
      </template>
    </td>

    
  </tr>
</template>
  </v-data-table>
</template>

<script>

import { ActionTypes } from "../../interfaces/vuexStoreTypes";
import { MutationTypes } from "../../services/store/appDataStore/mutations";
import SpriteComponent from "../data-side/SpriteComponent.vue";

export default {
  props: [
    'items',
    'headers',
    'noDataText',
    'itemsPerPage',
    'tableHeight',
    'shadow',
    'selections',
    'contexts',
    'height',
    'selectedItemTab',
  ],

  data() {
    return {
      selected_id: null,
      selected_header: null,
      arrow: false,
      displayedSprites: [],
      displayedColors: [],
      hiddenGroups: [],
      expandedGroups: [],

    };
  },
  computed: {
    filteredContexts() {
      if (this.contexts) {
        return this.contexts[0]?.data;
      }
    },
    computedStyle() {
      return {
        boxShadow: this.shadow
          ? 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px'
          : '',
        marginTop: '65px',
        overflow: 'auto',
        maxHeight: '75vh',
        background: 'transparent',
        overflowX: 'hidden',
      };
    },

    hasActions() {
      return this.headers.some((header) => header.text === 'Actions');
    },

    normalHeaders() {
      return this.headers.filter(header => header.text !== 'Actions' && header.text !== 'Nom');
    },

    hasSelectedGroup() {
      return this.$store.state.appDataStore.user_selected.grp;
    },

    
  },
  methods: {
    isUrl(value) {
      // Vérifie si la chaîne commence par http ou https
      return (
        typeof value === 'string' &&
        (value.startsWith('http://') || value.startsWith('https://'))
      );
    },

    getTargetColor(item){
      if(this.$store.state.appDataStore.itemSelected && this.$store.state.appDataStore.itemSelected?.dynamicId == item.dynamicId){
        return this.$store.state.appDataStore.itemSelected.color;
      } else {
        return '';
      }

    },

    selectDataView(item) { // when clicking dataView row , progress in path, when room we just trigger sprite selection
      console.log('TEST')
      if(item.type === 'geographicRoomGroupContext'){
        this.$emit('table-item-selected', { listType : 'ctx', value : item });
        return
      }
      if(item.type === 'groupingCategory'){
        this.$emit('table-item-selected', { listType : 'cat', value : item });
        return
      }
      if(item.type === 'geographicRoomGroup'){
        this.$emit('table-item-selected', { listType : 'grp', value : item });
        return
      }
      this.selected_id = item.dynamicId;
      console.log('selectDataView', item);
      // this.$store.commit(MutationTypes.SET_ITEM_SELECTED, item);
      this.$store.dispatch(ActionTypes.SELECT_SPRITES, [item.dynamicId]);
      //this.$emit('item-selected', item);
    },


    fitToView(item){
      this.$emit('fit-to-view', item);
    },

    clearSelectedItem(){
      this.selected_id = null;
    },
    handleRightClick(item, event) {
      if(this.selected_id != item.dynamicId){
        return
      }
      this.clearSelectedItem();
      this.$emit('unselect-data-view');
    },

    handleTableClick() {
      this.$emit('table-click');
    },

    handleArrowSelectionClick(item){
      if(this.$store.state.appDataStore.itemSelected && this.$store.state.appDataStore.itemSelected?.dynamicId == item.dynamicId){
        this.clearSelectedItem();
        this.$emit('unselect-data-view');
      }
      else {
        this.selectItem(item);
      }
    },

    selectItem(item) { // when clicking on the arrow icon we select the room
      console.log('selectItem', item);
      this.$store.commit(MutationTypes.SET_ITEM_SELECTED, item);
      this.$emit('item-selected', item);
      
    },

    headershow(header) {
      // this.selected_header = header.text;
    },

    sort(header) {
      if (this.arrow != header.text) {
        this.arrow = header.text;
      } else {
        this.arrow = null;
      }
      this.$emit('filter', header);
    },
    getAttributeValue(item, attrLabel) {
      if(typeof item[attrLabel] === 'object'){
        return item[attrLabel]?.name ?? '';
      }
      return item[attrLabel] ?? '';
    },
    handleMouseEnter(event) {
      const children = event.target.querySelectorAll('.colortd');
      children.forEach((child) => {
        child.classList.add('custom-hover-color');
      });
    },
    handleMouseLeave(event) {
      const children = event.target.querySelectorAll('.colortd');
      children.forEach((child) => {
        child.classList.remove('custom-hover-color');
      });
    },

    getDisplayedSpriteColor(item) {
      // The displayedSprites list contains strings in the format "groupName-groupColor"
      const entry = this.displayedSprites.find(str => str.startsWith(`${item.name}-`));
      if (entry) {
        // Extract the color after the hyphen
        return entry.split('-')[1];
      }
      // Default icon color if not found in the list
      return '';
    },

    getDisplayedColorIconColor(item){

      const found = this.displayedColors.find(it => it.dynamicId === item.dynamicId);
      if (found) {
        return found.color;
      }
      return 'white';
    },

    isDisplayedColorIconColor(item){
      return this.displayedColors.some(it => it.dynamicId === item.dynamicId);
    },

    clearAllSprites(){
      this.displayedSprites = [];
      this.$store.dispatch(ActionTypes.REMOVE_ALL_SPRITES);
    },

    async clearAllGroupColors(){
      if(this.$store.state.appDataStore.user_selected.grp){
        // si on a selectionné un groupe tous les éléments dans this.items sont des équipements
        const itemsToColor = this.items.map(it => {
          return {
            ...it,
            color: null,
            floorId: this.$store.state.appDataStore.lastLoadedZone.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId
          }
        })
        this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: localStorage.getItem("idBuilding")
      });
        return;
      }

      const groups = this.items.filter(it => it.type === 'geographicRoomGroup');
      for(const group of groups){
        this.removeColor(group)
      }
      return;
    },

    //used by global action color
    async colorAllGroups(){

      if(this.$store.state.appDataStore.user_selected.grp){
        const itemsToColor = this.items.map(it => {
          return {
            ...it,
            floorId: this.$store.state.appDataStore.lastLoadedZone.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId
          }
        })
        this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: localStorage.getItem("idBuilding")
      });
        return;
      }

      const groups = this.items.filter(it => it.type === 'geographicRoomGroup');
      for(const group of groups){
        this.addColor(group)
      }
      return;
    },

    // used by global action sprite
    async addSpriteAllGroups(){
      if(this.$store.state.appDataStore.user_selected.grp){
        this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
        items: this.items,
        buildingId: localStorage.getItem("idBuilding"),
        component: SpriteComponent,
        });

        return;
      }
      const groups = this.items.filter(it => it.type === 'geographicRoomGroup');
      this.displayedSprites = [];
      for(const group of groups){
        this.addOrRemoveSpriteGroup(group);
      }
    },

    async hideOrDisplayGroup(item){
      const matchingContext = this.$store.state.appDataStore.user_selection_list.ctx.find(ctx => ctx.name === this.$store.state.appDataStore.user_selected.ctx);
      const matchingCategory = this.$store.state.appDataStore.user_selection_list.cat.find(cat => cat.name === this.$store.state.appDataStore.user_selected.cat);
      const matchingGroup = item;
      let roomList = await this.$store.dispatch(ActionTypes.GET_ROOM_LIST,{buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,groupDynId: matchingGroup.dynamicId,forceUpdate: true});
      const itemsToHide = {};
      for(const eq of roomList){
        if (!itemsToHide[eq.bimFileId]){
          itemsToHide[eq.bimFileId] = [];
        }
        itemsToHide[eq.bimFileId].push(eq.dbid);
      }
      this.$store.dispatch(ActionTypes.HIDE_ITEMS, {
      items: {itemToHIde: itemsToHide},
      buildingId: localStorage.getItem("idBuilding"),
      });

      if (this.hiddenGroups.includes(item.dynamicId)){
        this.hiddenGroups = this.hiddenGroups.filter(it => it !== item.dynamicId);
      }else {
        this.hiddenGroups.push(item.dynamicId);
      }

    },

    async hideAllGroups(){
      const groups = this.items.filter(it => it.type === 'geographicRoomGroup');
      for(const group of groups){
        if(this.hiddenGroups.includes(group.dynamicId)){
          continue;
        }
        this.hideOrDisplayGroup(group);
      }
    },

    async unHideAllGroups(){
      const groups = this.items.filter(it => it.type === 'geographicRoomGroup');
      for(const group of groups){
        if(!this.hiddenGroups.includes(group.dynamicId)){
          continue;
        }
        this.hideOrDisplayGroup(group);
      }
    },

    isHiddenGroup(item){      
      return this.hiddenGroups.some(it => it === item.dynamicId);
    },
    

    async removeColor(item){
      this.displayedColors = this.displayedColors.filter(eq => eq.dynamicId !== item.dynamicId);
      const matchingContext = this.$store.state.appDataStore.user_selection_list.ctx.find(ctx => ctx.name === this.$store.state.appDataStore.user_selected.ctx);
      const matchingCategory = this.$store.state.appDataStore.user_selection_list.cat.find(cat => cat.name === this.$store.state.appDataStore.user_selected.cat);
      const matchingGroup = item;
      let roomList = [];
      if(this.$store.state.appDataStore.zoneSelected.type === 'building'){
        roomList = await this.$store.dispatch( ActionTypes.GET_ROOM_LIST,{buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,groupDynId: matchingGroup.dynamicId,forceUpdate: true});
      }

      else {
        roomList = this.$store.state.appDataStore.inventory.find(it => it.dynamicId === matchingGroup.dynamicId).groupItems;
      }

      roomList = roomList.map((eq) => {
          return {
            ...eq,
            color: null,
            floorId: this.$store.state.appDataStore.lastLoadedZone.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId
          };
        });      
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: roomList,
        buildingId: localStorage.getItem("idBuilding")
      });
    },

    async addColor(item){
      this.displayedColors.push(item);
      const matchingContext = this.$store.state.appDataStore.user_selection_list.ctx.find(ctx => ctx.name === this.$store.state.appDataStore.user_selected.ctx);
      const matchingCategory = this.$store.state.appDataStore.user_selection_list.cat.find(cat => cat.name === this.$store.state.appDataStore.user_selected.cat);
      const matchingGroup = item;
      let roomList = [];
      if(this.$store.state.appDataStore.zoneSelected.type === 'building'){
        roomList = await this.$store.dispatch( ActionTypes.GET_ROOM_LIST,{buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,groupDynId: matchingGroup.dynamicId,forceUpdate: true});
      }

      else {
        roomList = this.$store.state.appDataStore.inventory.find(it => it.dynamicId === matchingGroup.dynamicId).groupItems;
      }

      roomList = roomList.map((eq) => {
          return {
            ...eq,
            color: matchingGroup.color,
            floorId: this.$store.state.appDataStore.lastLoadedZone.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId
          };
      });   
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: roomList,
        buildingId: localStorage.getItem("idBuilding")
      });
      return;


    },

    
    async addOrRemoveSpriteGroup(item){
      // Remove the sprites if they are already displayed
      const entry = this.displayedSprites.find(str => str.startsWith(`${item.name}-`));
      if (entry) {
        this.$store.dispatch(ActionTypes.REMOVE_SPRITES_BY_GROUP, item.name);
        this.displayedSprites = this.displayedSprites.filter(str => !str.startsWith(`${item.name}-`));
        return;
      }

      this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
      this.$store.commit(MutationTypes.SET_LOADING_TEXT, `Chargement des sprites du groupe ${item.name} ...`);

      const matchingContext = this.$store.state.appDataStore.user_selection_list.ctx.find(ctx => ctx.name === this.$store.state.appDataStore.user_selected.ctx);
      const matchingCategory = this.$store.state.appDataStore.user_selection_list.cat.find(cat => cat.name === this.$store.state.appDataStore.user_selected.cat);
      const matchingGroup = item;
      
      let roomList = [];
      if(this.$store.state.appDataStore.zoneSelected.type === 'building'){
        roomList = await this.$store.dispatch( ActionTypes.GET_ROOM_LIST,{buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,groupDynId: matchingGroup.dynamicId,forceUpdate: true});
      }

      else {
        roomList = this.$store.state.appDataStore.inventory.find(it => it.dynamicId === matchingGroup.dynamicId).groupItems;
      }

      roomList = roomList.map(eq => {
        return {
          ...eq,
          color: matchingGroup.color,
          group: matchingGroup.name

        };
      });

      roomList = await this.enrichItemsWithChildrenReadings(roomList);
      roomList = await this.enrichItemsWithPositions(roomList);
      roomList = await this.enrichItemsWithCoordinates(roomList);
  
      this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
        items: roomList,
        buildingId: localStorage.getItem("idBuilding"),
        component: SpriteComponent,
      });

      this.displayedSprites.push(`${item.name}-${item.color}`)
      this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
      return;
      
    },

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
    },

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
  },

    async loadAndDisplayRooms(item){
      this.$store.commit(MutationTypes.INCREMENT_LOADING_COUNT);
      this.$store.commit(MutationTypes.SET_LOADING_TEXT, `Chargement des équipements du groupe ${item.name} ...`);
      const matchingContext = this.$store.state.appDataStore.user_selection_list.ctx.find(ctx => ctx.name === this.$store.state.appDataStore.user_selected.ctx);
      const matchingCategory = this.$store.state.appDataStore.user_selection_list.cat.find(cat => cat.name === this.$store.state.appDataStore.user_selected.cat);
      const matchingGroup = item;
      
      let roomList = [];
      if(this.$store.state.appDataStore.zoneSelected.type === 'building'){
        roomList = await this.$store.dispatch( ActionTypes.GET_ROOM_LIST,{buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,groupDynId: matchingGroup.dynamicId,forceUpdate: true});
      }

      else {
        roomList = this.$store.state.appDataStore.inventory.find(it => it.dynamicId === matchingGroup.dynamicId).groupItems;
      }

      roomList = roomList.map(eq => {
        return {
          ...eq,
          group: matchingGroup.name,
          color: matchingGroup.color,
          buildingId: localStorage.getItem("idBuilding"), // without this , the fit to view and selection would not work
          expanded: true
        };
      });
      // roomList = await this.enrichItemsWithPositions(roomList);

      const groupIndex = this.items.findIndex(it => it.dynamicId === item.dynamicId);
      let tmp = [...this.items];
      tmp.splice(groupIndex + 1, 0, ...roomList);
      this.$store.commit(MutationTypes.SET_DATA, tmp);
      this.expandedGroups.push(item.dynamicId);
      this.$store.commit(MutationTypes.DECREMENT_LOADING_COUNT);
      return;
    },

    async unloadRooms(item){
      const res =  [...this.$store.state.appDataStore.data].filter(it => it.group !== item.name);

      this.$store.commit(MutationTypes.SET_DATA, res);
      this.expandedGroups = this.expandedGroups.filter(it => it !== item.dynamicId);
    },

    getExpandedRoomTitle(item){
      return `Membre du groupe : ${item.group}`;
    },

    async viewerSelectItems(item){
      if(item.type === 'geographicRoom'){
        this.$store.dispatch(ActionTypes.SELECT_ITEMS, [item]);
        return;
      }
      // Get the room list of the selected group
      const matchingContext = this.$store.state.appDataStore.user_selection_list.ctx.find(ctx => ctx.name === this.$store.state.appDataStore.user_selected.ctx);
      const matchingCategory = this.$store.state.appDataStore.user_selection_list.cat.find(cat => cat.name === this.$store.state.appDataStore.user_selected.cat);
      const matchingGroup = item;
      let roomList = await this.$store.dispatch( ActionTypes.GET_ROOM_LIST,{buildingId: localStorage.getItem("idBuilding"),patrimoineId: JSON.parse(localStorage.getItem("patrimoine"))?.id,contextDynId: matchingContext.dynamicId,categoryDynId: matchingCategory.dynamicId,groupDynId: matchingGroup.dynamicId,forceUpdate: true});
      console.log('viewerSelectItems TO select : ', roomList);
      this.$store.dispatch(ActionTypes.SELECT_ITEMS, roomList);
    },

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
    },

    async enrichItemsWithPositions(items){

      const itemsPositions = await this.$store.dispatch(ActionTypes.GET_ROOM_POSITION_MULTIPLE, {
        buildingId: localStorage.getItem("idBuilding"),
        roomIds: items.map(it => it.dynamicId)
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
    },

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
          area : this.getAreaFromAttributes(matchingResult.categoryAttributes)
        }
        });
    }
  },
  watch: {
    selectedItemTab(newVal, oldVal) {
      this.selected_id = newVal;
      if (this.$refs[`row-${newVal}`]) {
        this.$refs[`row-${newVal}`].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    },

  },
};
</script>

<style scoped>

.sticky-column {
  position: sticky;
  left: 0;
  z-index: 1; /* Ensure it appears above other content */
}

.sticky-column.colortd {
  background-color: rgb(201, 232, 255); /* Same as the row's color */
}

tr .colortd {
  background-color: rgb(201, 232, 255); /* Your blue color */
}

td.colortd, th.colortd {
  background-color: rgb(201, 232, 255); /* Ensure all cells in the row are blue */
}






::v-deep
  .v-text-field.v-input--is-focused
  > .v-input__control
  > .v-input__slot:after {
  color: rgba(255, 255, 255, 0) !important;
}

.selected-class {
  background-color: rgba(215, 240, 250, 0.644);
  border-radius: 2px;
  margin-left: -10px;
  padding-left: 10px;
  margin-right: -8px;
  /* padding-left: 10px; */
}

::v-deep
  .theme--light.v-text-field
  > .v-input__control
  > .v-input__slot:before {
  border-color: rgba(255, 255, 255, 0) !important;
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

::v-deep .v-data-table__wrapper > table > thead > tr > th:nth-child(1) {
  position: sticky;
  left: 0;
  z-index: 9;
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

.custom-hover-color {
  background-color: rgb(142, 196, 221) !important;
}

tr .colortd.custom-hover-color {
  background-color: rgb(155, 223, 255) !important;
}

::v-deep .custom-hover-color {
  background-color: rgb(100, 206, 255) !important;
}

::v-deep .v-breadcrumbs {
  padding: 2px !important;
}

.colortd {
  background-color: rgb(201, 232, 255);
}


td {
  min-width: 250px;
}

.fixed-first-column table {
  position: relative;
}

::v-deep .v-data-footer {
  display: none;
}

::v-deep div.v-data-table__wrapper > table > thead > tr > th > i {
  display: none;
}

.mouse {
  width: 101%;
  height: 50px;
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  border: 1px solid rgb(0, 0, 0);
  padding-left: 20px;
  font-size: 17px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.5s;
  color: rgb(47, 47, 47);
  /* padding-right: 0px; */
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

::v-deep .v-treeview-node__children {
  padding-left: 20px;
}

::v-deep .v-treeview-node__root {
  position: relative;
  border-radius: 5px;
  border: 0.2px solid rgb(143, 143, 143);
  max-height: 20px !important;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
}

::v-deep .v-treeview-node__root:hover {
  background-color: rgb(238, 238, 238);
  border: 1px solid rgb(83, 83, 83);
}

.fixed-first-column tbody td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
}

::v-deep
  .v-data-table__wrapper
  > table
  > tbody
  > tr:nth-child(1)
  > td:nth-child(1) {
  position: sticky;
  left: 0;
  z-index: 1;
}

.scrollable-table-container {
  overflow-x: auto;
}

.fixed-first-column thead th:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: white;
  border: 1px solid #14202c !important;
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

.font-table {
  font: normal normal normal 16px/13px Charlevoix !important;
  letter-spacing: 1.1px;
  color: #14202c;
  opacity: 1;
  box-shadow: none !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hover-magnify:hover {
  background-color: rgb(219, 218, 218) !important;
}

.card-title {
  color: #214353 !important;
  font-size: 20px !important;
}

.text-start {
  justify-content: center;
  display: flex !important;
  flex-direction: row !important;
}

.v-data-table {
  display: flex;
  flex-direction: column;
}

::v-deep .v-data-table__wrapper {
  flex-shrink: 0;
  flex-grow: 1;
  overflow-y: auto !important;
}

::v-deep th {
  height: 48px !important;
  font-size: 14px !important;
  color: #14202c !important;
  border: 1px solid #14202c !important;
}

::v-deep td {
  font-size: 14px !important;
  color: #14202c !important;
  background-color: #f4f4f4;
  border-bottom: 1px solid #14202c !important;
  border-right: 1px solid #14202c !important;
  border-left : 1px solid #14202c !important;
  vertical-align: middle;
}

::v-deep tr:hover td {
  cursor: pointer;
  background-color: #f0f0f0 !important;
}

::v-deep .v-icon__svg {
  fill: #214353 !important;
}

::v-deep .v-list .v-list-item--active,
.v-list .v-list-item--active .v-icon {
  background-color: #2f5321 !important;
}

::v-deep
  .v-text-field.v-input--is-focused
  > .v-input__control
  > .v-input__slot:after {
  color: #214353;
}

::v-deep .v-list-item--link:before {
  background-color: #1500ff !important;
}

::v-deep .v-application .primary--text {
  color: #14202c !important;
  caret-color: #14202c !important;
  background-color: #1500ff !important;
}

::v-deep .v-data-footer__select {
  visibility: hidden;
}

.title {
  letter-spacing: 1.1px;
  color: #214353;
  opacity: 1;
  font-size: 20px !important;
}

.text {
  font-size: 14px;
  font-family: Charlevoix;
  letter-spacing: 0.7px;
  color: #214353;
  opacity: 1;
  font-size: 14px;
}

.theme--light.v-data-table .v-data-footer {
  background: #7b5151 !important;
}

::v-deep .v-data-footer {
  width: 100%;
  margin-right: 0px !important;
  background: #fff !important;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 0px;
}

::v-deep tr > th:first-child {
  border-top-left-radius: 10px !important;
}

::v-deep tr > th:last-child {
  border-top-right-radius: 0px !important;
}

::v-deep tr > td.text-start {
  display: flex;
  align-items: center;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar-thumb {
  background: #e8e8e8;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 1px solid rgb(195, 195, 195);
  transition: 1s;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar {
  width: 10px;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar-track {
  background: #ffffff;
}
::v-deep .v-data-table__wrapper::-webkit-scrollbar-thumb:hover {
  background: #dedede;
}


.icon-rounded-square {
  background-color: #14202c;
  color: #fff;               
  border-radius: 4px;         
  padding: 8px;               
  width: 25px;                
  height: 25px;               
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}
</style>
