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
  <v-container class="loginAppContainer"
               fluid>
    <for-got-password :dialog="forgotPassword"
                      @close="() => forgotPassword = false" />

    <form @submit.prevent="login">
      <v-card class="loginCard"
              elevation="4">
        <v-card-title class="loginCardTitle">
          <div class="logoImg">
            <div class="logo">
              <img class="img"
                   alt="logo"
                   :src="logoSvg" />
            </div>
          </div>

          <div class="description">
            Consultez toutes les données de vos bâtiments connectés.
          </div>
        </v-card-title>

        <v-card-text class="loginCardContent">
          <v-alert v-show="!hide && showError"
                   dense
                   outlined
                   type="error">
            incorrect login and/or password !
          </v-alert>

          <v-text-field outlined
                        height="35"
                        autocomplete="username"
                        dense
                        label="Login"
                        v-model="credential.userName"
                        required></v-text-field>

          <v-text-field outlined
                        v-model="credential.password"
                        height="35"
                        dense
                        label="Password"
                        autocomplete="current-password"
                        required
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'"
                        class="input-group--focused"
                        @click:append="showPassword = !showPassword">
          </v-text-field>

          <v-btn x-small
                 text
                 @click="forgotPassword = true"> mot de passe oublié ? </v-btn>
        </v-card-text>

        <v-card-actions class="loginCardAction">
          <v-btn dark
                 type="submit"> Connexion </v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </v-container>
</template>

<script>
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import logoSvg from "../../assets/img/logo.jpg";
import ForGotPassword from "./password-forgot.vue";
// import logoSvg from "../assets/logo.jpg";

export default Vue.extend({
  name: "Login",
  components: {
    ForGotPassword,
  },
  data() {
    return {
      forgotPassword: false,
      logoSvg,
      showPassword: false,
      showError: false,
      hide: true,
      credential: {
        userName: "",
        password: "",
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions("logingStore", ["logUser", "storeCookie"]),
    async login() {
      this.hide = false;
      const logged = await this.logUser(this.credential);
      this.showError = !logged;
      if (logged) {
        this.storeCookie(this.$cookie);
        this.$router.push("/home");
      }
    },
  },
  computed: {
    ...mapState("logingStore", ["incorrect"]),
    // showError() {
    //   return !this.hide && this.incorrect;
    // },
  },
  watch: {
    credential: {
      handler() {
        this.hide = true;
      },
      deep: true,
    },
  },
});
</script>


<style lang="scss">
$md-screen: 960px;

.loginAppContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .loginCard {
    width: 450px;
    padding: 18px;
    @media (max-width: $md-screen) {
      width: 100%;
      max-width: 500px;
    }
  }

  .loginCardTitle,
  .loginCardContent,
  .loginCardAction {
    padding: unset !important;
  }

  .loginCardTitle {
    margin-bottom: 40px;

    .description {
      line-height: 25px;
      word-break: keep-all;
      text-align: justify;
      font-size: 0.7em;
    }

    .logoImg {
      width: 100%;
      height: 200px;
      @media (max-width: $md-screen) {
        height: 200px !important;
      }
      .logo {
        width: 100%;
        height: 100%;
        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .loginCardAction {
    height: 40px;
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<style>
.loginAppContainer
  .loginCardContent
  .v-text-field.v-text-field--enclosed
  .v-text-field__details {
  margin-bottom: 0px;
}
</style>