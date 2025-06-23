<!--
Copyright 2025 SpinalCom - www.spinalcom.com

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
  <v-card class="app-config-form-card" elevation="4">
    <v-card-text class="app-config-form-content">
      <v-tabs v-model="stepper" centered class="app-config-form-tab">
        <v-tab> General information </v-tab>
        <v-tab> JSON configuration </v-tab>
        <v-tab-item class="app-config-form-tab-item">
          <v-card class="app-form-card">
            <v-card-text class="app-form-content">
              <v-form class="app-form" ref="form" @submit.prevent="onSubmit" v-model="isFormValid">
                <v-row class="app-form-row app-select-box-container">
                  <v-col class="colonnes">
                    <v-checkbox v-model="appInfo.hasViewer" label="Cette application utilise de la 3D"
                      :hide-details="true"></v-checkbox>
                  </v-col>
                </v-row>
                <v-row class="app-form-row">
                  <v-col class="colonnes" cols="4">
                    <v-combobox :items="icons" v-model="currentIcon" label="Icone" item-value="name" item-text="name"
                      :hide-details="true" outlined>
                      <template v-slot:item="{ item }">
                        <v-icon style="margin-right: 10px">{{ 'mdi-' + item.name }}
                        </v-icon>
                        {{ item.name }}
                      </template>

                      <template v-slot:selection="{ item }">
                        <span class="ellipsis"><v-icon style="margin-right: 10px">{{ 'mdi-' + item.name }}
                          </v-icon>
                          {{ item.name }}</span>
                      </template>
                    </v-combobox>
                  </v-col>
                  <v-col class="colonnes" cols="8">
                    <v-text-field class="app-form-validation" v-model="appInfo.name" label="Nom de l'application"
                      :rules="[
                        (v) => !!v || 'Le nom de l\'application est requis',
                      ]" outlined></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="app-form-row">
                  <v-col class="colonnes" cols="12">
                    <v-text-field v-model="appInfo.categoryName" label="catégorie de l'application" :hide-details="true"
                      outlined></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="app-form-row">
                  <v-col class="colonnes" cols="12">
                    <v-text-field v-model="appInfo.documentationLink"
                      label="Lien vers la documentation de l'application" :hide-details="true" outlined></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="app-form-row">
                  <v-col class="colonnes" cols="12">
                    <v-combobox small-chips deletable-chips multiple append-icon="none" v-model="appInfo.tags"
                      label="Tags" :hide-details="true" outlined></v-combobox>
                  </v-col>
                </v-row>

                <v-row class="app-form-row">
                  <v-col class="colonnes" cols="12">
                    <v-textarea v-model="appInfo.description" :hide-details="true" outlined name="input-7-4"
                      label="Description">
                    </v-textarea>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item class="app-config-form-tab-item">
          <v-card class="app-form-card">
            <v-card-text class="app-form-content">
              <MonacoEditorJSON v-model="appInfo.appConfig" :app-name="appName"></MonacoEditorJSON>
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" fab dark bottom left small class="app-config-form-btn-get-config"
                    @click="getDefaultConfig">
                    <v-icon>mdi-file-download-outline</v-icon>
                  </v-btn>
                </template>
                <span>Récupéré la configuration par défaut de l'application</span>
              </v-tooltip>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  PropSync,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { ISubApp } from '../../types/ISubApp';
import icons from '../../utils/icons';
import { getBuildingAppConfigRequest } from '../../requests/index';
import { parse } from 'json5';
import MonacoEditorJSON from './MonacoEditorJSON.vue';
import { ISpinalApp } from '../../types';
import { getAppConfigTemplate } from '../../utils/getAppConfigTemplate';
import { parse as jsoncParse } from 'jsonc-parser';
@Component({
  components: {
    MonacoEditorJSON,
  },
})
class AppConfigForm extends Vue {
  @Prop({ required: false }) subApp: ISubApp;
  @Prop({ required: false }) appSelected: ISpinalApp;
  @Prop({ required: true }) edit: boolean;
  @Prop({ required: true }) title: string;
  @PropSync('formValidation', {
    type: Boolean,
    required: false,
    default: () => false,
  })
  isFormValid: boolean;
  isStepOneValid = false;
  stepper = 0;

  icons = icons;
  appInfo: ISubApp = {
    name: '',
    icon: '',
    description: '',
    tags: [],
    hasViewer: false,
    appConfig: '',
    categoryName: ''
  };

  async mounted() {
    if (this.edit) {
      await this.copyAppInfo();
    } else {
      this.resetAppInfo();
    }
  }

  appConfigRules = [
    (v: string) => !!v || "La configuration de l'application est requise",
    (v: string) => {
      try {
        parse(v);
        return true;
      } catch (e) {
        return e.message;
      }
    },
  ];

  get appName() {
    return this.appSelected?.packageName || '';
  }

  get currentIcon() {
    const icon = this.icons.find(
      (el) => `mdi-${el.name}` === this.appInfo.icon
    );
    return icon;
  }
  set currentIcon(value: { id: string; name: string }) {
    const icon = this.icons.find((el) => el.name === value.name);
    if (icon) {
      this.appInfo.icon = `mdi-${icon.name}`;
    }
  }

  @Watch('appSelected', { deep: true })
  async onAppSelectedChange(newVal: ISubApp) {
    if (this.edit && newVal) {
      await this.copyAppInfo();
    } else {
      this.resetAppInfo();
    }
  }

  resetAppInfo() {
    this.appInfo = {
      name: '',
      icon: this.appSelected?.icon || '',
      description: this.appSelected?.description || '',
      tags: this.appSelected?.tags || [],
      hasViewer: this.appSelected?.hasViewer || false,
      documentationLink: this.appSelected?.documentationLink || '',
      categoryName: this.appSelected?.categoryName || '',
      appConfig: '',
    };
    this.resetValidation();
  }
  async copyAppInfo() {
    console.log('les info son récup ?', this.appSelected);

    this.appInfo = {
      name: this.subApp?.name || '',
      icon: this.subApp?.icon || this.appSelected?.icon || '',
      description:
        this.subApp?.description || this.appSelected?.description || '',
      tags: this.subApp?.tags || this.appSelected?.tags || [],
      hasViewer: this.subApp?.hasViewer || this.appSelected?.hasViewer || false,
      documentationLink:
        this.subApp?.documentationLink ||
        this.appSelected?.documentationLink ||
        '',
      categoryName: '',
      appConfig: '',
    };
    this.resetValidation();
    try {
      const cfg = await getBuildingAppConfigRequest(
        this.appSelected.id,
        this.subApp.id
      );
      this.appInfo.appConfig = JSON.stringify(cfg, null, 2);
    } catch (e) {
      console.error('Error in copyAppInfo:', e);
    }
  }

  async getDefaultConfig() {
    try {
      const data = await getAppConfigTemplate(this.appName);
      if (data) {
        // test JSONC,
        const errors = [];
        const j = jsoncParse(data, errors, {
          allowTrailingComma: true,
          disallowComments: false,
        });
        if (errors.length > 0) {
          console.error('Error parsing JSONC:', errors);
          // if JSONC is not valid, test JSON5
          try {
            parse(data);
            this.appInfo.appConfig = data;
          } catch (e) {
            console.error('Error parsing JSON5:', e);
            this.$swal({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              icon: 'error',
              text: 'Erreur de chargement de la configuration par défaut',
            });
          }
        } else {
          this.appInfo.appConfig = data;
        }
      } else {
        console.error('No data received from getAppConfigTemplate');
      }
    } catch (error) {
      console.error('Error in getDefaultConfig:', error);
    }
  }

  tryValidate() {
    // @ts-ignore
    this.$refs.form?.validate();
  }
  resetValidation() {
    // @ts-ignore
    this.$refs.form?.resetValidation();
  }
  @Emit('close')
  close() { }

  @Emit('submit')
  onSubmit() {
    const result = {};
    const keys = [
      'name',
      'icon',
      'description',
      'tags',
      'hasViewer',
      'documentationLink',
      'categoryName'
    ];
    for (const key of keys) {
      if (this.appInfo[key]) {
        result[key] = this.appInfo[key];
      }
    }
    result['appConfig'] = parse(this.appInfo.appConfig);
    return result;
  }
}

export default AppConfigForm;
</script>

<style scoped>
.app-config-form-card {
  width: 100%;
  height: 100%;
}

.app-config-form-content {
  padding-top: 0;
  height: 100%;
  position: relative;
}

.app-config-form-tab {
  width: 100%;
  height: 100%;
  position: relative;
}

.app-config-form-tab-item {
  height: calc(100vh - 260px);
}

.monaco-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  margin-top: 20px;
}

.app-form-card {
  width: 100%;
  height: 100%;
  overflow-y: auto !important;
  overflow-x: hidden;
}

.app-form-content {
  position: relative;
  padding: 8px 0 0 0;
  height: 100%;
}

.app-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.app-select-box-container {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
}

.app-form-row:first-child {
  margin-top: 0 !important;
}

.app-form-row:has(.app-form-validation)+.app-form-row {
  margin-top: -12px !important;
}

.app-config-form-btn-get-config {
  position: absolute;
  z-index: 6;
  bottom: 8px;
  right: 16px;
}

.ellipsis {
  display: inline-block;
  /* Ensure the span behaves like a block for width */
  max-width: 100%;
  /* Set the maximum width */
  white-space: nowrap;
  /* Prevent text from wrapping to the next line */
  overflow: hidden;
  /* Hide the overflowing text */
  text-overflow: ellipsis;
  /* Add the ellipsis (...) */
}
</style>
