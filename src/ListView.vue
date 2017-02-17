<template>
  <div>
    <main>
      <div class="navbar-fixed">
        <nav class="nav-extended">
          <div class="nav-wrapper">
            <a href="#" class="brand-logo">清华IPTV</a>
            <ul class="right">
              <li><a href="#">登出</a></li>
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
      </div>
      <div class="row" id="list">
        <channel-thumbnail v-for="c in channelsOfCurrentCategory" class="col l4 m6 s12" :channel="c"></channel-thumbnail>
      </div>
    </main>
    <iptv-footer></iptv-footer>
  </div>
</template>

<script>
import 'materialize-css/dist/css/materialize.css'
import ChannelThumbnail from './ChannelThumbnail.vue'
import IPTVFooter from './IPTVFooter.vue'

export default {
  props: ['category', 'channels'],
  components: {
    ChannelThumbnail,
    'iptv-footer': IPTVFooter,
  },
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

<style scoped>
div#list {
  margin-top: 55px
}
</style>
