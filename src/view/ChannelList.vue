<template>
  <div class="container">
    <transition-group
      id="list"
      tag="div"
      appear
      name="channel-list"
      mode="out-in"
      class="row">
      <channel-thumbnail
        v-for="(c, index) in filteredList"
        :channel="c"
        :category="category"
        :key="c.Vid"
        :detail="detail"
        :selected="selectedChannel === c"
        class="col l4 m6 s12 channel-list-item"
        @hover="selected = index"
        @channel="$emit('channel', $event)"/>
    </transition-group>
  </div>
</template>

<script>
import fuzzy from 'fuzzy';
import {mapGetters} from 'vuex';
import {debounce} from 'underscore';

window.noZensmooth = true;
import zenscroll from 'zenscroll';

import {categoryLink} from '../route/link.js';

import ChannelThumbnail from './ChannelThumbnail.vue';

// set edgeOffset of zenroll to zero
zenscroll.setup(null, 0);

export default {
  name: 'ChannelList',
  components: {
    ChannelThumbnail,
  },
  props: {
    filter: String,
    detail: Boolean,
    category: String,
  },
  data() {
    return {
      selected: 0,
    };
  },
  computed: {
    selectedElement() {
      return this.$el.querySelector(
        `.channel-list-item:nth-child(${this.selected + 1})`);
    },
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
    categoryIndex() {
      // if category is null, then when are in 'star' page
      return this.category ? this.channels.Categories.findIndex(
        (category) => category.Name === this.category
      ) : this.channels.Categories.length;
    },
    ...mapGetters([
      'channels',
    ]),
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
        zenscroll.toY(0);
      } else if (val === this.filteredList.length) {
        zenscroll.toY(document.documentElement.scrollHeight);
      } else {
        zenscroll.intoView(this.selectedElement);
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.keyHandler);
    window.addEventListener('scroll', this.scrollHandler);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keyHandler);
    window.removeEventListener('scroll', this.scrollHandler);
  },
  methods: {
    toCategory(index) {
      let target;
      if (index < this.channels.Categories.length) {
        target = categoryLink(this.channels.Categories[index]);
      } else if (index === this.channels.Categories.length) {
        target = {name: 'star'};
      } else {
        target = {name: 'program'};
      }
      this.$router.push(target);
    },
    scrollHandler: debounce(function(event) {
      /* eslint-disable no-invalid-this */
      if (this.selectedElement) {
        const rect = this.selectedElement.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          // no need to find no selected element
          return;
        }
      }
      const switchTo = Array.prototype.findIndex.call(
        this.$el.querySelectorAll('.channel-list-item'),
        (el) => el.getBoundingClientRect().top >= 0);
      if (switchTo >= 0) {
        this.selected = switchTo;
      } else {
        this.selected = this.filteredList.length - 1;
      }
      /* eslint-enable no-invalid-this */
    }, 200),
    keyHandler(event) {
      let captured = true;
      // workaround for safari
      switch (event.key || event.keyIdentifier) {
        case 'Left': // keyIdentifier
        case 'H': // keyIdentifier
        case 'U+0048': // keyIdentifier
        case 'ArrowLeft':
        case 'h':
        case 'ChannelDown':
          this.selected = Math.max(this.selected - 1, -1);
          break;
        case 'Right': // keyIdentifier
        case 'L': // keyIdentifier
        case 'U+004C': // keyIdentifier
        case 'ArrowRight':
        case 'l':
        case 'ChannelUp':
          this.selected = Math.min(this.selected + 1,
            this.filteredList.length);
          break;
        case 'Up': // keyIdentifier
        case 'K': // keyIdentifier
        case 'U+004B': // keyIdentifier
        case 'ArrowUp':
        case 'k':
          this.toCategory(Math.max(0, this.categoryIndex - 1));
          break;
        case 'Down': // keyIdentifier
        case 'J': // keyIdentifier
        case 'U+004A': // keyIdentifier
        case 'ArrowDown':
        case 'j':
          this.toCategory(
            Math.min(this.channels.Categories.length, this.categoryIndex + 1));
          break;
        case 'Enter':
        case 'Spacebar': // keyIdentifier
        case 'U+0020': // keyIdentifier
        case ' ':
        case 'MediaPlayPause':
        case 'Unidentified': // XXX: Assumed to be enter
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
