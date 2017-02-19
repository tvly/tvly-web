<template>
  <div>
    <nav>
      <div class="nav-wrapper">
        <a href="#"  class="button-collapse" style="display: block" @click.prevent="$router.go(-1)">
          <i class="material-icons">arrow_back</i>
        </a>
        <a class="brand-logo center">{{categoryTitle}}/{{channelTitle}}<span v-if="engine.length" class="badge green">{{engine}}</span></a>
      </div>
    </nav>
    <div class="player fp-mute"></div>
  </div>
</template>

<script>
import 'material-design-icons/iconfont/material-icons.css'
import 'flowplayer/dist/skin/skin.css'
import flowplayer from 'flowplayer'
import engine from 'flowplayer-hlsjs'
engine(flowplayer)
import swf from 'flowplayer/dist/flowplayer.swf'
import swfHls from 'flowplayer/dist/flowplayerhls.swf'

import { categoryLink, channelLink } from '../route/link.js'

export default {
  props: ['channel', 'channels'],
  name: 'hls-player',
  data() {
    return {
      engine: '',
      player: null,
    }
  },
  methods: {
    keyHandler(event) {
      let captured = true
      // workaround for safari
      switch(event.key || event.keyIdentifier) {
        case 'Esc': // keyIdentifier
        case 'Escape':
          this.$router.go(-1)
          break
        case 'Left': // keyIdentifier
        case 'H': // keyIdentifier
        case 'ArrowLeft':
        case 'h':
          this.switchChannel(-1)
          break
        case 'Right': // keyIdentifier
        case 'L': // keyIdentifier
        case 'ArrowRight':
        case 'l':
          this.switchChannel(1)
          break
        case 'Up': // keyIdentifier
        case 'K': // keyIdentifier
        case 'ArrowUp':
        case 'k':
          this.switchCategory(-1)
          break
        case 'Down': // keyIdentifier
        case 'J': // keyIdentifier
        case 'ArrowDown':
        case 'j':
          this.switchCategory(1)
          break
        case 'Plus': // keyIdentifier
        case '+':
          this.player.volume(Math.min(this.player.volumeLevel + 0.1, 1))
          break
        case 'HyphenMinus': // keyIdentifier
        case '-':
          this.player.volume(Math.max(this.player.volumeLevel - 0.1, 0))
          break
        default:
          captured = false
          console.log(`Unkown key event: ${event.key}(${event.keyIdentifier})`,
                      event)
      }
      if (captured) {
        event.preventDefault()
      }
    },
    switchChannel(offset) {
      const currentCategory = this.channels.Categories[this.categoryIndex]
      const nextChannelIndex = this.channelIndex + offset
      if (nextChannelIndex >= 0 &&
            nextChannelIndex < currentCategory.Channels.length) {
        this.$router.replace(
          channelLink(currentCategory.Channels[nextChannelIndex]))
      }
    },
    switchCategory(offset) {
      const categories = this.channels.Categories
      const nextCategoryIndex = this.categoryIndex + offset
      if (nextCategoryIndex >= 0 &&
            nextCategoryIndex < categories.length) {
        const category = categories[nextCategoryIndex]
        this.$router.replace(
          channelLink(category.Channels[0]))
      }
    },
  },
  computed: {
    categoryIndex() {
      return this.channels.Categories.findIndex((category) => {
        return category.Channels.findIndex((channel) => {
          return channel['Vid'] === this.channel
        }) !== -1
      })
    },
    channelIndex() {
      const category = this.channels.Categories[this.categoryIndex]
      return category.Channels.findIndex((channel) => {
        return channel['Vid'] === this.channel
      })
    },
    channelTitle() {
      const category = this.channels.Categories[this.categoryIndex]
      const channel = category.Channels[this.channelIndex]
      return channel.Name
    },
    categoryTitle() {
      const category = this.channels.Categories[this.categoryIndex]
      return category.Name
    },
    categoryLink() {
      const category = this.channels.Categories[this.categoryIndex]
      return categoryLink(category)
    },
    clip() {
      return {
        live: true,
        sources: [{
          type: 'application/x-mpegurl',
          src: `//iptv.tsinghua.edu.cn/hls/${this.channel}.m3u8`,
        }],
      }
    },
  },
  created() {
    flowplayer((api) => {
      api.on('ready', (e, api, video) => {
        const engineName = api.engine.engineName
        this.engine = engineName
      })
    })
  },
  mounted() {
    this.player = flowplayer(this.$el.getElementsByClassName('player')[0], {
      autoplay: true,
      share: false,
      keyboard: false,
      swf,
      swfHls,
      clip: this.clip,
    })
    window.addEventListener('keydown', this.keyHandler)
  },
  updated() {
    this.player.load(this.clip)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyHandler)
  },
}
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
