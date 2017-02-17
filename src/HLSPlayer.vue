<template>
  <div class="container">
    <div class="player"></div>
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
  mounted() {
    console.log(this.$el.childNodes[0])
    flowplayer(this.$el.childNodes[0], {
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
