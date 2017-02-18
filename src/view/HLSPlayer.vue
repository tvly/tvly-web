<template>
  <div>
    <nav>
      <div class="nav-wrapper">
        <a href="#"  class="button-collapse" style="display: block" @click.prevent="$router.go(-1)">
          <i class="material-icons">arrow_back</i>
        </a>
        <a class="brand-logo center">{{title}}<span v-if="engine.length" class="badge green">{{engine}}</span></a>
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
    }
  },
  methods: {
    keyHandler(event) {
      if (event.key === 'Escape') {
        this.$router.go(-1)
      } else if (event.key === 'ArrowLeft' || event.key === 'h') {
        this.switchChannel(-1)
      } else if (event.key === 'ArrowRight' || event.key === 'l') {
        this.switchChannel(1)
      } else if (event.key === 'ArrowUp' || event.key === 'k') {
        this.switchCategory(-1)
      } else if (event.key === 'ArrowDown' || event.key === 'j') {
        this.switchCategory(1)
      } else {
        console.log(`Unkown key event: ${event.key}(${event.keyIdentifier})`)
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
    title() {
      const category = this.channels.Categories[this.categoryIndex]
      const channel = category.Channels[this.channelIndex]
      return channel.Name
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
  mounted() {
    flowplayer((api) => {
      api.on('ready', (e, api, video) => {
        const engineName = api.engine.engineName
        this.engine = engineName
      })
    })

    flowplayer(this.$el.getElementsByClassName('player')[0], {
      autoplay: true,
      share: false,
      swf,
      swfHls,
      clip: this.clip,
    })
    window.addEventListener('keyup', this.keyHandler)
  },
  updated() {
    const player = flowplayer(this.$el.getElementsByClassName('player')[0])
    player.load(this.clip)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyHandler)
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
