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
    <RegisterForm v-if="page === pages.creation"
                  :showError="showError"
                  @submit="registerAuthPlateform" />

    <PlateformeInfo v-else-if="page === pages.info"
                    @delete="deletePlatform"
                    @update="updatePlatform"
                    :data="authPlatformInfo" />

    <div class="loading"
         v-else-if="page === pages.loading">
      <v-progress-circular :size="70"
                           color="primary"
                           indeterminate></v-progress-circular>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import RegisterForm from "../components/RegisterForm.vue";
import PlateformeInfo from "../components/PlateformeInfo.vue";
import { mapActions, mapState } from "vuex";

export default Vue.extend({
  name: "HomeComponent",
  components: {
    RegisterForm,
    PlateformeInfo,
  },
  data() {
    this.pages = Object.freeze({
      create: 1,
      loading: 1,
      info: 3,
    });
    return {
      showError: false,
      page: this.pages.create,
    };
  },
  async mounted() {
    this.page = this.pages.loading;
    await this.getAuthPlatformInfo();

    if (!this.authPlatformInfo) this.page = this.pages.creation;
  },

  methods: {
    ...mapActions([
      "getAuthPlatformInfo",
      "_registerAuthPlatform",
      "updateAuthPlatform",
      "deleteAuthPlatform",
    ]),
    async registerAuthPlateform(data: any) {
      let isSuccess;
      try {
        this.page = this.pages.loading;
        await this._registerAuthPlatform(data);
        isSuccess = true;
      } catch (error) {
        isSuccess = false;
        this.showError = true;
      }

      this.$swal({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        icon: isSuccess ? "success" : "error",
        text: isSuccess
          ? "Plateforme ajoutée"
          : "oups, une erreur s'est produite !",
      });

      this.page = isSuccess ? this.pages.info : this.pages.creation;
    },

    async deletePlatform() {
      return this.$swal({
        title: "Supprimer",
        text: `Êtes-vous sûre de vouloir supprimer cette plateforme ?`,
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

        const isSuccess = await this.deleteAuthPlatform();

        if (isSuccess) this.page = this.pages.creation;

        this.$swal({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          icon: isSuccess ? "success" : "error",
          text: isSuccess
            ? "Plateforme supprimée"
            : "oups, une erreur s'est produite !",
        });
      });
    },

    async updatePlatform() {
      let isSuccess;
      try {
        this.page = this.pages.loading;
        await this.updateAuthPlatform();
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
          ? "Mis à jour envoyée"
          : "oups, une erreur s'est produite !",
      });

      this.page = this.pages.info;
    },
  },
  computed: {
    ...mapState(["authPlatformInfo"]),
  },
  watch: {
    authPlatformInfo() {
      if (this.authPlatformInfo) this.page = this.pages.info;
      else this.page = this.pages.creation;
      // this.authPlatformInfo
      //   ? (this.isRegistered = true)
      //   : (this.isRegistered = false);
    },
  },
});
</script>

<style lang="scss">
._container {
  width: 100%;
  height: 100%;

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
