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
  <div class="profileListContainer">
    <div class="header">
      <v-card class="btnCard">
        <v-btn class="button" color="#14202c" @click="createProfile">
          <v-icon class="btnIcon"> mdi-plus-thick </v-icon>
          Ajouter un profil
        </v-btn>
      </v-card>
    </div>

    <v-card class="tableCard" elevation="4">
      <div class="toolbar">
        <div class="title">liste de profils d'applications</div>
      </div>

      <div class="table-container">
        <v-data-table
          dense
          hide-default-header
          disable-pagination
          hide-default-footer
          :headers="headers"
          id="table"
          :items="profiles"
          item-key="name"
        >
          <template v-slot:header="{props: {headers}}">
            <thead>
              <tr>
                <th
                  v-for="headerItem in headers"
                  class="tableHeader"
                  :key="headerItem.value"
                >
                  {{ headerItem.text }}
                </th>
              </tr>
            </thead>
          </template>

          <template v-slot:item="{item}">
            <tr class="itemRow">
              <td>{{ item.name }}</td>
              <td>{{ item.contexts | length }}</td>
              <td>{{ item.apis | length }}</td>

              <td
                class="actions"
                style="
                  background: white;
                  text-align: center;
                  vertical-align: middle;
                "
              >
                <v-btn class="actionBtn dark" @click="editProfile(item)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>

                <v-btn
                  class="actionBtn"
                  color="error"
                  outlined
                  @click="deleteProfile(item)"
                >
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {State} from 'vuex-class';
import {Component} from 'vue-property-decorator';

@Component({
  filters: {
    length: function (liste: any[]) {
      if (!liste || liste.length === 0) return 0;
      return liste.filter((el) => el.name.toLowerCase() !== 'administration')
        .length;
    },
    bosLength: function (liste: any) {
      let count = 0;
      if (!liste || liste.length === 0) return count;
      for (const item of liste) {
        count += item.buildings.length;
      }

      return count;
    },
    concat: function (value: any[]) {
      if (!value || value.length === 0) return '-';
      return value.map((el) => el.name).join(', ');
    },
  },
})
class ProfileListComponent extends Vue {
  headers: any[] = [
    {text: 'Nom du profil', value: 'name'},
    {text: 'Contexte(s) autorisé(s)', value: 'contexts'},
    {text: 'Route(s) autorisée(s)', value: 'apis'},
    // { text: "Route(s) autorisée(s)", value: "routes" },
    {text: 'Actions', value: 'actions'},
  ];

  @State profiles!: any;

  seeProfile(item: any) {
    this.$emit('see', item);
  }

  createProfile() {
    this.$emit('create');
  }

  editProfile(item: any) {
    this.$emit('edit', item);
  }

  deleteProfile(item: any) {
    this.$emit('delete', item);
  }
}

export default ProfileListComponent;
</script>

<style lang="scss" scoped>
$header-height: 60px;
// $page-background: #f5f3f3;
$header-margin-bottom: 10px;
$toolbar-height: 30px;
.profileListContainer {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    height: $header-height;
    margin-bottom: $header-margin-bottom;
    display: flex;
    justify-content: flex-end;

    .btnCard {
      min-width: 250px;
      height: $header-height;
      border-radius: 7px;
      padding: 10px;
      // background-color: $page-background !important;
      display: flex;
      justify-content: center;
      align-items: center;

      .button {
        height: 100%;
        color: #fff;

        .btnIcon {
          margin-right: 5px;
        }
      }
    }
  }

  .tableCard {
    padding: 10px;
    // background-color: $page-background !important;
    background: transparent !important;
    width: 100%;
    height: calc(100% - #{$header-height + $header-margin-bottom});
    border-radius: 10px;

    .toolbar {
      width: 100%;
      height: $toolbar-height !important;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .title {
        font-size: 0.9em !important;
        text-transform: uppercase;
      }
    }

    .table-container {
      height: calc(100% - #{$toolbar-height}) !important;
      #table {
        background: transparent;
        th.tableHeader {
          height: 50px;
          text-transform: lowercase;
          font-size: 0.9em !important;
          text-align: left;
          vertical-align: bottom;
          text-align: center;
        }

        tr.itemRow {
          td {
            height: 50px;
            text-align: center;
            vertical-align: middle;
            background: #fff;
            margin-bottom: 5px;
          }

          .actions {
            .actionBtn {
              min-width: unset;
              width: 30px !important;
              height: 30px;
              margin-left: 10px;
            }

            .actionBtn.dark {
              background: #14202c;
              color: white;
            }
          }
        }
      }
    }
  }
}
</style>
