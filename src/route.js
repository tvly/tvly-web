import VueRouter from 'vue-router'

import ListView from './ListView.vue'
import HLSPlayer from './HLSPlayer.vue'

import channels from './channels.json'

const categories = channels['Categories']

const routes = [{
  path: '/',
  redirect: (to) => {
    return {
      name: 'list',
      params: {
        category: categories[0]['Name'],
      },
    }
  },
}, {
  name: 'list',
  path: '/list/:category',
  props: true,
  component: ListView,
}, {
  name: 'play',
  path: '/play/:channel',
  props: true,
  component: HLSPlayer,
}]

export default new VueRouter({
  routes,
})
