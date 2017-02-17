<template>
  <div class="container">
    <nav class="nav-extended">
      <div class="nav-wrapper">
        <a href="#" class="brand-logo">清华IPTV</a>
        <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><a href="sass.html">Sass</a></li>
          <li><a href="badges.html">Components</a></li>
          <li><a href="collapsible.html">JavaScript</a></li>
        </ul>
        <ul class="side-nav" id="mobile-demo">
          <li><a href="sass.html">Sass</a></li>
          <li><a href="badges.html">Components</a></li>
          <li><a href="collapsible.html">JavaScript</a></li>
        </ul>
      </div>
      <div class="nav-content">
        <ul class="tabs tabs-transparent">
          <li v-for="c in channels['Categories']" class="tab">
            <router-link :to="linkCategory(c)" :class="{active: c['Name'] == category}">{{c['Name']}}</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="row">
      <div v-for="c in channelsOfCurrentCategory" class="col-xs-4 col-md-3">
        <router-link :to="linkChannel(c)" class="btn btn-block btn-primary">{{c['Name']}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'

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
        },
      }
    },
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
