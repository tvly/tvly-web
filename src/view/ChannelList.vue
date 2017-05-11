<template>
  <div class="container">
    <div class="row" id="list">
      <div class="col s12 cards-container"
        :style="{'column-count': columns}">
        <channel-thumbnail
          v-for="c in filteredList"
          :channel="c" :key="c.Vid" :detail="detail"
          class="card-item"
          @channel="$emit('channel', $event)"
          @noimage="$emit('noimage', $event)"></channel-thumbnail>
      </div>
    </div>
  </div>
</template>

<script>
import fuzzy from 'fuzzy';

import {categoryLink} from '../route/link.js';

import ChannelThumbnail from './ChannelThumbnail.vue';

export default {
  name: 'channel-list',
  props: ['filter', 'detail', 'category'],
  data() {
    return {
      windowWidth: document.documentElement.clientWidth,
    };
  },
  components: {
    ChannelThumbnail,
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  computed: {
    channelList() {
      return this.$store.getters.channelList(this.category);
    },
    filteredList() {
      return this.channelList.filter((channel) => {
        return (!this.filter.length ||
                fuzzy.test(this.filter, channel.Name) ||
                fuzzy.test(this.filter, channel.Vid));
      });
    },
    fallbackUrl() {
      if (!this.$store.getters.defaultCategory) {
        // no category to fallback
        return;
      }
      if (this.$store.getters.hasCategory(this.category)) {
        // no need to fallback
        return;
      }
      return categoryLink(this.$store.getters.defaultCategory);
    },
    columns() {
      if (this.windowWidth < 601) {
        return 1;
      } else if (this.windowWidth < 992) {
        return 2;
      } else if (this.windowWidth < 1440) {
        return 3;
      } else if (this.windowWidth < 2000) {
        return 4;
      } else {
        return 6;
      }
    },
  },
  methods: {
    resizeHandler(event) {
      this.windowWidth = document.documentElement.clientWidth;
    },
  },
  watch: {
    fallbackUrl(val) {
      if (val) {
        this.$router.push(val);
      }
    },
  },
};
</script>

<style>
.card-item {
  display: inline-block;
  width: 100%;
}
</style>
