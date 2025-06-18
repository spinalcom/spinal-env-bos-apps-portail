<template>
  <div>
    <v-card @click.prevent="download" v-ripple class="main-button card-colored outer-card"
      style="background: #14202C; border-radius: 10px !important;" :class="{ 'enter-button': hover }"
      @mouseover="hover = true" @mouseleave="hover = false" elevation="8">
      <v-card v-ripple class="first-nested card-colored inner-card" style="background: #14202C; margin: auto;"
        :class="{ inside: hover }" elevation="8">
        <v-icon :class="{ inside: hover }" style="color: #bfbfbf; padding: 3px">mdi-file-download</v-icon>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { MutationTypes } from '../services/store/appDataStore/mutations';

export default {
  name: "DownloadButton",

  data: () => ({
    hover: false,
  }),

  methods: {
    async download() {

      this.downloadCSV();
    },
    async downloadCSV() {
      // Démarrer le loader
      this.$store.commit(MutationTypes.SET_LOADING, {
        message: "Initialisation...",
        completed: 0,
        total: 0,
        progress: 0,
      });
      this.$store.commit(MutationTypes.SET_LOADER, true);

      await this.$nextTick();

      // Récupérer les données
      let dataCommissioning = this.$store.state.appDataStore.DownloadData ? this.$store.state.appDataStore.DownloadData : this.$store.state.appDataStore.data;
      const data = this.$store.state.appDataStore.data;

      let completed = 0;
      const total = dataCommissioning.data.length;
      const resultFinaldata = dataCommissioning.data;

      // resultFinaldata.push(data.data);

      // Fichier prêt à être télécharger 
      this.$store.commit(MutationTypes.SET_LOADING, {
        message: "Préparation du fichier...",
        completed: total,
        total: total,
        percent: 100,
      });

      await new Promise(resolve => setTimeout(resolve, 300)); // petite pause pour que l'utilisateur voit l'étape de préparation du fichier

      const selectedZone = this.$store.state.appDataStore.zoneSelected.name;
      // Convertir les données en format CSV
      const flatData = this.convertCSV(resultFinaldata.flat(), data.sources);

      // Créer un fichier Excel
      const worksheet = XLSX.utils.json_to_sheet(flatData);
      // Ajout  des en-têtes
      const workbook = XLSX.utils.book_new();
      // Ajout des colonnes
      XLSX.utils.book_append_sheet(workbook, worksheet, selectedZone);

      XLSX.writeFile(workbook, `${selectedZone}-convention_nomage.xlsx`);

      // Télechargement terminé
      this.$store.commit(MutationTypes.SET_LOADING, {
        message: "Téléchargement terminé",
        completed: 0,
        total: 0,
        progress: 0,
        isSuccess: true
      });

      // Laisse le temps à l'utilisateur de voir le message
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Réinitialiser le loader
      this.$store.commit(MutationTypes.SET_LOADER, false);
    }
    ,
    extractForCSV(obj, sources) {
      const row = {
        dynamicId: obj.dynamicId,
        nom: obj.name,
        etage: obj.floor,
        groupe: obj.group,
      };
      for (const source of sources) {
        const childs = source.children;
        if (childs && childs.length > 0) {
          for (const childrenItem of childs) {
            if (obj[childrenItem.name.replace(' ', '_')]) {
              row[childrenItem.name] = obj[childrenItem.name.replace(' ', '_')];
            }
          }
        }
      }


      return row;
    },
    convertCSV(arr, sources) {
      let flat = arr.map(obj => this.extractForCSV(obj, sources));
      return flat;

      ;
    }


  },
};
</script>

<style scoped>
.card-colored {
  background-color: #14202c;
}

.outer-card {
  border-radius: 10px;
  height: 60px;
  width: 60px;
}

.inner-card {
  border-radius: 5px;
  height: 32px;
  width: 32px;
  border: 1px solid #bfbfbf;
  position: absolute;
  top: 13px;
  left: 13px;
}

.enter-button {
  cursor: pointer;
}

.inside {
  color: #fff !important;
}
</style>