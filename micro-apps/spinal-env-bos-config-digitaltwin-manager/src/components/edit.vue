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
  <div class="setDigitalTwin">
    <div class="header">
      <v-btn
        depressed
        large
        color="#14202c"
        style="color: #fff"
        @click="create"
      >
        Ajouter un nouveau jumeau numérique
      </v-btn>
    </div>

    <div class="content">
      <div class="_title"
        >Selectionner le jumeau numérique par defaut et enregistrer</div
      >
      <div class="search">
        <v-text-field
          v-model="searchText"
          label="Rechercher"
          outlined
          dense
          filled
          rounded
          append-icon="mdi-magnify"
          required
        ></v-text-field>
      </div>
      <div class="listContent">
        <v-list
          style="background-color: transparent !important"
          v-if="digitaltwins.length > 0"
        >
          <v-list-item-group v-model="selected" color="green">
            <v-list-item
              two-line
              v-for="digitaltwin in searched"
              :key="digitaltwin.id"
              :value="digitaltwin"
            >
              <v-list-item-content>
                <v-list-item-title>{{ digitaltwin.name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  digitaltwin.url
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  v-if="
                    actualDigitalTwin && actualDigitalTwin.id === digitaltwin.id
                  "
                  icon
                >
                  <v-icon color="green">mdi-check</v-icon>
                </v-btn>

                <v-btn
                  v-if="
                    !actualDigitalTwin ||
                    actualDigitalTwin.id !== digitaltwin.id
                  "
                  icon
                  @click.stop="deleteDigitalTwin(digitaltwin.id)"
                >
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>

      <!-- <multiselect v-model="selected"
                     placeholder="Selectionner le jumeau numérique par defaut"
                     track-by="id"
                     label="name"
                     :options="digitaltwins"
                     :allowEmpty="false"
                     :show-labels="false">
          <template slot="option"
                    slot-scope="props">
            <div class="description">
              <div class="option__title">{{ props.option.name }}</div>
              <div class="option__small">{{ props.option.url }}</div>
            </div>
          </template>
        </multiselect> -->
    </div>

    <div class="actions">
      <v-btn depressed large color="error" @click="cancel"> Annuler </v-btn>

      <v-btn
        depressed
        large
        color="#14202c"
        style="color: #fff; margin-left: 10px"
        @click="save"
      >
        Enregistrer
      </v-btn>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
  props: {
    digitaltwins: {},
    actualDigitalTwin: {},
  },
  components: {
    Multiselect,
  },
  data() {
    return {
      searchText: '',
      selected: this.actualDigitalTwin,
      searched: [],
    };
  },
  mounted() {
    this.setSearchedItems();
  },
  methods: {
    create() {
      this.$emit('create');
    },

    save() {
      if (this.selected) this.$emit('change', this.selected);
    },

    cancel() {
      this.$emit('cancel');
    },

    deleteDigitalTwin(id) {
      return this.$swal({
        title: 'Supprimer',
        text: `Êtes-vous sûre de vouloir supprimer cet jumeau numérique ?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'successBtn',
        cancelButtonClass: 'errorBtn',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuler',
        buttonsStyling: false,
        icon: 'warning',
      }).then(async ({isConfirmed}) => {
        if (!isConfirmed) return;

        this.$emit('delete', id);
      });
    },
    setSearchedItems() {
      if (!this.searchText) this.searched = this.digitaltwins;
      this.searched = this.digitaltwins.filter((el) =>
        el.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
  },
  watch: {
    actualDigitalTwin() {
      if (this.actualDigitalTwin) this.selected = this.actualDigitalTwin;
    },
    digitaltwins() {
      this.setSearchedItems();
    },
    searchText() {
      this.setSearchedItems();
    },
  },
};
</script>

<style lang="scss" scoped>
.setDigitalTwin {
  width: 100%;
  height: 100%;

  .header {
    margin-bottom: 15px;
  }
  .header,
  .actions {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .content {
    width: 100%;
    height: 450px;
    // height: calc(100% - 100px);

    .search {
      width: 100%;
      height: 50px;
      margin-top: 10px;
    }

    .listContent {
      width: 100%;
      height: calc(100% - 100px);
      overflow: auto;
    }
    // display: flex;
    // align-items: center;
    // > div {
    //   width: 100%;
    // }

    // ._title {
    //   margin-bottom: 10px;
    //   font-size: 1.2em;
    // }

    // .description {
    //   height: 30px;
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   .option__title {
    //     // height: 30px;
    //     font-size: 1.2em;
    //     font-weight: 500;
    //   }
    //   .option__small {
    //     // height: 10px;
    //     font-size: 0.8em !important;
    //     color: grey;
    //   }
    // }
  }
}
</style>

<style>
/* .multiselect__option--highlight { */
/* background: #14202c !important; */
/* background: rgb(171 176 181) !important; */
/* } */
</style>
