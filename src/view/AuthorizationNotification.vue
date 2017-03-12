<template>
  <div id="auth-notification" class="modal">
    <div class="modal-content">
      <h4>校外访问</h4>
      <p>有一些资源不能访问，可能是因为你当前在校外或错误地设置了代理。我们即将为您跳转到学校的统一认证平台进行登录，登录成功之后可以返回当前网页继续观看。</p>
      <p>如果登录成功之后依然出现以上该错误，可以根据<a href="https://www.cnet.com/how-to/disable-third-party-cookies-in-ie-firefox-and-google-chrome/">这篇博客</a>反向设置启用三方cookie或将"https://iptv.tsinghua.edu.cn"添加到白名单。</p>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" @click="doLogin">跳转</a>
      <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">取消</a>
      <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" @click="dismissed=true">不再显示</a>
    </div>
  </div>
</template>

<script>
import jQuery from 'jquery';

import config from '../../config.json';

export default {
  name: 'auth-notification',
  data() {
    return {
      dismissed: false,
    };
  },
  methods: {
    notify() {
      if (!this.dismissed) {
        jQuery('#auth-notification').modal('open');
      }
    },
    doLogin() {
      window.location.assign(config.authUrl);
    },
  },
  mounted() {
    jQuery('#auth-notification').modal({
      dismissible: false,
      opacity: .5,
    });
  },
};
</script>
