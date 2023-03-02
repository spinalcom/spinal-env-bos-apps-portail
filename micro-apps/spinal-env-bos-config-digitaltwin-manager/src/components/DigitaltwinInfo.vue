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
  <v-card elevation="4"
          class="digitaltwin_container">

    <ActualDigitalTwinInfo v-show="state === steps.info"
                           :digitalTwin="actualDigitalTwin"
                           @edit="goToEditPage" />

    <EditActualDigitalTwinInfo v-show="state === steps.edit"
                               :digitaltwins="digitalTwins"
                               :actualDigitalTwin="actualDigitalTwin"
                               @create="goToCreationPage"
                               @change="updateDigitalTwin"
                               @cancel="cancelEdit" />

    <CreateDigitalTwin v-show="state === steps.creation"
                       @cancel="cancelEdit"
                       @create="createDigitalTwin"
                       :error="errorCreation"
                       @reset="errorCreation = false" />

    <div class="loading"
         v-show="state === steps.loading">
      <v-progress-circular :size="70"
                           color="primary"
                           indeterminate></v-progress-circular>
    </div>

  </v-card>
</template>

<script>
import ActualDigitalTwinInfo from "./info.vue";
import EditActualDigitalTwinInfo from "./edit.vue";
import CreateDigitalTwin from "./creation.vue";
import { mapActions } from "vuex";
import { SET_ACTUAL_DIGITALTWIN } from "../store/mutations";

export default {
  props: {
    digitalTwins: {},
    actualDigitalTwin: {},
  },
  components: {
    ActualDigitalTwinInfo,
    EditActualDigitalTwinInfo,
    CreateDigitalTwin,
  },
  data() {
    this.steps = {
      info: 0,
      edit: 1,
      creation: 2,
      loading: 3,
    };
    return {
      errorCreation: false,
      state: this.steps.info,
    };
  },
  mounted() {},
  methods: {
    ...mapActions(["addDigitalTwin", "setAsActualDigitalTwin"]),

    goToEditPage() {
      this.state = this.steps.edit;
    },

    cancelEdit() {
      this.state = this.steps.info;
    },

    goToCreationPage() {
      this.state = this.steps.creation;
    },

    updateDigitalTwin(digitalTwin) {
      this.state = this.steps.loading;

      this.setAsActualDigitalTwin(digitalTwin.id)
        .then((result) => {
          console.log("result", result);

          this.state = this.steps.info;
          this.$store.commit(SET_ACTUAL_DIGITALTWIN, digitalTwin);
          this.alertNotification(true, "Jumeau numerique modifié avec success");
        })
        .catch((err) => {
          this.alertNotification(false, "oups ! une erreur s'est produite");
          this.state = this.steps.info;
        });
    },

    createDigitalTwin(info) {
      this.state = this.steps.loading;
      this.addDigitalTwin(info)
        .then((digital) => {
          this.$store.commit(SET_ACTUAL_DIGITALTWIN, digital);
          this.state = this.steps.info;
          this.this.alertNotification(
            true,
            "Jumeau numerique ajouté avec success"
          );
        })
        .catch(() => {
          // this.errorCreation = true;
          this.alertNotification(
            false,
            "oups ! une erreur s'est produite, veuillez verifier vos saisies"
          );
          this.state = this.steps.creation;
        });
    },

    alertNotification(isSuccess, message) {
      this.$swal({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        icon: isSuccess ? "success" : "error",
        text: message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.digitaltwin_container {
  @media (max-width: 960px) {
    width: 100%;
  }
  width: 700px;
  max-width: 800px;
  height: 320px;
  padding: 10px;
  background: transparent !important;

  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>