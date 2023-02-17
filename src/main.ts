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
import 'core-js/stable';
import Vue from 'vue';
import { vuetifyInit, vuetify } from './plugins/vuetify';
import { routerInit, router } from './router';
import store from './store';
import { initAxios } from './requests';
import VueCookie from 'vue-cookie';
import App from './App.vue';

import "./events/iframeEventBus";
import '../assets/css/basic/reset.css';
import '../assets/css/basic/main.less';
import '../assets/css/component/navPickerApp.css';
import 'material-design-icons-iconfont';


vuetifyInit(Vue);
routerInit(Vue);

initAxios();

Vue.config.productionTip = false;
Vue.use(VueCookie);


new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');
