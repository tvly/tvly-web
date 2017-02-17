<template>
  <div>
    <div class="card">
      <div class="card-image">
        <img :src="snapshot">
        <span class="card-title">{{channel['Name']}}</span>
      </div>
      <div class="card-action">
        <router-link :to="channelLink">Play</router-link>
      </div>
    </div>
  </div>
</template>

<script>
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
