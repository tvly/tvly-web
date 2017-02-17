<template>
  <div>
    <div class="card">
      <div class="card-image">
        <img src="http://thecatapi.com/api/images/get?format=src&type=jpg">
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
