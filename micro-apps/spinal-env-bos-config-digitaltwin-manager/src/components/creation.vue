<!--
Copyright 2023 SpinalCom - www.spinalcom.com

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
  <form class="creation_container"
        @submit.prevent="save">
    <div class="_title">Ajouter un jumeau numerique</div>
    <div class="creation_content">
      <!-- <v-alert dense
               outlined
               type="error"
               v-show="error">
        oups ! une erreur s'est produite, veuillez verifier vos saisies
      </v-alert> -->

      <div class="textField">
        <v-text-field label="Nom du jumeau numerique"
                      outlined
                      required
                      hide-details="true"
                      @input="resetError"
                      v-model="data.name"></v-text-field>
      </div>

      <div class="textField">
        <v-text-field label="chemin du dossier du jumeau numerique"
                      outlined
                      placeholder="/__users__/username/dossier"
                      required
                      hide-details="true"
                      @input="resetError"
                      v-model="data.url"></v-text-field>
      </div>

      <div>
        <v-checkbox v-model="data.set_as_actual_digitaltwin"
                    label="Utiliser ce jumeau numerique par defaut">
        </v-checkbox>
      </div>
    </div>
    <div class="actions">
      <v-btn depressed
             large
             color="error"
             @click="cancel">
        Annuler
      </v-btn>

      <v-btn depressed
             large
             color="#14202c"
             style="color: #fff; margin-left: 10px;"
             type="submit">
        Enregistrer
      </v-btn>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    error: { type: Boolean, default: false },
  },
  data() {
    return {
      data: {
        name: "",
        url: "",
        set_as_actual_digitaltwin: true,
      },
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.$emit("create", this.data);
    },

    resetError() {
      this.$emit("reset");
    },
  },
};
</script>

<style lang="scss" scoped>
.creation_container {
  width: 100%;
  height: 100%;

  ._title {
    width: 100%;
    height: 50px;
    font-size: 1.5em;
    padding-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .creation_content {
    width: 100%;
    height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .actions {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: end;
  }
}
</style>