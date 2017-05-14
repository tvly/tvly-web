<template>
  <v-card hover>
    <v-card-row v-if="detail" height="auto">
      <img :src="snapshot"/>
    </v-card-row>
    <v-card-text class="channel">
      <p class="title">{{channel.Name}}</p>
      <p v-if="currentProgram">{{currentProgram.title}}</p>
    </v-card-text>
    <v-card-row actions>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon class="blue--text" @click.native="$router.push(channelLink)">play_arrow</v-icon>
      </v-btn>
    </v-card-row>
  </v-card>
</template>

<script>
import {mapState} from 'vuex';

import {channelLink} from '../route/link.js';
import config from '../../config.json5';

export default {
  name: 'channel-thumbnail',
  props: ['channel', 'detail'],
  data() {
    return {
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
    time() {
      return Math.floor(this.now / config.snapshotRefreshInterval);
    },
    currentProgram() {
      const programs = this.$store.state.epg[this.channel.Vid];
      if (programs) {
        return programs.find((p) => p.start < this.now && p.stop > this.now);
      }
    },
    ...mapState([
      'now',
    ]),
  },
  methods: {
    switchChannel() {
      this.$emit('channel', this.channel);
    },
  },
};
</script>

<style scoped>
img {
  width: 100%;
}

p.title {
  font-size: 13px;
}

.channel {
  min-height: 80px;
  padding: 9px;
}
</style>
