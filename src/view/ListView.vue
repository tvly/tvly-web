<template>
  <div id="body" class="grey lighten-4">
    <header>
      <nav class="teal lighten-2">
        <div class="container">
          <div class="nav-wrapper">
            <a href="#" data-activates="nav-menu" class="button-collapse"><i class="material-icons">menu</i></a>
            <a class="brand-logo">清华大学IPTV<span class="hide-on-small-only badge pink accent-1">beta</span></a>
          </div>
        </div>
      </nav>
      <ul id="nav-menu" class="side-nav fixed">
        <li>
          <div class="userView">
            <div class="background">
              <img :src="background">
            </div>
            <a><img class="circle" :src="avatar"></a>
            <a><span class="white-text name">{{uid}}</span></a>
            <a><span class="white-text email">{{uid}}</span></a>
          </div>
        </li>
        <li class="search">
          <div class="search-wrapper card" :class="{focused: filter.length || searching}">
            <input id="search" type="search" v-model="filter" @focus="searching = true" @blur="searching = false">
            <i class="material-icons" v-if="filter.length" @click="filter = ''">close</i>
            <i class="material-icons" v-else>search</i>
          </div>
        </li>
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
        <li v-if="uid.length && !withIP">
          <a @click="$emit('logout')">
            登出
          </a>
        </li>
      </ul>
    </header>

    <main>
      <div class="container">
        <div class="row" id="list">
          <channel-thumbnail v-for="c in filteredList" class="col l4 m6 s12" :channel="c" :key="c.Vid" :detail="detail"
            @unauth="$emit('unauth')"></channel-thumbnail>
        </div>
      </div>
    </main>
    <iptv-footer></iptv-footer>
  </div>
</template>

<script>
import 'materialize-css/dist/css/materialize.css';
import 'material-design-icons/iconfont/material-icons.css';

import 'materialize-css';
import jQuery from 'jquery';
import fuzzy from 'fuzzy';

import ChannelThumbnail from './ChannelThumbnail.vue';
import IPTVFooter from './IPTVFooter.vue';

import {categoryLink} from '../route/link.js';
import {UNAUTHORIZED, UNKNOWN} from '../error.js';

import thuLogo from '../image/thu.svg';
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
      filter: '',
      searching: false,
      withIP: false,
      uid: '',
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
  created() {
    window.fetch('https://iptv.tsinghua.edu.cn/thauth/userinfo.php', {
      credentials: 'include',
    }).then((response) => {
      if (response.status === 200) {
        return response.text();
      } else if (response.status === 403) {
        throw UNAUTHORIZED;
      } else {
        throw UNKNOWN;
      }
    }).then((text) => {
      const iSeq = text.indexOf(':');
      if (iSeq === -1) {
        throw UNKNOWN;
      }
      const [type, value] = [text.slice(0, iSeq), text.slice(iSeq+1)];
      this.withIP = (type === 'ip');
      this.uid = value;
    }).catch((e) => {
      if (e == UNAUTHORIZED) {
        this.$emit('unauth');
      }
    });
  },
  computed: {
    channelList() {
      for (const c of this.channels['Categories']) {
        if (c['Name'] === this.category) {
          return c['Channels'];
        }
      }
    },
    filteredList() {
      return this.channelList.filter((channel) => {
        return (!this.filter.length ||
                fuzzy.test(this.filter, channel.Name) ||
                fuzzy.test(this.filter, channel.Vid));
      });
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

div.background img {
  height: 100%;
}

a {
  cursor: pointer;
}

main {
  padding-top: 10px;
}

div.userView {
  height: 240px;
}

input#search {
  width: 200px!important;
}

li.search {
  position: absolute;
  left: 0;
  right: 0;
  top: 180px;
  margin-top: 1px;
  padding: 1px 0 0 0;
  z-index: 2;
}

li.search .search-wrapper {
  margin: 0 12px;
  transition: margin .25s ease;
}

li.search .search-wrapper input#search {
  display: block;
  font-size: 16px;
  font-weight: 300;
  width: 100%;
  height: 45px;
  margin: 0;
  padding: 0 45px 0 15px;
  border: 0;
}

li.search .search-wrapper input#search:focus {
  outline: none;
}

li.search .search-wrapper.focused {
  margin: 0;
}

li.search .search-wrapper i.material-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

li.search:hover {
  background-color: rgba(0, 0, 0, 0)!important;
}

.container {
  width: 93%;
}

@media only screen and (max-width : 992px) {
  header, main, footer {
    padding-left: 0;
  }
}
</style>
