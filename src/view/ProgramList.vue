<template>
  <div class="container">
    <table class="highlight">
      <thead>
        <tr>
          <th>标题</th>
          <th>频道</th>
          <th v-if="hasChannelViewers">观众</th>
        </tr>
      </thead>

      <tbody
        v-for="program in sortedCurrentPrograms"
        v-if="program && channelMap[program.channel]"
        :key="program.channel"
        @click="switchChannel(program.channel)">
        <tr>
          <td>{{program.title}}</td>
          <td>{{channelMap[program.channel].Name}}</td>
          <td v-if="hasChannelViewers">{{program.viewers}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import fuzzy from 'fuzzy';
import {mapState, mapGetters} from 'vuex';
import {channelLink} from '../route/link.js';
import config from '../../config.json5';

export default {
  name: 'program-list',
  props: ['filter'],
  data() {
    return {
      hasChannelViewers: !!config.channelViewersUrl,
    };
  },
  methods: {
    switchChannel(channel) {
      // TODO: 2nd screen
      this.$router.push(channelLink(channel, this.$route.name));
    },
  },
  computed: {
    currentPrograms() {
      const programs = this.$store.state.epg;
      return Object.entries(programs).map(([channel, programs]) => {
        const currentProgram = programs.find((program) => {
          return program.start < this.now && program.stop > this.now;
        });
        if (currentProgram) {
          currentProgram.channel = channel;
          currentProgram.viewers = this.getViewers(channel);
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
    sortedCurrentPrograms() {
      return this.filteredCurrentPrograms.sort((a, b) => {
        return (this.hasChannelViewers && a.viewers - b.viewers)
          || a.channel.localeCompare(b.channel);
      });
    },
    ...mapState([
      'now',
    ]),
    ...mapGetters([
      'channelMap',
      'getViewers',
    ]),
  },
};
</script>
