<template>
  <v-list two-line>
    <v-list-item
      v-for="program in filteredCurrentPrograms"
      v-if="program && channelMap[program.channel]"
      :key="program.channel">
      <v-list-tile avatar router
        :href="{name:'play', params: {channel: program.channel}}">
        <v-list-tile-content>
          <v-list-tile-title>{{program.title}}</v-list-tile-title>
          <v-list-tile-sub-title>{{channelMap[program.channel].Name}}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list-item>
  </v-list>
</template>

<script>
import fuzzy from 'fuzzy';
import {mapState, mapGetters} from 'vuex';

export default {
  name: 'program-list',
  props: ['filter'],
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
    ...mapGetters([
      'channelMap',
    ]),
  },
};
</script>
