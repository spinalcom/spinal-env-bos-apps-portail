<template>
    <div>
        <div @click.stop
            style="background-color: white;width: 65%;left: 50%;top:50%;position: absolute;transform: translate(-50%,-50%); overflow: hidden;padding-bottom: 10px;">
            <div
                style="background-color: rgb(228, 228, 228);width: 100%;height: 50px;padding: 10px;font-size: 25px; color: #14202c;font-weight: bold;padding-bottom: 50px;">
                Import des données
            </div>



            <div style="padding-left: 10px;padding-right: 10px;margin-top: 10px;">
                <DataTable :height="'58vh'" :items="filteredContexts" :headers="headers" :contexts="filteredContexts"
                    :selections="selections" @item-selected="selectDataView($event)" @filter="filtercolumn($event)" />
            </div>

            <div
                style="width: 100%;height: 40px;display: flex;flex-direction: row;justify-self: center;align-self: center;">
                <label style="margin-top: 16px;" class="custom-file-upload">
                    <input type="file" @change="handleFileUpload" style="display: none;" />
                    <span
                        style="border: 1px solid black; padding: 8px ;border-radius: 4px; color: white;background: #14202c;font-weight: bold;"
                        id="file-chosen">Choisir un fichier </span>
                    <span v-if="fileIsLoaded" style="margin-left: 5px;color: green;">fichier importé avec succés</span>
                </label>
            </div>
            
            <button v-if="fileIsLoaded" @click="uploadData()"
                style="border: 1px solid black; background-color: #14202c ;color: white;padding: 8px; position: absolute; right:10px;bottom: 6px;height: 34px; border-radius: 4px;font-weight: bold;display: flex;justify-content: center;align-items: center;">Valider
                l'import</button>

        </div>
        <div v-if="showinfoEdit" @click.stop="showinfoEdit = !showinfoEdit"
            style="width: 100%;height: 100%; position: absolute; ; left: 50% ; top :50%;transform: translate(-50%,-50%);backdrop-filter: blur(4px);">
            <div v-if="showinfoEdit"
                style="width: 30%;height: 40%;position: absolute;background-color: white;left: 50%;top: 50%;transform: translate(-50%,-50%);border-radius: 5px;border: 2px solid gray;box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;padding-bottom: 40px;">

                <div style="display: flex;flex-direction: column;border-bottom: 1px solid gray;">

                    <div style="display: flex; ">
                        <div style="height: 30px;text-align: center;overflow: hidden;width: 50%;white-space: nowrap;text-overflow: ellipsis;border-right: 1px solid gray;font-weight: bold;">Attributs/Categories</div>
                        <div style="height: 30px;text-align: center;overflow: hidden;width: 50%;white-space: nowrap;text-overflow: ellipsis;border-right: 1px solid gray;font-weight: bold;">Nouvelles données</div>
                        <div style="height: 30px;text-align: center;overflow: hidden;width: 50%;white-space: nowrap;text-overflow: ellipsis;font-weight: bold;">Anciennes données</div>
                    </div>

                    <div v-for="(difference, indexDifference) in selectedItem.differences" style="display: flex;border-top: 1px solid gray;">
                        <div style="text-align: center;overflow: hidden;width: 50%;white-space: nowrap;text-overflow: ellipsis;border-right: 1px solid gray;">{{ indexDifference }} </div>
                        <div style="text-align: center;overflow: hidden;width: 50%;white-space: nowrap;text-overflow: ellipsis;border-right: 1px solid gray;"> <v-icon color="green">mdi-arrow-right-bold</v-icon>  {{ difference.to }}</div>
                        <div style="text-align: center;overflow: hidden;width: 50%;white-space: nowrap;text-overflow: ellipsis;">{{ difference.from }}<v-icon color="red">mdi-arrow-right-bold</v-icon></div>
                    </div>

                </div>


                <button @click.stop="showinfoEdit = !showinfoEdit"
                    style="border: 1px solid black; background-color: #14202c ;color: white;padding: 8px; position: absolute; right:10px;bottom: 6px;height: 34px; border-radius: 4px;font-weight: bold;display: flex;justify-content: center;align-items: center;">Quitter</button>
            </div>
        </div>

    </div>

</template>
<script>
import SpinalExcelManager from 'spinal-env-viewer-plugin-excel-manager-service'
import { MutationTypes } from "../../services/store/appDataStore/mutations";
import DataTable from './SpinalDataTable';

export default {
    components: {
        DataTable
    },
    props: ['contexts'],
    data: () => ({
        dataflattenedDifferences: [],
        showElementModofication: false,
        formattedList: [],
        fileIsLoaded: false,
        checked: false,
        tableData: [],
        difference_data: [],
        dataTab: [],
        showinfoEdit: false,
        headers: [
            { text: 'Nom', value: 'name' },
            { text: 'Attributs modifiés', value: 'diffType' },
            { text: 'Détails', value: 'info' },
        ],
        selections: [],
        selectedItem: false,
    }),

    computed: {
        filteredContexts() {
            if (this.dataTab) {
                return this.dataTab
            }
        },
    },

    methods: {

        selectDataView(event) {
            // console.log(event);
            this.selectedItem = event
            this.showinfoEdit = true
        },

        async handleFileUpload(event) {
            const file = event.target.files[0];
            this.$emit('extractData');
            if (file) {
                this.fileIsLoaded = true;
                const loaded = (await SpinalExcelManager.convertExcelToJson(file))['sheet 1'];
                if (this.checked != true) {
                    this.tableData = this.contexts[0].data?.map(item => {
                        const dataForRow = {
                            dynamicId: item.dynamicId,
                            staticId: item.staticId,
                            Nom: item.name,
                        };

                        item?.categoryAttributes.forEach(category => {
                            category.attributs.forEach(attr => {
                                const attrKey = `${attr.label}/${category.name}`;
                                dataForRow[attrKey] = attr.value;
                            });
                        });

                        return dataForRow;
                    });
                    this.$store.commit(MutationTypes.SET_DLDATA, this.tableData);
                }

                const dldata = this.$store.state.appDataStore.dlData

                console.log(loaded , '/////////////////////////');
                
                this.dataTab = this.findDifferencesByStaticId(loaded, dldata);
            }
        },


        findDifferencesByStaticId(array1, array2) {
            let differences = [];
            array1.forEach(a1 => {
                const a2 = array2.find(a2 => a2.staticId === a1.staticId);
                if (a2) {
                    let diff = {};
                    let diffType = [];
                    let keys = new Set([...Object.keys(a1), ...Object.keys(a2)]);
                    keys.forEach(key => {
                        const normalizeValue = (value) => {
                            const normalized = value?.result ?? value;
                            return (normalized === undefined || normalized === null || normalized === "") ? "" : String(normalized);
                        };

                        const word1 = normalizeValue(a1[key]);
                        const word2 = normalizeValue(a2[key]);

                        if (word1 !== word2 && key != 'dynamicId') {
                            diff[key] = { from: word2, to: word1 };
                            diffType.push(key)
                        }
                    });

                    if (Object.keys(diff).length > 0) {
                        differences.push({ staticId: a1.staticId, name: a1.Nom, dynamicId: a2.dynamicId, differences: diff, info: 'Voir les details', diffType: diffType });
                    }
                }

            });
            return differences;
        },

        formatData(dataList) {
            const formattedData = dataList.map(item => {
                const formattedItem = { dynamicId: item.dynamicId, categories: [] };
                const categoriesMap = {};

                for (const [key, value] of Object.entries(item.differences)) {
                    const [attributeLabel, categoryName] = key.split('/');

                    if (!categoriesMap[categoryName]) {
                        categoriesMap[categoryName] = {
                            categoryName,
                            attributes: []
                        };
                    }

                    categoriesMap[categoryName].attributes.push({
                        attributeLabel,
                        attributeNewValue: value.to
                    });
                }

                for (const category of Object.values(categoriesMap)) {
                    formattedItem.categories.push(category);
                }

                return formattedItem;
            });
            this.formattedList = formattedData;
        },

        uploadData() {
            this.$store.dispatch('UPDATE_MULTIPLE_ATTRIBUTES', {
                buildingId: localStorage.getItem("idBuilding"),
                formattedData: this.formattedList
            }).then(() => {
                this.$emit('updateSuccess');
            }).catch(error => {
                console.error('Erreur lors de la mise à jour:', error);
            });
        },

        showelementedited(el) {
            this.showElementModofication = !this.showElementModofication
        }
    },

    watch: {
        dataTab(newVal, oldVal) {
            this.formatData(newVal)
        },
    }
}


</script>
<style scoped>
.tableau {
    overflow: scroll;
    max-height: 200px;

}


.custom-file-upload {
    display: inline-block;
    cursor: pointer;
}

.custom-file-upload button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
}

.custom-file-upload #file-chosen {
    margin-left: 10px;
    font-family: Arial, sans-serif;
}
</style>