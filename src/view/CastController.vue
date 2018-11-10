<template>
  <a
    v-if="supported"
    @click="connect">
    <i class="material-icons">
      {{ icon }}
    </i>
  </a>
</template>

<script>
export default {
  name: 'CastController',
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
      const request = new window.PresentationRequest(['/play/cctv1hd']);
      request.start().then((connection) => {
        this.connection = connection;

        connection.onclose = connection.onterminate = () => {
          this.connected = false;
        };
        connection.onconnect = () => {
          this.connected = true;
        };

        connection.onmessage = (msg) => {
          console.warn(msg.data);
        };
      }).catch((error) => {
        window.Materialize.toast(error.message);
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
