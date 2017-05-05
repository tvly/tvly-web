<template>
  <div class="container">
    <div class="collection">
      <router-link v-for="program in currentPrograms" v-if="program" class="collection-item" :to="{name:'play', params: {channel: program.channel}}">
        {{ program.title }}
      </router-link>
    </div>
  </div>
</template>

<script>
import config from '../../config.json5';

export default {
  name: 'program-list',
  data() {
    return {
      programList: {},
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
  },
  computed: {
    currentPrograms() {
      // TODO: now should be updated regularly
      const now = Math.floor(Date.now() / 1000);
      return Object.entries(this.programList).map(([channel, programs]) => {
        const currentProgram = programs.find((program) => {
          return program.start < now && program.stop > now;
        });
        if (currentProgram) {
          currentProgram.channel = channel;
          return currentProgram;
        }
      });
    },
  },
};
</script>
