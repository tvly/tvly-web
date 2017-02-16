import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import router from './route.js'

const channelsUrl = require('file-loader?name=[name].[ext]!./channels.json')

const xhr = new XMLHttpRequest()
xhr.addEventListener('load', function() {
  const channels = JSON.parse(xhr.response)
  new Vue({
    el: '#app',
    template: '' +
      '<router-view :channels="channels">' +
      '</router-view>',
    data: {
      channels,
    },
    router,
  })
})
xhr.open('GET', channelsUrl)
xhr.send()

