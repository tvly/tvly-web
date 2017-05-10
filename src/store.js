import Vue from 'vue';
import Vuex from 'vuex';

import {now} from './time.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    now: now(),
  },
  mutations: {
    updateNow(state) {
      state.now = now();
    },
  },
});

window.setInterval(() => {
  store.commit('updateNow');
}, 10 * 1000);
