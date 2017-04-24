import VueRouter from 'vue-router';
import URI from 'urijs';

import ListView from '../view/ListView.vue';
import HLSPlayer from '../view/HLSPlayer.vue';

import config from '../../config.json5';

const routes = [{
  name: 'list',
  path: URI('./list/:category').absoluteTo(config.baseUrl).toString(),
  props: true,
  component: ListView,
}, {
  name: 'play',
  path: URI('./play/:channel').absoluteTo(config.baseUrl).toString(),
  props: true,
  component: HLSPlayer,
}, {
  path: '*',
  redirect: (to) => {
    return {
      name: 'list',
      params: {
        category: 'UNKNOWN',
      },
    };
  },
}];

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

