<template>
  <a v-if="supported" @click="connect">
    <i class="material-icons">
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
