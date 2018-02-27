<template>
  <div :class="{compact: !detail}">
    <div
      :class="{'z-depth-5': selected}"
      class="card">
      <div
        v-if="detail"
        class="card-image">
        <img
          :src="snapshot"
          :alt="'Snapshot of ' + channel['Name']"
          @click="switchChannel">
        <a
          class="btn-floating halfway-fab"
          @click="switchChannel">
          <i class="material-icons">play_arrow</i>
        </a>
      </div>
      <div
        class="card-content"
        @click="switchChannel">
        <p class="title">
          {{ channel.Name }}
          <span
            v-if="hasChannelViewers"
            class="viewers">
            <i class="material-icons">remove_red_eye</i>
            {{ viewers }}
          </span>
        </p>
        <p
          v-if="currentProgram"
          class="program-title">{{ currentProgram.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import format from 'string-template';

import {channelLink} from '../route/link.js';
import config from '../../config.json5';

export default {
  name: 'ChannelThumbnail',
  props: {
    channel: Object,
    detail: Boolean,
    selected: Boolean,
    category: String,
  },
  data() {
    return {
      interval: null,
      hasChannelViewers: !!config.channelViewersUrl,
    };
  },
  computed: {
    snapshot() {
      const template = (this.channel.SnapshotUrlTemplate
        || (this.category &&
            this.$store.getters.getCategory(this.category).SnapshotUrlTemplate)
        || config.defaultSnapshotUrlTemplate);
      return `${format(template, this.channel)}?${this.time}`;
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
