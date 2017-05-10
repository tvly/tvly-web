<template>
  <div class="container">
    <div class="collection">
      <router-link
        v-for="program in filteredCurrentPrograms"
        v-if="program"
        :key="program.channel"
        class="collection-item"
        :to="{name:'play', params: {channel: program.channel}}">
        {{ program.title }}
      </router-link>
    </div>
  </div>
</template>

<script>
import fuzzy from 'fuzzy';
import {now} from '../time.js';

import config from '../../config.json5';

export default {
  name: 'program-list',
  data() {
    return {
      programList: {},
      now: now(),
      interval: null,
    };
  },
  props: ['filter', 'channelList'],
  created() {
    window.fetch(config.epgUrl, {
      mode: 'cors',
      credentials: 'include',
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    }).then((programList) => {
      this.programList = programList;
    });
    this.interval = setInterval(() => {
      this.now = now();
    }, 10 * 1000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  computed: {
    currentPrograms() {
      return Object.entries(this.programList).map(([channel, programs]) => {
        const currentProgram = programs.find((program) => {
          return program.start < this.now && program.stop > this.now;
        });
        if (currentProgram) {
          currentProgram.channel = channel;
          return currentProgram;
        }
      });
    },
    filteredCurrentPrograms() {
      return this.currentPrograms.filter((program) => {
        return program && (!this.filter.length ||
          fuzzy.test(this.filter, program.channel) ||
          fuzzy.test(this.filter, program.title));
      });
    },
  },
};
</script>
