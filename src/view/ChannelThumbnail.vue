<template>
  <div :class="{compact: !detail}">
    <div class="card">
      <div class="card-image" v-if="detail">
        <img :src="snapshot" @click="$router.push(channelLink)" @error="$emit('unauth')" :alt="'Snapshot of ' + channel['Name']">
        <router-link :to="channelLink" class="btn-floating halfway-fab pink"><i class="material-icons">play_arrow</i></router-link>
      </div>
      <div class="card-content" @click="$router.push(channelLink)">
        <p class=“title”>{{channel['Name']}}</p>
      </div>
    </div>
  </div>
</template>

<script>

import {channelLink} from '../route/link.js';

export default {
  name: 'channel-thumbnail',
  props: ['channel', 'detail'],
  computed: {
    snapshot() {
      return `https://iptv.tsinghua.edu.cn/snapshot/${this.channel['Vid']}.jpg`;
    },
    channelLink() {
      return channelLink(this.channel);
    },
  },
};
</script>

<style scoped>
title {
  font-size: 13px;
}
div.card-content {
  padding: 21px;
}
div.compact div.card {
  margin: 0.5px;
  border: 1px;
}
div.compact {
  padding: 0px;
}
div.card {
  cursor: pointer;
}
</style>
