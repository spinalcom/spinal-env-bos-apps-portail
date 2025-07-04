<!--
Copyright 2024 SpinalCom - www.spinalcom.com

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
  <div class="cards-container">
    <div class="card">
      <!-- Front Side (Summary) -->
      <div class="card-front"
        :style="{ display: 'flex', flexDirection: 'column', height: showDetailsProp ? '35%' : '35%' }">
        <div class="title-container">
          <p class="stat-title">Status Overview</p>
          <div class="stat-buttons-container">
            <!-- <div @click="toggleDetails" class="toggle-button" :class="{ hide_details_bg: showDetailsProp }">

            </div> -->
            <div class="stat-num">
              <div class="app-button" @click="$emit('changeRoute', tickets)">
                Tickets
              </div>
              <div class="leftarrow"></div>
            </div>
          </div>

        </div>

        <div class="desc-container">
          <div class="echele">
            <div class="non-active-num">
              <div class="text-border">{{ statusCounts.inactive }}</div>
              <p style="font-size: 0.9rem">inactive</p>
            </div>
            <div class="all-eq-num">
              <p class="num-title">{{ totalNodes }}</p>
              <p class="unit">total</p>
            </div>
          </div>
          <div class="chart">
            <div class="chart-legend">
              <div class="stat3-label">{{ statusCounts.inactive }} Inactive</div>
              <div v-if="statusCounts.unknown > 0" class="stat2-label">
                {{ statusCounts.unknown }} Unknown
              </div>
              <div class="stat1-label">{{ statusCounts.active }} Active</div>
            </div>
            <div class="chart-container">
              <div class="stat3"></div>
              <div class="stat2"></div>
              <div class="stat1"></div>
            </div>
          </div>
        </div>
      </div>
      <div style="
            background-color: #14202c;
            width: 70%;
            height: 1px;
            opacity: 0.2;
            margin-bottom: 13px;
            margin-top: 13px;
            margin-left: auto;
            margin-right: auto;
          "></div>
      <!-- Expandable Details Section -->
      <!-- <transition name="height"> -->
      <div class="card-details" style="margin-top: 0px;height: 55%;">

        <div class="title-container2">
          <p class="stat-title">Typologie Overview</p>

        </div>
        <div v-for="(stats, typologie) in typologieCounts" :key="typologie" class="desc-container2">
          <div class="echele2">
            <div class="all-eq-num2">
              <div class="typo-img" :style="{
                backgroundImage: `url(${getImageUrl(String(typologie))})`,
              }"></div>
              <p class="typology-header">
                {{ stats.count }}
              </p>
              <div class="typology-header">{{ typologie }}</div>
            </div>
          </div>
          <div class="chart2">
            <div class="chart-legend">
              <div class="stat3-label">
                {{ stats.countInactive }} Inactive
              </div>
              <div v-if="stats.countUnknown > 0" class="stat2-label">
                {{ stats.countUnknown }} Unknown
              </div>

              <div class="stat1-label">{{ stats.countActive }} Active</div>
            </div>
            <div class="chart-container">
              <div class="stat3" :style="{
                '--final-width': getStatWidth(
                  stats.countInactive,
                  stats.count
                ),
              }"></div>

              <div class="stat2" v-if="stats.countUnknown > 0" :style="{
                '--final-width': getStatWidth(
                  stats.countUnknown,
                  stats.count
                ),
              }"></div>
              <div class="stat1" :style="{
                '--final-width': getStatWidth(
                  stats.countActive,
                  stats.count
                ),
              }"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- </transition> -->
    </div>
  </div>
</template>


<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";
import Component from "vue-class-component";
import { IConfig } from "../interfaces/IConfig";

@Component({
  name: "StatCard",
})
class StatCard extends Vue {
  @Prop() dataprop: any[];
  @Prop() showDetailsProp!: boolean;
  @Prop() config!: IConfig;
  typologieCounts: {
    [key: string]: {
      count: number;
      countActive: number;
      countInactive: number;
      countUnknown: number;
    };
  } = {};

  totalNodes: number = 0;
  tickets: string = "ticket_link_or_data";
  statusCounts: { active: number; inactive: number; unknown: number } = {
    active: 0,
    inactive: 0,
    unknown: 0,
  };
  showDetails: boolean = false;
  toggleDetails() {
    this.$emit("update:showDetailsProp", !this.showDetailsProp);
  }
  mounted() {
    this.typologieCounts = this.countTypologieNodes(this.dataprop);
    const { totalNodes, statusCounts } = this.countNodesAndStatus(
      this.dataprop
    );
    this.totalNodes = totalNodes;
    this.statusCounts = statusCounts;

    const activePercentage = (statusCounts.active / totalNodes) * 100;
    const inactivePercentage = (statusCounts.inactive / totalNodes) * 100;
    const unknownPercentage = (statusCounts.unknown / totalNodes) * 100;

    this.$nextTick(() => {
      this.setDynamicWidths(
        activePercentage,
        inactivePercentage,
        unknownPercentage
      );
    });
  }

  async getImageUrl(typologie: string): Promise<string> {
    const imageMapping = this.config.imageMapping;

    if (imageMapping.hasOwnProperty(typologie)) {
      return imageMapping[typologie];
    }

    console.warn(
      `Image not found for typologie ${typologie}, using default image.`
    );
    return imageMapping.Default;
  }
  getStatWidth(count: number, total: number): string {
    if (total === 0) return "0%";
    return `${(count / total) * 100}%`;
  }
  flipcard() {
    this.showDetails = !this.showDetails;
  }

  countNodesAndStatus(data) {
    let totalNodes = 0;
    let statusCounts = {
      active: 0,
      inactive: 0,
      unknown: 0,
    };

    function countNodes(node) {
      totalNodes++;
      if (node.self_status) {
        statusCounts[node.self_status]++;
      }

      if (node.nodes && node.nodes.length > 0) {
        node.nodes.forEach((childNode) => {
          countNodes(childNode);
        });
      }
    }

    data.forEach((item) => {
      countNodes(item);
    });

    return { totalNodes, statusCounts };
  }

  setDynamicWidths(activePct, inactivePct, unknownPct) {
    this.$el.style.setProperty("--final-width-stat1", `${activePct}%`);
    this.$el.style.setProperty("--final-width-stat2", `${unknownPct}%`);
    this.$el.style.setProperty("--final-width-stat3", `${inactivePct}%`);
  }

  countTypologieNodes(data: any[]): {
    [key: string]: {
      count: number;
      countActive: number;
      countInactive: number;
      countUnknown: number;
    };
  } {
    // console.log(data);
    const result: {
      [key: string]: {
        count: number;
        countActive: number;
        countInactive: number;
        countUnknown: number;
      };
    } = {};

    function traverse(node: any) {
      if (node.typologie) {
        if (!result[node.typologie]) {
          result[node.typologie] = {
            count: 0,
            countActive: 0,
            countInactive: 0,
            countUnknown: 0,
          };
        }
        result[node.typologie].count += 1;

        if (node.self_status) {
          if (node.self_status === "active") {
            result[node.typologie].countActive += 1;
          } else if (node.self_status === "inactive") {
            result[node.typologie].countInactive += 1;
          } else {
            result[node.typologie].countUnknown += 1;
          }
        }
      }

      if (Array.isArray(node.nodes)) {
        node.nodes.forEach((childNode) => traverse(childNode));
      }
    }

    data.forEach((rootNode) => traverse(rootNode));

    // Sort entries based on count, then typologie
    const sortedEntries = Object.entries(result).sort(
      ([typologieA, statsA], [typologieB, statsB]) => {
        if (statsA.count === statsB.count) {
          return typologieA.localeCompare(typologieB);
        }
        return statsB.count - statsA.count;
      }
    );

    // console.log(sortedEntries);

    // Convert sorted entries to desired result format
    const sortedResult: {
      [key: string]: {
        count: number;
        countActive: number;
        countInactive: number;
        countUnknown: number;
      };
    } = {};
    for (const [typologie, stats] of sortedEntries) {
      sortedResult[typologie] = stats;
    }

    return sortedResult;
  }
}

export { StatCard };
export default StatCard;
</script>


<style lang="scss">
.cards-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 12px 12px;
  // padding-bottom: 0px;
  // background: linear-gradient(to bottom right, #fff, #e3e1eb);
  // background-color: red;
}

.title-container {
  width: 100%;
  height: 25%;
  // background-color: green;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title-container2 {
  width: 100%;
  height: 20%;
  // background-color: green;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.stat-title {
  font-family: Roboto, sans-serif !important;
  // font-family: Charlevoix Pro !important;
  font-weight: 500;
  // letter-spacing: 0.0125em !important;
  font-size: 1rem !important;
  line-height: 1 !important;
}

.leftarrow {
  width: 12px;
  height: 12px;
  background-image: url("../../viewer/assets/right-arrow.png");
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 50%;
  z-index: 3;
  margin-right: 5px !important;
}

.num-title {
  font-family: Roboto, sans-serif !important;
  font-family: Charlevoix Pro !important;
  font-weight: 600;
  // letter-spacing: 0.0125em !important;
  font-size: 2rem !important;
  padding: 0 !important;
  margin: 0 !important;
}

.app-button {
  font-family: Roboto, sans-serif !important;
  font-weight: 500;
  color: white;
  font-size: 0.9rem;
  width: 80%;
  overflow: hidden;
  // background: red;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  padding: 10 0px;
  margin-left: -7px;
  padding-left: 15px !important;
}

.app-button:hover {
  color: #14202c;
}

.stat-num {
  font-family: Roboto, sans-serif !important;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #14202c;
  width: 70%;
  height: 30px;
  font-size: 0.9rem !important;
  color: white;
  border-radius: 6px;
  padding: 0 !important;
  /* Correct padding value */
  margin: 0 !important;
  position: relative;
  /* Needed for the pseudo-element */
  overflow: hidden;
  /* Hide the overflowing part of the pseudo-element */
  transition: color 0.5s;
  /* Smooth transition for font color */
}

.stat-num::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  transform: translateX(-100%);
  transition: transform 0.5s;
  /* Smooth transition for background color */
  z-index: 0;
  /* Ensure the pseudo-element is below the text */
}

.stat-num:hover::before {
  transform: translateX(-20);
}

.stat-num:hover {
  color: #14202c;
  /* Change the font color to the old background color */
  z-index: 2;
  /* Ensure the text is above the pseudo-element */
}

.desc-container {
  width: 100%;
  height: 70%;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
  overflow: hidden;
  // background-color: yellow;
  position: relative;
}

.desc-container2 {
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  // background-color: yellow;
  position: relative;
}

.all-eq-num {
  display: flex;
  flex-direction: row;
  // justify-content: start;
  justify-content: start;
  align-items: end;
  width: 100%;
  height: 50%;
}

.all-eq-num2 {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 50%;
}

.unit {
  font-weight: 500;
  font-size: 0.8rem !important;
  color: #14202c;
  margin-left: 5px !important;
}

.non-active-num {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100%;
  // height: 30%;
  color: #d7270c;
  // background-color: pink;
}

.text-border {
  font-family: Roboto, sans-serif !important;
  // font-family: Charlevoix Pro !important;
  font-weight: 500;
  height: 100%;
  color: #d7270c;
  // letter-spacing: 0.0125em !important;
  font-size: 0.8rem !important;
  // border: #d7270c 5px solid;
  background: #ffe3eb;
  padding: 3px 5px;
  border-radius: 3px;
  line-height: 0.8 !important;
  text-align: center;
  margin-right: 5px;
}

.chart-container {
  // left: 30%;
  width: 100%;
  height: 10px;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: start;
  overflow: hidden;
  background-color: #e4e4e4;
  position: relative;
  border-radius: 10px;
}

.chart-legend {
  // left: 30%;
  width: 100%;
  height: 15px;
  margin: 0;
  font-size: 0.7rem;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: start;
  overflow: hidden;
  // background-color: #e4e4e4;
  position: relative;
  border-radius: 10px;
}

.chart {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
  // background-color: blue;
}

.chart2 {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
}

.typo-img {
  // background-color: red;
  background-size: cover;
  background-repeat: no-repeat;
  height: 15px;
  width: 15px;
  margin-right: 8px;
}

.echele {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
}

.echele2 {
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
}

p {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 0.8 !important;
}

.stat1,
.stat2,
.stat3 {
  height: 10px;
  animation: grow 0.7s ease-in-out forwards;
}

.stat1 {
  width: 0;
  /* Start with width 0 */
  background-color: #325e4b;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  animation-delay: 0s;
  /* Delay for the start of the animation */
}

.stat2 {
  width: 0;
  /* Start with width 0 */
  background-color: #f49700;
  animation-delay: 0.7s;
  /* Delay for the start of the animation */
}

.stat3 {
  width: 0;
  /* Start with width 0 */
  background-color: #d7270c;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  animation-delay: 1.4s;
  /* Delay for the start of the animation */
}

.stat1-label,
.stat2-label,
.stat3-label {
  animation: grow 0.7s ease-in-out forwards;
  // transform: rotate(55deg);
}

.stat1-label {
  width: 0;
  animation-delay: 0s;
  color: transparent;
}

.stat2-label {
  width: 0;
  animation-delay: 0.7s;

  color: transparent;
}

.stat3-label {
  width: 0;

  color: transparent;
  animation-delay: 1.4s;
}

@keyframes grow {
  0% {
    width: 0;
  }

  100% {
    width: var(--final-width);
    /* Final width will be set using inline styles */
    color: #14202c;
  }
}

/* Set the final widths for each stat */
.stat1 {
  --final-width: 40%;
}

.stat2 {
  --final-width: 35%;
}

.stat3 {
  --final-width: 25%;
}

.stat1 {
  --final-width: var(--final-width-stat1, 0%);
  // width: var(--final-width);
  // animation-delay: 0s;
}

.stat2 {
  --final-width: var(--final-width-stat2, 0%);
  // width: var(--final-width);
}

.stat3 {
  --final-width: var(--final-width-stat3, 0%);
  // width: var(--final-width);
}

.stat1-label {
  --final-width: var(--final-width-stat1, 0%);
  // width: var(--final-width);
}

.stat2-label {
  --final-width: var(--final-width-stat2, 0%);
  // width: var(--final-width);
}

.stat3-label {
  --final-width: var(--final-width-stat3, 0%);
  // width: var(--final-width);
}

.stat1,
.stat2,
.stat3 {
  height: 10px;
  animation: grow 0.7s ease-in-out forwards;
}

.stat1 {
  background-color: #325e4b;
  border-radius: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.stat2 {
  background-color: #f49700;
}

.stat3 {
  background-color: #d7270c;
  border-radius: 0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.stat1-label,
.stat2-label,
.stat3-label {
  animation: grow 2s ease-in-out forwards;
}

.stat1-label {
  color: transparent;
}

.stat2-label {
  color: transparent;
}

.stat3-label {
  color: transparent;
}

@keyframes grow {
  0% {
    width: 0;
  }

  100% {
    width: var(--final-width);
    /* Final width will be set using inline styles */
    color: #14202c;
  }
}

.flip-card {
  //background-color: red;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  /* Adds perspective to the flip effect */
  // padding: 13 15 !important;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: rotateY(0deg);
}

.flip-card-inner.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 90%;
  backface-visibility: hidden;
}

.typology-header {
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 5px !important;
}

.flip-card-front {
  // transform: rotateY(0deg);
  /* Add your front-side styles here */
}

.flip-card-back {
  transform: rotateY(180deg);
  /* Add your back-side styles here */
}

.typologies-container {
  height: 70%;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  margin-top: 5px;
  padding: 0 !important;
}

.flip-card-button {
  font-size: 0.7rem;
  margin-bottom: 2px;
  margin-left: 85%;
  text-decoration: underline;
}

.card {
  width: 100%;
  height: 100%;
  // overflow: auto;
}

.card-details {
  width: 100%;
  overflow: auto;
  // height: auto;
}

.toggle-button {
  cursor: pointer;
  background: #14202c;
  background-image: url("../assets/details.svg");
  background-position: center;
  background-size: 90%;
  background-repeat: no-repeat;
  border: none;
  width: 30px;
  height: 30px;
  font-size: .8rem;
  border-radius: 5px;
}

.hide_details_bg {
  background-image: url("../assets/hidedetails.svg");
}

.stat-buttons-container {
  width: 25%;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}

.toggle-button:hover {
  // text-decoration: underline;
}

.height-enter-active,
.height-leave-active {
  transition: height 0.3s ease;
}

.height-enter,
.height-leave-to {
  height: 0;
}
</style>
