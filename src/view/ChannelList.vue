<template>
  <div class="container">
    <transition-group tag="div"
      appear name="channel-list" mode="out-in"
      class="row" id="list">
      <channel-thumbnail
        v-for="c in filteredList"
        class="col l4 m6 s12 channel-list-item"
        :channel="c" :key="c.Vid" :detail="detail"
        :class="{selected: selectedChannel === c}"
        @channel="$emit('channel', $event)"
        @noimage="$emit('noimage', $event)"></channel-thumbnail>
    </transition-group>
  </div>
</template>

<script>
import fuzzy from 'fuzzy';

import {categoryLink} from '../route/link.js';
import {ensureVisible} from '../dom.js';

import ChannelThumbnail from './ChannelThumbnail.vue';

export default {
  name: 'channel-list',
  props: ['filter', 'detail', 'category'],
  data() {
    return {
      selected: 0,
    };
  },
  components: {
    ChannelThumbnail,
  },
  mounted() {
    window.addEventListener('keydown', this.keyHandler);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyHandler);
  },
  methods: {
    keyHandler(event) {
      let captured = true;
      // workaround for safari
      switch (event.key || event.keyIdentifier) {
        case 'Left': // keyIdentifier
        case 'H': // keyIdentifier
        case 'U+0048': // keyIdentifier
        case 'ArrowLeft':
        case 'h':
          this.selected = Math.max(this.selected - 1, -1);
          break;
        case 'Right': // keyIdentifier
        case 'L': // keyIdentifier
        case 'U+004C': // keyIdentifier
        case 'ArrowRight':
        case 'l':
          this.selected = Math.min(this.selected + 1,
            this.filteredList.length);
          break;
        case 'Enter':
        case ' ':
          if (this.selectedChannel) {
            this.$emit('channel', this.selectedChannel);
          }
          break;
        default:
          captured = false;
          console.warn(`Unkown key event: ${event.key}(${event.keyIdentifier})`,
                       event);
      }
      if (captured) {
        event.preventDefault();
      }
    },
  },
  computed: {
    channelList() {
      if (this.$route.name === 'channel') {
        return this.$store.getters.channelList(this.category);
      } else {
        return this.$store.getters.starredChannels;
      }
    },
    filteredList() {
      return this.channelList.filter((channel) => {
        return (!this.filter ||
                fuzzy.test(this.filter, channel.Name) ||
                fuzzy.test(this.filter, channel.Vid));
      });
    },
    selectedChannel() {
      if (this.selected >= 0 && this.selected < this.filteredList.length) {
        return this.filteredList[this.selected];
      } else {
        return null;
      }
    },
    fallbackUrl() {
      if (this.$route.name !== 'channel') {
        // not in channel view
        return;
      } else if (!this.$store.getters.defaultCategory) {
        // no category to fallback
        return;
      } else if (this.$store.getters.hasCategory(this.category)) {
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
    filteredList() {
      this.selected = 0;
    },
    selected(val) {
      if (val < 0) {
        window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
      } else if (val === this.filteredList.length) {
        window.scrollTo({left: 0, top: document.body.scrollHeight,
          behavior: 'smooth'});
      } else {
        const selector = `.channel-list-item:nth-child(${this.selected + 1})`;
        const selectedElement = this.$el.querySelector(selector);
        if (selectedElement) {
          ensureVisible(selectedElement);
        }
      }
    },
  },
};
</script>

<style scoped>
.channel-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.channel-list-enter {
  opacity: 0;
  transform: translateY(-30px);
}

.channel-list-item {
  transition: all .5s ease;
}

.channel-list-enter-active {
  transition: all .5s ease .5s;
}

.channel-list-leave-active {
  transition: all .5s ease;
}
</style>
