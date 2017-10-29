<template>
  <div :class="{compact: !detail}">
    <div class="card" :class="{hoverable: detail}">
      <div class="card-image" v-if="detail">
        <img :src="snapshot" @click="switchChannel" @error="$emit('noimage')" :alt="'Snapshot of ' + channel['Name']">
        <a @click="switchChannel" class="btn-floating halfway-fab"><i class="material-icons">play_arrow</i></a>
      </div>
      <div class="card-content" @click="switchChannel">
        <p class="title">
          {{channel.Name}}
          <span class="viewers">
            <i class="material-icons" v-if="hasChannelViewers">remove_red_eye</i>
            {{viewers}}
          </span>
        </p>
        <p class="program-title" v-if="currentProgram">{{currentProgram.title}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

import {channelLink} from '../route/link.js';
import config from '../../config.json5';

export default {
  name: 'channel-thumbnail',
  props: ['channel', 'detail'],
  data() {
    return {
      interval: null,
      hasChannelViewers: !!config.channelViewersUrl,
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
    viewers() {
      return this.getViewers(this.channel.Vid);
    },
    ...mapState([
      'now',
    ]),
    ...mapGetters([
      'getViewers',
    ]),
  },
  methods: {
    switchChannel() {
      this.$emit('channel', this.channel);
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  font-size: 13px;
}

p.program-title {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

span.viewers {
  .material-icons {
    font-size: 11px;
    margin-left: 20px;
    margin-right: 4px;
  }
}
</style>
