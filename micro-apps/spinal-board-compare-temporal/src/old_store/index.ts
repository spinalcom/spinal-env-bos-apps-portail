import Vuex from 'vuex';
import StoreOptions from 'vuex';
import Vue from 'vue';
import config from '../../config';

Vue.use(Vuex);

export default new Vuex.Store({ 
    state: {
        config: config,
        config_endpoint: config.controlEndpoints[0]
    },
    mutations : {
        setConfigEndpoint(state, endpoint){
            state.config_endpoint = endpoint;
        },
        setConfigText(state, text){
            state.config_text = text;
        }
    }

})