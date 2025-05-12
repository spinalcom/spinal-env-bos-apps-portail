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
  <div class="mobile-nav-container" :class="{ enabled: drawer }">
    <div class="navPickerApp" @click.stop="drawer = !drawer">
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

    <v-navigation-drawer
      class="navPickerApp-drawer"
      v-model="drawer"
      absolute
      temporary
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <v-avatar size="36" color="grey">
              <v-icon dark> mdi-account </v-icon>
            </v-avatar>
            {{ userInfo && userInfo.name }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ userInfo && userInfo.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav rounded dense>
        <v-list-item
          :href="homeApp.href"
          @click="navBarAppMenuShow = false"
          :title="homeApp.name"
        >
          <v-list-item-icon>
            <v-icon class="app-btn-icon">{{
              homeApp.icon || 'mdi-city'
            }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ homeApp.name }}</v-list-item-title>
        </v-list-item>

        <template v-for="app in apps">
          <v-list-item
            :key="app.id"
            :href="app.href"
            @click="navBarAppMenuShow = false"
            :title="app.name"
            v-if="!app.subApp"
          >
            <v-list-item-icon>
              <v-icon class="app-btn-icon">{{ app.icon || 'mdi-city' }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ app.name }}</v-list-item-title>
          </v-list-item>
          <template v-else>
            <v-list-group :value="true" :title="app.name" :key="app.id">
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon class="app-btn-icon">{{
                    app.icon || 'mdi-city'
                  }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ app.name }}</v-list-item-title>
              </template>

              <v-list-item
                v-for="subApp in app.subApp"
                :key="subApp.id"
                :href="subApp.href"
                @click="navBarAppMenuShow = false"
                :title="subApp.name"
              >
                <v-list-item-icon>
                  <v-icon class="app-btn-icon">{{
                    subApp.icon || 'mdi-city'
                  }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ subApp.name }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </template>
        </template>
      </v-list>

      <template v-slot:append>
        <div style="height: 60px">
          <v-btn block color="error" style="height: 100%" @click="logOut">
            <v-icon left> mdi-logout </v-icon>
            Déconnexion
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
const logo = require('../../../assets/img/favicon.png');
export default {
  name: 'nav-mobile',
  props: {
    logoSvg: {},
    userInfo: {},
    apps: {},
  },
  data() {
    return {
      homeApp: {
        href: this.$router.resolve({ name: 'Home' }).href,
        name: 'Toutes les applications',
      },
      drawer: false,
      group: null,
      logo,
    };
  },

  methods: {
    logOut() {
      this.$emit('logout');
    },
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>

<style scoped>
.mobile-nav-container {
  position: absolute;
  top: 0px;
  left: 0px;
}

.mobile-nav-container.enabled {
  width: 100vw !important;
  height: 100vh !important;
}
</style>

<style>
.v-list-group .v-list-group__items .v-list-item .v-list-item__icon {
  margin-left: 14px;
  margin-right: 16px;
}
</style>
