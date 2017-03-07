import Vue from 'vue';
import VueRouter from 'vue-router';

import {router} from './route/route.js';
import channels from './data/channels.json';

import './animation.css';

Vue.use(VueRouter);

new Vue({
  el: '#app',
  template: '' +
    '<transition :name="transition">' +
      '<router-view :channels="channels">' +
      '</router-view>' +
    '</transition>',
  data: {
    channels,
    transition: '',
  },
  watch: {
    '$route'(to, from) {
      if (from.name === 'list' && to.name === 'play') { // from list to play
        this.transition = 'slide-left';
      } else {
        this.transition = 'slide-right';
      }
    },
  },
  router,
});
