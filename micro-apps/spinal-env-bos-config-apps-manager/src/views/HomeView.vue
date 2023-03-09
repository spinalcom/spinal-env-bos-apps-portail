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
  <v-container class="mainContent"
               fluid>
    <AppListComponent :buildingApps="buildingApps"
                      :adminApps="adminApps"
                      @select="selectCategory"
                      @create="goToCreationPage"
                      @upload="uploadApp"
                      @edit="goToCreationPage"
                      @delete="deleteApp"
                      v-if="page === pages.list" />

    <CreationComponent v-else-if="page === pages.creation"
                       @create="createApp"
                       @edit="editApp"
                       @cancel="cancelCreation"
                       :edit="edition"
                       :title="title"
                       :appSelected="appSelected" />

    <LoadingComponent v-else-if="page === pages.loading" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import AppListComponent from "../components/appsComponent.vue";
import LoadingComponent from "../components/loading.vue";
import CreationComponent from "../components/creation.vue";
import categories from "../store/data";
import { IApp } from "../types/interfaces";
import { sendEventToParent } from "../event";
type updateFunc = ({
  id,
  newValue,
}: {
  id: string;
  newValue: IApp;
}) => Promise<void>;

type creationFunc = (app: IApp) => Promise<void>;

@Component({
  components: {
    AppListComponent,
    LoadingComponent,
    CreationComponent,
  },
})
class HomeView extends Vue {
  pages = Object.freeze({
    list: 1,
    creation: 2,
    loading: 3,
  });

  edition: boolean = false;
  appSelected: IApp = null;

  page: number = this.pages.list;
  categorySelected: any = null;
  apps: IApp[] = [];

  @State buildingApps!: IApp[];
  @State adminApps!: IApp[];

  @Action getAllBuildingApps!: () => Promise<void>;
  @Action getAllAdminApps!: () => Promise<void>;

  @Action createBuildingApps!: creationFunc;
  @Action createAdminApps!: creationFunc;

  @Action deleteBuildingApp!: (id: string) => Promise<void>;
  @Action deleteAdminApp!: (id: string) => Promise<void>;

  @Action updateBuildingApp!: updateFunc;
  @Action updateAdminApp!: updateFunc;

  @Action uploadAdminFile!: (file: FormData) => Promise<void>;
  @Action uploadBuildingFile!: (file: FormData) => Promise<void>;

  async mounted() {
    this.page = this.pages.loading;

    await Promise.all([this.getAllBuildingApps(), this.getAllAdminApps()]);

    this.page = this.pages.list;
    const selected = this.categorySelected || categories.bos;
    this.selectCategory(selected);
  }

  selectCategory(item?: any) {
    this.categorySelected = item;

    switch (item.id) {
      case categories.bos.id:
        this.apps = this.buildingApps;
        break;

      case categories.admin.id:
        this.apps = this.adminApps;
        break;

      default:
        this.apps = [];
        break;
    }
  }

  goToCreationPage({ app, categorySelected }) {
    this.categorySelected = categorySelected;
    if (app) {
      this.edition = true;
      this.appSelected = app;
    }

    this.page = this.pages.creation;
  }

  async createApp(app: IApp) {
    if (typeof app.icon !== "string" && (<any>app.icon).name)
      app.icon = `mdi-${(<any>app.icon).name}`;

    let isSuccess;
    try {
      this.page = this.pages.loading;

      switch (this.categorySelected.id) {
        case categories.bos.id:
          await this.createBuildingApps(app);
          break;

        case categories.admin.id:
          await this.createAdminApps(app);
          break;
      }
      isSuccess = true;
    } catch (error) {
      isSuccess = false;
    }

    this.page = this.pages.list;
    const message = isSuccess
      ? "application ajoutée"
      : "oups, une erreur s'est produite !";

    this.alertNotification(isSuccess, message);

    sendEventToParent("reload_portofolio");
  }

  uploadApp({ categorySelected }) {
    this.categorySelected = categorySelected;
    const maxSize = 25000000;
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.click();
    input.addEventListener(
      "change",
      (event: any) => {
        const [file] = event.target.files;
        if (file.size >= maxSize) {
          alert(
            "The selected file is too large. The maximum size must not exceed 25 MB"
          );
          return;
        }
        if (!/.*\.xlsx$/.test(file.name)) {
          alert("The selected file must an excel file");
          return;
        }
        var formData = new FormData();
        formData.append("file", file);
        this.uploadFile(formData);
      },
      false
    );
  }

  async uploadFile(formData: FormData) {
    let isSuccess;
    try {
      this.page = this.pages.loading;

      switch (this.categorySelected.id) {
        case categories.bos.id:
          await this.uploadBuildingFile(formData);
          break;

        case categories.admin.id:
          await this.uploadAdminFile(formData);
          break;
      }
      isSuccess = true;
    } catch (error) {
      isSuccess = false;
    }

    this.page = this.pages.list;
    const message = isSuccess
      ? "fichier ajouté"
      : "oups, une erreur s'est produite !";
    this.alertNotification(isSuccess, message);

    sendEventToParent("reload_portofolio");
  }

  async editApp(app: IApp) {
    if (typeof app.icon !== "string" && (<any>app.icon).name)
      app.icon = `mdi-${(<any>app.icon).name}`;

    const id: any = this.appSelected.id;
    let isSuccess;
    try {
      this.page = this.pages.loading;

      switch (this.categorySelected.id) {
        case categories.bos.id:
          await this.updateBuildingApp({ id, newValue: app });
          break;

        case categories.admin.id:
          await this.updateAdminApp({ id, newValue: app });
          break;
      }
      isSuccess = true;
    } catch (error) {
      isSuccess = false;
    }

    this.page = this.pages.list;
    const message = isSuccess
      ? "application modifiée"
      : "oups, une erreur s'est produite !";

    this.alertNotification(isSuccess, message);

    sendEventToParent("reload_portofolio");
  }

  deleteApp({ app, categorySelected }) {
    return this.$swal({
      title: "Supprimer",
      text: `Êtes-vous sûre de vouloir supprimer ${app.name} ?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "successBtn",
      cancelButtonClass: "errorBtn",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
      buttonsStyling: false,
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.categorySelected = categorySelected;

        this.page = this.pages.loading;
        let isSuccess;
        try {
          switch (this.categorySelected.id) {
            case categories.bos.id:
              await this.deleteBuildingApp(<any>app.id);
              break;

            case categories.admin.id:
              await this.deleteAdminApp(<any>app.id);
              break;
          }
          isSuccess = true;
        } catch (error) {
          isSuccess = false;
        }

        this.page = this.pages.list;

        const message = isSuccess
          ? "Application supprimée"
          : "oups, une erreur s'est produite !";

        this.alertNotification(isSuccess, message);
        sendEventToParent("reload_portofolio");
      }
    });
  }

  cancelCreation() {
    this.edition = false;
    this.page = this.pages.list;
  }

  get title() {
    if (!this.categorySelected) return "";

    if (this.edition) return "Modifier une application";

    const begin = "Créer une application";
    switch (this.categorySelected.id) {
      case categories.bos.id:
        return `${begin} de batiment`;

      case categories.admin.id:
        return `${begin} d'administration`;
    }
  }

  @Watch("buildingApps")
  watch_buildingApps() {
    if (this.categorySelected && this.categorySelected.id === categories.bos.id)
      this.apps = this.buildingApps;
  }

  @Watch("adminApps")
  watch_adminApps() {
    if (
      this.categorySelected &&
      this.categorySelected.id === categories.admin.id
    ) {
      this.apps = this.adminApps;
    }
  }

  alertNotification(isSuccess, message) {
    this.$swal({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      icon: isSuccess ? "success" : "error",
      text: message,
    });
  }
}

export default HomeView;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
// $header-height: 70px;
// $header-margin: 10px;
// $card-background: #f8f9f9;

.mainContent {
  width: 100%;
  height: 100%;
  padding: 0 !important;
}
</style>

<style>
.successBtn {
  width: 60px !important;
  height: 40px;
  border: 1px solid green;
  color: green !important;
  border-radius: 5px;
  margin: 5px;
}

.errorBtn {
  width: 75px !important;
  height: 40px;
  border: 1px solid #ff5252;
  color: #ff5252 !important;
  border-radius: 5px;
  margin: 5px;
}
</style>