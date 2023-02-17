<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
  <v-container class="_container"
               fluid>
    <!-- <div class="header"> 
       <Select @selected="selectCategory" /> 
     </div> -->

    <v-card class="myCard"
            elevation="4">
      <Home :headers="headers"
            :apis="apis"
            @upload="uploadFile"
            @delete="deleteItems" />
    </v-card>
  </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Select from "../components/select.vue";
import Home from "../components/Home.vue";
import categories from "../store/categories";
import { Action, Getter, State } from "vuex-class";
import { IApiRoute } from "../interfaces";

type updateFunc = (param: { id: string; data: IApiRoute }) => Promise<void>;

@Component({
  components: {
    Select,
    Home,
  },
})
class TableComponent extends Vue {
  @State bosApis!: any;

  @Getter bosApisGet!: any;

  @Action createBosApiRoute!: (api: IApiRoute) => Promise<void>;
  @Action updateBosApiRoute!: updateFunc;
  @Action getAllBosApiRoute!: () => Promise<void>;
  @Action deleteBosApiRoute!: (id: string) => Promise<void>;
  @Action uploadBosSwaggerFile!: (data: FormData) => Promise<void>;

  headers = [
    { text: "Nom", value: "name" },
    { text: "Scope", value: "scope" },
    { text: "Methodes", value: "method" },
  ];

  apis: any[] = [];
  categorySelected: any;

  async mounted() {
    await Promise.all([this.getAllBosApiRoute()]);

    this.selectCategory(categories.building);
  }

  async uploadFile(formData: FormData) {
    let isSuccess;
    try {
      switch (this.categorySelected.id) {
        case categories.building.id:
          await this.uploadBosSwaggerFile(formData);
          break;

        // case categories.portofolio.id:
        //   await this.uploadPortofolioSwaggerFile(formData);
        //   break;
      }
      isSuccess = true;
    } catch (error) {
      isSuccess = false;
    }

    this.$swal({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      icon: isSuccess ? "success" : "error",
      text: isSuccess ? "fichier ajouté" : "oups, une erreur s'est produite !",
    });
  }

  selectCategory(item: { name: string; id: string }) {
    this.categorySelected = item;
    switch (item.id) {
      case categories.building.id:
        this.apis = this.bosApisGet;
        break;

      // case categories.portofolio.id:
      //   this.apis = this.portofolioApisGet;
      //   break;

      default:
        break;
    }
  }

  async deleteItems(items: IApiRoute[]) {
    return this.$swal({
      title: "Supprimer",
      text: `Êtes-vous sûre de vouloir supprimer ${items.length} routes ?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "successBtn",
      cancelButtonClass: "errorBtn",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      buttonsStyling: false,
      icon: "warning",
    }).then(async ({ isConfirmed }) => {
      if (!isConfirmed) return;

      const isSuccess = await this.removeCallback(items);

      this.$swal({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        icon: isSuccess ? "success" : "error",
        text: isSuccess
          ? "api(s) supprimée(s)"
          : "oups, une erreur s'est produite !",
      });
    });
  }

  async removeCallback(items: IApiRoute[]) {
    let isSuccess;
    try {
      switch (this.categorySelected.id) {
        case categories.building.id:
          await Promise.all(
            items.map((el) => this.deleteBosApiRoute(<any>el.id))
          );
          break;

        // case categories.portofolio.id:
        //   await Promise.all(
        //     items.map((el) => this.deletePortofolioApiRoute(<any>el.id))
        //   );
        //   break;
      }
      isSuccess = true;
    } catch (error) {
      isSuccess = false;
    }

    return isSuccess;
  }

  @Watch("bosApis")
  watchBosApis() {
    if (
      this.categorySelected &&
      this.categorySelected.id === categories.building.id
    )
      this.apis = this.bosApisGet;
  }

  // @Watch("portofolioApis")
  // watchPortofolioApis() {
  //   if (
  //     this.categorySelected &&
  //     this.categorySelected.id === categories.portofolio.id
  //   )
  //     this.apis = this.portofolioApisGet;
  // }
}

export default TableComponent;
</script>

<style lang="scss">
$header-height: 70px;
._container {
  width: 100vw;
  height: 100vh;
  margin-top: $header-height;

  .header {
    height: $header-height;
    margin-bottom: 10px;
  }

  .myCard {
    width: 100%;
    height: calc(100vh - 90px);
    // background: #f5f3f3;
    background: transparent !important;
    border-radius: 10px !important;
    margin: auto;
  }
}
</style>

<style>
.successBtn {
  width: 60px !important;
  height: 40px;
  border: 1px solid green;
  color: green;
  border-radius: 5px;
  margin: 5px;
}

.errorBtn {
  width: 75px !important;
  height: 40px;
  border: 1px solid #ff5252;
  color: #ff5252;
  border-radius: 5px;
  margin: 5px;
}
</style>