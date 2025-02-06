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
  <v-app id="application">
    <!--Download & selector-->
    <div style="width: 100%" class="d-flex justify-end">
      <sc-download-button
        :file-name="'Tickets'"
        :data="downloadList"
      ></sc-download-button>
      <div class="Hx1 mx-2">
        <space-selector
          ref="space-selector"
          :open.sync="openSpaceSelector"
          :maxDepth="0"
          :GetChildrenFct="expand"
          v-model="el"
          label="ESPACE"
        />
      </div>
    </div>

    <!--Ticket table-->
    <v-card
      class="ticket-table ma-2 d-flex flex-column table-card rounded-lg flex-grow-1"
      elevation="5"
      outlined
    >
      <v-card-title style="height: 56px" class="text-uppercase ma-2"
        >Liste des tickets</v-card-title
      >
      <div
        ref="tableContainer"
        style="height: calc(100% - 56px)"
        class="d-flex flex-column"
      >
        <div ref="dataTable" class="d-flex ml-6 mr-6 mb-6 flex-fill">
          <v-data-table
            item-key="name"
            class="elevation-1 table-data d-flex flex-column flex-grow-1 justify-space-between"
            loading-text="Chargement des données"
            :loading="!loaded"
            fixed-header
            :headers="headers"
            :height="tableHeight"
            :items="stepFilteredTickets"
            :footer-props="{
              prevIcon: 'mdi-menu-left',
              nextIcon: 'mdi-menu-right',
              showCurrentPage: true,
              itemsPerPageAllText: 'Tout',
            }"
            @click:row="rowClicked"
          >
            <v-progress-linear
              v-show="!loaded"
              slot="progress"
              color="accent"
              class="progress-bar"
              indeterminate
              style="margin-left: -16px; width: calc(100% + 32px)"
            ></v-progress-linear>
            <template v-slot:no-data> Pas de données disponibles </template>
            <template v-slot:header.Domaine="{ header }">
              <v-select
                color="#14202C"
                style="
                  width: calc(100% - 18px);
                  margin-left: -12px;
                  transform: translate(0%, 4%);
                "
                class="d-inline-block mt-4"
                dense
                solo
                flat
                @click.stop
                v-model="domain_filter"
                label="Domaine"
                placeholder="Domaine"
                :items="domains"
                append-icon="mdi-chevron-down"
                clearable
                clear-icon="mdi-close-circle-outline"
                multiple
                menu-props="offset-y"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip
                    @click:close="
                      domain_filter = domain_filter.filter((d) => d !== item)
                    "
                    close
                    :close-icon="'mdi-close-circle'"
                    style="
                      font-size: 11px;
                      height: 24px;
                      max-width: calc(100% - 50px);
                    "
                    v-if="index < 1"
                  >
                    <span style="max-width: 90%; overflow: hidden">{{
                      item
                    }}</span>
                  </v-chip>

                  <span
                    v-if="index === 1"
                    class="text-grey text-caption align-self-center"
                  >
                    (+{{ domain_filter.length - 1 }})
                  </span>
                </template>
              </v-select>
            </template>
            <template v-slot:header.Étape="{ header }">
              <v-select
                color="#14202C"
                style="
                  width: calc(100% - 18px);
                  margin-left: -12px;
                  transform: translate(0%, 4%);
                "
                class="d-inline-block mt-4"
                dense
                solo
                flat
                @click.stop
                v-model="step_filter"
                label="Étape"
                placeholder="Étape"
                :items="steps"
                append-icon="mdi-chevron-down"
                clearable
                clear-icon="mdi-close-circle-outline"
                multiple
                menu-props="offset-y"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip
                    @click:close="
                      step_filter = step_filter.filter((s) => s !== item)
                    "
                    close
                    :close-icon="'mdi-close-circle'"
                    style="
                      font-size: 11px;
                      height: 24px;
                      max-width: calc(100% - 50px);
                    "
                    v-if="index < 1"
                  >
                    <span style="max-width: 90%; overflow: hidden">{{
                      item
                    }}</span>
                  </v-chip>

                  <span
                    v-if="index === 1"
                    class="text-grey text-caption align-self-center"
                  >
                    (+{{ step_filter.length - 1 }})
                  </span>
                </template>
              </v-select>
            </template>
            <template v-slot:item.Étape="{ item }">
              <div
                class="mr-1 rounded-circle ps-3 pt-3 d-inline-block"
                :style="{
                  background: item.color + ' no-repeat padding-box',
                }"
              ></div>
              {{ item.Étape }}
            </template>
            <template v-slot:item.attachement="{ item }">
              <div class="text-center">
                <v-icon v-if="item.attachement" color="#0f0">
                  mdi-check-circle-outline
                </v-icon>
                <v-icon v-else color="#f00">mdi-close-circle-outline</v-icon>
              </div>
            </template>
          </v-data-table>
        </div>
      </div>
    </v-card>

    <!--Dialog box to display the details of the tcket-->
    <sc-ticket-detail
      v-if="detailedTicket"
      v-model="showDialog"
      :detailedTicket="detailedTicket"
      :baseURL="baseURL"
      :token="token"
    ></sc-ticket-detail>
  </v-app>
</template>

<script>
import { gradiant, HSVtoRGB, RGBtoHexa } from "spinal-components/src/colors";
import { mapState, mapActions, mapGetters } from "vuex";
import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)
import { getBuildingAsync } from "./api-requests";
import { displayDate } from "./store/index";
import { SpaceSelector } from "./components/SpaceSelector/index";
const buildingId = localStorage.getItem("idBuilding");
const token = localStorage.getItem("token");

export default {
  name: "App",

  components: { SpaceSelector },

  data: () => ({
    initiated: false,
    el: { name: "Bâtiment" },
    openSpaceSelector: false,
    selectedId: 0,
    baseURL: `${HTTP}`,
    token: token,
    domain_filter: [],
    step_filter: [],
    loaded: false,
    tableHeight: 156,
    showDialog: false,
  }),

  computed: {
    ...mapState({ tickets: "tickets" }),
    ...mapGetters({ getTickets: "getTickets" }),
    dispDateCreation() {
      return displayDate(this.detailedTicket.creationDate);
    },
    dispDateModif() {
      return this.detailedTicket.log_list.length > 0
        ? displayDate([...this.detailedTicket.log_list].reverse()[0]?.date)
        : this.dispDateCreation;
    },
    tableData() {
      return this.loaded ? this.getTickets(this.el.dynamicId) : [];
    },
    detailedTicket() {
      return this.tickets.find((t) => t.dynamicId === this.selectedId);
    },
    headers() {
      const widths = [20, 20, 19, 10, 10, 13, 8];
      return [
        "Nom",
        "Domaine",
        "Étape",
        "Date de création",
        "Dernière modification",
        "Déclarant",
        { text: "Pièces jointes", value: "attachement" },
      ].map((e, i) => ({
        text: e.text || e,
        value: e.value || e,
        width: widths[i] + "%",
        sort: [3, 4].includes(i) ? (a, b) => this.compareDate(a, b) : null,
      }));
    },
    domains() {
      return [...new Set(this.tableData.map((t) => t.Domaine))];
    },
    domainFilteredTickets() {
      if (this.domain_filter.length === 0 || this.tableData.length === 0)
        return this.tableData;
      return this.tableData.filter((d) =>
        this.domain_filter.includes(d.Domaine)
      );
    },
    steps() {
      return [...new Set(this.domainFilteredTickets.map((t) => t["Étape"]))];
    },
    stepFilteredTickets() {
      if (this.step_filter.length === 0 || this.tableData.length === 0)
        return this.domainFilteredTickets;
      return this.domainFilteredTickets.filter((d) =>
        this.step_filter.includes(d["Étape"])
      );
    },
    downloadList() {
      return this.stepFilteredTickets.map((t) => {
        const { Nom, Étape, Domaine, Déclarant } = t;
        const tdetail = this.tickets.find((tc) => tc.dynamicId === t.id);
        return {
          Nom,
          "Date de création": t["Date de création"],
          "Dernière modification": t["Dernière modification"],
          Étape,
          Domaine,
          Déclarant,
          bosId: tdetail?.staticId || 0,
          gmaoId: tdetail?.gmaoId || 0,
          description: tdetail?.description || "",
          targetName: tdetail?.elementSelected?.name || "",
          targetId: tdetail?.elementSelected?.staticId || 0,
        };
      });
    },
  },

  methods: {
    ...mapActions({
      loadTickets: "loadTickets",
      floors: "getFloorList",
      setTickets: "setFloorTickets",
    }),
    async expand(item) {
      if (item) {
        switch (item.level) {
          case 0:
            const floors = await this.floors();
            const colors = gradiant(floors.length);
            return floors.map((f, i) => {
              const { r, g, b } = HSVtoRGB(colors[i] / 100, 1, 1);
              return {
                name: f.name,
                dynamicId: f.dynamicId,
                color: RGBtoHexa(r, g, b),
                count: f.tickets.length,
              };
            });

          default:
            return [];
        }
      }
      const building = await getBuildingAsync();
      building.count = this.tickets.length;
      return [building];
    },

    compareDate(date1, date2) {
      const e1 = date1.split("/");
      const e2 = date2.split("/");
      return e1[2] - e2[2] || e1[1] - e2[1] || e1[0] - e2[0];
    },

    async rowClicked(event) {
      this.selectedId = event.id;
      this.showDialog = true;
    },
  },

  async mounted() {
    const { dataTable, tableContainer } = this.$refs;
    this.tableHeight = dataTable.clientHeight - 59;
    window.onresize = () => {
      this.tableHeight = tableContainer.clientHeight - 85;
    };
    const { name, dynamicId } = await getBuildingAsync();
    this.el = { name: name, dynamicId: dynamicId };
    await this.loadTickets();
    this.initiated = true;
    this.loaded = true;
  },

  watch: {
    async el(v) {
      if (!this.initiated) return;
      this.loaded = false;
      await this.setTickets(v.dynamicId);
      this.loaded = true;
    },
  },
};
</script>

<style scoped>
html {
  overflow-y: auto !important;
}

.v-input,
::v-deep .v-label {
  font-size: 0.75rem;
}

#application {
  background: linear-gradient(121deg, #f8fafa, #d6e2e6);
  position: absolute;
  width: 100%;
  height: 100%;
}

.ticket-table {
  position: fixed;
  height: calc(100% - 92px);
  top: 70px;
  bottom: 0;
  left: 0;
  right: 0;
}

.table-card {
  background-color: #f9f9f9;
}

.v-data-table {
  font-size: 14px;
}

.Hx1 {
  position: relative;
  width: 33%;
  right: 0px;
  top: -1px;
  height: 60px;
}
</style>
