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
import {mapState} from 'vuex';

export default {
  name: 'program-list',
  props: ['filter', 'channelMap'],
  computed: {
    currentPrograms() {
      const programs = this.$store.state.epg;
      return Object.entries(programs).map(([channel, programs]) => {
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
    ...mapState([
      'now',
    ]),
  },
};
</script>
