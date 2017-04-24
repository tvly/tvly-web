<template>
  <div :class="{compact: !detail}">
    <div class="card">
      <div class="card-image" v-if="detail">
        <img :src="snapshot" @click="$router.push(channelLink)" @error="$emit('noimage')" :alt="'Snapshot of ' + channel['Name']">
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
import config from '../../config.json5';

export default {
  name: 'channel-thumbnail',
  props: ['channel', 'detail'],
  data() {
    return {
      time: Date.now(),
      interval: null,
    };
  },
  computed: {
    snapshot() {
      return `${config.snapshotUrl}/${this.channel['Vid']}.jpg?${this.time}`;
    },
    channelLink() {
      return channelLink(this.channel);
    },
  },
  created() {
    if (config.snapshotRefreshInterval) {
      this.interval = window.setInterval(() => {
        this.time = Date.now();
      }, config.snapshotRefreshInterval * 1000);
    }
  },
  destroyed() {
    if (this.interval !== null) {
      window.clearInterval(this.interval);
    }
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
