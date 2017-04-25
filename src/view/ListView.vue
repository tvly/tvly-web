<template>
  <div id="body" class="grey lighten-4">
    <header>
      <nav class="teal lighten-2">
        <div class="container">
          <div class="nav-wrapper">
            <a href="#" data-activates="nav-menu" class="button-collapse"><i class="material-icons">menu</i></a>
            <a class="brand-logo">{{appName}}</a>
            <ul class="right">
              <li>
                <cast-controller ref="cast"></cast-controller>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <ul id="nav-menu" class="side-nav fixed">
        <li>
          <div class="userView">
            <div class="background">
              <img :src="background" alt="background">
            </div>
            <a><img class="circle" :src="avatar" alt="avatar"></a>
            <a><span class="white-text type">{{userType}}</span></a>
            <a><span class="white-text uid">{{uid}}</span></a>
          </div>
        </li>
        <li class="search">
          <div class="search-wrapper card" :class="{focused: filter.length || searching}">
            <input id="search" type="search" v-model="filter" @focus="searching = true" @blur="searching = false">
            <i class="material-icons" v-if="filter.length" @click="filter = ''">close</i>
            <i class="material-icons" v-else>search</i>
          </div>
        </li>
        <li v-for="c in channels['Categories']" @click="hideMenu" :class="{active: c['Name'] == currentCategory}">
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
        <li v-if="legacyUrl && legacyUrl.length">
          <a :href="legacyUrl">
            回忆旧版
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
          <channel-thumbnail @channel="switchChannel($event)" v-for="c in filteredList" class="col l4 m6 s12" :channel="c" :key="c.Vid" :detail="detail"
            @noimage="queryThumbnail"></channel-thumbnail>
        </div>
      </div>
    </main>

    <iptv-footer></iptv-footer>

    <div id="no-image" class="modal">
      <div class="modal-content">
        <h4>不能加载缩略图</h4>
        <p>当前不能加载缩略图，是否禁用？</p>
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" @click="detail = false">禁用</a>
        <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">取消</a>
      </div>
    </div>
  </div>
</template>

<script>
import jQuery from 'jquery';
import fuzzy from 'fuzzy';

import ChannelThumbnail from './ChannelThumbnail.vue';
import IPTVFooter from './IPTVFooter.vue';
import CastController from './CastController.vue';

import {categoryLink, channelLink} from '../route/link.js';
import {UNAUTHORIZED, UNKNOWN} from '../error.js';

import background from '../image/background.jpg';
import config from '../../config.json5';

/**
 * Read detail from localStorage
 * @return {bool} - value stored in localStorage or true
 **/
function getDetail() {
  return (window.localStorage.iptvDetail || 'true') === 'true';
}

export default {
  props: ['category', 'channels'],
  components: {
    ChannelThumbnail,
    CastController,
    'iptv-footer': IPTVFooter,
  },
  name: 'list-view',
  data() {
    return {
      avatar: config.sponsorLogoUrl,
      detail: getDetail(),
      filter: '',
      appName: config.name,
      searching: false,
      withIP: false,
      uid: '',
      navBtn: null,
      legacyUrl: config.legacyUrl,
      background,
    };
  },
  methods: {
    switchChannel(channel) {
      if (this.$refs.cast.connected) {
        console.warn(channel);
        this.$refs.cast.send({
          action: 'channel',
          channel: channel,
        });
      } else {
        this.$router.push(channelLink(channel));
      }
    },
    checkCategory() {
      const categoryNames = this.channels.Categories.map((c) => c.Name);
      if (categoryNames.length && !categoryNames.includes(this.category)) {
        const link = this.categoryLink(this.channels.Categories[0]);
        console.warn(`${this.category} is not in `, categoryNames);
        this.$router.push(link);
      }
    },
    hideMenu() {
      if (window.innerWidth <= 992) {
        this.navBtn.sideNav('hide');
      }
    },
    queryThumbnail() {
      jQuery('#no-image').modal('open');
    },
    categoryLink,
  },
  created() {
    if (config.userInfoUrl) {
      window.fetch(config.userInfoUrl, {
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
    }
  },
  computed: {
    userType() {
      if (!this.uid.length) {
        return '';
      } else if (this.withIP) {
        if (this.uid.includes(':')) {
          return 'IPv6用户';
        } else {
          return '校内用户';
        }
      } else {
        return '登录用户';
      }
    },
    currentCategory() {
      return this.category || this.channels.Categories[0].Name;
    },
    channelList() {
      for (const c of this.channels['Categories']) {
        if (c['Name'] === this.currentCategory) {
          return c['Channels'];
        }
      }
      return [];
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
    this.navBtn = jQuery(this.$el.querySelector('.button-collapse'));
    this.checkCategory();
    this.navBtn.sideNav({
      menuWidth: 250,
      // There is a known [issue](https://github.com/Dogfalo/materialize/issues/4118)
      closeOnClick: false,
      draggable: true,
    });
    jQuery('#no-image').modal();
  },
  beforeDestroy() {
    this.navBtn.sideNav('destroy');
  },
};
</script>

<style scoped>
header, main, footer {
  padding-left: 250px;
}

div.background img {
  height: 100%;
  width: 100%;
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
  width: 180px;
  height: 45px;
  margin: 0;
  padding: 0 15px 0 15px;
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

.side-nav .userView .type, .side-nav .userView .uid {
    line-height: 24px;
    display: block;
}

.side-nav .userView .type {
    font-size: 14px;
    margin-top: 16px;
    font-weight: 600;
}

.side-nav .userView .uid {
    font-size: 11px;
    padding-bottom: 16px;
    font-weight: 300;
}

@media only screen and (max-width : 992px) {
  header, main, footer {
    padding-left: 0;
  }
}

.side-nav {
  padding-bottom: 10px!important;
}
</style>
