/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'

import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2, {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
});

Vue.config.productionTip = false
import "../../../assets/css/basic/reset.css";
import "../../../assets/css/basic/main.css";
import "../../../assets/css/component/navPickerApp.css";

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
