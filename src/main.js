import Vue from 'vue';
import VueRouter from 'vue-router';

import {router} from './route/route.js';
import config from '../config.json';

import AuthorizationNotification from './view/AuthorizationNotification.vue';

// Materialize-css
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css';

// Material-Design-Icons
import 'material-design-icons/iconfont/material-icons.css';

// Material-Design-Iconic-Font
import 'material-design-iconic-font/dist/css/material-design-iconic-font.css';

// Flowplayer
import 'flowplayer/dist/skin/skin.css';

import './animation.css';

Vue.use(VueRouter);

const app = new Vue({
  components: {
    'auth-notification': AuthorizationNotification,
  },
  data: {
    channels: {
      Categories: [],
    },
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

fetch(config.channelsUrl, {
  credentials: 'always',
}).then((response) => {
  if (response.status === 200) {
    return response.json();
  }
}).then((channels) => {
  app.channels = channels;
  app.$mount('#app');
});
