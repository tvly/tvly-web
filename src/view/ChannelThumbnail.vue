<template>
  <div :class="{compact: !detail}">
    <div class="card" :class="{hoverable: detail}">
      <div class="card-image" v-if="detail">
        <img :src="snapshot" @click="switchChannel" @error="$emit('noimage')" :alt="'Snapshot of ' + channel['Name']">
        <a @click="switchChannel" class="btn-floating halfway-fab"><i class="material-icons">play_arrow</i></a>
      </div>
      <div class="card-content" @click="switchChannel">
        <p class="title">{{channel.Name}}</p>
        <p v-if="currentProgram">{{currentProgram.title}}</p>
      </div>
    </div>
  </div>
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

<style scoped type="scss">
.title {
  font-size: 13px;
}

div.compact {
  padding: 0px;

  div.card {
    margin: 0.5px;
    border: 1px;
  }
}

div.card {
  cursor: pointer;

  div.card-content {
    padding: 11px;
    min-height: 70px;
  }
}
</style>
