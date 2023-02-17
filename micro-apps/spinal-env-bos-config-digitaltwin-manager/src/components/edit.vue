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
  <div class="setDigitalTwin">
    <div class="header">
      <v-btn depressed
             large
             color="#14202c"
             style="color: #fff"
             @click="create">
        Ajouter un nouveau jumeau numerique
      </v-btn>
    </div>

    <div class="content">
      <div>
        <div class="_title">Selectionner le jumeau numerique par defaut</div>
        <v-select outlined
                  v-model="selected"
                  :items="digitaltwins"
                  item-text="name"
                  item-value="id"
                  label="Selectionner le jumeau numerique par defaut"
                  persistent-hint
                  return-object
                  single-line></v-select>
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
             @click="save">
        Enregistrer
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    digitaltwins: {},
    actualDigitalTwin: {},
  },
  data() {
    return {
      selected: this.actualDigitalTwin,
    };
  },
  methods: {
    create() {
      this.$emit("create");
    },

    save() {
      this.$emit("change", this.selected);
    },

    cancel() {
      this.$emit("cancel");
    },
  },
  watch: {
    actualDigitalTwin() {
      if (this.actualDigitalTwin) this.selected = this.actualDigitalTwin;
    },
  },
};
</script>

<style lang="scss" scoped>
.setDigitalTwin {
  width: 100%;
  height: 100%;
  .header,
  .actions {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .content {
    width: 100%;
    height: calc(100% - 100px);
    display: flex;
    align-items: center;
    > div {
      width: 100%;
    }

    ._title {
      margin-bottom: 10px;
      font-size: 1.2em;
    }
  }
}
</style>