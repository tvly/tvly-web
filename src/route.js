import VueRouter from 'vue-router'

import ListView from './ListView.vue'

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
}]

export default new VueRouter({
  routes,
})
