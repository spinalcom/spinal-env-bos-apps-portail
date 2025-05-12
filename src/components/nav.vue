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
    <mobile-nav
      style="width: 100%; height: 100%"
      v-show="isMobile"
      :logoSvg="logoSvg"
      :userInfo="userInfo"
      :apps="apps"
      @logout="logOut"
    ></mobile-nav>
    <div
      class="spinal-backdrop"
      @click="showMenu = navBarAppMenuShow = false"
      v-if="showMenu || navBarAppMenuShow"
    ></div>
    <nav v-show="!isMobile">
      <div class="navPickerApp">
        <div class="navPickerApp-container">
          <v-btn
            style="box-shadow: 0 3px 6px #00000033"
            icon
            @click="showMenu = !showMenu"
          >
            <v-icon v-if="!showMenu">mdi-menu</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </v-btn>
          <v-menu
            bottom
            left
            offset-y
            transition="slide-x-transition"
            v-model="showMenu"
          >
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ userInfo && userInfo.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                v-for="(item, i) in mainbuttons"
                :key="i"
                @click="item.action"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

          <div class="navPickerApp-companyLogo">
            <img :src="logoSvg" />
          </div>
          <div class="navPickerApp-appMenu">
            <button
              class="navPickerApp-appMenu-button"
              @click="navBarAppMenuShow = !navBarAppMenuShow"
              :class="{
                actived: navBarAppMenuShow,
              }"
              :title="localAppSelected.name"
            >
              <div class="buttonLabel">application</div>
              <div class="navPickerApp-appMenu-iconContainer">
                <v-icon>{{ localAppSelected.icon || 'mdi-domain' }}</v-icon>
              </div>
              <div class="navPickerApp-appMenu-title">
                {{ localAppSelected.name }}
              </div>
            </button>

            <v-list
              class="navPickerApp-appMenu-content"
              :class="{
                actived: navBarAppMenuShow,
              }"
              dense
            >
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
                    <v-icon class="app-btn-icon">{{
                      app.icon || 'mdi-city'
                    }}</v-icon>
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
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import logoSvg from '../../assets/img/logo.jpg';
import NavMobile from './mobile/nav.vue';

export default {
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    'mobile-nav': NavMobile,
  },
  async mounted() {
    await Promise.all([this.getPortofolios(), this.getUserInfo()]);
    this.setLocalAppSelected();
    // this.setApps();
  },
  data() {
    this.homeApp = {
      href: this.$router.resolve({ name: 'Home' }).href,
      name: 'Toutes les applications',
    };
    return {
      logoSvg,
      homeApp: this.homeApp,
      localAppSelected: this.homeApp,
      navBarAppMenuShow: false,
      apps: [],
      showMenu: false,
      mainbuttons: [
        {
          name: 'Déconnexion',
          icon: 'mdi-logout',
          action: () => this.logOut(),
        },
      ],
    };
  },
  methods: {
    ...mapActions('logingStore', ['clearLocalStorage']),
    ...mapActions('appDataStore', ['getApps', 'getUserInfo', 'getPortofolios']),

    logOut() {
      this.clearLocalStorage();
      this.$router.push({ name: 'Login' });
    },

    setLocalAppSelected() {
      if (!this.appSelected) {
        this.localAppSelected = this.homeApp;
        return;
      }
      if (this.appsDisplayed.length === 0) {
        this.localAppSelected = this.homeApp;
        return;
      }
      this.localAppSelected = this.appsDisplayed.find(
        (app) => app.name === this.appSelected
      );
    },
  },
  computed: {
    ...mapState('appDataStore', [
      'appsDisplayed',
      'userInfo',
      'appSelected',
      'portofolios',
    ]),

    appMenuTabIndexComputed() {
      return this.navBarAppMenuShow ? '' : '-1';
    },
  },
  watch: {
    appSelected() {
      this.setLocalAppSelected();
    },
    appsDisplayed: {
      immediate: true,
      deep: true,
      handler() {
        this.apps = [];
        for (const app of this.appsDisplayed) {
          const curr = {
            name: app.name,
            href: this.$router.resolve({
              name: 'App',
              query: { app: app.name },
            }).href,
            icon: app.icon || 'mdi-domain',
            id: app.id,
          };
          if (app.subApps && app.subApps.length > 0) {
            for (const subApps of app.subApps) {
              if (curr.subApp === undefined) curr.subApp = [];

              curr.subApp.push({
                name: subApps.name,
                href: this.$router.resolve({
                  name: 'App',
                  query: { app: app.name, config: subApps.name },
                }).href,
                icon: subApps.icon || app.icon || 'mdi-domain',
                id: subApps.id,
              });
            }
          }
          this.apps.push(curr);
        }

        // this.appsDisplayed;
      },
    },
  },
};
</script>

<style>
.navPickerApp-mainMenu-content-list {
  background-color: aquamarine;
  padding-top: 45px;
}
.navPickerApp-appMenu-content
  .v-list-group
  .v-list-group__items
  .v-list-item
  .v-list-item__icon {
  margin-left: 14px;
  margin-right: 16px;
}
.navPickerApp-appMenu-content
  .v-list-group__header
  .v-list-item__icon:first-child {
  color: #0000008a;
  margin-right: 36px;
}
</style>

<style scoped>
.spinal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
.app-btn-icon {
  width: 25px;
  height: 25px;
  margin-right: 12px;
  box-shadow: 0 3px 6px #00000033;
  border-radius: 3px;
  background-color: white;
}
.navPickerApp-appMenu-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
