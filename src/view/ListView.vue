<template>
  <div
    id="body"
    class="grey lighten-4">
    <header>
      <nav>
        <div class="container">
          <div class="nav-wrapper">
            <a class="brand-logo">{{ appName }}</a>
            <a
              data-target="nav-menu"
              class="sidenav-trigger">
              <i class="material-icons">menu</i>
            </a>
            <ul class="right">
              <li>
                <a @click="detail = !detail">
                  <i class="material-icons">{{ viewIcon }}</i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <ul
        id="nav-menu"
        class="sidenav sidenav-fixed">
        <li>
          <div class="user-view">
            <div class="background">
              <img
                :src="background"
                alt="background">
            </div>
            <a>
              <img
                :src="avatar"
                class="circle"
                alt="avatar">
            </a>
            <a><span class="white-text type">{{ userType }}</span></a>
            <a><span class="white-text uid">{{ uid }}</span></a>
          </div>
        </li>
        <li class="search">
          <div
            :class="{focused: filter || searching}"
            class="search-wrapper card">
            <input
              id="search"
              v-model="filter"
              type="search"
              @focus="searching = true"
              @blur="searching = false">
            <i
              v-if="filter"
              class="material-icons"
              @click="filter = ''">close</i>
            <speech-recognition
              v-else-if="voidSearch"
              :options="recognitionOption"
              @result="filter = $event"/>
            <i
              v-else
              class="material-icons">search</i>
          </div>
        </li>
        <li
          v-for="c in channels['Categories']"
          :key="c['Name']"
          :class="{active: c['Name'] == category}"
          class="sidenav-close">
          <router-link
            :to="categoryLink(c)"
            replace>{{ c['Name'] }}</router-link>
        </li>
        <li><div class="divider"/></li>
        <li
          :class="{active: $route.name == 'star'}"
          class="sidenav-close">
          <router-link :to="{ name: 'star' }">收藏列表</router-link>
        </li>
        <li
          v-if="hasEPG"
          :class="{active: $route.name == 'program'}"
          class="sidenav-close">
          <router-link :to="{ name: 'program' }">当前节目列表</router-link>
        </li>
        <li
          v-if="legacyUrl"
          class="sidenav-close">
          <a :href="legacyUrl">
            回忆旧版
          </a>
        </li>
        <li
          v-if="uid && !withIP"
          class="sidenav-close">
          <a @click="$emit('logout')">
            登出
          </a>
        </li>
      </ul>

    </header>

    <main>
      <router-view
        :filter="filter"
        :detail="detail"
        :disable-key-binding="searching"
        @channel="switchChannel($event)"/>
    </main>

    <iptv-footer/>

  </div>
</template>

<script>
import Modernizr from 'modernizr';
import {mapGetters} from 'vuex';
import Materialize from 'materialize-css';

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
  name: 'ListView',
  components: {
    CastController,
    SpeechRecognition,
    'iptv-footer': IPTVFooter,
  },
  props: {
    category: String,
  },
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
    ...mapGetters([
      'channels',
    ]),
  },
  watch: {
    detail(val) {
      window.localStorage.iptvDetail = val.toString();
    },
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
  mounted() {
    this.navBtn = Materialize.Sidenav.init(this.$el.querySelector('.sidenav'));
  },
  beforeDestroy() {
    this.navBtn.destroy();
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
    categoryLink,
  },
};
</script>

<style scoped lang="scss">
@import "~materialize-css/sass/materialize.scss";

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

ul.sidenav {
  padding-bottom: 10px!important;

  div.user-view {
    height: 240px;

    div.background img {
      height: 100%;
      width: 100%;
    }

    @mixin user-view-item {
      line-height: 24px;
      display: block;
    }

    .type {
      @include user-view-item;
      font-size: 14px;
      margin-top: 16px;
      font-weight: 600;
    }

    .uid {
      @include user-view-item;
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
        top: 0px;
        right: 10px;
        cursor: pointer;
      }

      &.focused {
        margin: 0 4px;
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
