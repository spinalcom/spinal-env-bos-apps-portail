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

export function saveToLocalStorage(data: any) {

  const profileId = data.profile.userProfileBosConfigId || data.profile.profileId;
  const token = data.token;
  const user = btoa(JSON.stringify(data.userInfo));

  localStorage.setItem("profileId", profileId)
  localStorage.setItem("token", token)
  localStorage.setItem("user", user)
}

export function clearLocalStorage() {
  localStorage.clear();
}

export function deleteAllCookies() {
  document.cookie.split(';').forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + `=;expires=${new Date(0)}`;
  });
}

export function checkIfItComeFromPam(to) {
  const decoded = atob(<string>to.query.data);
  let params = decoded && JSON.parse(decoded);
  if ((params.from = 'PAM')) {
    let token = params.data.token;
    let userInfo = params.data.userInfo;

    return { token, userInfo };
  }

  return;
}

export function getCookieValue(name) {
  if (!name) return null;
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

export function setCookie(cname, cvalue, exdays = 1) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// function delete_cookie(name, path, domain) {
//     if (get_cookie(name)) {
//         document.cookie = name + "=" +
//             ((path) ? ";path=" + path : "") +
//             ((domain) ? ";domain=" + domain : "") +
//             ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
//     }
// }