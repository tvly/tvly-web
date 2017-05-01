<template>
  <div class="container">
    <div class="row" id="list">
      <channel-thumbnail
        v-for="c in filteredList"
        class="col l4 m6 s12"
        :channel="c" :key="c.Vid" :detail="detail"
        @channel="$emit('channel', $event)"
        @noimage="$emit('noimage', $event)"></channel-thumbnail>
    </div>
  </div>
</template>

<script>
import fuzzy from 'fuzzy';

import ChannelThumbnail from './ChannelThumbnail.vue';

export default {
  name: 'channel-list',
  props: ['filter', 'channelList', 'detail'],
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
  },
};
</script>
