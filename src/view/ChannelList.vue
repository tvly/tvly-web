<template>
  <div class="container">
    <transition-group appear tag="div" name="channel-list" class="row" id="list">
      <channel-thumbnail
        v-for="c in filteredList"
        class="col l4 m6 s12 channel-list-item"
        :channel="c" :key="c.Vid" :detail="detail"
        @channel="$emit('channel', $event)"
        @noimage="$emit('noimage', $event)"></channel-thumbnail>
    </transition-group>
  </div>
</template>

<script>
import fuzzy from 'fuzzy';

import {categoryLink} from '../route/link.js';

import ChannelThumbnail from './ChannelThumbnail.vue';

export default {
  name: 'channel-list',
  props: ['filter', 'detail', 'category'],
  components: {
    ChannelThumbnail,
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

<style scoped>
.channel-list-enter, .channel-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.channel-list-item {
  transition: all .5s ease;
}
</style>
