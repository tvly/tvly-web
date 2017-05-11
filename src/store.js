import Vue from 'vue';
import Vuex from 'vuex';

import {now} from './time.js';

import config from '../config.json5';

Vue.use(Vuex);

// mutations
const UPDATE_NOW = 'UPDATE_NOW';
const SET_CHANNELS = 'SET_CHANNELS';
const SET_EPG = 'SET_EPG';

// actions
const FETCH_CHANNELS = 'FETCH_CHANNELS';
const FETCH_EPG = 'FETCH_EPG';

export const store = new Vuex.Store({
  state: {
    now: now(),
    channels: {
      Categories: [],
    },
    epg: {},
  },
  mutations: {
    [UPDATE_NOW](state) {
      state.now = now();
    },
    [SET_CHANNELS](state, channels) {
      state.channels = channels;
    },
    [SET_EPG](state, epg) {
      state.epg = epg;
    },
  },
  actions: {
    [FETCH_CHANNELS](context) {
      window.fetch(config.channelsUrl, {
        mode: 'cors',
        credentials: 'include',
      }).then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.warn('FATEL: failed to get channels!');
        }
      }).then((channels) => {
        context.commit(SET_CHANNELS, channels);
      });
    },
    [FETCH_EPG](context) {
      if (config.epgUrl && config.epgUrl.length) {
        window.fetch(config.epgUrl, {
          mode: 'cors',
          credentials: 'include',
        }).then((response) => {
          if (response.status == 200) {
            return response.json();
          } else {
            console.warn('FATEL: failed to get channels!');
          }
        }).then((epg) => {
          context.commit(SET_EPG, epg);
        });
      }
    },
  },
  getters: {
    defaultCategory(state) {
      if (state.channels.Categories.length > 0) {
        return state.channels.Categories[0];
      }
    },
    channelList(state) {
      return (categoryName) => {
        const category = state.channels.Categories.find(
          (c) => c['Name'] == categoryName
        );
        return category ? category.Channels : [];
      };
    },
  },
});

window.setInterval(() => {
  store.commit(UPDATE_NOW);
}, 1000);

store.dispatch(FETCH_CHANNELS);
store.dispatch(FETCH_EPG);
