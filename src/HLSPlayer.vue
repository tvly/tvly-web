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

export default {
  props: ['channel', 'channels'],
  name: 'hls-player',
  mounted() {
    console.log(this.$el.childNodes[0])
    flowplayer(this.$el.childNodes[0], {
      clip: {
        sources: [{
          type: 'application/x-mpegurl',
          src: '//stream.flowplayer.org/bauhaus.m3u8',
        }],
      },
      debug: true,
    })
  },
}
</script>
