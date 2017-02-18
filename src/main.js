import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import { router } from './route/route.js'
import channels from './data/channels.json'

new Vue({
  el: '#app',
  template: '' +
    '<router-view :channels="channels">' +
    '</router-view>',
  data: {
    channels,
  },
  created() {
    this.$route.go
  },
  router,
})
