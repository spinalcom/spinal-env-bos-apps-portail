import {subscribe} from './subscribe.js'

import {SpinalAPI} from '../spinalAPI/SpinalAPI'
import {store} from '../store/index';
import  { io } from 'socket.io-client';
// import  * as io  from 'socket.io-client';

export async function getContextId(buildingId) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, 'api/v1/context/list');
  
    return await spinalAPI.get(url)
      .then((res) => res.data)
      .then((data) => data.filter((el) => el.type === 'geographicContext'));
  }
export async function getCurrentData (data){
  
    //  return websocketdata;
    
    
}


