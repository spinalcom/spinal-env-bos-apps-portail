<template>
    <div
        class="select-source"
      
    >
        <div class="label"  @click.stop="isOpen = !isOpen">
            <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
            <span v-if="childrenSelected.length == 0">{{ label }}</span>
            <span v-else style="text-transform: lowercase;">{{ childrenSelected.length }} éléments sélectionnés </span>
        </div>

        <div class="item" v-if="isOpen">
            <div class="box-content">
                <!-- <span class="" style="border: 1px solid #14202c; padding: 10px; border-radius: 5px;">
                    Sélectionner les sources
                </span> -->

                <ul
                class="item-list">
                <li class="bloc-item" v-for="(parent, idx) in parentsWitSelectedChildren" :key="parent.dynamicId">
                    <div class="item-parent" @click.stop="toggleParent(parent.dynamicId)">
                        <v-icon v-if="expandedParents.has(parent.dynamicId)">mdi-chevron-up</v-icon>
                        <v-icon v-else>mdi-chevron-down</v-icon>
                        
                        <span class="parent-label">
                            {{ parent.name }}
                            
                        </span>
                            <label class="custom-checkbox" for="">
                                <input
                                @click.stop=""
                                :checked="parent.allSelected"
                                :indeterminate.prop="parent.someSelected"
                                @change.stop="toggleAllChildren(parent)"
                                :id="`parent-${parent.dynamicId}`"
                                type="checkbox">
                            </label>
                    </div>
                    <ul 
                    v-if="expandedParents.has(parent.dynamicId)"
                    style="width: calc(100% - 20px); height: 100%; padding: 0; margin-left: 19px; display: flex; flex-direction: column; gap: 10px; transition: all 2ms linear;">
                        <li  class="children" v-for="(child, childIdx) in parent.children" :key="child.id">
                             <label style="display: flex; align-items: center; gap: 10px;">
                                 <input
                                type="checkbox"
                                :checked="isChildSelected(child.name)"
                                @change="toggleChildSelection(child.name)"
                                />
                                <span class="children-label">{{ child.name }}</span>
                            </label>
                        </li>
                    </ul>
                </li>
            </ul>
            
        </div>
        </div>
    </div>

</template>



<script lang="ts">
export default {
    name: 'SelectSource',
    props: {
        label: {
            type: String,
            default: 'Select Source',
        },
        items:  {
            type: Array ,
            default: () => [],

        }
    },
    data() {
        return {
            isOpen: false,
            expandedParents: new Set<number>(), 
            selectedChildren: new Set<number>(), 
            childrenSelected: [] as any[],
        }
    },

  mounted() {
  },

    methods: {
        toggleParent(parentId: number)  {
            if(this.expandedParents.has(parentId)) {
                this.expandedParents.delete(parentId);
            } else {
                this.expandedParents.add(parentId);
            }
            
            this.expandedParents = new Set(this.expandedParents);
        },

            toggleChildSelection(childName) {
                if (this.selectedChildren.has(childName)) {
                this.selectedChildren.delete(childName)
                } else {
                this.selectedChildren.add(childName)
                // recuperation de l'enfant selectionné
                const child = this.items.reduce((acc: any, parent: any) => {
                    const foundChild = parent.children.find(child => child.name === childName);
                    if (foundChild) {
                        acc = foundChild;
                    }
                    return acc;
                }, null);
                // Ajout de l'enfant sélectionné à la liste des enfants sélectionnés
                this.childrenSelected.push(child);
                }
                this.selectedChildren = new Set(this.selectedChildren)
                const itemsSelected = this.items.reduce((acc: any, parent: any) => {
                    const selectedChildren = parent.children.filter(child => this.selectedChildren.has(child.name));
                    if (selectedChildren.length > 0) {
                        acc.push({
                            ...parent,
                            children: selectedChildren
                        });
                    }
                    return acc;
                }, []);

                this.$emit('updateSelectedItems', itemsSelected);
                
            },

            isChildSelected(childName) {
                return this.selectedChildren.has(childName);
            },

        toggleAllChildren(parent) {
            const allSelected = parent.children.every(child => this.selectedChildren.has(child.name));
            parent.children.forEach(child => {
                if (allSelected) {
                this.selectedChildren.delete(child.name);
                } else {
                this.selectedChildren.add(child.name);
                }
            });
            // Force reactivity update
            this.expandedParents.add(parent.dynamicId); // Ensure parent is expanded
            this.expandedParents = new Set(this.expandedParents); // force reactive update

            const itemsSelected = this.items.reduce((acc: any, parent: any) => {
                const selectedChildren = parent.children.filter(child => this.selectedChildren.has(child.name));
                if (selectedChildren.length > 0) {
                    acc.push({
                        ...parent,
                        children: selectedChildren
                    });
                }
                return acc;
            }, []);
            this.childrenSelected = parent.children.filter(child => this.selectedChildren.has(child.name));
            this.$emit('updateSelectedItems', itemsSelected);


        this.selectedChildren = new Set(this.selectedChildren); // force reactive update
        },
        checkAllchildrenSelected(parent) {
            return parent.children.every(child => this.selectedChildren.has(child.dynamicId));
        }
    },
 
    
    watch: {
        isOpen(newVal) {
            if(newVal) {
                this.expandedParents = new Set(); 
            }
        },
    items: {
    handler(newItems) {
        this.expandedParents = new Set();
        this.selectedChildren = new Set(this.selectedChildren);
        this.parentsWitSelectedChildren
    },
  immediate: true,
}


    },
    computed : {
        parentsWitSelectedChildren() {
            return this.items.map((parent: any) => {
                const total = parent.children.length;
                const selected = parent.children.filter(child => this.selectedChildren.has(child.name)).length;
                return {
                    ...parent, 
                    allSelected: selected === total,
                    someSelected: selected > 0 && selected < total,
                }
            })
        }
    }
      
}

</script>



<style >
/* Custom */

.custom-checkbox {
    width: max-content;
    height: 100%;
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    position: relative;
    display: flex;
    align-items: center;
}
.custom-checkbox > input {
    width: 15px;
    height: 15px;
    background-color: #f9f9f9;
    accent-color: #14202C;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: absolute;
    right: 4px;
    position: relative;
}

 .custom-checkbox > .has-selected{
    content: '✔';
    background-color: #14202C;
    border: 1px solid #14202C;
    border-radius: 50%;
} 

.select-source {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 2px;
    user-select: none;
}
.select-source:hover {
    background-color: #f8f8f8a1;
    cursor: pointer;
}
.label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    width: 100%;
    height: 100%;
    gap: 20px;
    padding: 20px;
}
.item-list {
    width: 100%;
      padding: 0;
       margin: 0;
        display: flex;
         flex-direction: column; 
    gap: 2px;
    position: relative;
}

.box-content {
    width: 100%;
    height: max-content;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    position: relative;
    background-color: #ffffff;
    border-radius: 5px;
    position: relative;
}
.box-content::before {
    content: "";
    position: absolute;
    width: 20px;
    top: 30px;
    left: 30px;
    height: calc(100% - 84px);
    background-color: transparent;
    border-left: 1px solid #14202C;

    /* border-bottom-left-radius: 5px; */
}

.bloc-item {
    width: 100%;
    height: max-content;
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;
    /* border-left: 1.5px solid #14202C; */
}
.bloc-item::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 40px;
    width: 1px;
    height: calc(100% - 70px);
    background-color: #14202C;
    transition: all 0.3s ease;
}
.bloc-item::after {
    content: '';
    width: 15px;
    height: 25px;
    position: absolute;
    top: 0;
    left: -4px;
    border-bottom: 1px solid #14202C;
    border-left: 1px solid #14202C;
    border-left: 1px solid #14202C;
    border-bottom-left-radius: 7px;


} 
.item {
    position: absolute;
    width: 100%;
    height: 300px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    color: #14202C;
    border-radius: 2px;
    top: 46px;
    z-index: 3;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    user-select: none;

}


.item::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0px;
    width: 1px;
    background-color: #14202C;
    transition: all 0.3s ease;
}

.item::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    
}
.item::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
    border: 1px solid #14202C;

}
.item::-webkit-scrollbar-track {
    background-color: #f4f4f4;
    
}
.item::-webkit-scrollbar-thumb:hover {
    background-color: #e1ffd0;
}
.item::-webkit-scrollbar-thumb:active {
    background-color: #4e5057;
 
}


li {
   list-style: none;
   padding: 10px;
    font-size: 14px;
}
.item-parent {
  width: 100%;
  min-height: 35px;
  height: 35px;
  display: flex;
  flex-direction: flex-start;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  position: relative;
  background-color: #ffffff;
  border: 1px solid #14202C;
    border-radius: 5px;


}
.item-parent .parent-label {
    width: 200px;
    max-width: calc(100% - 80px);
    overflow: hidden !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
    color: #14202C;
}
.children {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #14202C;
    border-radius: 5px;
    border: 1.5px solid #14202C;
    transition: all 0.3s ease;
    position: relative;
}
.children-label {
    width: 200px;
    max-width: calc(100% - 80px);
    overflow: hidden !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
    color: #14202C;
}
.children::before {
    content: '';
    position: absolute;
    width: 15px;
    height: 20px;
    left: -15px;
    top: 30%;
    transform: translateY(-70%);
    background-color: transparent;
    /* border-left: 1px solid #14202C; */
    border-bottom: 1px solid #14202C;
    border-bottom-left-radius: 7px;
    

}

.drop-down-bottom-parent {
    width: 10px;
    height: 10px;
    background-color: transparent;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid #14202C;
    border-left: 2px solid #14202C;
    transform: rotate(140deg);
    transition: all 0.5s ease;
}
.drop-down-top-parent {
    width: 10px;
    height: 10px;
    background-color: transparent;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 2px solid #14202C;
    border-right: 2px solid #14202C;
    transform: rotate(135deg);
    transition: all 0.5s ease;
}

.drop-down-bottom {
    width: 15px;
    height: 15px;
    background-color: transparent;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid #14202C;
    border-left: 2px solid #14202C;
   transform: rotate(140deg);
    transition: all 0.3s ease;
}

.drop-down-top {
    width: 15px;
    height: 15px;
    background-color: transparent;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 2px solid #14202C;
    border-right: 2px solid #14202C;
    transform: rotate(135deg);
    transition: all 0.3s ease;
}

</style>