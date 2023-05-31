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
  <v-simple-table fixed-header
                  class="dataTable">
    <template v-slot:default>
      <thead class="tableHeader">
        <tr>
          <!-- <th></th> -->
          <th>
            Date
          </th>
          <th>
            message
          </th>
        </tr>
      </thead>

      <tbody class="tableBody">
        <tr v-for="(log,i) in logs"
            :key="i">
          <!-- <td class="color">
            <v-timeline>
              <v-timeline-item :color="getLogType(log)"
                               :icon="getIcon(log)"
                               fill-dot
                               small>


              </v-timeline-item>

            </v-timeline>
          </td> -->
          <td class="date">
            <v-icon left
                    :color="getLogType(log)">
              {{ getIcon(log) }}
            </v-icon>
            {{getDate(log)}}
          </td>
          <td class="message">{{ log.message }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>

</template>

<script>
import { logTypes } from "../store/constants";

import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work

moment.locale("fr");

export default {
  props: ["logs"],
  data() {
    return {
      // headers: [
      //   // {
      //   //   text: "",
      //   //   align: "start",
      //   //   sortable: true,
      //   //   value: "icon",
      //   //   width: "150px",
      //   //   class: ["tableHeader", "dateColumn"],
      //   // },
      //   {
      //     text: "Date",
      //     align: "start",
      //     sortable: true,
      //     value: "date",
      //     width: "300px",
      //     class: ["tableHeader", "dateColumn"],
      //   },
      //   {
      //     text: "Message",
      //     align: "start",
      //     sortable: false,
      //     value: "message",
      //     class: "tableHeader",
      //   },
      // ],
    };
  },
  methods: {
    getLogType(log) {
      return log.type === logTypes.Normal ? "green" : "#ff5252";
    },

    getIcon(log) {
      return log.type === logTypes.Normal
        ? "mdi-check"
        : "mdi-alert-circle-outline";
    },

    getDate(log) {
      return moment(log.date).format("llll");
    },
  },
};
</script>

<style lang="scss">
.dataTable {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: transparent !important;

  .v-data-table__wrapper,
  .v-data-table__wrapper table {
    width: 100%;
    height: 100%;
    background: transparent !important;
  }

  .tableHeader {
    height: 50px !important;
    tr {
      // background: linear-gradient(121deg, #f8fafa, #d6e2e6) !important;
    }

    th {
      background: transparent !important;
      font-size: 1em !important;
      vertical-align: bottom !important;
      text-transform: capitalize;
    }
  }
  .tableBody {
    td {
      min-width: unset !important;
      height: 60px !important;
      vertical-align: middle;
      min-width: unset;
    }
    td.color {
      width: 20px !important;
      height: 40px;
    }
    td.date {
      min-width: 280px !important;
      width: 280px;
    }
    td.message {
      width: calc(100% - 280px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

// $card-padding: 10px;
// ._container {
//   width: 100%;
//   height: 100%;

//   ._layout {
//     width: 100%;
//     padding: 15px;
//     height: 100%;
//     // max-height: calc(100% - 100px);
//     background: white;
//     ._flex {
//       width: 100%;
//       max-height: 100%;
//       overflow: auto;

//       .component_container {
//         // width: 100%;
//         // height: 100%;
//         // padding: $card-padding;

//         table {
//           thead th.tableHeader {
//             height: 50px !important;
//             vertical-align: bottom !important;
//             font-size: 1em !important;
//           }

//           tbody {
//             position: relative;
//             height: 100%;
//             td {
//               height: 60px;
//               vertical-align: middle;
//             }
//           }
//         }
//       }
//     }
//   }
// }
</style>