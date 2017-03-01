<template>
  <div>
    <header>
      <nav class="teal">
        <div class="container">
          <div class="nav-wrapper">
            <a href="#" data-activates="slide-out" class="button-collapse"><i class="material-icons">menu</i></a>
            <a class="brand-logo">清华大学IPTV<span class="hide-on-small-only badge pink accent-1">beta</span></a>
          </div>
        </div>
      </nav>
      <ul id="slide-out" class="side-nav fixed">
        <li><div class="userView">
            <div class="background teal"></div>
            <a><img class="circle" :src="avatar"></a>
            <a><span class="white-text name"></span></a>
        </div></li>
        <li v-for="c in channels['Categories']" @click="hideMenu" :class="{active: c['Name'] == category}">
          <router-link :to="categoryLink(c)" replace>{{c['Name']}}</router-link>
        </li>
      </ul>
    </header>

    <main>
      <div class="container">
        <div class="row" id="list">
          <channel-thumbnail v-for="c in channelsOfCurrentCategory" class="col l4 m6 s12" :channel="c" :key="c.Vid"></channel-thumbnail>
        </div>
      </div>
    </main>
    <iptv-footer></iptv-footer>
  </div>
</template>

<script>
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/css/ghpages-materialize.css';
import 'material-design-icons/iconfont/material-icons.css';

import 'materialize-css';
import jQuery from 'jquery';

import ChannelThumbnail from './ChannelThumbnail.vue';
import IPTVFooter from './IPTVFooter.vue';

import thuLogo from '../image/thu.svg';
import {categoryLink} from '../route/link.js';

export default {
  props: ['category', 'channels'],
  components: {
    ChannelThumbnail,
    'iptv-footer': IPTVFooter,
  },
  name: 'list-view',
  data() {
    return {
      avatar: thuLogo,
    };
  },
  methods: {
    categoryLink,
    hideMenu() {
      if (window.innerWidth <= 992) {
        jQuery('.button-collapse').sideNav('hide');
      }
    },
  },
  computed: {
    channelsOfCurrentCategory() {
      for (const c of this.channels['Categories']) {
        if (c['Name'] === this.category) {
          return c['Channels'];
        }
      }
    },
  },
  mounted() {
    jQuery('.button-collapse').sideNav({
      menuWidth: 250,
      // There is a known [issue](https://github.com/Dogfalo/materialize/issues/4118)
      closeOnClick: false,
      draggable: false,
    });
  },
};
</script>

<style scoped>
header, main, footer {
  padding-left: 250px;
}

@media only screen and (max-width : 992px) {
  header, main, footer {
    padding-left: 0;
  }
}
</style>
