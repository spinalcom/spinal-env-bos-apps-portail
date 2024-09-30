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

import { isAuthenticate } from '../middleware/auth';
import VueRouter, { RouteConfig } from 'vue-router';
import { checkIfItComeFromPam } from '../utils';

// import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';
import ErrorView from '../views/Error.vue';
import HomeLayout from '../layout/HomeLayout.vue';


const getLoginRedirect = () => {
  let url = process.env.SPINAL_API_URL;
  return url?.endsWith('/') ? url.substring(0, url.length - 1) : url;
}

export function routerInit(vue: any) {
  vue.use(VueRouter);
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/home',
    name: '_Home',
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: LoginView,
  },
  {
    name: "Login",
    path: '/login',
    redirect: () => {
      const url = getLoginRedirect();
      window.location.href = `${url}/login`;
      return url + "/login";
    },
  },
  {
    path: '/error',
    name: 'Error',
    component: ErrorView,
  },
  {
    path: '/app',
    name: 'App',
    component: () => import('../views/ApplicationView.vue'),
  },
  {
    path: '/',
    component: HomeLayout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/HomeView.vue'),
      },
    ],
  },
];

const router: any = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {

  if (to.name === 'Error') return next();

  let token, userInfo;

  if (to.name === 'Home' && to.query.data) {
    const d = checkIfItComeFromPam(to);
    token = d?.token;
    userInfo = d?.userInfo;
  }

  let comeFromPam = token ? true : false;

  const auth = await isAuthenticate(token, userInfo);

  if (!auth && comeFromPam) return next({ name: 'Error' });

  const isConnectionPage = ['Login', 'AdminLogin'].indexOf(to.name) !== -1;

  if (isConnectionPage && auth) return next({ name: 'Home' });
  if (!auth && !isConnectionPage) {
    if (to.name === 'AdminLogin')
      return next({ name: 'Login' });
    return next({ name: 'Login' })
  };

  return next();
});


router.customPush = function (path, query) {
  this.push({ path, query });
};

router.customReplace = function (path, query) {
  this.replace({ path, query });
};

(window as any).router = router;
(window as any).routerFunction = router;

export { router };
