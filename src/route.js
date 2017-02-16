import VueRouter from 'vue-router'

import App from './App.vue'
import ListView from './ListView.vue'

const routes = [{
  path: '/',
  component: App,
}, {
  name: 'list',
  path: '/list/:category',
  props: true,
  component: ListView,
}]

export default new VueRouter({
  routes,
})
