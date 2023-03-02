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
  <div class="text-center">
    <v-dialog v-model="dialog"
              transition="dialog-top-transition"
              persistent
              width="500">

      <v-card>
        <v-card-title class="text-h5 lighten-2">
          Mot de passe oublié ?
        </v-card-title>

        <v-card-text>
          Veuillez contactez votre administrateur, pour changer votre mot de
          passe !
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 text
                 @click="close">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    dialog: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>