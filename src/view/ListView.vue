<template>
  <div class="grey lighten-4">
    <header>
      <nav class="teal lighten-2">
        <div class="container">
          <div class="nav-wrapper">
            <a href="#" data-activates="slide-out" class="button-collapse"><i class="material-icons">menu</i></a>
            <a class="brand-logo">清华大学IPTV<span class="hide-on-small-only badge pink accent-1">beta</span></a>
          </div>
        </div>
      </nav>
      <ul id="slide-out" class="side-nav fixed">
        <li><div class="userView">
            <div class="background">
              <img :src="background">
            </div>
            <a><img class="circle" :src="avatar"></a>
            <a><span class="white-text name"></span></a>
        </div></li>
        <li v-for="c in channels['Categories']" @click="hideMenu" :class="{active: c['Name'] == category}">
          <router-link :to="categoryLink(c)" replace>{{c['Name']}}</router-link>
        </li>
        <li><div class="divider"></div></li>
        <li>
          <a @click="detail = !detail">
            显示缩略图
            <div class="switch right">
              <label class="switch">
                <input type="checkbox" v-model="detail">
                <span class="lever"></span>
              </label>
            </div>
          </a>
        </li>
      </ul>
    </header>

    <main>
      <div class="container">
        <div class="row" id="list">
          <channel-thumbnail v-for="c in channelsOfCurrentCategory" class="col l4 m6 s12" :channel="c" :key="c.Vid" :detail="detail"></channel-thumbnail>
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

import background from '../image/background.jpg';

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
      detail: window.localStorage.iptvDetail === 'true',
      background,
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
  watch: {
    detail(val) {
      window.localStorage.iptvDetail = val.toString();
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

img {
  width: 100%;
}

a {
  cursor: pointer;
}

main {
  padding-top: 10px;
}

@media only screen and (max-width : 992px) {
  header, main, footer {
    padding-left: 0;
  }
}
</style>
