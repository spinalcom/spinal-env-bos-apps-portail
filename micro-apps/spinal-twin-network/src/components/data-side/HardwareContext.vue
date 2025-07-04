<!--
Copyright 2024 SpinalCom - www.spinalcom.com

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
  <div class="HardwareContextContainer">
    <div class="custom-dropdown">
      <div class="dropdown-selected" style="font-size: 15px!important;" @click="toggleDropdown">
        <!-- {{ selectedLabel }} -->
          <div>
            <span v-if="label.length > 0">
              <ul style="display: flex; gap: 20px; list-style: none; ">
                <li v-for="(item, index) in label" :key="index" class="hardware-item">
                  <span :style="{'background-color': item.color, width: `5px`, height: `15px`, 'border-radius': `5px`, 'margin-right': `5px`}"></span> 
                  
                  {{  item.name }}
                </li>
              </ul>
            </span>
            <span v-else>Select an option</span>
          </div>
        <div>
          <span class="arrow"></span>
        </div>
      </div>
      <ul v-show="dropdownOpen" class="dropdown-list" style="font-size: 15px!important;">
        <li v-for="(item, index) in visibleItems" :key="index">
          <div>
            {{ item.name }}
          </div>
          <div>
            <input
              type="checkbox"
              :checked="isChecked(item.nodeId)"
              @change="onCheckboxChange($event, item)"
            >
          </div>
          <!-- {{ item.nodes[0].name.length > 60 ? item.nodes[0].name.substring(0, 60) + '...' : item.nodes[0].name }} -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import createAccentColorGenerator from "../../services/utils/colors";
import { MutationTypes } from "../../services/store/appDataStore/mutations";
import { get } from "http";
import { title } from "process";

@Component({
  name: "HardwareContext",
})
class HardwareContext extends Vue {
  @Prop() data!: any[];
  @Prop() selectedDynamicId!: {contextId: number,  nodeId: number }[];

  selectedItemId: number []  = [];
  hardwareContextSelected : {contextId: number, nodeId: number, color: string}[] = [];
  label: {contextId: number, name: string, color?: string}[] = [];
  startIndex: number = 0;
  dropdownOpen: boolean = false;
  indHardWareContextSelected: number[] = [];

  get visibleItems() {
    return this.data.map((item) => {
      return {
        nodeId: item.dynamicId,
        contextId: item.nodes[0].realid,
        name: item.nodes[0].name,
      };
    })
  }

  getItemColor(contextId: number): string {
    const color = this.$store.state.appDataStore.hardwareColor.get(contextId);
    return color ? color : '#fff'; // Default color if not found
  }




  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }



isChecked(dynamicId: number): boolean {
  return this.hardwareContextSelected.some(item => item.nodeId === dynamicId);
}



  onCheckboxChange(event: Event, item: { nodeId: number; contextId: number; name: string }) {
  const isChecked = (event.target as HTMLInputElement).checked;
  console.warn("HardawareContext before emit: ", this.hardwareContextSelected);

  const index = this.hardwareContextSelected.findIndex(el => el.nodeId === item.nodeId);
  const getColor = createAccentColorGenerator()
      const color = getColor();
  if (isChecked && index === -1) {
    this.hardwareContextSelected.push({
      nodeId: item.nodeId,
      contextId: item.contextId,
      color: getColor()
    });



    this.label.push({
      contextId: item.contextId,
      name: item.name,
      color: color
    });
     this.$store.commit(MutationTypes.SET_HARDWER_COLOR, {
          contextId: item.contextId,
          color: color,
        });
  } else if (!isChecked && index !== -1) {
    this.hardwareContextSelected.splice(index, 1);
    this.label = this.label.filter(l => l.contextId !== item.contextId);
  }
  console.warn("HardwareContext emit: ", this.hardwareContextSelected);

  this.indHardWareContextSelected = this.hardwareContextSelected.map(i => i.contextId);
  this.$emit('update-selected', this.hardwareContextSelected);
}


@Watch('selectedDynamicId', { immediate: true, deep: true })
onSelectedDynamicIdChange(newVal: any) {
  if (!Array.isArray(newVal) || newVal.length === 0) return;
  console.log("onSelectedDynamicIdChange called with newVal: ", newVal);
  const newIds = newVal.map((el: any) => el.nodeId).sort();
  const currentIds = this.hardwareContextSelected.map(el => el.nodeId).sort();

  // Vérifie si les tableaux ont la même longueur et contiennent les mêmes éléments
  const isSame =
    newIds.length === currentIds.length &&
    newIds.every((id, idx) => id === currentIds[idx]);

  if (isSame) return;

  

  this.hardwareContextSelected = [];
  this.indHardWareContextSelected = [];
  this.label = [];

  for (const element of newVal) {
    const item = this.data.find(dataItem => dataItem.dynamicId === element.nodeId);
    if (item) {
      this.hardwareContextSelected.push({
        nodeId: item.dynamicId,
        contextId: item.nodes[0].realid,
        color: element.color
      });

       this.$store.commit(MutationTypes.SET_HARDWER_COLOR, {
          contextId: item.nodes[0].realid,
          color: newVal.find((el: any) => el.nodeId === item.dynamicId)?.color,
        });


      this.indHardWareContextSelected.push(item.nodes[0].realid);
      const color = this.$store.state.appDataStore.hardwareColor.get(item.nodes[0].realid);
      console.warn("color label: ", this.$store.state.appDataStore.hardwareColor);
      
      this.label.push({
        contextId: item.nodes[0].realid,
        name: item.nodes[0].name,
        color: color 
      });
      
      console.warn("label after change: ", this.label);
    }
  }


  this.hardwareContextSelected = [...this.hardwareContextSelected];
  this.indHardWareContextSelected = [...this.indHardWareContextSelected];
  this.label = [...this.label];

  // Facultatif : évite d'émettre si inutile
  // this.$emit('update-selected', this.hardwareContextSelected);
}

@Watch('label', { immediate: true, deep: true })
onLabelChange(newVal: any) {
  this.$store.commit(MutationTypes.SET_HARDWARE_LIST, []);
  if (!Array.isArray(newVal) || newVal.length === 0) return;
  console.log("onLabelChange called with newVal: ", newVal);
  let hardwareItem: any = [];
    newVal.forEach((item: any) => {
       item = {
        title: item.name,
        color: item.color,
        type: "line"
      }
      hardwareItem.push(item);

    })
    console.log("hardwareItem: ", hardwareItem);
    this.$store.commit(MutationTypes.SET_HARDWARE_LIST, hardwareItem);

}


}

export { HardwareContext };
export default HardwareContext;
</script>


<style lang="scss">
.HardwareContextContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 80px;
}

.custom-dropdown {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropdown-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background-color: #14202c;
  color: #fff;
  border-radius: 7px;
  cursor: pointer;
  position: relative;
}

.dropdown-selected .arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #fff;
  // background-color: turquoise;
  display: flex;
  align-items: center;
  justify-content: center;
}

// .v-application ul {
//   list-style: none;
//   padding: 0;
//   margin: 0;
// }

.dropdown-list {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  background-color: #14202c;
  color: #ffffff;
  border: 1px solid #ccc;
  z-index: 1000;
  padding: 4px !important;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dropdown-list li {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
}
.dropdown-list li input[type="checkbox"] {
  width: 15px;
  height: 15px;
  cursor: pointer;
  margin-right: 10px;
  accent-color: #00ff00; /* Change the color of the checkbox */
}

.dropdown-list li.selected {
  background-color: #1c2a38;
}

.dropdown-list li:hover {
  background-color: #1c2a38;
}
.select-hardware {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
  display: inline-block;
  background-color: #00ff00;
  outline: #00ff00a2 solid 2px;
}
.hardware-item {
  width: max-content;
  height: max-content;
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: 200px;
  width: max-content;
  border-radius: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
</style>
