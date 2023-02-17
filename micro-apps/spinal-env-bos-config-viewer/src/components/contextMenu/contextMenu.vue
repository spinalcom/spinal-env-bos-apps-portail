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
<script lang="ts">
import {
  IContextMenuGroup,
  EmitterViewerHandler,
  VIEWER_SET_CONTEXT_MENU,
  IContextMenuButton,
} from 'spinal-viewer-event-manager';
import { sendContextMenuClick } from '../../startEvents';
export default {
  name: 'forgeViewer',
  data() {
    return {
      buttons: <IContextMenuGroup[]>[],
    };
  },
  mounted() {
    // viewerAction, viewerAction2
    EmitterViewerHandler.getInstance().on(
      VIEWER_SET_CONTEXT_MENU,
      (btns: IContextMenuGroup[]): void => {
        this.buttons = btns;
      }
    );
  },
  methods: {
    onClick(button: IContextMenuButton) {
      sendContextMenuClick(button);
    },
  },
};
</script>

<template>
  <div class="context-menu-container">
    <v-fab-transition v-for="itm in buttons" :key="itm.label">
      <v-speed-dial
        v-model="itm.opened"
        direction="top"
        :open-on-hover="false"
        transition="slide-y-reverse-transition"
      >
        <template v-slot:activator>
          <v-btn
            v-model="itm.opened"
            v-tooltip="itm.opened ? itm.label : 'close'"
            small
            dark
            fab
          >
            <v-icon v-if="itm.opened"> mdi-close </v-icon>
            <v-icon v-else> {{ itm.icon }} </v-icon>
          </v-btn>
        </template>
        <v-btn
          v-for="btn in itm.children"
          :key="btn.label"
          dark
          small
          fab
          v-tooltip="btn.label"
          @click="onClick(btn)"
        >
          <v-icon>{{ btn.icon }} </v-icon>
        </v-btn>
      </v-speed-dial>
    </v-fab-transition>
  </div>
</template>

<style>
.context-menu-container {
  z-index: 1;
  background: red;
  position: fixed;
  right: 0;
  bottom: 0;
  max-height: 100%;
  display: flex;
  flex-direction: row-reverse;
}
.context-menu-container > * {
  margin: 8px;
}
</style>
