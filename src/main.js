import Vue from 'vue';
import VueRouter from 'vue-router';

import {router} from './route/route.js';
import channels from './data/channels.json';
import config from '../config.json';

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
    logout() {
      window.fetch(config.logoutUrl, {
        credentials: 'include',
      }).then(() => { window.location.reload(); });
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
