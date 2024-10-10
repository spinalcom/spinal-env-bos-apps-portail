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
  <div class="card-container">
    <v-card class="card" elevation="4">
      <v-alert v-if="showError" dense outlined type="error">
        Une erreur s'est produite, Assurez-vous que l'url et la clé
        d'enregitrement soient correctes !
      </v-alert>

      <div class="text-h6" style="margin-bottom: 35px" v-text="`Enregistrer une plateforme d'authentification`"></div>

      <v-form @submit.prevent="onSubmit">
        <!-- <v-text-field label="Nom du bâtiment"
                      v-model="data.pamInfo.name"
                      outlined></v-text-field>

        <v-text-field label="Adresse du bâtiment"
                      v-model="data.pamInfo.address"
                      outlined></v-text-field> -->

        <v-text-field label="Nom de la plateforme d'authentification" v-model="data.name" outlined></v-text-field>

        <v-text-field label="URL de la plateforme d'authentification" v-model="data.urlAdmin" outlined></v-text-field>


        <v-text-field label="ClientId" v-model="data.clientId" outlined
          :append-icon="showClientId ? 'mdi-eye' : 'mdi-eye-off'" :type="showClientId ? 'text' : 'password'"
          @click:append="showClientId = !showClientId">
        </v-text-field>

        <v-text-field label="ClientSecret" v-model="data.clientSecret" outlined
          :append-icon="showClientSecret ? 'mdi-eye' : 'mdi-eye-off'" :type="showClientSecret ? 'text' : 'password'"
          @click:append="showClientSecret = !showClientSecret">
        </v-text-field>

        <!-- <v-text-field label="Clé d'enregistrement" v-model="data.adminInfo.registerKey" outlined
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword">
        </v-text-field> -->

        <v-card-actions class="d-flex justify-end">
          <!-- <v-btn color="error"
                 text>Annuler</v-btn> -->

          <v-btn color="success" type="submit" text>Enregistrer </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
export default {
  name: "RegisterAuthAdmin",
  props: ["showError"],
  data() {
    return {
      showPassword: false,
      showClientId: false,
      showClientSecret: false,
      data: {
        // pamInfo: {
        //   name: "",
        //   url: window.origin,
        //   address: "",
        //   statusPlatform: "online",
        // },
        // adminInfo: {
        name: "",
        urlAdmin: "",
        clientId: "",
        clientSecret: "",
        // registerKey: "",
        // },
      },
    };
  },
  methods: {
    onSubmit() {
      this.$emit("submit", this.data);
    },
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .card {
    width: 100%;
    max-width: 600px;
    padding: 15px;

    @media (max-width: 960px) {
      max-width: 500px;
    }

    .text_title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
