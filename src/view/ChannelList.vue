<template>
  <div class="container">
    <div class="row" id="list">
      <div class="col s12 cards-container">
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
  props: ['filter', 'channelList', 'detail', 'category'],
  components: {
    ChannelThumbnail,
  },
  computed: {
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

<style>
@media only screen and (max-width: 601px) {
  .cards-container {
    column-count: 1;
  }
}
@media only screen and (min-width: 601px) and (max-width: 992px) {
  .cards-container {
    column-count: 2;
  }
}
@media only screen and (min-width: 992px) and (max-width: 1440px) {
  .cards-container {
    column-count: 3;
  }
}
@media only screen and (min-width: 1440px) {
  .cards-container {
    column-count: 4;
  }
}
.card-item {
  display: inline-block;
  width: 100%;
}
</style>
