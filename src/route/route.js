import VueRouter from 'vue-router';
import URI from 'urijs';

import ListView from '../view/ListView.vue';
import HLSPlayer from '../view/HLSPlayer.vue';

import channels from '../data/channels.json';
import config from '../../config.json';

const categories = channels['Categories'];

const routes = [{
  path: URI('./').absoluteTo(config.baseUrl).toString(),
  redirect: (to) => {
    return {
      name: 'list',
      params: {
        category: categories[0]['Name'],
      },
    };
  },
}, {
  name: 'list',
  path: URI('./list/:category').absoluteTo(config.baseUrl).toString(),
  props: true,
  component: ListView,
}, {
  name: 'play',
  path: URI('./play/:channel').absoluteTo(config.baseUrl).toString(),
  props: true,
  component: HLSPlayer,
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

