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

    <mobile-nav style="width: 100%; height: 100%;" v-show="isMobile" :logoSvg="logoSvg" :userInfo="userInfo"
      :apps="appsDisplayed" @logout="logOut" @home="goToHome"
      @goToApp="({ item, event }) => goToApp(item, event)"></mobile-nav>

    <nav v-show="!isMobile">
      <div class="navPickerApp">
        <div class="navPickerApp-container">
          <div class="navPickerApp-mainMenu">
            <button class="navPickerApp-mainMenu-button" :class="{
              actived: navBarMainMenuShow,
            }" @click="clickMainMenu()">
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div class="navPickerApp-mainMenu-content" :class="{
              actived: navBarMainMenuShow,
            }">
              <div class="navPickerApp-mainMenu-content-profil">
                <div class="navPickerApp-mainMenu-content-profil-name">
                  {{ userInfo && userInfo.name }}
                </div>
                <div class="navPickerApp-mainMenu-content-profil-role">
                  {{ userInfo && userInfo.email }}
                </div>
              </div>
              <div class="navPickerApp-mainMenu-content-buttonContainer">
                <button v-for="btn in mainbuttons" :key="btn.name"
                  class="navPickerApp-mainMenu-content-buttonContainer-button" :tabindex="mainMenuTabIndexComputed"
                  @click="btn.action">
                  <div class="navPickerApp-mainMenu-content-buttonContainer-button-icon">
                  </div>
                  <div class="navPickerApp-mainMenu-content-buttonContainer-button-title">
                    {{ btn.name }}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div class="navPickerApp-companyLogo">
            <img :src="logoSvg" />
          </div>
          <div class="navPickerApp-appMenu">
            <button class="navPickerApp-appMenu-button" @click="clickAppMenu()" :class="{
              actived: navBarAppMenuShow,
            }">
              <div class="buttonLabel">application</div>
              <div class="navPickerApp-appMenu-iconContainer">
                <!-- <span class="material-icons">
                {{ localAppSelected.icon || 'location_city' }}
              </span> -->
                <v-icon>{{ localAppSelected.icon || 'mdi-domain' }}</v-icon>

              </div>
              <div class="navPickerApp-appMenu-title">
                {{ localAppSelected.name }}
              </div>
            </button>

            <div class="navPickerApp-appMenu-content" :class="{
              actived: navBarAppMenuShow,
            }">
              <button class="navPickerApp-appMenu-content-app" :tabindex="appMenuTabIndexComputed" @click="goToHome">
                <div class="navPickerApp-appMenu-content-app-iconContainer">
                  <!-- <v-icon>{{homeApp.icon || 'mdi-domain'}}</v-icon> -->
                  <span class="material-icons">
                    {{ homeApp.icon || 'location_city' }}
                  </span>
                </div>
                <div class="navPickerApp-appMenu-content-app-title">
                  {{ homeApp.name }}
                </div>
              </button>

              <button v-for="app in appsDisplayed" :key="app.name" class="navPickerApp-appMenu-content-app"
                :tabindex="appMenuTabIndexComputed" @click="goToApp(app, $event)">
                <div class="navPickerApp-appMenu-content-app-iconContainer">
                  <v-icon>{{ app.icon || 'mdi-domain' }}</v-icon>
                  <!-- <span class="material-icons">
                  {{ app.icon || 'location_city' }}
                </span> -->
                </div>
                <div class="navPickerApp-appMenu-content-app-title">
                  {{ app.name }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>

</template>

<script>
import { mapActions, mapState } from "vuex";
import logoSvg from "../../assets/img/logo.jpg";
import NavMobile from "./mobile/nav.vue";

export default {
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    "mobile-nav": NavMobile,
  },
  async mounted() {
    await Promise.all([this.getPortofolios(), this.getUserInfo()]);
    this.setLocalAppSelected();
    // this.setApps();
  },
  data() {
    this.homeApp = {
      path: "Home",
      name: "toutes les applications",
    };
    return {
      logoSvg,
      localAppSelected: this.homeApp,
      navBarMainMenuShow: false,
      navBarAppMenuShow: false,
      apps: [],
      mainbuttons: [
        { name: "", action: () => console.log("click Paramètres") },
        { name: "Déconnexion", action: () => this.logOut() },
      ],
    };
  },
  methods: {
    ...mapActions("logingStore", ["clearLocalStorage", "clearAllCookies"]),
    ...mapActions("appDataStore", ["getApps", "getUserInfo", "getPortofolios"]),

    clickMainMenu() {
      this.navBarMainMenuShow = !this.navBarMainMenuShow;
      this.navBarAppMenuShow = false;
    },

    clickAppMenu() {
      this.navBarMainMenuShow = false;
      this.navBarAppMenuShow = !this.navBarAppMenuShow;
    },

    logOut() {
      this.clearLocalStorage();
      this.clearAllCookies();
      this.$router.push({ name: "Login" });
    },

    goToHome(event) {
      if (event.ctrlKey) {
        let routeData = this.$router.resolve({ name: "Home" });
        window.open(routeData.href, "_blank");
      } else {
        this.$router.push({ name: "Home" }).catch(() => { });
      }
      this.navBarAppMenuShow = false;
    },

    goToApp(item, event) {
      if (item.isExternalApp) {
        window.open(item.link, "_blank");
        return;
      }

      if (event.ctrlKey) {
        let routeData = this.$router.resolve({
          name: "App",
          query: { app: btoa(JSON.stringify(item)) },
        });
        window.open(routeData.href, "_blank");
      } else {
        this.$router
          .push({ name: "App", query: { app: btoa(JSON.stringify(item)) } })
          .catch((error) => { });
      }
      this.navBarAppMenuShow = false;
    },

    setLocalAppSelected() {
      this.localAppSelected = this.appSelected || this.homeApp;
    },
    // setApps() {
    //   this.apps = [this.homeApp, ...this.appsDisplayed].map(
    //     ({ id, name, path, icon, action }) => {
    //       const app = {
    //         path: path || name || id,
    //         name,
    //         id,
    //         icon,
    //       };

    //       app.action = action
    //         ? action
    //         : () => {
    //             this.appSelected = app;
    //             // this.goTo(app.path);
    //           };
    //       return app;
    //     }
    //   );
    // },
  },
  computed: {
    ...mapState("appDataStore", [
      "appsDisplayed",
      "userInfo",
      "appSelected",
      "portofolios",
    ]),
    mainMenuTabIndexComputed() {
      return this.navBarMainMenuShow ? "" : "-1";
    },

    appMenuTabIndexComputed() {
      return this.navBarAppMenuShow ? "" : "-1";
    },

    // goTo(path) {
    //   this.$router.push({ name: path });
    // },
  },
  watch: {
    appSelected() {
      this.setLocalAppSelected();
    },
  },
};
</script>
