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
  <v-container class="applicationContainer"
               fluid>

    <ProfileList v-if="actualState === STATES.home"
                 @create="goToCreationPage"
                 @see="goToProfileDetail"
                 @edit="gotToEditPage"
                 @delete="deleteProfile" />

    <CreationComponent v-else-if="[STATES.creation, STATES.edit].indexOf(actualState) !== -1"
                       :profileSelected="selectedProfile"
                       :edit="actualState === STATES.edit"
                       @create="createProfile"
                       @goBack="goToHomePage"
                       @edit="editProfile" />

    <ProfileDetail v-else-if="actualState===STATES.view"
                   :profileSelected="selectedProfile" />

    <div class="loading"
         v-else-if="actualState === STATES.loading">

      <v-progress-circular :size="70"
                           color="primary"
                           indeterminate></v-progress-circular>
    </div>

  </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ProfileList from "../components/profileList.vue";
import CreationComponent from "../components/creation.vue";
import ProfileDetail from "../components/profileDetail.vue";
import { Action } from "vuex-class";

@Component({
  components: {
    ProfileList,
    CreationComponent,
    ProfileDetail,
  },
})
class HomeComponent extends Vue {
  selectedProfile: any = null;

  @Action getAllAppProfiles!: any;
  @Action getAllContexts!: any;
  @Action getAllApis!: any;
  @Action createAppProfile!: any;
  @Action deleteAppProfile!: any;
  @Action editAppProfile!: any;

  STATES = Object.freeze({
    home: 0,
    creation: 1,
    edit: 2,
    view: 3,
    loading: 4,
  });

  actualState: any = this.STATES.loading;

  async mounted() {
    this.goToLoadingPage();

    await Promise.all([
      this.getAllAppProfiles(),
      this.getAllContexts(),
      this.getAllApis(),
    ]);

    this.goToHomePage();
  }

  async createProfile(profileInfo: any) {
    let isSuccess;
    try {
      this.goToLoadingPage();
      await this.createAppProfile(profileInfo);
      isSuccess = true;
    } catch (error) {
      isSuccess = false;
    }

    this.goToHomePage();

    this.$swal({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      icon: isSuccess ? "success" : "error",
      text: isSuccess ? "profile ajouté" : "oups, une erreur s'est produite !",
    });
  }

  async editProfile({ data, profileId }: any) {
    let isSuccess;
    try {
      this.goToLoadingPage();
      await this.editAppProfile({ profileId, data });
      isSuccess = true;
    } catch (error) {
      isSuccess = false;
    }
    this.goToHomePage();
    this.$swal({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      icon: isSuccess ? "success" : "error",
      text: isSuccess ? "profil modifié" : "oups, une erreur s'est produite !",
    });
  }

  goToCreationPage() {
    this.selectedProfile = undefined;
    this.actualState = this.STATES.creation;
  }

  goToProfileDetail(item: any) {
    this.selectedProfile = item;
    this.actualState = this.STATES.view;
  }

  gotToEditPage(item: any) {
    this.selectedProfile = item;
    this.actualState = this.STATES.edit;
  }

  goToHomePage() {
    this.actualState = this.STATES.home;
  }

  goToLoadingPage() {
    this.actualState = this.STATES.loading;
  }

  deleteProfile(item: any) {
    return this.$swal({
      title: "Supprimer",
      text: `Êtes-vous sûre de vouloir supprimer ${item.name} ?`,
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
        let isSuccess;
        try {
          await this.deleteAppProfile(item.id);
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
          text: isSuccess
            ? "profil supprimé"
            : "oups, une erreur s'est produite !",
        });
      }
    });
  }
}

export default HomeComponent;
</script>

<style  lang="scss">
$header-height: 60px;
$header-margin-bottom: 10px;

.applicationContainer {
  width: 100vw;
  height: 100vh;
  padding-top: 0px !important;
  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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