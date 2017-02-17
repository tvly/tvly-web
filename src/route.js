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

export const router = new VueRouter({
  routes,
})

/**
 * object required to jump to category
 * @param {object} category - the category to jump
 * @return {object} - object used to jump
 */
function categoryLink(category) {
  return {
    name: 'list',
    params: {
      category: category['Name'],
    },
  }
}

/**
 * object required to jump to channel
 * @param {object} channel - the channel to jump
 * @return {object} - object used to jump
 */
function channelLink(channel) {
  return {
    name: 'play',
    params: {
      category: channel['Name'],
    },
  }
}

export { channelLink, categoryLink }
