import VueRouter from 'vue-router'

import ListView from '../view/ListView.vue'
import HLSPlayer from '../view/HLSPlayer.vue'

import channels from '../data/channels.json'

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

export const router = new VueRouter({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    console.log(to, from, savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes,
})

