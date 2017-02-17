<template>
  <div>
    <nav>
      <div class="nav-wrapper">
        <a href="#" class="button-collapse" style="display: block"><i class="material-icons">arrow_back</i></a>
        <a class="brand-logo center">{{title}}<span class="badge green">{{engine}}</span></a>
      </div>
    </nav>
    <div class="player"></div>
    <iptv-footer></iptv-footer>
  </div>
</template>

<script>
import 'material-design-icons/iconfont/material-icons.css'
import 'flowplayer/dist/skin/skin.css'
import IPTVFooter from './IPTVFooter.vue'
import flowplayer from 'flowplayer'
import engine from 'flowplayer-hlsjs'
engine(flowplayer)
import swf from 'flowplayer/dist/flowplayer.swf'
import swfHls from 'flowplayer/dist/flowplayerhls.swf'

export default {
  props: ['channel', 'channels'],
  components: {
    'iptv-footer': IPTVFooter,
  },
  name: 'hls-player',
  data() {
    return {
      engine: '',
    }
  },
  computed: {
    title() {
      for (const category of this.channels['Categories']) {
        for (const c of category['Channels']) {
          if (c['Vid'] === this.channel) {
            return c['Name']
          }
        }
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

<style>
.flowplayer {
   margin-top: 10px;
   max-width: 70%;
   left: 50%;
   transform: translate(-50%, 0)
}
</style>
