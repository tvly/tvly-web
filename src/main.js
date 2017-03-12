import Vue from 'vue';
import VueRouter from 'vue-router';

import {router} from './route/route.js';
import channels from './data/channels.json';

import AuthorizationNotification from './view/AuthorizationNotification.vue';

import './animation.css';

Vue.use(VueRouter);

new Vue({
  el: '#app',
  components: {
    'auth-notification': AuthorizationNotification,
  },
  data: {
    channels,
    transition: '',
  },
  methods: {
    notify() {
      this.$refs.auth.notify();
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
