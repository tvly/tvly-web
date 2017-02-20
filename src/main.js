import Vue from 'vue';
import VueRouter from 'vue-router';

import {router} from './route/route.js';
import channels from './data/channels.json';

Vue.use(VueRouter);

new Vue({
  el: '#app',
  template: '' +
    '<router-view :channels="channels">' +
    '</router-view>',
  data: {
    channels,
  },
  router,
});
