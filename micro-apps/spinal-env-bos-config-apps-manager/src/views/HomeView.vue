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
  <v-card
    class="mainContent"
    ref="mainContent"
    fluid
    :loading="showLoading"
    :disabled="showLoading"
  >
    <AppListComponent
      @upload="uploadApp"
      @create="openCreationPage"
      @create-sub-app="createSubApp"
      @edit="openCreationPage"
      @edit-sub-app="editSubApp"
      @delete="deleteApp"
    />
    <div
      class="creation-dialog"
      :class="{ 'fade-in': showCreationPage, 'fade-out': !showCreationPage }"
    >
      <!-- @click.self="closeCreationPage" -->
      <CreationComponent
        @close="closeCreationPage"
        :edit="edition"
        :appSelected="appSelected"
        :sub-app="subApp"
        :creationCategory="creationCategoryMode"
      />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppListComponent from '../components/appsComponent.vue';
import CreationComponent from '../components/creation/creation.vue';
import { categories, type IAppCategory } from '../store/categories';
import { ISpinalApp } from '../types/ISpinalApp';
import { ISubApp } from '../types/ISubApp';
import { OpenFileUpload } from '../utils/OpenFileUpload';

@Component({
  components: {
    AppListComponent,
    CreationComponent,
  },
})
class HomeView extends Vue {
  edition: boolean = false;
  appSelected: ISpinalApp = null;
  subApp: ISubApp = null;

  creationCategoryMode: IAppCategory = null;
  showLoading: boolean = false;
  showCreationPage: boolean = false;

  @Action deleteBuildingApp!: (id: string) => Promise<void>;
  @Action deleteAdminApp!: (id: string) => Promise<void>;
  @Action deleteBuildingAppConfig!: (id: string) => Promise<void>;

  @Action uploadAdminFile!: (file: FormData) => Promise<void>;
  @Action uploadBuildingFile!: (file: FormData) => Promise<void>;
  @Action uploadBuildingAppConfigFile!: (file: FormData) => Promise<void>;

  async uploadApp({ category }) {
    this.showLoading = true;

    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });

      const data = await OpenFileUpload();
      switch (category.id) {
        case categories.bos.id:
          await this.uploadBuildingFile(data);
          break;
        case categories.admin.id:
          await this.uploadAdminFile(data);
          break;
        case categories.bosConfig.id:
          await this.uploadBuildingAppConfigFile(data);
          break;
      }
      this.alertNotification(true, 'fichier ajouté');
    } catch (error) {
      console.error('Error uploading file:', error);
      this.alertNotification(false, "erreur lors de l'ajout du fichier");
    } finally {
      this.showLoading = false;
    }
  }
  openCreationPage({ app, category }) {
    this.showCreationPage = true;
    this.creationCategoryMode = category;
    if (app) {
      this.edition = true;
      this.appSelected = app;
    } else {
      this.edition = false;
      this.appSelected = null;
    }
  }
  editSubApp({ app, subApp, category }) {
    this.showCreationPage = true;
    this.creationCategoryMode = category;
    this.edition = true;
    this.appSelected = app;
    this.subApp = subApp;
  }

  createSubApp({ app, category }) {
    this.showCreationPage = true;
    this.appSelected = app;
    this.creationCategoryMode = category;
  }
  async deleteApp({ app, category }) {
    console.log('app', app);
    console.log('category', category);
    const result = await this.$swal({
      title: 'Supprimer',
      text: `Êtes-vous sûre de vouloir supprimer ${app.name} ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'successBtn',
        cancelButton: 'errorBtn',
      },
      icon: 'warning',
    });
    if (result.isConfirmed) {
      this.showLoading = true;
      try {
        switch (category.id) {
          case categories.bos.id:
            await this.deleteBuildingApp(app.id);
            break;
          case categories.admin.id:
            await this.deleteAdminApp(app.id);
            break;
          case categories.bosConfig.id:
            await this.deleteBuildingAppConfig(app.id);
            break;
        }
        this.alertNotification(true, 'Application supprimée');
      } catch (error) {
        console.error('Error deleting app:', error);
        this.alertNotification(
          false,
          "erreur lors de la suppression de l'application"
        );
      } finally {
        this.showLoading = false;
      }
    }
  }

  closeCreationPage() {
    this.showCreationPage = false;
    this.edition = false;
    this.appSelected = null;
  }
  // async createApp(app: ISpinalApp) {
  //   if (typeof app.icon !== 'string' && (<any>app.icon).name)
  //     app.icon = `mdi-${(<any>app.icon).name}`;

  //   let isSuccess;
  //   try {
  //     // this.page = this.pages.loading;
  //     this.showLoading = true;

  //     switch (this.categorySelected.id) {
  //       case categories.bos.id:
  //         await this.createBuildingApps(app);
  //         break;

  //       case categories.admin.id:
  //         await this.createAdminApps(app);
  //         break;
  //     }
  //     isSuccess = true;
  //   } catch (error) {
  //     isSuccess = false;
  //   }
  //   // this.page = this.pages.list;
  //   this.showLoading = false;
  //   const message = isSuccess
  //     ? 'application ajoutée'
  //     : "oups, une erreur s'est produite !";

  //   this.alertNotification(isSuccess, message);

  //   sendEventToParent('reload_portofolio');
  // }

  // uploadApp({ categorySelected }) {
  //   // this.categorySelected = categorySelected;
  //   const maxSize = 25000000;
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = '.xlsx, .json';
  //   input.multiple = false;
  //   input.click();
  //   input.addEventListener(
  //     'change',
  //     (event: any) => {
  //       const [file] = event.target.files;
  //       if (file.size >= maxSize) {
  //         alert(
  //           'The selected file is too large. The maximum size must not exceed 25 MB'
  //         );
  //         return;
  //       }
  //       if (!/.*\.(xlsx|json)$/.test(file.name)) {
  //         alert('The selected file must an excel or JSON file');
  //         return;
  //       }
  //       var formData = new FormData();
  //       formData.append('file', file);
  //       this.uploadFile(formData);
  //     },
  //     false
  //   );
  // }

  // async uploadFile(formData: FormData) {
  //   let isSuccess;
  //   try {
  //     // this.page = this.pages.loading;

  //     switch (this.categorySelected.id) {
  //       case categories.bos.id:
  //         await this.uploadBuildingFile(formData);
  //         break;

  //       case categories.admin.id:
  //         await this.uploadAdminFile(formData);
  //         break;
  //     }
  //     isSuccess = true;
  //   } catch (error) {
  //     isSuccess = false;
  //   }

  //   this.page = this.pages.list;
  //   const message = isSuccess
  //     ? 'fichier ajouté'
  //     : "oups, une erreur s'est produite !";
  //   this.alertNotification(isSuccess, message);

  //   sendEventToParent('reload_portofolio');
  // }

  // async editApp(app: ISpinalApp) {
  //   if (typeof app.icon !== 'string' && (<any>app.icon).name)
  //     app.icon = `mdi-${(<any>app.icon).name}`;

  //   const id: any = this.appSelected.id;
  //   let isSuccess;
  //   try {
  //     this.page = this.pages.loading;

  //     switch (this.categorySelected.id) {
  //       case categories.bos.id:
  //         await this.updateBuildingApp({ id, newValue: app });
  //         break;

  //       case categories.admin.id:
  //         await this.updateAdminApp({ id, newValue: app });
  //         break;
  //     }
  //     isSuccess = true;
  //   } catch (error) {
  //     isSuccess = false;
  //   }

  //   this.page = this.pages.list;
  //   const message = isSuccess
  //     ? 'application modifiée'
  //     : "oups, une erreur s'est produite !";

  //   this.alertNotification(isSuccess, message);

  //   sendEventToParent('reload_portofolio');
  // }

  // deleteApp({
  //   app,
  //   categorySelected,
  // }: {
  //   app: ISpinalApp;
  //   categorySelected: IAppCategory;
  // }) {
  //   return this.$swal({
  //     title: 'Supprimer',
  //     text: `Êtes-vous sûre de vouloir supprimer ${app.name} ?`,
  //     showCancelButton: true,
  //     // type: 'warning',
  //     // confirmButtonClass: 'successBtn',
  //     // cancelButtonClass: 'errorBtn',
  //     confirmButtonText: 'Oui',
  //     cancelButtonText: 'Annuler',
  //     buttonsStyling: false,
  //     icon: 'warning',
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       this.categorySelected = categorySelected;

  //       this.page = this.pages.loading;
  //       let isSuccess;
  //       try {
  //         switch (this.categorySelected.id) {
  //           case categories.bos.id:
  //             await this.deleteBuildingApp(<any>app.id);
  //             break;

  //           case categories.admin.id:
  //             await this.deleteAdminApp(<any>app.id);
  //             break;
  //         }
  //         isSuccess = true;
  //       } catch (error) {
  //         isSuccess = false;
  //       }

  //       this.page = this.pages.list;

  //       const message = isSuccess
  //         ? 'Application supprimée'
  //         : "oups, une erreur s'est produite !";

  //       this.alertNotification(isSuccess, message);
  //       sendEventToParent('reload_portofolio');
  //     }
  //   });
  // }

  // cancelCreation() {
  //   this.edition = false;
  //   this.page = this.pages.list;
  // }

  // get title() {
  //   if (!this.categorySelected) return '';

  //   if (this.edition) return 'Modifier une application';

  //   const begin = 'Créer une application';
  //   switch (this.categorySelected.id) {
  //     case categories.bos.id:
  //       return `${begin} de batiment`;

  //     case categories.admin.id:
  //       return `${begin} d'administration`;
  //   }
  // }

  // @Watch('buildingApps')
  // watch_buildingApps() {
  //   if (this.categorySelected && this.categorySelected.id === categories.bos.id)
  //     this.apps = this.buildingApps;
  // }

  // @Watch('adminApps')
  // watch_adminApps() {
  //   if (
  //     this.categorySelected &&
  //     this.categorySelected.id === categories.admin.id
  //   ) {
  //     this.apps = this.adminApps;
  //   }
  // }

  alertNotification(isSuccess, message) {
    this.$swal({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      icon: isSuccess ? 'success' : 'error',
      text: message,
    });
  }
}

export default HomeView;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$header-height: 70px;
$header-margin: 10px;
// $card-background: #f8f9f9;

.mainContent {
  width: calc(100% - #{$header-margin * 2});
  height: calc(100% - #{$header-height + $header-margin});
  margin-top: $header-height;
  margin-left: $header-margin;
  margin-right: $header-margin;
  margin-bottom: $header-margin;
  padding: 0 !important;
  background-color: unset !important;
}
// .v-dialog {
//   width: calc(100% - #{$header-margin * 2});
//   // height: calc(100% - #{$header-height + $header-margin});
//   margin-top: $header-height !important;
//   margin-left: $header-margin;
//   margin-right: $header-margin;
//   margin-bottom: $header-margin;
// }
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
.creation-dialog {
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;
  backdrop-filter: blur(2px);
  opacity: 0; /* Initially hidden */
  visibility: hidden; /* Prevent interaction when hidden */
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out; /* Smooth transition for fade */
}

.creation-dialog.fade-in {
  opacity: 1; /* Fully visible */
  visibility: visible; /* Allow interaction */
}

.creation-dialog.fade-out {
  opacity: 0; /* Fully hidden */
  visibility: hidden; /* Prevent interaction */
}
</style>
