<template>
  <div>
    <nav>
      <div class="nav-wrapper">
        <router-link :to="categoryLink" class="button-collapse" style="display: block"><i class="material-icons">arrow_back</i></router-link>
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

import { categoryLink } from '../route/link.js'

export default {
  props: ['channel', 'channels'],
  name: 'hls-player',
  data() {
    return {
      engine: '',
    }
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
      clip: {
        live: true,
        sources: [{
          type: 'application/x-mpegurl',
          src: `//iptv.tsinghua.edu.cn/hls/${this.channel}.m3u8`,
        }],
      },
    })
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
