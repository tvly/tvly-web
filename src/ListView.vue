<template>
  <div class="container">
    <ul class="nav nav-tabs">
      <li v-for="c in channels['Categories']" role="presentation" :class="{active: c['Name'] == category}">
        <router-link :to="linkCategory(c)">{{c['Name']}}</router-link>
      </li>
    </ul>
    <div class="row">
      <div v-for="c in channelsOfCurrentCategory" class="col-xs-4 col-md-3">
        <router-link :to="linkChannel(c)" class="btn btn-block btn-primary">{{c['Name']}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'

export default {
  props: ['category', 'channels'],
  name: 'list-view',
  methods: {
    linkCategory(category) {
      return {
        name: 'list',
        params: {
          category: category['Name'],
        },
      }
    },
    linkChannel(channel) {
      return {
        name: 'play',
        params: {
          channel: channel['Vid'],
        }
      }
    }
  },
  computed: {
    channelsOfCurrentCategory() {
      for (const c of this.channels['Categories']) {
        if (c['Name'] === this.category) {
          return c['Channels']
        }
      }
    },
  },
}
</script>
