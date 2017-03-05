<template>
  <div>
    <nav class="teal lighten-2">
      <div class="nav-wrapper">
        <router-link :to="categoryLink" class="button-collapse show-on-large">
          <i class="material-icons">arrow_back</i>
        </router-link>
        <a class="brand-logo center"><span class="hide-on-small-only">{{categoryTitle}}/</span>{{channelTitle}}<span v-if="engine.length" class="hide-on-small-only badge pink accent-1">{{engine}}</span></a>
        <ul class="right">
          <li class="hide-on-small-only"><a href="#help-modal" id="help"><i class="material-icons">keyboard</i></a></li>
        </ul>
      </div>
    </nav>
    <div class="player fp-mute"></div>
    <div id="help-modal" class="modal">
      <div class="modal-content">
        <h4>键盘绑定</h4>
        <table class="centered highlight">
          <thead>
            <tr>
              <th data-field="key">按键</th>
              <th data-field="function">功能</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>ESC</td>
              <td>返回列表</td>
            </tr>
            <tr>
              <td>+/-</td>
              <td>增减音量</td>
            </tr>
            <tr>
              <td>左右</td>
              <td>切换频道</td>
            </tr>
            <tr>
              <td>上下</td>
              <td>切换分类</td>
            </tr>
            <tr>
              <td>f</td>
              <td>切换全屏</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/css/ghpages-materialize.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'flowplayer/dist/skin/skin.css';
import flowplayer from 'flowplayer';
import engine from 'flowplayer-hlsjs';
import 'materialize-css';
import jQuery from 'jquery';

import swf from 'flowplayer/dist/flowplayer.swf';
import swfHls from 'flowplayer/dist/flowplayerhls.swf';

import {categoryLink, channelLink} from '../route/link.js';

engine(flowplayer);

export default {
  props: ['channel', 'channels'],
  name: 'hls-player',
  data() {
    return {
      engine: '',
      player: null,
    };
  },
  methods: {
    keyHandler(event) {
      let captured = true;
      // workaround for safari
      switch(event.key || event.keyIdentifier) {
        case 'Esc': // keyIdentifier
        case 'U+001B': // keyIdentifier
        case 'Escape':
          if (!this.player.isFullscreen) {
            this.$router.push(this.categoryLink);
          }
          break;
        case 'Left': // keyIdentifier
        case 'H': // keyIdentifier
        case 'U+0048': // keyIdentifier
        case 'ArrowLeft':
        case 'h':
          this.switchChannel(-1);
          break;
        case 'Right': // keyIdentifier
        case 'L': // keyIdentifier
        case 'U+004C': // keyIdentifier
        case 'ArrowRight':
        case 'l':
          this.switchChannel(1);
          break;
        case 'Up': // keyIdentifier
        case 'K': // keyIdentifier
        case 'U+004B': // keyIdentifier
        case 'ArrowUp':
        case 'k':
          this.switchCategory(-1);
          break;
        case 'Down': // keyIdentifier
        case 'J': // keyIdentifier
        case 'U+004A': // keyIdentifier
        case 'ArrowDown':
        case 'j':
          this.switchCategory(1);
          break;
        case 'Plus': // keyIdentifier
        case 'U+002B': // keyIdentifier
        case '+':
          this.player.volume(Math.min(this.player.volumeLevel + 0.1, 1));
          break;
        case 'HyphenMinus': // keyIdentifier
        case 'U+002D': // keyIdentifier
        case '-':
          this.player.volume(Math.max(this.player.volumeLevel - 0.1, 0));
          break;
        case 'f':
        case 'F': // keyIdentifier
        case 'U+0046': // keyIdentifier
          this.player.fullscreen();
          break;
        default:
          captured = false;
          console.warn(`Unkown key event: ${event.key}(${event.keyIdentifier})`,
                       event);
      }
      if (captured) {
        event.preventDefault();
      }
    },
    switchChannel(offset) {
      const currentCategory = this.channels.Categories[this.categoryIndex];
      const nextChannelIndex = this.channelIndex + offset;
      if (nextChannelIndex >= 0 &&
            nextChannelIndex < currentCategory.Channels.length) {
        this.$router.replace(
          channelLink(currentCategory.Channels[nextChannelIndex]));
      }
    },
    switchCategory(offset) {
      const categories = this.channels.Categories;
      const nextCategoryIndex = this.categoryIndex + offset;
      if (nextCategoryIndex >= 0 &&
            nextCategoryIndex < categories.length) {
        const category = categories[nextCategoryIndex];
        this.$router.replace(
          channelLink(category.Channels[0]));
      }
    },
  },
  computed: {
    categoryIndex() {
      return this.channels.Categories.findIndex((category) => {
        return category.Channels.findIndex((channel) => {
          return channel['Vid'] === this.channel;
        }) !== -1;
      });
    },
    channelIndex() {
      const category = this.channels.Categories[this.categoryIndex];
      return category.Channels.findIndex((channel) => {
        return channel['Vid'] === this.channel;
      });
    },
    channelTitle() {
      const category = this.channels.Categories[this.categoryIndex];
      const channel = category.Channels[this.channelIndex];
      return channel.Name;
    },
    categoryTitle() {
      const category = this.channels.Categories[this.categoryIndex];
      return category.Name;
    },
    categoryLink() {
      const category = this.channels.Categories[this.categoryIndex];
      return categoryLink(category);
    },
    clip() {
      return {
        live: true,
        sources: [{
          type: 'application/x-mpegurl',
          src: `//iptv.tsinghua.edu.cn/hls/${this.channel}.m3u8`,
        }],
      };
    },
  },
  created() {
    flowplayer((api) => {
      api.on('ready', (e, api, video) => {
        const engineName = api.engine.engineName;
        this.engine = engineName;
      });
    });
  },
  mounted() {
    this.player = flowplayer(this.$el.getElementsByClassName('player')[0], {
      autoplay: true,
      share: false,
      keyboard: false,
      swf,
      swfHls,
      clip: this.clip,
    });
    jQuery('.modal').modal();
    window.addEventListener('keydown', this.keyHandler);
  },
  watch: {
    clip(val) {
      this.player.load(val);
    },
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyHandler);
  },
};
</script>

<style scoped>
@media only screen and (min-width: 500px) {
  .flowplayer {
    margin-top: 10px;
    max-width: 70%;
    left: 50%;
    transform: translate(-50%, 0)
  }
}
</style>
