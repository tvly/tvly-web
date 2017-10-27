<template>
  <div id="body" class="grey lighten-4">
    <header>
      <nav>
        <div class="container">
          <div class="nav-wrapper">
            <a href="#" data-activates="nav-menu" class="button-collapse"><i class="material-icons">menu</i></a>
            <a class="brand-logo">{{appName}}</a>
            <ul class="right">
              <!--<li>-->
                <!--<cast-controller ref="cast"></cast-controller>-->
              <!--</li>-->
              <li>
                <a @click="detail = !detail">
                  <i class="material-icons">{{viewIcon}}</i>
                </a>
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
          <div class="search-wrapper card" :class="{focused: filter || searching}">
            <input id="search" type="search" v-model="filter" @focus="searching = true" @blur="searching = false">
            <i class="material-icons" v-if="filter" @click="filter = ''">close</i>
            <speech-recognition v-else-if="voidSearch" @result="filter = $event" :options="recognitionOption"></speech-recognition>
            <i class="material-icons" v-else>search</i>
          </div>
        </li>
        <li v-for="c in channels['Categories']" :class="{active: c['Name'] == category}">
          <router-link :to="categoryLink(c)" replace>{{c['Name']}}</router-link>
        </li>
        <li><div class="divider"></div></li>
        <li :class="{active: $route.name == 'star'}">
          <router-link :to="{ name: 'star' }">收藏列表</router-link>
        </li>
        <li v-if="hasEPG" :class="{active: $route.name == 'program'}">
          <router-link :to="{ name: 'program' }">当前节目列表</router-link>
        </li>
        <li v-if="legacyUrl">
          <a :href="legacyUrl">
            回忆旧版
          </a>
        </li>
        <li v-if="uid && !withIP">
          <a @click="$emit('logout')">
            登出
          </a>
        </li>
      </ul>
    </header>

    <main>
      <router-view
        :filter="filter" :detail="detail"
        @noimage="queryThumbnail"
        @channel="switchChannel($event)"></router-view>
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
import Modernizr from 'modernizr';
import {mapState} from 'vuex';

import IPTVFooter from './IPTVFooter.vue';
import CastController from './CastController.vue';
import SpeechRecognition from './SpeechRecognition.vue';

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
  props: ['category'],
  components: {
    CastController,
    SpeechRecognition,
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
      voidSearch: Modernizr.speechrecognition,
      background,
    };
  },
  methods: {
    switchChannel(channel) {
      if (this.$refs.cast && this.$refs.cast.connected) {
        this.$refs.cast.send({
          action: 'channel',
          channel: channel,
        });
      } else {
        this.$router.push(channelLink(channel.Vid, this.$route.name));
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
        mode: 'cors',
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
    recognitionOption() {
      const allChannels = Object.values(this.$store.getters.channelMap);
      return allChannels.map((ch) => [ch.Name, ch.Vid]);
    },
    userType() {
      if (!this.uid) {
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
    hasEPG() {
      return !!Object.keys(this.$store.state.epg).length;
    },
    viewIcon() {
      if (this.detail) {
        return 'view_module';
      } else {
        return 'view_list';
      }
    },
    ...mapState([
      'channels',
    ]),
  },
  watch: {
    detail(val) {
      window.localStorage.iptvDetail = val.toString();
    },
  },
  mounted() {
    this.navBtn = jQuery(this.$el.querySelector('.button-collapse'));
    this.navBtn.sideNav({
      menuWidth: 250,
      closeOnClick: true,
      draggable: true,
    });
    jQuery('#no-image').modal();
  },
  beforeDestroy() {
    this.navBtn.sideNav('destroy');
  },
};
</script>

<style scoped lang="scss">
@import "~materialize-css/sass/components/_color.scss";
@import "~materialize-css/sass/components/_variables.scss";

a {
  cursor: pointer;
}

header, main, footer {
  @media #{$large-and-up} {
    padding-left: 250px;
  }
  @media #{$medium-and-down} {
    padding-left: 0;
  }
}

main {
  padding-top: 10px;
}

.container {
  width: 93%;
}

ul.side-nav {
  padding-bottom: 10px!important;

  div.userView {
    height: 240px;

    div.background img {
      height: 100%;
      width: 100%;
    }

    @mixin userView-item {
      line-height: 24px;
      display: block;
    }

    .type {
      @include userView-item;
      font-size: 14px;
      margin-top: 16px;
      font-weight: 600;
    }

    .uid {
      @include userView-item;
      font-size: 11px;
      padding-bottom: 16px;
      font-weight: 300;
    }
  }

  li.search {
    position: absolute;
    left: 0;
    right: 0;
    top: 180px;
    margin-top: 1px;
    padding: 1px 0 0 0;
    z-index: 2;

    &:hover {
      background-color: rgba(0, 0, 0, 0)!important;
    }

    div.search-wrapper {
      margin: 0 12px;
      transition: margin .25s ease;

      i.material-icons {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }

      &.focused {
        margin: 0;
      }

      input#search {
        display: block;
        font-size: 16px;
        font-weight: 300;
        width: 180px;
        height: 45px;
        margin: 0;
        padding: 0 15px 0 15px;
        border: 0;

        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>
