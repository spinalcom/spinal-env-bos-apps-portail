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
  <v-card class="creationContent" elevation="4" loading="isLoading">
    <v-card-title class="creationContent-title">{{ title }}</v-card-title>
    <v-card-text class="creationContent-content">
      <AppForm v-if="!isBosConfigApp" :app-selected="appSelected" ref="appForm" :title="title" :edit="edit"
        :form-validation.sync="isFormValid" @close="closeApp" @submit="onSubmitApp"></AppForm>
      <AppConfigForm v-else ref="appForm" :app-selected="appSelected" :form-validation.sync="isFormValid"
        :sub-app="subApp" :title="title" :edit="edit" @close="closeApp" @submit="onSubmitAppConfig"></AppConfigForm>
    </v-card-text>
    <v-card-actions class="creationContent-actions">
      <v-btn class="button" color="error" @click="closeApp">
        <v-icon class="btnIcon"> mdi-cancel </v-icon>
        Annuler
      </v-btn>
      <v-btn class="button" color="#14202c" dark @click="submit">
        <v-icon class="btnIcon"> mdi-content-save-outline </v-icon>
        Enregister
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { type ISpinalApp } from '../../types/ISpinalApp';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';
import AppForm from './AppForm.vue';
import AppConfigForm from './AppConfigForm.vue';
import { categories, type IAppCategory } from '../../store/categories';
import { Action } from 'vuex-class';
import { ISubApp } from '../../types/ISubApp';
type updateFunc = ({
  id,
  newValue,
}: {
  id: string;
  newValue: ISpinalApp;
}) => Promise<void>;

type creationFunc = (app: ISpinalApp) => Promise<void>;

@Component({ components: { AppForm, AppConfigForm } })
class CreationComponent extends Vue {
  required = [(v: string) => !!v || 'this input is required'];
  isLoading = false;
  isFormValid: boolean = false;

  @Prop({ required: true }) edit!: boolean;
  @Prop({ required: false }) appSelected: ISpinalApp;
  @Prop({ required: false }) subApp: ISubApp;
  @Prop({ required: true }) creationCategory!: IAppCategory;

  @Ref('appForm') appForm!: AppForm | AppConfigForm;
  @Action updateBuildingApp!: updateFunc;
  @Action updateAdminApp!: updateFunc;
  @Action updateBuildingSubApp!: (o: {
    appId: string;
    id: string;
    newValue: ISubApp;
  }) => Promise<void>;

  @Action createBuildingApps!: creationFunc;
  @Action createAdminApps!: creationFunc;
  @Action createBuildingSubApps!: (o: {
    newValue: ISubApp;
    appId: string;
  }) => Promise<void>;

  mounted() { }

  get isBosConfigApp() {
    return this.creationCategory?.id === categories.bosConfig.id;
  }
  submit() {
    // @ts-ignore
    this.$refs.appForm?.onSubmit();
  }

  @Emit('close')
  async onSubmitApp(app: ISpinalApp) {
    try {
      this.isLoading = true;
      switch (this.creationCategory.id) {
        case categories.admin.id:
          if (this.edit) {
            await this.updateAdminApp({
              id: this.appSelected.id,
              newValue: app,
            });
          } else {
            await this.createAdminApps(app);
          }
          break;
        case categories.bos.id:
          if (this.edit) {
            await this.updateBuildingApp({
              id: this.appSelected.id,
              newValue: app,
            });
          } else {
            await this.createBuildingApps(app);
          }
          break;
      }
    } catch (error) {
      console.error('Error in onSubmit App:', error);
    } finally {
      this.isLoading = false;
    }
  }

  @Emit('close')
  async onSubmitAppConfig(app: ISubApp) {
    console.log('je submit la config form' , app);

    try {
      this.isLoading = true;
      if (this.creationCategory.id === categories.bosConfig.id) {
        if (this.edit) {
          await this.updateBuildingSubApp({
            id: this.subApp.id,
            newValue: app,
            appId: this.appSelected.id,
          });
        } else {
          await this.createBuildingSubApps({
            newValue: app,
            appId: this.appSelected.id,
          });
        }
      }
    } catch (error) {
      console.error('Error in onSubmit AppConfig:', error);
    } finally {
      this.isLoading = false;
    }
  }

  @Emit('close')
  closeApp() { }

  get title() {
    const appCat = this.creationCategory?.name;
    const prefix = this.edit ? 'Modification' : 'Création';
    if (!appCat) return prefix;
    return `${prefix} : ${appCat}`;
  }
}

export default CreationComponent;
</script>

<style lang="scss" scoped>
$header-height: 70px;
$margin-size: 10px;

.creationContent {
  height: calc(100% - #{$header-height + $margin-size});
  width: calc(100% - ($margin-size * 2));
  margin-left: $margin-size;
  margin-right: $margin-size;
  display: flex;
  margin-top: $header-height;
  flex-direction: column;
  position: relative;

  $title-height: 64px;
  $footer-height: 52px;

  .creationContent-title {
    background-color: #f5f5f5;
  }

  .creationContent-content {
    background-color: #f5f5f5;
    height: calc(100% - #{$title-height + $footer-height});
    padding-top: 2px;
    padding-bottom: 6px;
    width: 100%;
    margin-top: 0px;
    overflow: hidden;
    position: relative;
  }

  .creationContent-actions {
    background-color: #f5f5f5;
    height: $footer-height;
    padding: 0 16px 8px 16px;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style lang="scss">
$header-height: 70px;
// $toolbar-height: 60px;

.creationContent {
  background-color: #ffffff;
  // width: 98%;
  height: calc(100% - #{$header-height + 10px});
  width: calc(100% - 10px);
  margin: auto;
  margin-top: $header-height;
  // background: transparent !important;
  // border-radius: 10px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  // padding: 10px;
  overflow: auto !important;
  position: relative;

  .back {
    width: 100%;
    height: 40px;
    margin-bottom: 5px;
  }

  .form {
    width: 70%;
    // height: calc(100% - 40px);
    padding: 10px;
    margin: auto;

    @media (max-width: 960px) {
      width: calc(100% - 56px);
    }

    .colonnes {
      padding-top: 0px !important;
    }

    ._title {
      width: 100%;
      height: 35px;
      text-align: center;
      font-size: 1.5em;
      color: #214353;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .content {
      .appDiv {
        width: 100%;
        display: flex;
        margin-bottom: 10px;
        @media (max-width: 960px) {
          height: 100px;
          display: block;
        }
        .selectionDiv {
          @media (max-width: 960px) {
            width: 100%;
          }
          & {
            width: 49%;
            height: 50px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

      .buttons {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .button {
          color: #fff;
          margin-right: 5px;
          .btnIcon {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style> -->
