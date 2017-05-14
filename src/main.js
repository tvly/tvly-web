import Vue from 'vue';
import Vuetify from 'vuetify';
import Modernizr from 'modernizr';

import {router} from './route/route.js';
import {store} from './store.js';
import config from '../config.json5';
import detects from './detects.js';

import AuthorizationNotification from './view/AuthorizationNotification.vue';

// Material-Design-Icons
import 'material-design-icons/iconfont/material-icons.css';

// Material-Design-Iconic-Font
import 'material-design-iconic-font/dist/css/material-design-iconic-font.css';

// Font Awesome
import 'font-awesome/css/font-awesome.css';

// Flowplayer
import 'flowplayer/dist/skin/skin.css';

import './animation.css';

// Vuetify
import 'vuetify/src/stylus/main.styl';

// offline-plugin
import offlinePlugin from 'offline-plugin/runtime';
offlinePlugin.install();

Modernizr.addTest(detects);

Vue.use(Vuetify);

new Vue({
  el: '#app',
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
      if (from.name === 'play') { // left play view
        this.transition = 'slide-right';
      } else {
        this.transition = 'slide-left';
      }
    },
  },
  router,
  store,
});
