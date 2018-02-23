<template>
  <footer class="page-footer">
    <div class="container">
      <div class="row">
        <div class="col l6 s12">
          <h5 class="white-text">鸣谢</h5>
          <p
            v-if="srcCredit"
            class="grey-text text-lighten-5">感谢{{ srcCredit }}提供视频源</p>
          <p class="grey-text text-lighten-5">
            感谢
            <a
              href="http://www.flaticon.com/authors/madebyoliver"
              class="grey-text text-lighten-5">
              Madebyoliver
            </a>
            的 Logo
          </p>
        </div>
        <div class="col l4 offset-l2 s12">
          <h5 class="white-text">联系我们</h5>
          <ul class="zmdi-hc-ul">
            <li>
              <a
                class="grey-text text-lighten-3"
                target="_blank"
                rel="noopener"
                href="https://github.com/huiyiqun/iptv">
                <i class="zmdi zmdi-github zmdi-hc-li"/>Github
              </a>
            </li>
            <li v-if="mailbox">
              <a
                class="grey-text text-lighten-3"
                target="_blank"
                rel="noopener"
                :href="'mailto:' + mailbox">
                <i class="zmdi zmdi-email zmdi-hc-li"/>Email
              </a>
            </li>
            <li v-if="wechat">
              <a class="grey-text text-lighten-3">
                <i class="fa fa-li fa-wechat"/>{{ wechat }}
              </a>
            </li>
            <li v-if="telegram">
              <a
                class="grey-text text-lighten-3"
                target="_blank"
                rel="noopener"
                :href="'https://t.me/joinchat/' + telegram">
                <i class="fa fa-li fa-telegram"/>Telegram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
        Powered by {{ sponsor }} © 2017
        Ver.{{ version }}@{{ built.toLocaleString() }}
      </div>
    </div>
  </footer>
</template>

<script>
import config from '../../config.json5';

export default {
  name: 'IPTVFooter',
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

<style lang="scss">
div#body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;

  main {
    flex: 1 0 auto;
  }
}

</style>
