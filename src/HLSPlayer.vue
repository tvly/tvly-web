<template>
  <div class="container">
    <div class="player"></div>
    <p>Engine: {{engine}}</p>
  </div>
</template>

<script>
import 'flowplayer/dist/skin/skin.css'
import flowplayer from 'flowplayer'
import engine from 'flowplayer-hlsjs'
engine(flowplayer)
import swf from 'flowplayer/dist/flowplayer.swf'
import swfHls from 'flowplayer/dist/flowplayerhls.swf'

export default {
  props: ['channel', 'channels'],
  name: 'hls-player',
  data() {
    return {
      engine: '',
    }
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
