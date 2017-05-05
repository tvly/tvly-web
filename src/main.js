import Vue from 'vue';
import VueRouter from 'vue-router';
import Modernizr from 'modernizr';

import {router} from './route/route.js';
import config from '../config.json5';
import detects from './detects.js';

import AuthorizationNotification from './view/AuthorizationNotification.vue';

// Materialize-css
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css'; // bind Materialize to window

// Material-Design-Icons
import 'material-design-icons/iconfont/material-icons.css';

// Material-Design-Iconic-Font
import 'material-design-iconic-font/dist/css/material-design-iconic-font.css';

// Font Awesome
import 'font-awesome/css/font-awesome.css';

// Flowplayer
import 'flowplayer/dist/skin/skin.css';

import './animation.css';

// offline-plugin
import offlinePlugin from 'offline-plugin/runtime';
offlinePlugin.install();

Vue.use(VueRouter);

Modernizr.addTest(detects);

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
        mode: 'cors',
      }).then(() => { window.location.reload(); });
    },
  },
  created() {
    const div = document.getElementById('legacy-browser');
    div.outerHTML = '';
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
  credentials: 'include',
  mode: 'cors',
}).then((response) => {
  if (response.status === 200) {
    return response.json();
  }
}).then((channels) => {
  app.channels = channels;
  app.$mount('#app');
});
