import Vue from 'vue';
import Vuex from 'vuex';

import {now} from './time.js';

import config from '../config.json5';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    now: now(),
    channels: {
      Categories: [],
    },
    epg: {},
  },
  mutations: {
    updateNow(state) {
      state.now = now();
    },
    setChannels(state, channels) {
      state.channels = channels;
    },
    setEPG(state, epg) {
      state.epg = epg;
    },
  },
  actions: {
    fetchChannels(context) {
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
        context.commit('setChannels', channels);
      });
    },
    fetchEPG(context) {
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
          context.commit('setEPG', epg);
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
    channelList(state, getters) {
      return (categoryName) => {
        const category = getters.getCategory(categoryName);
        return category ? category.Channels : [];
      };
    },
    getCategory(state) {
      return (categoryName) => {
        return state.channels.Categories.find(
          (c) => c['Name'] == categoryName
        );
      };
    },
    hasCategory(state, getters) {
      return (categoryName) => !!getters.getCategory(categoryName);
    },
    getChannel(state, getters) {
      return (channelName) => {
        return getters[channelName];
      };
    },
    hasChannel(state, getters) {
      return (channelName) => !!getters.getChannel(channelName);
    },
    channelMap(state) {
      return [].concat(...state.channels.Categories.map((c) => {
        return c.Channels.map((ch) => {
          ch.Category = c.Name;
          return ch;
        });
      })).reduce((acc, cur, i) => {
        acc[cur.Vid] = cur;
        return acc;
      }, {});
    },
  },
});

window.setInterval(() => {
  store.commit('updateNow');
}, 1000);

store.dispatch('fetchChannels');
store.dispatch('fetchEPG');
