<!--
Copyright 2025 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Software license Agreement ("Agreement")
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
  <v-card class="app-form-card" elevation="4">
    <v-card-text class="app-form-content">
      <v-form
        class="app-form"
        ref="form"
        @submit.prevent="onSubmit"
        v-model="isFormValid"
      >
        <v-row class="app-form-row app-select-box-container">
          <v-checkbox
            v-model="appInfo.hasViewer"
            label="Cette application utilise de la 3D"
          ></v-checkbox>
          <v-checkbox
            v-model="appInfo.isExternalApp"
            label="Cette application est une application externe"
          >
          </v-checkbox>
        </v-row>
        <v-row class="app-form-row">
          <v-col class="colonnes" cols="4">
            <v-combobox
              :items="icons"
              v-model="currentIcon"
              label="Icone"
              item-value="name"
              item-text="name"
              :hide-details="true"
              outlined
            >
              <template v-slot:item="{ item }">
                <v-icon style="margin-right: 10px"
                  >{{ 'mdi-' + item.name }}
                </v-icon>
                {{ item.name }}
              </template>

              <template v-slot:selection="{ item }">
                <span class="ellipsis"
                  ><v-icon style="margin-right: 10px"
                    >{{ 'mdi-' + item.name }}
                  </v-icon>
                  {{ item.name }}</span
                >
              </template>
            </v-combobox>
          </v-col>
          <v-col class="colonnes" cols="8">
            <v-text-field
              class="app-form-validation"
              v-model="appInfo.name"
              label="Nom de l'application"
              :rules="[(v) => !!v || 'Le nom de l\'application est requis']"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="app-form-row">
          <v-col class="colonnes" cols="12">
            <v-text-field
              v-if="appInfo.isExternalApp"
              class="app-form-validation"
              v-model="appInfo.link"
              label="Lien vers l'application"
              :rules="[(v) => !!v || 'Le lien est requis']"
              outlined
            ></v-text-field>

            <v-text-field
              v-else
              class="app-form-validation"
              v-model="appInfo.packageName"
              label="Nom du dossier de l'application dans micro-apps"
              :rules="[
                (v) => !!v || 'Le nom du dossier de l\'application est requis',
              ]"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="app-form-row">
          <v-col class="colonnes" cols="12">
            <v-text-field
              v-model="appInfo.documentationLink"
              label="Lien vers la documentation de l'application"
              :hide-details="true"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="app-form-row">
          <v-col class="colonnes" cols="12">
            <v-combobox
              small-chips
              deletable-chips
              multiple
              append-icon="none"
              v-model="appInfo.tags"
              label="Tags"
              :hide-details="true"
              outlined
            ></v-combobox>
          </v-col>
        </v-row>

        <v-row class="app-form-row">
          <v-col class="colonnes" cols="6">
            <v-text-field
              v-model="appInfo.categoryName"
              label="Categorie de l'application"
              :hide-details="true"
              outlined
            ></v-text-field>
          </v-col>

          <v-col class="colonnes" cols="6">
            <v-text-field
              v-model="appInfo.groupName"
              label="Groupe de l'application"
              :hide-details="true"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="app-form-row">
          <v-col class="colonnes" cols="12">
            <v-textarea
              v-model="appInfo.description"
              :hide-details="true"
              outlined
              name="input-7-4"
              label="Description"
            >
            </v-textarea>
          </v-col>
        </v-row>
      </v-form>
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
import { ISpinalApp } from '../../types/ISpinalApp';
import icons from '../../utils/icons';

@Component({})
class AppForm extends Vue {
  @Prop({ required: false }) appSelected: ISpinalApp;
  @Prop({ required: true }) edit: boolean;
  @Prop({ required: true }) title: string;
  @PropSync('formValidation', {
    type: Boolean,
    required: false,
    default: () => false,
  })
  isFormValid!: boolean;
  icons = icons;
  appInfo: ISpinalApp = {
    name: '',
    icon: '',
    description: '',
    tags: [],
    categoryName: '',
    groupName: '',
    hasViewer: false,
    packageName: '',
    isExternalApp: false,
    link: '',
    documentationLink: '',
  };

  mounted() {
    if (this.edit) {
      this.copyAppInfo();
    } else {
      this.resetAppInfo();
    }
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
  onAppSelectedChange(newVal: ISpinalApp) {
    if (this.edit && newVal) {
      this.copyAppInfo();
    } else {
      this.resetAppInfo();
    }
  }

  resetAppInfo() {
    this.appInfo = {
      name: '',
      icon: '',
      description: '',
      tags: [],
      categoryName: '',
      groupName: '',
      hasViewer: false,
      packageName: '',
    };
    this.resetValidation();
  }
  copyAppInfo() {
    this.appInfo = {
      name: this.appSelected?.name || '',
      icon: this.appSelected?.icon || '',
      description: this.appSelected?.description || '',
      tags: this.appSelected?.tags || [],
      categoryName: this.appSelected?.categoryName || '',
      groupName: this.appSelected?.groupName || '',
      hasViewer: this.appSelected?.hasViewer || false,
      packageName: this.appSelected?.packageName || '',
      isExternalApp: this.appSelected?.isExternalApp || false,
      link: this.appSelected?.link || '',
      documentationLink: this.appSelected?.documentationLink || '',
    };
    this.resetValidation();
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
  close() {}

  @Emit('submit')
  onSubmit() {
    return this.appInfo;
  }
}

export default AppForm;
</script>

<style scoped>
.app-form-card {
  width: 100%;
  height: 100%;
  overflow-y: auto !important;
  overflow-x: hidden;
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
.app-form-row:has(.app-form-validation) + .app-form-row {
  margin-top: -12px !important;
}
.ellipsis {
  display: inline-block; /* Ensure the span behaves like a block for width */
  max-width: 100%; /* Set the maximum width */
  white-space: nowrap; /* Prevent text from wrapping to the next line */
  overflow: hidden; /* Hide the overflowing text */
  text-overflow: ellipsis; /* Add the ellipsis (...) */
}
</style>
