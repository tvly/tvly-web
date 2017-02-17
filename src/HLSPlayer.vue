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
      console.log(this)
      api.on('ready', (e, api, video) => {
        const engineName = api.engine.engineName
        console.log(this)
        console.log(engineName)
        console.log('===>', engineName)
        this.engine = engineName
      })
    })

    flowplayer(this.$el.getElementsByClassName('player')[0], {
      swf,
      swfHls,
      clip: {
        sources: [{
          type: 'application/x-mpegurl',
          src: '//edge.flowplayer.org/FlowplayerHTML5forWordPress.m3u8',
        }],
      },
      debug: true,
    })
  },
}
</script>
