<template>
  <div class="RC" style="min-height: 480px">
    <div class="MC">
      <BarChart
        v-if="load"
        :noNav="periodTickets === -1"
        :title="'Activité des tickets en cours'"
        :labels="barData.labels"
        :datasets="barData.data"
        :currentPeriod="barData.period"
        :prev_next="true"
        @nav="nav"
        stacked
        class="BR"
      >
        <template v-slot:extras>
          <v-select
            v-model="domain"
            append-icon="mdi-chevron-down"
            :items="domainList"
            outlined
            menu-props="offset-y"
            color="#E3E7E8"
            item-color="#E3E7E8"
            dense
            style="
              min-width: 200px;
              width: 340px;
              flex-grow: 0;
              font-size: 14px !important;
            "
            class="ml-8"
            label="Domaine"
          >
        

            <template #item="{ item }">
              <SmallLegend :color="item.color" :text="item.name" :size="14" />
            </template>

            <template #selection="{ item }">
              <SmallLegend :color="item.color" :text="item.name" :size="14" />
            </template>
          </v-select>
        </template>
      </BarChart>
      <LoadingCard v-else class="flex-grow-1 pa-4 br" style="width: 100%" />
      <div class="d-flex cards">
        <StatCard
          v-if="periodTickets !== -1"
          :value="periodTickets"
          :unit="'Tickets'"
          :title="selectedTempoTicketsText"
          class="flex-grow-1 pa-4"
          style="width: 100% !important"
        />
        <LoadingCard
          v-else
          class="flex-grow-1 pa-4"
          style="height: 106px; width: 100% !important"
        />
        <StatCard
          v-if="load"
          :value="cardsData.onGoingTickets"
          :unit="'Tickets'"
          :title="'en cours'"
          class="flex-grow-1 pa-4"
          style="width: 100% !important"
        />
        <LoadingCard
          v-else
          class="flex-grow-1 pa-4"
          style="height: 106px; width: 100% !important"
        />
        <StatCard
          v-if="todaysTickets !== -1"
          :value="todaysTickets"
          :unit="'Tickets'"
          :title="'créés'"
          :subtitle="'Aujourd\'hui'"
          class="flex-grow-1 pa-4"
          style="width: 100% !important"
        />
        <LoadingCard
          v-else
          class="flex-grow-1 pa-4"
          style="height: 106px; width: 100% !important"
        />
      </div>
      <div
        v-if="load"
        style="height: 280px; gap: 10px; width: 100%"
        class="d-flex flex-row"
      >
        <PieCard
          style="width: 100%"
          class="flex-grow-1"
          :title="'Tickets par domaines'"
          :pie-chart-data="domainPie"
        />
        <PieCard
          style="width: 100%"
          class="flex-grow-1"
          :title="'Tickets par déclarants'"
          :pie-chart-data="declarerPie"
          :color="declarerColors"
        />
      </div>
      <div v-else style="height: 280px; width: 100%; gap: 10px" class="d-flex">
        <LoadingCard class="flex-grow-1 pa-4" style="height: 100%" />
        <LoadingCard class="flex-grow-1 pa-4" style="height: 100%" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Prop, Vue, Watch } from "vue-property-decorator";
import BarChart from "./BarCard.vue";
import StatCard from "./StatsCard.vue";
import PieCard from "./PieCard.vue";
import LoadingCard from "./LoadingCard.vue";
import SmallLegend from "./SmallLegend.vue";
import {
  getData,
  curveData,
  ticketsCreatedtoday,
  ticketsCreated,
} from "../services/index.js";
import moment from "moment";
import { TemporalityModel } from "../models/Temporality.model";
import { StatsModel } from "../models/Stats.model";

@Component({
  components: {
    BarChart,
    StatCard,
    PieCard,
    LoadingCard,
    SmallLegend,
  },
})
class App extends Vue {
  @Prop({ type: Object as () => TemporalityModel, required: true })
  temporality: TemporalityModel;

  load = false;
  ticketList: { domains: []; ticketList: [] };
  domainList: any[] = [{ name: "Tous les domaines", color: "#fff" }];
  currentTimestamp = { valueTime: 0 };

  barData = { period: "", labels: [], data: [] };
  domain: any = { name: "Tous les domaines", color: "#fff" };
  pieData!: {};
  cardsData: StatsModel;
  selectedTempoTicketsText = "";
  domainPie = [];
  todaysTickets = -1;
  periodTickets = -1;
  declarerPie = [];
  declarerColors = [
    "#14202C",
    "#1F3348",
    "#2F4F70",
    "#47719B",
    "#6593C0",
    "#80A9D2",
    "#ACCAE8",
  ];
  async mounted() {
    this.ticketList = await getData();
    let dom;
    for (let i = 0; i < this.ticketList.domains.length; i++) {
      dom = this.ticketList.domains[i] as any;
      this.domainList.push({ name: dom.name, color: dom.color });
    }
    this.interval();
    this.load = true;
    this.todaysTickets = await ticketsCreatedtoday();
  }

  interval() {
    this.currentTimestamp = {
      valueTime: (this.currentTimestamp.valueTime = moment().valueOf()),
    };
    this.spreadData();
  }

  @Watch("temporality")
  async temporalityChange() {
    this.interval();
  }

  @Watch("domain")
  async domainChange() {
    const res = curveData(
      this.temporality.name,
      this.currentTimestamp.valueTime,
      this.domain.name,
      this.ticketList.ticketList,
      this.domainList
    );
    if (res)
      [this.barData, this.cardsData, this.domainPie, this.declarerPie] = res;
    this.declarerColors = this.getColors(this.declarerPie.length);
  }

  async nav(payload: number): Promise<void> {
    if (this.temporality.name == "Semaine") {
      this.currentTimestamp = {
        valueTime: moment(this.currentTimestamp.valueTime)
          .add(payload, "weeks")
          .valueOf(),
      };
    }
    if (this.temporality.name == "Mois") {
      this.currentTimestamp = {
        valueTime: moment(this.currentTimestamp.valueTime)
          .add(payload, "months")
          .valueOf(),
      };
    }
    if (this.temporality.name == "Année") {
      this.currentTimestamp = {
        valueTime: moment(this.currentTimestamp.valueTime)
          .add(payload, "years")
          .valueOf(),
      };
    }
    this.spreadData();
  }

  async spreadData() {
    let ticketsCreatedPromise = ticketsCreated(
      this.currentTimestamp.valueTime,
      this.temporality.name
    );
    this.periodTickets = -1;
    const res = curveData(
      this.temporality.name,
      this.currentTimestamp.valueTime,
      this.domain.name,
      this.ticketList.ticketList,
      this.domainList
    );
    if (res)
      [this.barData, this.cardsData, this.domainPie, this.declarerPie] = res;
    this.declarerColors = this.getColors(this.declarerPie.length);
    this.selectedTempoTicketsText = res[1].selectedTempoTicketsText;
    

    try {
      let ticketsCreatedRes = await ticketsCreatedPromise;
      this.periodTickets = ticketsCreatedRes[0];
    } catch (e) {
      if (e instanceof Error && e.message === "Cancellation") {
        this.periodTickets = -1;
      } else {
        throw e;
      }
    }
  }

  getColors(size: number): string[] {
    switch (size) {
      case 1:
        return ["#14202C"];
        break;
      case 2:
        return ["#14202C", "#ACCAE8"];
      case 3:
        return ["#14202C", "#47719B", "#ACCAE8"];
        break;
      case 4:
        return ["#14202C", "#2F4F70", "#6593C0", "#ACCAE8"];
        break;
      case 5:
        return ["#14202C", "#2F4F70", "#6593C0", "#80A9D2", "#ACCAE8"];
        break;
      case 6:
        return [
          "#14202C",
          "#2F4F70",
          "#47719B",
          "#6593C0",
          "#80A9D2",
          "#ACCAE8",
        ];
        break;
      default:
        return [
          "#14202C",
          "#1F3348",
          "#2F4F70",
          "#47719B",
          "#6593C0",
          "#80A9D2",
          "#ACCAE8",
        ];
        break;
    }
  }
}
export default App;
</script>

<style scoped>
.RC {
  font-family: Charlevoix;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 80px 10px 10px;
  gap: 10px;
  height: 100vh;
  width: 100%;
  background: linear-gradient(111.34deg, #f8fafa 0%, #d6e2e6 100%);
}
/* main container */
.MC {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  /* background: #F9F9F9; */
  /* border: 1px solid #F7F7F7; */
  /* box-shadow: 0px 3px 10px rgba(73, 84, 92, 0.16); */
  border-radius: 10px;
  width: 100%;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  overflow-y: auto;
}

.BR {
  /* height: 100%; */
  flex-grow: 1;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  min-height: 300px;
}

.cards {
  gap: 10px;
  width: 100%;
}

.v-application .ma-2 {
  margin: 0 !important;
}

.v-application .elevation-5 {
  box-shadow: 0px 3px 10px #49545c29 !important;
}

::v-deep .v-label {
  font-size: 14px !important;
  letter-spacing: 1.1px !important;
  color: #000000de !important;
}

::v-deep .v-list-item__title {
  font-size: 14px !important;
  letter-spacing: 1.1px !important;
  color: #000000de !important;
}

::v-deep
  .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(
    .v-input--has-state
  )
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: #e3e7e8 !important;
}

::v-deep .theme--light.v-icon {
  color: #e3e7e8 !important;
}

::v-deep .v-menu__content {
  top: 188px !important;
}

::v-deep .v-list-item--link:before {
  background: #fff !important;
}
</style>
