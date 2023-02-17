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
  <div class="mobile-nav-container"
       :class="{'enabled' : drawer}">
    <div class="navPickerApp"
         @click.stop="drawer = !drawer">
      <div class="navPickerApp-container">
        <div class="navPickerApp-mainMenu">
          <button class="navPickerApp-mainMenu-button">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div class="navPickerApp-companyLogo">
          <img :src="logoSvg" />
        </div>

      </div>
    </div>

    <v-navigation-drawer v-model="drawer"
                         absolute
                         temporary>

      <v-list-item>
        <v-list-item-content>

          <v-list-item-title class="text-h6">
            <v-avatar size="36"
                      color="grey">
              <v-icon dark>
                mdi-account
              </v-icon>
            </v-avatar>
            {{ userInfo && userInfo.name }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ userInfo && userInfo.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav
              rounded>

        <v-list-item link
                     @click="goToHome">
          <v-list-item-icon>
            <v-icon>mdi-domain</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Acceuil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-for="item in apps"
                     :key="item.id"
                     link
                     @click="goToApp(item, $event)">
          <v-list-item-icon>
            <v-icon>{{item.icon || 'mdi-domain'}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div style="height : 60px">
          <v-btn block
                 color="error"
                 style="height : 100%"
                 @click="logOut">
            <v-icon left>
              mdi-logout
            </v-icon>
            Déconnexion
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>

</template>

<script>
const logo = require("../../../assets/img/favicon.png");
export default {
  props: {
    logoSvg: {},
    userInfo: {},
    apps: {},
  },
  data: () => ({
    drawer: false,
    group: null,
    logo,
  }),

  methods: {
    logOut() {
      this.$emit("logout");
    },

    goToHome(event) {
      this.$emit("home", event);
    },

    goToApp(item, event) {
      this.$emit("goToApp", { item, event });
    },
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-nav-container {
  position: absolute;
  width: 450px !important;
  height: 60px !important;
  top: 5px;
  left: 0px;
}

.mobile-nav-container.enabled {
  width: 100vw !important;
  height: 100vh !important;
}

// .menu {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;

//   div.icon {
//     width: 50px;
//     height: 50px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin-right: 10px;
//   }

//   div.username {
//     width: calc(100% - 50px);
//     height: 100%;
//     max-width: 200px;
//     font-size: 1.3em;
//     display: flex;
//     align-items: center;
//     overflow: hidden;
//     white-space: nowrap;
//     text-overflow: ellipsis;
//   }
// }
</style>