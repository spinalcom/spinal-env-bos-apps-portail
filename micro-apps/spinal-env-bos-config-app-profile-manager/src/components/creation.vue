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
  <v-card class="creationContainer"
          elevation="4">
    <div class="header">
      <div class="leftDiv">
        <div class="back">
          <v-btn rounded
                 outlined
                 color="#14202c"
                 dark
                 @click="goBack">
            <v-icon left>
              mdi-arrow-left-thin
            </v-icon>
            Retour
          </v-btn>
        </div>
        <div class="_title">ajouter un profil d'application</div>
        <div class="description">
          <p>Entrez un nom de profil d'application</p>
          <p>Sélectionnez son périmètre ci-dessous :</p>
        </div>
        <div class="searchDiv">
          <v-text-field solo
                        outlined
                        dense
                        flat
                        label="nom du profil"
                        hide-details="auto"
                        v-model.trim="profileName"></v-text-field>
        </div>
      </div>

      <div class="rightDiv">
        <v-btn class="button"
               color="#14202c"
               @click="saveProfile"
               :disabled="disableSaveButton">
          <v-icon class="btnIcon">
            mdi-content-save-outline
          </v-icon>

          Enregister le profil
        </v-btn>
      </div>
    </div>

    <div class="profileContent">
      <StepsComponent :contexts="contextsCopy"
                      :apis="apisCopy"
                      @selectContext="selectContext"
                      :contextSelected="contextSelected"
                      :appSelected="apisSelected"
                      :profileSelected="profileSelected"
                      :edit="edit" />
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import TreeViewComponent from "./treeView.vue";
import PortofolioList from "./portofolioList.vue";
import StepsComponent from "./stepComponent.vue";

interface IDataTypes {
  id: string;
  apps: string[];
  apis: string[];
  buildings?: IDataTypes[];
}

@Component({
  components: {
    TreeViewComponent,
    PortofolioList,
    StepsComponent,
  },
})
class CreationComponent extends Vue {
  @Prop() edit!: boolean;
  @Prop() profileSelected!: any;

  profileName = "";

  @State contexts!: any;
  @State apis!: any;

  contextSelected: any = null;
  contextsCopy: any = null;

  apisSelected: any = null;
  apisCopy: any = null;

  mounted() {
    this._initProfile();
  }

  selectContext(context: any) {
    this.contextSelected = context;
  }

  goBack() {
    this.$emit("goBack");
  }

  saveProfile() {
    if (!this.edit) {
      const data = this._getProfileCreationData();
      return this.$emit("create", data);
    }

    this.$emit("edit", {
      profileId: this.profileSelected.id,
      data: this._getDiffBetweenProfile(),
    });
  }

  _initProfile() {
    this.profileName = !this.edit ? "" : this.profileSelected.name;
    this.contextsCopy = this.createCopy(this.contexts);
    this.apisCopy = this._formatApis(this.createCopy(this.apis));
  }

  createCopy(liste: any) {
    if (!liste) return [];
    return liste.map((el: any) => {
      const copy = this._addSelectedAttr(el);
      return copy;
    });
  }

  _addSelectedAttr(element: any) {
    const copy = JSON.parse(JSON.stringify(element));
    copy.selected = false;
    return copy;
  }

  _getProfileCreationData() {
    return {
      name: this.profileName,
      contextIds: this._getSelected(this.contextsCopy, "contexts"),
      apisIds: this._getSelected(this.apisCopy, "apis"),
    };
  }

  _getSelected(arr: any, type: string) {
    switch (type) {
      case "contexts":
        return arr.reduce((liste: any[], item: any) => {
          if (item.selected) liste.push(item.id);
          return liste;
        }, []);

      case "apis":
        return arr.reduce((liste: any[], item: any) => {
          if (item.selected)
            liste.push(...item.children.map((el: any) => el.id));
          else
            liste.push(
              ...item.children.reduce((l: any, i: any) => {
                if (i.selected) l.push(i.id);
                return l;
              }, [])
            );
          return liste;
        }, []);
    }
  }

  getItemToSelect(parentId: string, isBuilding = false) {
    if (!this.edit) return [];

    if (!isBuilding) {
      const found = this.profileSelected.authorized.find(
        (el: any) => el.id === parentId
      );

      return found ? found.apis : [];
    }
  }

  get disableSaveButton() {
    if (this.profileName.length === 0) return true;

    return false;
  }

  @Watch("contexts")
  watchContextss() {
    this._initProfile();
  }

  @Watch("apis")
  watchApps() {
    this._initProfile();
  }

  @Watch("edit")
  watchEditMode(newValue: boolean) {
    this._initProfile();
  }

  _formatApis(apis: any) {
    return apis.reduce((liste: any[], item: any) => {
      const copy = this._addSelectedAttr(item);

      let found = liste.find((el) => el.name === item.tag);

      if (found) {
        found.children.push(copy);
        return liste;
      }

      liste.push({
        selected: false,
        name: item.tag,
        children: [copy],
      });

      return liste;
    }, []);
  }

  _getDiffBetweenProfile() {
    const toCreate: any = this._getProfileCreationData();

    toCreate.unauthorizeContextIds = this._getUnauthorizedItem(
      this.profileSelected.contexts,
      toCreate.contextIds
    );

    toCreate.unauthorizeApisIds = this._getUnauthorizedItem(
      this.profileSelected.apis,
      toCreate.apisIds
    );

    return toCreate;
  }

  _getUnauthorizedItem(liste1: any[], liste2: any[]) {
    const obj = liste2.reduce((o, item) => {
      o[item] = item;
      return o;
    }, {});

    return liste1.reduce((liste, item) => {
      if (!obj[item.id]) liste.push(item.id);
      return liste;
    }, []);
  }
}

export default CreationComponent;
</script>

<style lang="scss" scoped>
$header-margin-top: 70px;
$header-height: 170px;
$header-margin-bottom: 10px;

.creationContainer {
  width: 100%;
  height: calc(100% - #{$header-margin-top});
  margin-top: $header-margin-top !important;
  padding: 15px;
  background: transparent !important;

  .header {
    height: $header-height !important;
    display: flex;
    justify-content: space-between;
    margin-bottom: $header-margin-bottom;
    .leftDiv {
      width: 45%;
      height: 100%;

      .back {
        height: 40px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
      }
      ._title {
        height: 25px;
        vertical-align: middle;
        text-transform: uppercase;
        font-size: 1em;
        margin-bottom: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .description {
        height: 50px;
        font-size: 0.8em;
        line-height: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .searchDiv {
        height: calc(100% - 140px);
        display: flex;
        align-items: center;
      }
    }

    .rightDiv {
      width: 40%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .button {
        color: #fff;

        .btnIcon {
          margin-right: 5px;
        }
      }
    }
  }

  .profileContent {
    width: 100%;
    height: calc(100% - #{$header-height + $header-margin-bottom});
  }
}
</style>

<style>
.v-window__container {
  height: 100%;
}

.v-window-item {
  height: calc(100% - 50px);
}

.buildingTabItems .v-window-item {
  height: 100%;
}
</style>