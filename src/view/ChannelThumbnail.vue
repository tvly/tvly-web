<template>
  <div :class="{compact: !detail}">
    <div class="card hoverable">
      <div class="card-image" v-if="detail">
        <img :src="snapshot" @click="switchChannel" @error="$emit('noimage')" :alt="'Snapshot of ' + channel['Name']">
        <a @click="switchChannel" class="btn-floating halfway-fab pink"><i class="material-icons">play_arrow</i></a>
      </div>
      <div class="card-content" @click="switchChannel">
        <p class=“title”>{{channel['Name']}}</p>
      </div>
    </div>
  </div>
</template>

<script>

import {channelLink} from '../route/link.js';
import {now} from '../time.js';
import config from '../../config.json5';

/**
 * Generate time serial which increase one
 * every `config.snapshotRefreshInterval` seconds.
 * @return {number}
 */
function timeSerial() {
  return Math.floor(now() / config.snapshotRefreshInterval);
}

export default {
  name: 'channel-thumbnail',
  props: ['channel', 'detail'],
  data() {
    return {
      time: timeSerial(),
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
  methods: {
    switchChannel() {
      this.$emit('channel', this.channel);
    },
  },
  created() {
    if (config.snapshotRefreshInterval) {
      this.interval = window.setInterval(() => {
        this.time = timeSerial();
      });
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
