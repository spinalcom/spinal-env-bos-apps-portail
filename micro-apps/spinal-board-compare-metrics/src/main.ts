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
import { SpinalAPI } from './services/spinalAPI/SpinalAPI';

SpinalAPI.setHook(window.parent);
SpinalAPI.getInstance(process.env.SPINAL_API_URL);
import {initStoreConfig , store } from './services/store';
import storeconfig from './services/store/StoreConfig';
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'


// import SpinalComponents from 'spinal-components'
// import 'spinal-components/dist/spinal-components.css'
// Vue.use(SpinalComponents, {})


async function startApp() {
  Vue.config.productionTip = false
  
  await initStoreConfig();
  new Vue({
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
}

startApp();