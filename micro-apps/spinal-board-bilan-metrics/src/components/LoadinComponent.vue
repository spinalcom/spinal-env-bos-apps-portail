<template>
    <div class="RC" style="min-height: 480px">
      <div class="MC">

        <LoadingCard style="width: 100%; height: 485px;"/>
        <div class="stat-heat">
          <div class="stats">
            <LoadingCard style="width: 100%; height: 74px;"/>
          </div>
          <div class="heat">
            <LoadingCard style="width: 100%; height: 286px;"/>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import Component from 'vue-class-component';
  import { Prop, Vue, Watch } from 'vue-property-decorator';
  import HeatCal from './HeatCal.vue';
  import HeatWeek from './HeatWeek.vue';
  import StatsCard from './StatsCard.vue';
  import LoadingCard from './LoadingCard.vue';
  import { ISpaceSelectorItem } from './SpaceSelector/index';
  import { TemporalityModel } from '../models/Temporality.model';
  import { LegendModel } from '../models/Legend.model';
  import { CalendarModel } from '../models/Calendar.model';
  import { getHeatCal } from '../services/index.js';
  import moment from 'moment';
  
  
  interface state {
    year: string;
    space: {
      type: string; // [controlEndpoint, endpoint]
      Name: string;
      profile: string;
      dynamicId: number;
      capacity: number;
      min: number;
      max: number;
    };
    calculus: string;
  }
  
  @Component({
    components: {
      LoadingCard,
    },
  })
  class App extends Vue {
    
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
    background: linear-gradient(111.34deg, #F8FAFA 0%, #D6E2E6 100%);
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
    box-shadow: 0px 3px 10px #49545C29 !important;
  }
  
  .plus-button {
    /* background: #f9f9f9 !important; */
    background: transparent !important;
    position: absolute;
    top: 180px;
    left: 40px;
    font-size: 0.875em !important;
    border-radius: 10px;
    min-width: 36px !important;
    box-shadow: none;
    /* border: 1px solid #EAEEF0 !important; */
    width: 48px !important;
    height: 36px !important;
  }
  
  .plus-button:hover {
    background: transparent !important;
  }
  
  .g {
    gap: 10px;
  }
  
  .active-select {
    border-color: green ; /* set the border color to red when the select is active */
  }
  
  .loading {
    cursor: wait;
  }
  
  .not-loading {
    cursor: default;
  }
  
  .stat-heat {
    display: flex;
    flex-direction: row;
    gap: 10px;
  
    width: 100%;
  }
  
  .stats {
    width: 50%;
  }
  .heat {
    width: 50%;
  }
  ::v-deep .v-application .primary--text {
    color: #000000DE !important;
  }
  ::v-deep .v-menu__content {
    border-radius: 10px !important;
  }
  ::v-deep .v-label {
    font-size: 0.875em !important;
    letter-spacing: 1.1px !important;
    color: #000000DE !important;
  }
  
  ::v-deep .v-list-item__title {
    font-size: 0.875em !important;
    letter-spacing: 1.1px !important;
    color: #000000DE !important;
  }
  
  ::v-deep  .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
    color: #E3E7E8 !important;
  }
  
  ::v-deep .theme--light.v-icon {
    color: #E3E7E8;
  }
  
  ::v-deep .v-menu__content {
    top: 188px !important;
  }
  
  ::v-deep .v-list-item--link:before {
    background: #fff !important;
  }
  </style>