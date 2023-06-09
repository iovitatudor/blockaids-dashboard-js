import Vue from 'vue';
import Vuex from 'vuex';

import layout from './layout';
import auth from './auth';
import alert from './alert';
import categories from './category';
import collection from './collection';
import parameters from './parameter';
import experts from './expert';
import services from './services';
import calls from './call';
import client from './client';
import language from './language';
import schedule from './schedule';
import notification from './notification';
import payment from './payment';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layout,
    language,
    auth,
    alert,
    categories,
    parameters,
    experts,
    services,
    calls,
    client,
    collection,
    schedule,
    notification,
    payment,
  },
});
