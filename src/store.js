import Vue from 'vue';
import Vuex from 'vuex';

import {now} from './time.js';

import config from '../config.json5';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    now: now(),
    epg: {},
    collections: JSON.parse(window.localStorage.starredChannels || '[]'),
    channelViewers: {},
    jsonUrlCompleted: 0,

    // Initialized with an array of empty array
    // with the length of channelsUrlList
    fetchedCategories: Array.from(
      Array(config.channelsUrlList.length)).map(() => []),
  },
  mutations: {
    updateNow(state) {
      state.now = now();
    },
    addChannels(state, {channels, index}) {
      const categories = channels.Categories;
      const defaults = Object.assign({}, channels);
      delete defaults.Categories;
      const categoriesWithDefaults = categories.map((c) => {
        return Object.assign({}, defaults, c);
      });
      Vue.set(state.fetchedCategories, index, categoriesWithDefaults);
    },
    addEPG(state, epg) {
      state.epg = Object.assign({}, state.epg, epg);
    },
    setChannelViewers(state, channelViewers) {
      state.channelViewers = channelViewers;
    },
    toggleCollection(state, channel) {
      const idx = state.collections.indexOf(channel);
      if (idx !== -1) {
        state.collections.splice(idx, 1);
      } else {
        state.collections.push(channel);
      }
      window.localStorage.starredChannels = JSON.stringify(state.collections);
    },
    channelsUrlCompleted(state) {
      state.jsonUrlCompleted += 1;
    },
  },
  actions: {
    fetchChannels(context) {
      config.channelsUrlList.forEach((url, index) => {
        window.fetch(url, {
          mode: 'cors',
          credentials: 'include',
        }).then((response) => {
          if (response.status == 200) {
            return response.json();
          } else {
            console.warn('FATEL: failed to get channels!');
          }
        }).then((channels) => {
          context.commit('addChannels', {channels, index});
        }).then(
          () => context.commit('channelsUrlCompleted'),
          () => context.commit('channelsUrlCompleted'));
      });
    },
    fetchEPG(context) {
      if (config.epgUrlList) {
        config.epgUrlList.forEach((url) => {
          window.fetch(url, {
            mode: 'cors',
            credentials: 'include',
          }).then((response) => {
            if (response.status == 200) {
              return response.json();
            } else {
              console.warn('FATEL: failed to get EPG!');
            }
          }).then((epg) => {
            context.commit('addEPG', epg);
          });
        });
      }
    },
    fetchChannelViewers(context) {
      if (config.channelViewersUrl) {
        window.fetch(config.channelViewersUrl, {
          mode: 'cors',
          credentials: 'include',
        }).then((response) => {
          if (response.status == 200) {
            return response.text();
          } else {
            console.warn('FATEL: failed to get channel viewers!');
          }
        }).then((text) => {
          return text
            .split('\n')
            .filter((line) => line)
            .map((line) => line.replace(/^\s+/, '').split(/\s/));
        }).then((array) => {
          let channelViewers = {};
          for (let [num, channel] of array) {
            channelViewers[channel] = parseInt(num);
          }
          return channelViewers;
        }).then((channelViewers) => {
          context.commit('setChannelViewers', channelViewers);
        });
      }
    },
  },
  getters: {
    defaultCategory(state, getters) {
      if (state.jsonUrlCompleted === config.channelsUrlList.length &&
          getters.channels.Categories.length > 0) {
        return getters.channels.Categories[0];
      }
    },
    channelList(state, getters) {
      return (categoryName) => {
        const category = getters.getCategory(categoryName);
        return category ? category.Channels : [];
      };
    },
    getCategory(state, getters) {
      return (categoryName) => {
        return getters.channels.Categories.find(
          (c) => c['Name'] == categoryName
        );
      };
    },
    getViewers(state) {
      return (channel) => {
        return state.channelViewers[channel] || 0;
      };
    },
    hasCategory(state, getters) {
      return (categoryName) => !!getters.getCategory(categoryName);
    },
    getChannel(state, getters) {
      return (channelName) => {
        return getters.channelMap[channelName];
      };
    },
    hasChannel(state, getters) {
      return (channelName) => !!getters.getChannel(channelName);
    },
    inCollection(state) {
      return (channel) => state.collections.includes(channel);
    },
    channelMap(state, getters) {
      return [].concat(...getters.channels.Categories.map((c) => {
        return c.Channels.map((ch) => {
          return Object.assign({}, ch, {
            Category: c.Name,
          });
        });
      })).reduce((acc, cur) => {
        acc[cur.Vid] = cur;
        return acc;
      }, {});
    },
    starredChannels(state, getters) {
      return state.collections.map((col) => {
        return getters.channelMap[col];
      }).filter((channel) => !!channel);
    },
    channels(state) {
      return {
        Categories: [].concat.apply(...state.fetchedCategories),
      };
    },
  },
});

window.setInterval(() => {
  store.commit('updateNow');
}, 1000);

if (config.channelViewersUrl) {
  store.dispatch('fetchChannelViewers');
  window.setInterval(() => {
    store.dispatch('fetchChannelViewers');
  }, (config.channelViewersRefreshInterval || 30) * 1000);
}

store.dispatch('fetchChannels');
store.dispatch('fetchEPG');
