<template>
  <div>
    <div class="card">
      <div class="card-image">
        <img :src="snapshot" @click="$router.push(channelLink)">
        <router-link :to="channelLink" class="btn-floating halfway-fab pink"><i class="material-icons">play_arrow</i></router-link>
      </div>
      <div class="card-content">
        <p class=“title”>{{channel['Name']}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import 'material-design-icons/iconfont/material-icons.css';

import {channelLink} from '../route/link.js';

export default {
  name: 'channel-thumbnail',
  props: ['channel'],
  computed: {
    snapshot() {
      return `//iptv.tsinghua.edu.cn/snapshot/${this.channel['Vid']}.jpg`;
    },
    channelLink() {
      return channelLink(this.channel);
    },
  },
};
</script>

<style scoped>
.btn-floating:hover {
  transform: scale(1.1, 1.1);
  transform-origin: 20% -300%;
}
title {
  font-size: 13px;
}
div.card-content {
  padding: 21px;
}
</style>
