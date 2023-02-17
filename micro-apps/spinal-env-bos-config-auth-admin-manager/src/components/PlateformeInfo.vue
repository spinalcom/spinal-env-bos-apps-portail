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
    <v-card class="card"
            elevation="4">
      <div class="icon">
        <v-icon size="100px"
                color="success">mdi-checkbox-marked-circle-outline</v-icon>

        <div class="message">
          Une plateforme d'authentification a dejà été enregistée
        </div>
      </div>

      <div class="item-list">
        <!-- <ListItem :title="'Nom de la plateforme d\'authentification'"
                  :subTitle="data.bosName" /> -->

        <ListItem :title="'URL de la plateforme d\'authentification'"
                  :subTitle="data.urlAdmin" />

        <ListItem :title="'Clé d\'enregistrement'"
                  :subTitle="data.registerKey" />

        <ListItem :title="'Token de la plateforme d\'authentification'"
                  :subTitle="data.tokenPamToAdmin" />
      </div>

      <v-card-actions>
        <v-row>
          <v-col cols="6">
            <v-btn block
                   color="error"
                   @click="deletePlatform"
                   text>
              <span style="white-space: normal">Supprimer La plateforme</span>
            </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn block
                   color="success"
                   @click="updatePlatform"
                   text>
              <span style="white-space: normal">Mettre à jour les données</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import ListItem from "./listItem.vue";

export default {
  name: "PlateformeInfo",
  components: { ListItem },
  props: ["data"],
  methods: {
    deletePlatform() {
      this.$emit("delete");
    },
    updatePlatform() {
      this.$emit("update");
    },
  },
};
</script>

<style scoped lang="scss">
.card-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-container .card {
  width: 100%;
  max-width: 700px;
  padding: 15px;
  @media (max-width: 960px) {
    max-width: 600px;
  }
  .icon {
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

    .message {
      width: 100%;
      font-size: 1em !important;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #2e7d32;
    }
  }

  .item-list {
    margin-bottom: 30px;
  }
}
</style>
