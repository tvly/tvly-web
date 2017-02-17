<template>
  <div>
    <div class="card">
      <div class="card-image">
        <img :src="snapshot">
        <router-link :to="channelLink" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">play_arrow</i></router-link>
      </div>
      <div class="card-content">
        <p>{{channel['Name']}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import 'material-design-icons/iconfont/material-icons.css'

export default {
  name: 'channel-thumbnail',
  props: ['channel'],
  computed: {
    snapshot() {
      return `https://iptv.tsinghua.edu.cn/snapshot/${this.channel['Vid']}.jpg`
    },
    channelLink() {
      return {
        name: 'play',
        params: {
          channel: this.channel['Vid'],
        },
      }
    },
  },
}
</script>
