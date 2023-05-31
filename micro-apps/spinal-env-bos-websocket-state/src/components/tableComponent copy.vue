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
  <v-container class="_container"
               fluid>
    <v-layout column
              class="_layout elevation-5">
      <v-flex class="_flex">
        <v-data-table class="component_container"
                      :headers="headers"
                      hide-default-header
                      hide-default-footer
                      :items="desserts">

          <template v-slot:header="{ items }">
            {{ items }}
            <!-- <tr v-for="(item, index) in items"
          class="categoriesRows"
          :key="index">
        <td v-for="(header, index2) in headers"
            :key="index2">
          <div class="categoryName"
               v-if="header.value === 'name'">
            {{ item[header.value] }}
          </div>

          <div class="card"
               v-else
               v-for="(applicationData, index3) in item[header.value]"
               :key="index3"
               :style="cardStyle">
            <ApplicationCard :data="applicationData"
                             @goToApp="goToApp"
                             @exploreApp="exploreApp"
                             @addAppToFavoris="addAppToFavoris" />
          </div>
        </td>
      </tr> -->
          </template>

        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "",
          align: "start",
          sortable: true,
          value: "icon",
          width: "150px",
          class: ["tableHeader", "dateColumn"],
        },
        {
          text: "Date",
          align: "start",
          sortable: true,
          value: "date",
          width: "300px",
          class: ["tableHeader", "dateColumn"],
        },
        {
          text: "Message",
          align: "start",
          sortable: false,
          value: "message",
          class: "tableHeader",
        },
      ],
      desserts: [
        {
          date: new Date() + 1,
          message: "hello world",
        },
        {
          date: new Date() + 2,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
        {
          date: new Date() + 3,
          message: "hello world",
        },
      ],
    };
  },
  computed: {},
};
</script>

<style lang="scss">
$card-padding: 10px;
._container {
  width: 100%;
  height: 100%;

  ._layout {
    width: 100%;
    padding: 15px;
    height: 100%;
    // max-height: calc(100% - 100px);
    background: white;
    ._flex {
      width: 100%;
      max-height: 100%;
      overflow: auto;

      .component_container {
        // width: 100%;
        // height: 100%;
        // padding: $card-padding;

        table {
          thead th.tableHeader {
            height: 50px !important;
            vertical-align: bottom !important;
            font-size: 1em !important;
          }

          tbody {
            position: relative;
            height: 100%;
            td {
              height: 60px;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
}
</style>