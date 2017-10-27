import Vue from 'vue';
import VueRouter from 'vue-router';
import uri from 'urijs';
import analytics from 'universal-ga';

import ListView from '../view/ListView.vue';
import HLSPlayer from '../view/HLSPlayer.vue';
import ChannelList from '../view/ChannelList.vue';
import ProgramList from '../view/ProgramList.vue';

import config from '../../config.json5';

Vue.use(VueRouter);

const listRoute = {
  name: 'list',
  path: uri('./list/').absoluteTo(config.baseUrl).toString(),
  props: true,
  component: ListView,
  children: [{
    name: 'channel',
    path: 'channel/:category',
    component: ChannelList,
    props: true,
  }, {
    name: 'star',
    path: 'star',
    component: ChannelList,
    props: {
      category: null,
    },
  }],
};

if (config.epgUrl) {
  listRoute.children.push({
    name: 'program',
    path: 'program',
    component: ProgramList,
  });
}

const playRoute = {
  name: 'play',
  path: uri('./play/:channel').absoluteTo(config.baseUrl).toString(),
  props: true,
  component: HLSPlayer,
};

const defaultRoute = {
  path: '*',
  redirect: (to) => {
    return {
      name: 'channel',
      params: {
        category: 'UNKNOWN',
      },
    };
  },
};

const routes = [
  listRoute,
  playRoute,
  defaultRoute,
];

export const router = new VueRouter({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {x: 0, y: 0};
    }
  },
  routes,
});

if (config.googleAnalytics) {
  router.afterEach((to, from) => {
    analytics.pageview(to.path);
  });
}
