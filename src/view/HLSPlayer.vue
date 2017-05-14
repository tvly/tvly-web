<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>
        {{currentChannel.Category}}/{{currentChannel.Name}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog class="mx-2">
        <v-btn icon dark slot="activator" mx-5
          hidden-md-and-down>
          <v-icon>keyboard</v-icon>
        </v-btn>
        <v-card>
          <v-card-row>
            <v-card-title>键盘绑定</v-card-title>
          </v-card-row>
          <v-card-row>
            <v-card-text>
              <v-list two-line dense>
                <v-list-item
                  v-for="keybinding in keybindings"
                  :key="keybinding[0]">
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title v-text="keybinding[0]"></v-list-tile-title>
                      <v-list-tile-sub-title v-text="keybinding[1]"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card-row>
        </v-card>
      </v-dialog>
      <v-dialog class="mx-2">
        <v-btn icon dark slot="activator"
          v-if="currentEPG.length">
          <v-icon>playlist_play</v-icon>
        </v-btn>
        <v-card>
          <v-card-row>
            <v-card-title>节目列表</v-card-title>
          </v-card-row>
          <v-card-row>
            <v-card-text>
              <v-list two-line dense>
                <v-list-item
                  v-for="program, idx in currentEPG" :key="idx">
                  <v-list-tile v-model="program.now">
                    <v-list-tile-content>
                      <v-list-tile-title>{{program.title}}</v-list-tile-title>
                      <v-list-tile-sub-title v-text="program.date"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card-row>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <main>
      <div class="player fp-mute center-align"></div>
    </main>
  </v-app>
</template>

<script>
import flowplayer from 'flowplayer';
import engine from 'flowplayer-hlsjs';
import jQuery from 'jquery';
import Modernizr from 'modernizr';
import strftime from 'strftime';
import {mapState} from 'vuex';

import swf from 'flowplayer/dist/flowplayer.swf';
import swfHls from 'flowplayer/dist/flowplayerhls.swf';

import {categoryLink, channelLink} from '../route/link.js';

import config from '../../config.json5';

engine(flowplayer);

export default {
  props: ['channel'],
  name: 'hls-player',
  data() {
    return {
      engine: '',
      player: null,
      keybindings: [
        ['ESC', '返回列表'],
        ['+/-', '增减音量'],
        ['左右', '切换频道'],
        ['上下', '切换分类'],
        ['f', '切换全屏'],
        ['?', '查看帮助'],
        ['p', '查看节目列表'],
      ],
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
        case 'F': // keyIdentifier
        case 'U+0046': // keyIdentifier
        case 'f':
          this.player.fullscreen();
          break;
        case 'P': // keyIdentifier
        case 'U+0050': // keyIdentifier
        case 'p': {
          const $epgModel = jQuery('#epg-modal');
          $epgModel.modal($epgModel.hasClass('open') ? 'close' : 'open');
          break;
        }
        case 'QuestionMark': // KeyIdentifier
        case 'U+003F': // KeyIdentifier
        case '?': {
          const $helpModel = jQuery('#help-modal');
          $helpModel.modal($helpModel.hasClass('open') ? 'close' : 'open');
          break;
        }
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
    currentEPG() {
      const current = this.$store.state.epg[this.channel];
      if (current) {
        return current.map((program) => {
          return {
            date: strftime('%F', new Date(program.start * 1000)),
            start: strftime('%R', new Date(program.start * 1000)),
            stop: strftime('%R', new Date(program.stop * 1000)),
            title: program.title,
            now: program.start < this.now && program.stop > this.now,
          };
        });
      } else {
        return [];
      }
    },
    currentChannel() {
      return this.$store.getters.getChannel(this.channel) || {};
    },
    existedChannel() {
      return this.$store.getters.hasChannel(this.channel);
    },
    categoryIndex() {
      return this.channels.Categories.findIndex((category) => {
        return category.Name === this.currentChannel.Category;
      });
    },
    channelIndex() {
      const category = this.channels.Categories[this.categoryIndex];
      return category.Channels.findIndex((channel) => {
        return channel['Vid'] === this.channel;
      });
    },
    categoryLink() {
      const category = this.channels.Categories[this.categoryIndex];
      return category ? categoryLink(category) : {};
    },
    fallbackUrl() {
      if (!this.$store.getters.defaultCategory) {
        // no category to fallback
        return;
      }
      if (this.$store.getters.hasChannel(this.channel)) {
        // no need to fallback
        return;
      }
      return categoryLink(this.$store.getters.defaultCategory);
    },
    clip() {
      return {
        sources: [{
          type: 'application/x-mpegurl',
          src: `${config.hlsUrl}/${this.channel}.m3u8`,
        }],
      };
    },
    ...mapState([
      'now',
      'channels',
    ]),
  },
  created() {
    flowplayer((api) => {
      api.on('ready', (e, api, video) => {
        const engineName = api.engine.engineName;
        this.engine = engineName;
      });
      api.on('error', (e, api, error) => {
        if (error.code === 4) {
          // TODO: how about a 404 response?
          this.$emit('unauth');
        }
      });
      api.on('fullscreen', () => {
        if (Modernizr.lockorientation) {
          try {
            Modernizr.prefixed('lockOrientation', screen)('landscape');
          } catch(e) {
            console.warn('lockOrientation is not supported on this browser.');
            // the device does not support rotation
          }
        } else if (Modernizr.orientationlock) {
          screen.orientation.lock('landscape').catch(() => {
            console.warn('orientation.lock is not supported on this chrome.');
          });
        }
      });
      api.on('fullscreen-exit', () => {
        if (Modernizr.lockorientation) {
          Modernizr.prefixed('unlockOrientation', screen)('landscape');
        } else if (Modernizr.orientationlock) {
          screen.orientation.unlock();
        }
      });
    });
  },
  mounted() {
    this.player = flowplayer(this.$el.getElementsByClassName('player')[0], {
      autoplay: this.existedChannel,
      share: false,
      keyboard: false,
      chromecast: false,
      live: true,
      swf,
      swfHls,
      hlsjs: {
        xhrSetup: (xhr) => {
          xhr.withCredentials = true;
        },
      },
      clip: this.clip,
    });
    jQuery('.modal').modal();
    window.addEventListener('keydown', this.keyHandler);

    // as second screen
    if (navigator.presentation && navigator.presentation.receiver) {
      navigator.presentation.receiver.connectionList.then((list) => {
        list.connections.map((conn) => {
          conn.onmessage = (msg) => {
            let data = JSON.parse(msg.data);
            if (data.action === 'channel') {
              this.$router.push(channelLink(data.channel));
            }
            conn.send('ack');
          };
        });
      });
    }
  },
  watch: {
    clip(val) {
      this.player.load(val);
    },
    fallbackUrl(val) {
      if (val) {
        this.$router.push(val);
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyHandler);
    this.player.unload();
  },
};
</script>

<style scoped>
.page {
  height: 100vh;
}

.player-container {
  height: calc(100% - 56px);
}

@media only screen and (min-width: 601px) {
  .player-container {
    height: calc(100% - 64px);
  }
}

tr.current-program {
  background-color: #f2f2f2;
}
</style>
