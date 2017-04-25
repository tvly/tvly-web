<template>
  <a @click="connect">
    <i v-if class="material-icons">
      {{ icon }}
    </i>
  </a>
</template>

<script>
export default {
  name: 'cast-controller',
  data() {
    return {
      connection: null,
      connected: false,
    };
  },
  computed: {
    icon() {
      if (this.connected) {
        return 'cast_connected';
      } else {
        return 'cast';
      }
    },
  },
  methods: {
    connect() {
      let request = new window.PresentationRequest(['/play/cctv1hd']);
      request.start().then((connection) => {
        this.connection = connection;
        connection.onclose = () => { alert('closed'); };
        connection.onterminate = () => { alert('terminated'); };

        connection.onconnect = () => {
          this.connected = true;
        };
      });
    },
  },
};
</script>
