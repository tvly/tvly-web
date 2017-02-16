<template>
  <div>
    <ul class="nav nav-tabs">
      <li v-for="c in channels['Categories']" role="presentation" :class="{active: c['Name'] == category}">
        <router-link :to="link(c)">{{c['Name']}}</router-link>
      </li>
    </ul>
    <p>{{category}}</p>
    <p>{{channels}}</p>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'

export default {
  props: ['category', 'channels'],
  name: 'list-view',
  methods: {
    link(category) {
      return {
        name: 'list',
        params: {
          category: category['Name'],
        },
      }
    },
  }
}
</script>
