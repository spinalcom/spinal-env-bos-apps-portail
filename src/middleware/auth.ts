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

import { getTokenData } from '~/common_data/requests/users';
import {saveToLocalStorage, clearLocalStorage} from '../utils';

export async function isAuthenticate(argToken?: string, userInfo?: any ): Promise<any> {
  const token = argToken || localStorage.getItem('token');
  if (token) {
    const {code, data} = await getTokenData(token);
    

    if (code == 200) {
      const profileId =
        data.profile?.userProfileBosConfigId || data.profile?.profileId;
      if (!profileId) {
        // clearLocalStorage();
        return;
      }

      if (userInfo) data.userInfo = userInfo;
      saveToLocalStorage(data);
      return data;
    }
  }

  // clearLocalStorage();

  return;
}
