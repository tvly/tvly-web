<template>
  <v-btn v-if="supported" icon @click.native="connect">
    <v-icon>{{icon}}</v-icon>
  </v-btn>
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
    supported() {
      return window.PresentationRequest !== undefined;
    },
  },
  methods: {
    connect() {
      let request = new window.PresentationRequest(['/play/cctv1hd']);
      request.start().then((connection) => {
        this.connection = connection;

        connection.onclose = () => { this.connected = false; };
        connection.onterminate = () => { this.connected = false; };
        connection.onconnect = () => { this.connected = true; };

        connection.onmessage = (msg) => {
          console.warn(msg.data);
        };
      }).catch((error) => {
        console.warn(error.message);
      });
    },
    send(msg) {
      if (this.connected) {
        this.connection.send(JSON.stringify(msg));
      }
    },
  },
};
</script>
