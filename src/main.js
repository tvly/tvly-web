import Vue from 'vue';
import VueRouter from 'vue-router';

import {router} from './route/route.js';
import channels from './data/channels.json';
import config from '../config.json';

import './animation.css';

Vue.use(VueRouter);

new Vue({
  el: '#app',
  data: {
    channels,
    transition: '',
  },
  methods: {
    doLogin() {
      window.location.assign(config.authUrl);
    },
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
