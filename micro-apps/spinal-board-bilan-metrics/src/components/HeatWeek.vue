<template>
<v-card class="bar-card-w  d-flex flex-shrink-1 flex-column" style="position: relative;" >
    <v-card-title class="card-title flex-shrink-1 justify-space-between">
      <p class="mb-0" style="padding: 10px;">
        SEMAINE TYPE : {{ calculus.toUpperCase() }}
      </p>
    </v-card-title>

    <div class="CALHEAT">
      <table class="CALTABLE-week">
        <tr>
          <td width="70"></td>
          <td class="CALHEAD">0h</td>
          <td class="CALHEAD"> </td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD">6h</td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD">12h</td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD">18h</td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
          <td class="CALHEAD"></td>
        </tr>
        <tr>
          <td class="WEEKDAYS" width="70">
            <p class="CALDAY mb-0">Lundi</p>
            <p class="CALDAY mb-0">Dimanche</p>
          </td>
          <td v-for="j in 24" :key="j">
            <div class="CALMONTH">
              <span v-for="i in 7" :key="'d'+i">
                <v-tooltip bottom :open-delay="0">
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                    >
                    <div 
                      v-if="data[i-1][j-1] && data[i-1][j-1].value !== null" 
                      class="RECT unset" 
                      :style="{background: data[i-1][j-1].color}">
                    </div>
                    <div 
                      v-else
                      class="RECT unset" 
                      :class="'B'">
                    </div>
                  </span>
                  </template>
                  <!-- <span v-if="(results.d[j-1][i-1]!=-1)">{{`${i}/${j}/${results.y} :`}} <b>{{results.d[j-1][i-1].toFixed(1)}}</b> {{ unit.name }}</span>
                  <span v-else>{{`${i}/${j}/${results.y} :`}} <b>-</b> {{ unit.name }}</span> -->
                  <span v-if="unit.shortName === '%' && data[i-1][j-1] && data[i-1][j-1].value !== null">{{ data[i-1][j-1].date }}: {{ +data[i-1][j-1].value.toFixed(1) }} {{ unit.shortName }}</span>
                  <span v-if="unit.shortName !== '%' && data[i-1][j-1] && data[i-1][j-1].maxCapacity !== null">{{ data[i-1][j-1].date }}: {{ +data[i-1][j-1].maxCapacity.toFixed(1) }} {{ unit.shortName }}</span>
                </v-tooltip>
              </span>
            </div>
          </td>
        </tr>
        <!-- <tr>
          <td colspan="25">
            <b>9h</b> - <b>10h</b> est le créneau d'heures pleines 
            <br>
            <b>12h</b> - <b>13h</b> et <b>18h</b> - <b>7h</b> sont les créneaux d'heures creuses
          </td>
        </tr> -->
      </table>
    </div>
</v-card>
</template>

<script>
export default {
    name: 'HeatWeek',
    props: {
        data: {required: true},
        unit: {required: true},
        calculus: {required: true},
        // source: {required: true}
    },
    mounted() {
      
    },
    data() {
        return {
            title: 'Titre',
            week: [
              ['Mon 00', 'Mon 01', 'Mon 02', 'Mon 03', 'Mon 04', 'Mon 05', 'Mon 06', 'Mon 07', 'Mon 08', 'Mon 09', 'Mon 10', 'Mon 11', 'Mon 12', 'Mon 13', 'Mon 14', 'Mon 15', 'Mon 16', 'Mon 17', 'Mon 18', 'Mon 19', 'Mon 20', 'Mon 21', 'Mon 22', 'Mon 23'],
              ['Tue 00', 'Tue 01', 'Tue 02', 'Tue 03', 'Tue 04', 'Tue 05', 'Tue 06', 'Tue 07', 'Tue 08', 'Tue 09', 'Tue 10', 'Tue 11', 'Tue 12', 'Tue 13', 'Tue 14', 'Tue 15', 'Tue 16', 'Tue 17', 'Tue 18', 'Tue 19', 'Tue 20', 'Tue 21', 'Tue 22', 'Tue 23'],
              ['Wed 00', 'Wed 01', 'Wed 02', 'Wed 03', 'Wed 04', 'Wed 05', 'Wed 06', 'Wed 07', 'Wed 08', 'Wed 09', 'Wed 10', 'Wed 11', 'Wed 12', 'Wed 13', 'Wed 14', 'Wed 15', 'Wed 16', 'Wed 17', 'Wed 18', 'Wed 19', 'Wed 20', 'Wed 21', 'Wed 22', 'Wed 23'],
              ['Thu 00', 'Thu 01', 'Thu 02', 'Thu 03', 'Thu 04', 'Thu 05', 'Thu 06', 'Thu 07', 'Thu 08', 'Thu 09', 'Thu 10', 'Thu 11', 'Thu 12', 'Thu 13', 'Thu 14', 'Thu 15', 'Thu 16', 'Thu 17', 'Thu 18', 'Thu 19', 'Thu 20', 'Thu 21', 'Thu 22', 'Thu 23'],
              ['Fri 00', 'Fri 01', 'Fri 02', 'Fri 03', 'Fri 04', 'Fri 05', 'Fri 06', 'Fri 07', 'Fri 08', 'Fri 09', 'Fri 10', 'Fri 11', 'Fri 12', 'Fri 13', 'Fri 14', 'Fri 15', 'Fri 16', 'Fri 17', 'Fri 18', 'Fri 19', 'Fri 20', 'Fri 21', 'Fri 22', 'Fri 23'],
              ['Sat 00', 'Sat 01', 'Sat 02', 'Sat 03', 'Sat 04', 'Sat 05', 'Sat 06', 'Sat 07', 'Sat 08', 'Sat 09', 'Sat 10', 'Sat 11', 'Sat 12', 'Sat 13', 'Sat 14', 'Sat 15', 'Sat 16', 'Sat 17', 'Sat 18', 'Sat 19', 'Sat 20', 'Sat 21', 'Sat 22', 'Sat 23'],
              ['Sun 00', 'Sun 01', 'Sun 02', 'Sun 03', 'Sun 04', 'Sun 05', 'Sun 06', 'Sun 07', 'Sun 08', 'Sun 09', 'Sun 10', 'Sun 11', 'Sun 12', 'Sun 13', 'Sun 14', 'Sun 15', 'Sun 16', 'Sun 17', 'Sun 18', 'Sun 19', 'Sun 20', 'Sun 21', 'Sun 22', 'Sun 23']
            ]
        }
    }
}
</script>

<style scoped>
.bar-card-w {
  width: 100%;
  background-color: #f9f9f9;
  font-family: "Charlevoix Pro";
  font-size: 0.875em;
  min-height: 220px !important;
  background: #f9f9f9;
  border-radius: 10px !important;
  box-shadow: 0px 3px 10px #49545C29 !important;
  padding-bottom: 20px;
}

.card-title {
  letter-spacing: 1.1px !important;
  color: #000000DE !important;
  font-size: 1.25em !important;
  height: fit-content !important;
  padding: 0 !important;
}

.CALHEAT {
  font-family: "Charlevoix Pro";
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  width: 100%;
}

.CALTABLE-week {
  font-family: "Charlevoix Pro";
  max-width: 410px !important;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}

.CALHEAD {
  font-family: "Charlevoix Pro";
  font-style: normal;
  font-weight: 400;
  font-size: 0.62em;
  line-height: 0.813em;
  color: #214353;
}

.WEEKDAYS {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 172px;
  padding-left: 10px;
}

.CALMONTH {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 3px;
  height: 172px !important;
}

.RECT {
  width: 17px;
  height: 22px;
  background: transparent;
  border-radius: 5px;
}
.unset {
  background: #D9D9D9;
}

.CALDAY {
  font-family: "Charlevoix Pro";
  font-style: normal;
  font-weight: 400;
  font-size: 0.625em;
  line-height: 13px;
  color: #214353;
}

.CALMAX {
  font-family: "Charlevoix Pro";
  padding-left: 7.6%;
  font-style: normal;
  font-weight: 400;
  font-size: 0.813em;
  line-height: 17px;
  letter-spacing: 1.1px;
  color: #14202C;
  width: 100%;
}

</style>