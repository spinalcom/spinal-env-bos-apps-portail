<template>
  <v-dialog v-model="isDialogOpen" persistent
    style="display: flex !important;gap: 20px !important; font-size: 12px !important; overflow: hidden; background: white !important;border-radius: 20px !important;">
    <div class="contentPop">


      <div v-if="loadingStatus === 'loading'"
        style="display : flex ; text-align: center; margin-top: 20px; position: absolute; width: 100%;height: 100%;z-index: 99;justify-content: center;align-items: center;backdrop-filter: blur(3px);">
        <v-progress-circular indeterminate color="primary" />
        <div>Chargement des inventaires...</div>
      </div>

      <div v-if="loadingStatus === 'end'"
        style="position: absolute;width: 100%;height: 100%;z-index: 99;display: flex;justify-content: center;align-items: center;">
        <div class="popup_loaded">
          <v-icon color="green" size="87">mdi-check-circle</v-icon>
          <div style="margin-left: 35px; font-size: 27px;">Inventaires chargés</div>
        </div>
      </div>


      <div style="padding: 10px; align-items: center;max-height: 100px;"
        class="w-full flex justify-between border-bottom">
        <span class="headline">Creer un inventaire</span>
        <div style="display: flex; gap: 10px;">
          <!-- <button type="submit" class="save-btn">
            <v-icon style="color: white;">mdi-content-save</v-icon>
            Enregistrer</button> -->
          <button type="reset" class="cancel-btn" @click="closeDialog">Fermer</button>
        </div>

      </div>
      <v-card elevation="0" style="width: 100% !important; height: 100%; padding-top: 10px;">
        <div style="display: flex;" class="w-full h-full overflow-hidden overflow-y-auto">
          <!-- <div style="width: 100%; padding: 25px;">
            <v-card-text style="min-height: 50px;">
              <div class="col">
                <v-row v-if="showalert"
                  style="width: 100%; display: flex; gap: 10px;  justify-content: center; align-items: center; ">
                  <v-icon style=" color:rgba(133, 27, 27, 0.757);">mdi-alert-circle-outline</v-icon>
                  <span class="text-alert">Veuillez remplir tous les champs</span>
                </v-row>
                <v-row class="flex justify-center items-center" style="padding: 10px">
                  <span style="text-align: center; font-weight: 800; font-size: 16px;">Selectionez un type d'inventaire:
                  </span>
                  <span style="width: 150px; height: 38px;"
                    :class="['cursor-pointer chip', { 'checked': item.checked }]" v-for="(item, index) in prioritie"
                    @click="checkPrioritie(index)">
                    <span class="icon-check" v-if="item.checked">&#10003;</span>
                    <span style="font-weight: 700; text-transform: capitalize;"> {{ item.name }}</span>
                    <span class="chip-point" v-if="!item.checked"></span>
                  </span>
                </v-row>
              </div>
              <p v-if="isValid" class="valid_formText">{{ valid_message }}</p>
            </v-card-text>
          </div> -->

          <div style="padding: 20px;" class="category-list">
            <div style="font-weight: bold;" v-if="categories.length > 0">Selectionez un context</div>
            <div v-if="!selectedContext">
              <div @click="selectContext(category.name, category.dynamicId)" v-for="category in context"
                :key="category.dynamicId">
                <div :class="{ selected: selectedCategory === category.name }" class="category-item">
                  <span class="material-icons">{{ category.icon }}</span>
                  <span class="category-name">{{ category.name }}</span>
                </div>
              </div>
            </div>
            <div style="color : green" v-else>
              <div class="validate">{{ selectedContext.name }}</div>
              <div class="cancel" style="color:  red; cursor: pointer;font" @click="deleteContext">annuler</div>
            </div>
          </div>

          <div style="padding: 20px;" class="category-list">
            <div style="font-weight: bold;" v-if="categories.length > 0 && selectedContext">Selectionez une categorie
            </div>
            <div v-if="selectedContext">
              <div v-if="!selectedCat">
                <div @click="selectCategory(category)" v-for="category in categories" :key="category.dynamicId">
                  <div :class="{ selected: selectedCategory === category.name }" class="category-item">
                    <span class="material-icons">{{ category.icon }}</span>
                    <span class="category-name">{{ category.name }}</span>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="validate">{{ selectedCat }}</div>
                <div class="cancel" style="color:  red; cursor: pointer;font" @click="deleteCat">annuler</div>

              </div>
            </div>
          </div>

          <div style="padding: 20px" class="category-list">
            <div style="font-weight: bold;" v-if="grp.length > 0">Selectionez un groupe</div>
            <div v-if="selectedCat">
              <div v-for="category in grp" :key="category.dynamicId" @click="selectGrp(category)">
                <div :class="['category-item', { selected: isSelected(category) }]">
                  <span class="material-icons">{{ category.icon }}</span>
                  <span class="category-name">{{ category.name }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div style="display: flex;justify-content :  flex-end">
          <div @click="GetInventory"
            style="font-weight: bold;margin-right: 10px;padding: 12px;border-radius: 7px;margin-top: 10px;border:1px solid #14202c">
            Valider</div>
        </div>
      </v-card>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { get } from 'http';
import { ActionTypes } from '../interfaces/vuexStoreTypes';
import { WorkflowInterface } from '../interfaces/Workflow';
import getIcon from '../services/function/getIcon';


export default {
  name: 'form-ticket',
  props: {
    selectedZone: {
      type: Object,
      required: true,

    },
    value: {
      type: Boolean,
      default: false,
    },
    typedata: {
      type: String,
    },
    config: {
      type: Object,
    }
    ,
    selectedId: {
      type: Number,
    }
  },
  data() {
    return {
      showalert: false,
      loadingStatus: 'idle',
      workflowId: 0,
      processId: 0,
      ticketname: '',
      description: '',
      isDialogOpen: this.value,
      selectedCategory: null,
      selectedContext: null,
      prioritie: [
        {
          name: 'equipement',
          color: 'green',
          value: 0,
          checked: false,
        },
        {
          name: 'espace',
          color: 'orange',
          value: 1,
          checked: false,
        },
      ],
      workflowlist: [{}],
      process: [],
      files: Array(),
      priority: null,
      remove_animation: null,
      isValid: false,
      valid_message: '',
      categories: [],
      context: [],
      grp: [],
      getIcon: getIcon,
      selectedCtx: null,
      selectedCat: null,
      currentType: '',
      selectedGrp: [],
      groupString: []
    };

  },
  async mounted() {



    this.getFirstContextList();

    this.$emit('inventory-loaded', []);
    await this.initvalue()


    // this.workflowlist = await this.getWorkFlowList();
  },
  watch: {
    async selectedId() {

      await this.initvalue()
      this.$nextTick(() => {
        this.GetInventory()
      });

    },
    value(newVal) {
      this.isDialogOpen = newVal;
    },
    isDialogOpen(newVal) {
      this.$emit('input', newVal);
    },
    remove_animation(newVal: number) {
      if (newVal != null) {
        setTimeout(() => {
          this.remove_animation = null;
        }, 200);
      }
    },
    loadingStatus(newVal) {
      if (newVal === 'end') {
        setTimeout(() => {
          this.loadingStatus = 'idle';
        }, 1300); // 2000ms = 2 secondes
      }
    },
    prioritie: {
      handler(newVal) {
        this.Toto()
        this.selectedCategory = null
      },
      deep: true
    },
    typedata(newVal, oldVal) {

      if (newVal == "room") {
        this.prioritie = [
          {
            name: 'equipement',
            color: 'green',
            value: 0,
            checked: false,
          },
        ]
      }
      else {
        this.prioritie = [
          {
            name: 'equipement',
            color: 'green',
            value: 0,
            checked: false,
          },
          {
            name: 'espace',
            color: 'orange',
            value: 1,
            checked: false,
          },
        ]
      }
    }
  },
  methods: {
    async initvalue() {
      const buildingId = sessionStorage.getItem("idBuilding");

      const promises_node = [
        this.$store.dispatch(ActionTypes.GET_NODE_READ, {
          buildingId,
          referenceIds: [this.selectedId]
        }),
      ];

      const results = await Promise.all(promises_node);

      this.currentType = results[0].type

      if (this.typedata == "room") {
        this.prioritie = [
          {
            name: 'equipement',
            color: 'green',
            value: 0,
            checked: true,
          },
        ]
      }
      else {
        this.prioritie = [
          {
            name: 'equipement',
            color: 'green',
            value: 0,
            checked: true,
          },
          {
            name: 'espace',
            color: 'orange',
            value: 1,
            checked: false,
          },
        ]
      }
    },
    selectCategory(cate) {
      this.selectedCategory = cate.name;
      this.selectedCat = cate.name
      this.getGroup(this.selectedContext.dynamicId, cate.dynamicId)
    },
    selectGrp(grp) {
      const index = this.selectedGrp.findIndex(g => g.dynamicId === grp.dynamicId);
      if (index === -1) {
        this.selectedGrp.push(grp);
      } else {
        this.selectedGrp.splice(index, 1);
      }

      // Met à jour le tableau des noms sélectionnés
      this.groupString = this.selectedGrp.map(g => g.name);
      console.log('les grp', this.groupString);

    },
    isSelected(grp) {
      return this.selectedGrp.some(g => g.dynamicId === grp.dynamicId);
    },


    selectContext(name, dynamicId) {
      this.selectedContext = {
        name: name,
        dynamicId: dynamicId
      }

      this.getCategories(this.selectedContext.dynamicId)
    },

    deleteContext() {
      this.selectedContext = null
      this.selectedCat = null
    },
    deleteCat() {
      // this.selectedContext = null
      this.selectedCat = null
    },

    closeDialog() {
      this.isDialogOpen = !this.isDialogOpen;
      this.$emit('close-dialog', this.isDialogOpen);
    },
    checkPrioritie(index) {

      this.prioritie = this.prioritie.map((item, i) => {
        if (i === index) {
          item.checked = !item.checked;
          this.priority = item.value;
        } else {
          item.checked = false;
        }
        return item;
      });
    },

    getSelectedName() {
      const selected = this.prioritie.find(item => item.checked);
      return selected ? selected.name : null;
    },


    Toto() {
      let typeofvalue = ''
      if (this.getSelectedName() == 'espace') {
        typeofvalue = 'Gestion des espaces'
      } else {
        typeofvalue = 'Gestion des équipements'
      }

      // this.getContextList(typeofvalue)
    },

    async getFirstContextList() {
      let types = ["BIMObjectGroupContext", "geographicRoomGroupContext"];
      const buildingId = sessionStorage.getItem("idBuilding");
      const contextList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_LIST, { buildingId });
      const targetContexts = contextList.filter(ctx => types.includes(ctx.type));

      console.log('la liste des contexts', targetContexts);
      this.context = targetContexts
    },


    // async getContextList(typeofvalue) {
    //   const buildingId = sessionStorage.getItem("idBuilding");
    //   const contextList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_LIST, { buildingId });
    //   const targetContext = contextList.find(ctx => ctx.name === typeofvalue);
    //   this.getCategories(targetContext.dynamicId)
    //   this.selectedCtx = targetContext.name

    // }


    async getCategories(contextId) {
      const buildingId = sessionStorage.getItem("idBuilding");
      const resultCategory = await this.$store.dispatch(
        ActionTypes.GET_CONTEXT_CATEGORY_LIST,
        { buildingId, contextId }
      );
      this.categories = resultCategory

    },

    async getGroup(contextId, categoryDynId) {

      const buildingId = sessionStorage.getItem("idBuilding");
      const resultCategory = await this.$store.dispatch(
        ActionTypes.GET_CONTEXT_CATEGORY_GROUP_LIST,
        { buildingId, contextId, categoryDynId }
      );
      this.grp = resultCategory
      // console.warn(grp);


    },

    async GetInventory() {
      this.loadingStatus = 'loading';
      console.warn('l inventaire charche 1 ', this.currentType, this.typedata);

      try {
        if (this.typedata === 'equipement' || this.currentType == "BIMObject") {
          this.loadingStatus = 'end';
          return;
        }

        if (this.typedata === 'room' || this.currentType == "geographicRoom") {
          const inventoryResponse = await this.$store.dispatch(ActionTypes.GET_ROOM_INVENTORY, {
            id: this.selectedId,
            body: { context: this.selectedContext.name, category: this.selectedCat, groups: this.groupString },
            includeArea: true,
            onlyDynamicId: false,
          });
          console.warn(this.groupString, ' warn sssssssssssss');

          this.$emit('inventory-loaded', inventoryResponse);

          this.loadingStatus = 'end';
        }

        else if (this.typedata === 'floor' || this.currentType == "geographicFloor") {

          const inventoryResponse = await this.$store.dispatch(ActionTypes.GET_FLOOR_INVENTORY, {
            id: this.selectedId,
            body: { context: this.selectedContext.name, category: this.selectedCat, groups: this.groupString },
            onlyDynamicId: false,
          });
          console.warn(this.groupString, ' warn sssssssssssss');

          this.$emit('inventory-loaded', inventoryResponse);

          this.loadingStatus = 'end';
        }

        else {
          const buildingId = sessionStorage.getItem("idBuilding");
          const patrimoineId = JSON.parse(sessionStorage.getItem("patrimoine"))?.id;
          const floorsResult = await this.$store.dispatch(ActionTypes.GET_FLOORS, {
            buildingId,
            patrimoineId,
          });

          const floorIds = floorsResult.map(floor => floor.dynamicId);
          const allInventories = [];

          for (const floorId of floorIds) {
            try {
              const inventoryResponse = await this.$store.dispatch(ActionTypes.GET_FLOOR_INVENTORY, {
                id: floorId,
                body: { context: this.selectedContext.name, category: this.selectedCat, groups: this.groupString },
                includeArea: true,
                onlyDynamicId: false,
              });

              const floorName = floorsResult.find(f => f.dynamicId === floorId)?.name || `Étage ${floorId}`;

              allInventories.push({
                floorId,
                floorName,
                inventory: inventoryResponse,
              });
            } catch (error) {
              console.error(`[GetInventory] Erreur récupération inventaire pour ${this.selectedCtx} - ${this.selectedCat}, floor ${floorId} :`, error);
            }
          }

          this.$emit('inventory-loaded', allInventories);
          this.loadingStatus = 'end';
        }
      } catch (err) {
        console.error("Erreur GetInventory globale :", err);
        this.$emit('inventory-loaded', []);
        this.loadingStatus = 'error';
      }
    }
    ,


    resetForm() {
      // this.ticketname = '';
      // this.description = '';
      // this.workflowId = 0;
      // this.processId = 0;
      // this.files = [];
      // this.priority = null;
    },


    async createTicket(e) {
      // e.preventDefault();
      // const workflowname = this.workflowlist.find((item: WorkflowInterface) => item.dynamicId === this.workflowId);
      // const processname = this.process.find((item: WorkflowInterface) => item.dynamicId === this.processId);
      // const file = this.files;
      // if (workflowname && processname && this.ticketname && this.description && this.priority != null) {
      //   const data = {
      //     workflow: workflowname.name,
      //     process: processname.name,
      //     nodeDynamicId: this.selectedZone.dynamicId,
      //     name: this.ticketname,
      //     priority: this.priority,
      //     description: this.description,
      //   }

      //   const buildingId = sessionStorage.getItem("idBuilding");
      //   const res = await this.$store.dispatch(ActionTypes.ADD_TICKET, { buildingId, data, file });
      //   if (res) {
      //     this.resetForm();
      //     this.closeDialog();
      //     this.$emit('add-ticket', { message: 'ticket ajouté', status: 'success', context: 'ticket' });
      //   }
      //   else {
      //     this.$emit('add-ticket', { message: 'Erreur lors de l\'ajout du ticket', status: 'error', context: 'ticket' });
      //     this.showalert = false;
      //     this.closeDialog();
      //   }
      // } else {
      //   this.showalert = true;
      // }


    },


  },

};
</script>


<style>
.contentPop {
  background-color: #fff;
  border-radius: 24px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  /* height: calc(100vh - 200px); */
  min-height: 80vh;
  display: flex;
  position: relative;
  overflow: hidden;
}

.category-item.selected {
  background-color: #14202c;
  color: white;
  /* optionnel */
}

.category-list {
  background-color: #f3f3f3;
  border: 1px solid #cecece;
  border-radius: 5px;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 600px;
  margin: 10px;
  padding: 10px;
  margin: 10px;
  display: flex;
  overflow-y: auto;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgb(104, 104, 104);
  border-radius: 5px;
  cursor: pointer;
  transition: 0.5s;
  padding: 5px;
  margin-top: 5px;
  height: 60px;
  background-color: white;
}

.category-item:hover {
  background-color: rgb(236, 236, 236);
}

.material-icons {
  font-size: 20px;
}


.popup_loaded {
  position: absolute;
  width: 500px;
  height: 117px;
  /* top: 50%; */
  background-color: white;
  border: 1px solid gray;
  border-radius: 15px;
  z-index: 99;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-around;
  align-self: flex-end;
  -webkit-animation: slide-in-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: slide-in-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  margin-bottom: 100px;
  /* font-weight: bold; */
}

.validate {
  background-color: #14202c;
  color: white;
  border-radius: 5px;
  padding: 16px;
  margin-top: 7px;
}

.cancel {
  color: red;
  cursor: pointer;
  border: 1px solid red;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-top: 20px;
  border-radius: 5px;
}

@-webkit-keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(1000px);
    transform: translateY(1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(1000px);
    transform: translateY(1000px);
    opacity: 0;
  }

  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

<style scoped src="../assets/formComp.css"></style>