<template>
  <v-app left-fixed-sidebar>
    <header>
      <v-toolbar>
        <v-toolbar-side-icon class="hidden-sm-and-up"
          @click.native.stop="sidenav = !sidenav"/>
        <v-toolbar-title>{{appName}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <cast-controller ref="cast"></cast-controller>
      </v-toolbar>
    </header>
    <main>
      <v-sidebar fixed v-model="sidenav">
        <v-list>
          <v-list-item
            v-for="c in channels.Categories" :key="c.Vid"
            :class="{active: c.Name == category}">
            <v-list-tile :href="categoryLink(c)" replace router>
              <v-list-tile-title>
                {{c.Name}}
              </v-list-tile-title>
            </v-list-tile>
          </v-list-item>
          <v-divider/>
          <v-list-item>
            <v-list-tile>
              <v-text-field
                v-model="filter"
                prepend-icon="search" dark label="搜索"
                hide-details single-line></v-text-field>
            </v-list-tile>
          </v-list-item>
          <v-list-item
            v-if="hasEPG"
            :class="{active: $route.name == 'program'}">
            <v-list-tile :href="{name: 'program'}" replace router>
              <v-list-tile-title>
                当前节目列表
              </v-list-tile-title>
            </v-list-tile>
          </v-list-item>
          <v-list-item>
            <v-list-tile>
              <v-list-tile-title>
                显示缩略图
              </v-list-tile-title>
              <v-list-tile-action>
                <v-switch v-model="detail"/>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-item>
          <v-list-item
            v-if="legacyUrl && legacyUrl.length">
            <v-list-tile :href="legacyUrl">
              <v-list-tile-title>
                回忆旧版
              </v-list-tile-title>
            </v-list-tile>
          </v-list-item>
          <v-list-item v-if="uid.length && !withIP">
            <v-list-tile @click.native.stop="$emit('logout')">
              <v-list-tile-title>
                登出
              </v-list-tile-title>
            </v-list-tile>
            </a>
          </v-list-item>
        </v-list>
      </v-sidebar>
      <v-content>
        <router-view
          :filter="filter" :detail="detail"
          @noimage="queryThumbnail"
          @channel="switchChannel($event)"></router-view>
      </v-content>
    </main>
    <iptv-footer></iptv-footer>

    <v-dialog v-model="modal">
      <v-card>
        <v-card-row>
          <v-card-title>不能加载缩略图</v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text>当前不能加载缩略图，是否禁用？</v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn @click.native="modal = false" flat>取消</v-btn>
          <v-btn @click.native="modal = false; detail = false" flat>禁用</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
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
      sidenav: false,
      modal: false,
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
      if (this.$refs.cast.connected) {
        this.$refs.cast.send({
          action: 'channel',
          channel: channel,
        });
      } else {
        this.$router.push(channelLink(channel));
      }
    },
    queryThumbnail() {
      this.modal = true;
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
    hasEPG() {
      return !!Object.keys(this.$store.state.epg).length;
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
};
</script>
