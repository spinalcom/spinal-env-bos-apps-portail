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
  <div>
    <v-treeview :items="items"
                selectable
                :load-children="loadChildren"></v-treeview>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

@Component({})
class TreeView {
  items: any = [
    {
      id: 1,
      name: "Applications :",
      children: [
        { id: 2, name: "Calendar : app" },
        { id: 3, name: "Chrome : app" },
        { id: 4, name: "Webstorm : app" },
      ],
    },
    {
      id: 5,
      name: "Documents :",
      children: [
        {
          id: 6,
          name: "vuetify :",
          children: [
            {
              id: 7,
              name: "src :",
              children: [
                { id: 8, name: "index : ts" },
                { id: 9, name: "bootstrap : ts" },
              ],
            },
          ],
        },
        {
          id: 10,
          name: "material2 :",
          children: [
            {
              id: 11,
              name: "src :",
              children: [
                { id: 12, name: "v-btn : ts" },
                { id: 13, name: "v-card : ts" },
                { id: 14, name: "v-window : ts" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 15,
      name: "Downloads :",
      children: [
        { id: 16, name: "October : pdf" },
        { id: 17, name: "November : pdf" },
        { id: 18, name: "Tutorial : html" },
      ],
    },
    {
      id: 19,
      name: "Videos :",
      children: [
        {
          id: 20,
          name: "Tutorials :",
          children: [
            { id: 21, name: "Basic layouts : mp4" },
            { id: 22, name: "Advanced techniques : mp4" },
            { id: 23, name: "All about app : dir" },
          ],
        },
        { id: 24, name: "Intro : mov" },
        { id: 25, name: "Conference introduction : avi" },
      ],
    },
  ];

  loadChildren(item: any) {
    console.log(item);
  }
}

export default TreeView;
</script>

<style scoped lang="scss">
</style>