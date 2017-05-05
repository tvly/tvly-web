<template>
  <div class="container">
    <ul class="collection">
      <li v-for="program in programList" class="collection-item">
      </li>
    </ul>
  </div>
</template>

<script>
import config from '../../config.json5';

export default {
  name: 'program-list',
  data() {
    return {
      programList: [],
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
      console.warn(programList);
    });
  },
};
</script>
