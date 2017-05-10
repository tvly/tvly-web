<template>
  <div class="container">
    <table class="highlight">
      <thead>
        <tr>
          <th>标题</th>
          <th>频道</th>
        </tr>
      </thead>

      <tbody
        v-for="program in filteredCurrentPrograms"
        v-if="program"
        :key="program.channel"
        @click="$router.push({name:'play', params: {channel: program.channel}})">
        <tr>
          <td>{{program.title}}</td>
          <td>{{ channelMap[program.channel] }}</td>
        </tr>
      </tbody>
    </table>
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
  props: ['filter', 'channelList', 'channelMap'],
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
