<template>
  <v-footer class="footer">
    <v-container>
      <v-row>
        <v-col md6 sm12>
          <h5 class="white-text">鸣谢</h5>
          <p v-if="srcCredit.length" class="grey-text text-lighten-5">感谢{{srcCredit}}提供视频源</p>
          <p class="grey-text text-lighten-5">
            感谢 <a href="http://www.flaticon.com/authors/madebyoliver" class="grey-text text-lighten-5">Madebyoliver</a> 的 Logo
          </p>
        </v-col>
        <v-col md4 offset-md2 sm12>
          <h5 class="white-text">联系我们</h5>
          <ul class="zmdi-hc-ul">
            <li><a class="grey-text text-lighten-3" target="_blank" rel="noopener" href="https://github.com/huiyiqun/iptv"><i class="zmdi zmdi-github zmdi-hc-li"></i>Github</a></li>
            <li v-if="mailbox && mailbox.length"><a class="grey-text text-lighten-3" target="_blank" rel="noopener" :href="'mailto:' + mailbox"><i class="zmdi zmdi-email zmdi-hc-li"></i>Email</a></li>
            <li v-if="wechat && wechat.length"><a class="grey-text text-lighten-3"><i class="fa fa-li fa-wechat" aria-hidden="true"></i>{{wechat}}</a></li>
            <li v-if="telegram && telegram.length"><a class="grey-text text-lighten-3" target="_blank" rel="noopener" :href="'https://t.me/joinchat/' + telegram"><i class="fa fa-li fa-telegram" aria-hidden="true"></i>Telegram</a></li>
          </ul>
        </v-col>
      </v-row>
      <v-row>
        Powered by {{sponsor}} © 2017 Ver.{{version}}@{{built.toLocaleString()}}
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import config from '../../config.json5';

export default {
  name: 'iptv-footer',
  data() {
    return {
      mailbox: config.mailbox,
      srcCredit: config.srcCredit,
      wechat: config.wechat,
      telegram: config.telegram,
      sponsor: config.sponsor,
      version: WEBPACK_APP_VERSION,
      built: new Date(WEBPACK_TIMESTAMP),
    };
  },
};
</script>

<style scoped>
.footer {
  height: auto;
}
</style>
