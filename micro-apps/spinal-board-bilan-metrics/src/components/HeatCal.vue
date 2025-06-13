<template>
    <v-card class="bar-card  d-flex flex-shrink-1 flex-column">
        <LoadingCard v-if="loading" style="width: 100%; height: 100%; position: absolute; top: 0; z-index: 1000;" />
        <v-card-title class="card-title flex-shrink-1 justify-space-between">
            <p class="mb-0" style="padding: 10px;">
                {{ title }}
            </p>
            <div class="d-flex align-center mln6"
                style="position: absolute; right: calc(50% - 50px); font-size: 0.875em;" v-if="true">
                <v-icon style="margin-top: -1px; font-size: 1.125em; margin-right: 10px; color: #63717f;">{{
                    leftIcon }}</v-icon>
                <v-switch @click="$emit('calendar', switchValue)" style="margin-top: 1px; padding: 0px;height: 24px;"
                    v-model="switchValue" inset color="blue-grey" dense />
                <v-icon style="margin-top: -1px; font-size: 1.125em; margin-left: -10px; color: #63717f;">{{
                    rightIcon }}</v-icon>
            </div>
            <div v-if="true" style="height: 40px; align-self: flex-start; padding-top: 10px; padding-right: 10px;">
                <v-btn :disabled="false" @click="$emit('nav', -1)"
                    style="font-size: 0.875em !important; border-radius: 10px;  min-width: 36px !important; box-shadow: none; border: 1px solid #EAEEF0 !important;"><v-icon
                        style="color: #14202c !important" icon>mdi-chevron-left</v-icon>{{ prev }}</v-btn>
                <v-btn :disabled="false" @click="$emit('nav', +1)"
                    style="font-size: 0.875em !important; border-radius: 10px;  min-width: 36px !important; box-shadow: none; border: 1px solid #EAEEF0 !important;">{{
                        next }}<v-icon style="color: #14202c !important" icon>mdi-chevron-right</v-icon></v-btn>
            </div>
        </v-card-title>
        <div class="d-flex flex-column" style="width: 100%; height: 100%">
            <div class="selects">
                <v-select v-model="space" append-icon="mdi-chevron-down" :items="source" outlined
                    menu-props="{ bottom: true }" color="#000000DE" item-color="#000000DE" dense
                    style="margin-left: 10px !important; min-width: 100px; width: 300px; flex-grow: 0; font-size: 0.875em !important;"
                    class="ml-8" :label="selectTitle">
                    <!-- <template #label="{ attrs }"> <label :for="attrs.id" style="font-size: 14px;">Select an item</label></template>
-->

                    <template #item="{ item }">
                        <SmallLegend :color="item.color" :text="item.title" :size="14" />
                    </template>

                    <template #selection="{ item }">
                        <SmallLegend :color="item.color" :text="item.title" :size="14" />
                    </template>
                </v-select>

                <v-select v-model="calculation" append-icon="mdi-chevron-down" :items="calculationList" outlined
                    menu-props="{ bottom: true }" color="#000000DE" item-color="#000000DE" dense
                    style="margin-left: 10px !important; min-width: 100px; width: 130px; flex-grow: 0; font-size: 0.875em !important;"
                    class="ml-8" label="Calcul">
                    <!-- <template #label="{ attrs }"> <label :for="attrs.id" style="font-size: 14px;">Select an item</label></template> -->

                    <template #item="{ item }">
                        {{ item }}
                    </template>

                    <template #selection="{ item }">
                        {{ item }}
                    </template>
                </v-select>
                <div class="selects inside">
                    <v-select v-model="timeRange" append-icon="mdi-chevron-down" :items="timeRanges" outlined
                        menu-props="{ bottom: true }" color="#000000DE" item-color="#000000DE" dense
                        style="margin-left: 10px !important; min-width: 200px; width: 200px; flex-grow: 0; font-size: 0.875em !important;"
                        class="ml-8" label="Intervalle de temps">
                        <!-- <template #label="{ attrs }"> <label :for="attrs.id" style="font-size: 14px;">Select an item</label></template> -->

                        <template #item="{ item }">
                            {{ item.name }}
                        </template>

                        <template #selection="{ item }">
                            {{ item.name }}
                        </template>
                    </v-select>
                </div>

            </div>
            <div class="flex-grow-1 content-main" v-if="chart === 'calendar'">
                <CalendarAndStripe v-if="data && data.d && data.d.length > 0" :calMonths="calMonths"
                    @dayFilter="dayFilter" @toggle="toggle" @chart-sent="handleChart" :calc="calculation"
                    :results="data" :max="max" :unit="unit" />
            </div>

            <div class="d-flex flex-row"
                style="padding: 10px; width: 100%; height: 75%; justify-content: space-between; gap: 10px; "
                v-else-if="chart === 'line'">
                <CalendarAndStripe v-if="data && data.d && data.d.length > 0" style="width: 30%" :calMonths="calMonths"
                    @dayFilter="dayFilter" @toggle="toggle" @chart-sent="handleChart" :calc="calculation"
                    :results="data" :max="max" :unit="unit" />

                <LineChart v-if="data.chart && data.chart.label" :title="'title'" :subtitle="'subtitle'"
                    :labels="data.chart.label" :datasets="data.chart.data" :next="'temporality.next'"
                    :prev="'temporality.prev'" :stacked="false" style="height: 100%; width: 70%" class="BR" />
            </div>
        </div>
    </v-card>
</template>

<script>
import LineChart from './LineCard';
import CalendarAndStripe from './CalendarAndStripe';
import SmallLegend from './SmallLegend';
import LoadingCard from './LoadingCard.vue';
import LoadingCard from './LoadingCard.vue';
export default {
    name: 'HeatCal',
    components: {
        CalendarAndStripe,
        SmallLegend,
        LineChart,
        LoadingCard
    },
    props: {
        next: { type: String, required: true },
        prev: { type: String, required: true },
        data: { required: true },
        source: { required: true },
        defaultSource: { required: true },
        chart: { type: String, required: false },
        calMonths: { required: true },
        loading: { type: Boolean, required: true }
    },
    mounted() {

        this.arrCal = this.data.d;
        console.log(this.source, ' toto le toto');

        this.data.d = this.capacitySwitch(this.arrCal.max);
        this.max = this.source[0].max;
        console.log('aza');
        this.unit = this.switchValue ? this.unitRight : this.unitLeft;
        this.$emit('unit-switch', this.unit);

        this.space = this.source[0];
    }
    ,
    data() {
        return {
            chartx: {
                "label": [
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                    "16",
                    "17",
                    "18",
                    "19",
                    "20",
                    "21",
                    "22",
                    "23",
                    "24",
                    "25",
                    "26",
                    "27",
                    "28",
                    "29",
                    "30",
                    "31",
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                    "16",
                    "17",
                    "18",
                    "19",
                    "20",
                    "21",
                    "22",
                    "23",
                    "24",
                    "25",
                    "26",
                    "27",
                    "28",
                    "29",
                    "30",
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                    "16",
                    "17",
                    "18",
                    "19",
                    "20",
                    "21",
                    "22",
                    "23",
                    "24",
                    "25",
                    "26",
                    "27",
                    "28",
                    "29",
                    "30",
                    "31"
                ],
                "data": [
                    {
                        "label": "T4 2023",
                        "backgroundColor": "#14202c",
                        "data": [
                            10, 13, 11, 10, 10, 8, 9, 10, 10,
                            50.875,
                            60.375,
                            70.875,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        "stack": "01",
                        "tooltipDate": [
                            "Dim. 01/10/2023",
                            "Lun. 02/10/2023",
                            "Mar. 03/10/2023",
                            "Mer. 04/10/2023",
                            "Jeu. 05/10/2023",
                            "Ven. 06/10/2023",
                            "Sam. 07/10/2023",
                            "Dim. 08/10/2023",
                            "Lun. 09/10/2023",
                            "Mar. 10/10/2023",
                            "Mer. 11/10/2023",
                            "Jeu. 12/10/2023",
                            "Ven. 13/10/2023",
                            "Sam. 14/10/2023",
                            "Dim. 15/10/2023",
                            "Lun. 16/10/2023",
                            "Mar. 17/10/2023",
                            "Mer. 18/10/2023",
                            "Jeu. 19/10/2023",
                            "Ven. 20/10/2023",
                            "Sam. 21/10/2023",
                            "Dim. 22/10/2023",
                            "Lun. 23/10/2023",
                            "Mar. 24/10/2023",
                            "Mer. 25/10/2023",
                            "Jeu. 26/10/2023",
                            "Ven. 27/10/2023",
                            "Sam. 28/10/2023",
                            "Dim. 29/10/2023",
                            "Lun. 30/10/2023",
                            "Mar. 31/10/2023",
                            "Mer. 01/11/2023",
                            "Jeu. 02/11/2023",
                            "Ven. 03/11/2023",
                            "Sam. 04/11/2023",
                            "Dim. 05/11/2023",
                            "Lun. 06/11/2023",
                            "Mar. 07/11/2023",
                            "Mer. 08/11/2023",
                            "Jeu. 09/11/2023",
                            "Ven. 10/11/2023",
                            "Sam. 11/11/2023",
                            "Dim. 12/11/2023",
                            "Lun. 13/11/2023",
                            "Mar. 14/11/2023",
                            "Mer. 15/11/2023",
                            "Jeu. 16/11/2023",
                            "Ven. 17/11/2023",
                            "Sam. 18/11/2023",
                            "Dim. 19/11/2023",
                            "Lun. 20/11/2023",
                            "Mar. 21/11/2023",
                            "Mer. 22/11/2023",
                            "Jeu. 23/11/2023",
                            "Ven. 24/11/2023",
                            "Sam. 25/11/2023",
                            "Dim. 26/11/2023",
                            "Lun. 27/11/2023",
                            "Mar. 28/11/2023",
                            "Mer. 29/11/2023",
                            "Jeu. 30/11/2023",
                            "Ven. 01/12/2023",
                            "Sam. 02/12/2023",
                            "Dim. 03/12/2023",
                            "Lun. 04/12/2023",
                            "Mar. 05/12/2023",
                            "Mer. 06/12/2023",
                            "Jeu. 07/12/2023",
                            "Ven. 08/12/2023",
                            "Sam. 09/12/2023",
                            "Dim. 10/12/2023",
                            "Lun. 11/12/2023",
                            "Mar. 12/12/2023",
                            "Mer. 13/12/2023",
                            "Jeu. 14/12/2023",
                            "Ven. 15/12/2023",
                            "Sam. 16/12/2023",
                            "Dim. 17/12/2023",
                            "Lun. 18/12/2023",
                            "Mar. 19/12/2023",
                            "Mer. 20/12/2023",
                            "Jeu. 21/12/2023",
                            "Ven. 22/12/2023",
                            "Sam. 23/12/2023",
                            "Dim. 24/12/2023",
                            "Lun. 25/12/2023",
                            "Mar. 26/12/2023",
                            "Mer. 27/12/2023",
                            "Jeu. 28/12/2023",
                            "Ven. 29/12/2023",
                            "Sam. 30/12/2023",
                            "Dim. 31/12/2023"
                        ],
                        "fill": false,
                        "borderColor": "#14202c"
                    }
                ]
            },
            idx: 0,
            max: 100,
            subtitle: 'No sub',
            unit: null,
            arrCal: [],
            space: this.source[0],
            interval: {
                start: null,
                end: null,
            },
            startHours: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            endHours: ['00:59', '01:59', '02:59', '03:59', '04:59', '05:59', '06:59', '07:59', '08:59', '09:59', '10:59', '11:59', '12:59', '13:59', '14:59', '15:59', '16:59', '17:59', '18:59', '19:59', '20:59', '21:59', '22:59', '23:59'],
            timeRange: null,
        }
    },
    methods: {
        capacitySwitch(data) {
            if (this.switchValue === true) {

                const capacity = this.sourceData[this.idx]?.capacity || 1;
                this.data.max = capacity;

                return data.map(month =>
                    month.map(day => (day !== -1 ? (day * capacity) / 100 : -1))
                );
            } else {

                const max = this.sourceData[this.idx]?.max || 100;
                this.data.max = max;

                return data;
            }

        },
        handleChart(output) {
            this.$emit('chart-sent', output);
        },
        dayFilter(n) {
            this.$emit('dayFilter', n);
        },
        toggle(n) {
            this.$emit('toggle', n);
        }
    },
    computed: {
        appConfig() {
            return this.$store.state.appDataStore.appConfig || {};
        },
        leftIcon() {
            return this.appConfig.unit?.left?.icon || '';
        },
        rightIcon() {
            return this.appConfig.unit?.right?.icon || '';
        },
        title() {
            return this.appConfig.title || '';
        },
        selectTitle() {
            return this.appConfig.selectTitle || '';
        },
        switchValue() {
            return this.appConfig.unit?.default ?? false;
        },
        unitLeft() {
            return this.appConfig.unit?.left ?? '';
        },
        unitRight() {
            return this.appConfig.unit?.right ?? '';
        },
        timeRanges() {
            return this.appConfig.timeRanges || [];
        },
        calculation() {
            return this.appConfig.calculs?.[0] || null;
        },
        calculationList() {
            return this.appConfig.calculs || [];
        },
        sourceData() {
            return this.appConfig.source || [];
        }
    }
    ,
    watch: {
        interval: {
            deep: true,
            handler(n, o) {
                this.$emit('call-trigger', n);
            }
        },
        timeRange: {
            deep: true,
            handler(n, o) {
                this.$emit('call-trigger', n.intervals);
            }
        },
        calculation(v) {
            if (v === 'Maximum') this.data.d = this.capacitySwitch(this.arrCal.max);
            if (v === 'Minimum') this.data.d = this.capacitySwitch(this.arrCal.min);
            if (v === 'Moyenne') this.data.d = this.capacitySwitch(this.arrCal.mean);
            if (v === 'Somme') this.data.d = this.capacitySwitch(this.arrCal.sum);
            this.$emit('calculus', v);
        },
        switchValue(v) {
            const unit = v ? this.unitRight : this.unitLeft;

            this.$emit('unit-switch', unit);
            this.unit = unit;

            if (this.calculation === 'Maximum') this.data.d = this.capacitySwitch(this.arrCal.max);
            if (this.calculation === 'Minimum') this.data.d = this.capacitySwitch(this.arrCal.min);
            if (this.calculation === 'Moyenne') this.data.d = this.capacitySwitch(this.arrCal.mean);
            if (this.calculation === 'Somme') this.data.d = this.capacitySwitch(this.arrCal.sum);
        }
        ,
        space(v) {
            // @TODO:replace title with dynamicId
            const index = this.source.findIndex(e => e.title === v.title);
            if (index !== -1) {
                this.idx = index;
                this.$emit('source', index);
            }
        },
        data(v) {
            this.arrCal = this.data.d;
            if (this.calculation === 'Maximum') this.data.d = this.capacitySwitch(this.arrCal.max);
            if (this.calculation === 'Minimum') this.data.d = this.capacitySwitch(this.arrCal.min);
            if (this.calculation === 'Moyenne') this.data.d = this.capacitySwitch(this.arrCal.mean);
            if (this.calculation === 'Somme') this.data.d = this.capacitySwitch(this.arrCal.sum);
        },
        source(v) {
            if (v.length > 0) {
                // Set the selected item to the item at index 0
                this.space = v[0];
            } else {
                // Handle the case when the source array is empty
                this.space = null; // Set to null or handle it as needed
            }
        }
    }
}
</script>

<style>
.bar-card {
    width: 100%;
    background-color: #f9f9f9;
    font-family: "Charlevoix Pro";
    font-size: 0.875em;
    min-height: 55% !important;
    background: #f9f9f9;
    border-radius: 10px !important;
    position: relative;
    box-shadow: 0px 3px 10px #49545C29 !important;
}

.card-title {
    letter-spacing: 1.1px !important;
    color: #000000DE !important;
    font-size: 1.25em !important;
    height: fit-content !important;
    padding: 0 !important;
}

.desc {
    margin-left: 23px;
    font-family: "Charlevoix Pro";
    font-size: 1em !important;
}

.selects {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.inside {
    gap: 0 !important;
}

.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)>.v-input__control>.v-input__slot {
    background: #EAEEF0 !important;
    border-radius: 5px !important;
}

.v-input__icon.v-input__icon--append .v-icon.notranslate.mdi.mdi-chevron-down.theme--light {
    color: #000000DE !important;
}

.theme--light.v-input--switch .v-input--switch__thumb,
.theme--light.v-input--switch .v-input--switch__track {
    color: #607d8b !important;
}

.content-main {
    width: 100%;
    height: 75%;
    overflow: hidden;
    overflow-x: auto;
}

/* .content-main::-webkit-scrollbar {
    width: 10px;
    background: #aaa9a9c3;
    border-radius: 26px;
}
.content-main::-webkit-scrollbar-thumb {
    background: #e6e6e6;
    border-radius: 10px;
    border: 1px solid #14202c9a;
}
.content-main::-webkit-scrollbar-track {
    background: #f9f9f9;
} */
</style>