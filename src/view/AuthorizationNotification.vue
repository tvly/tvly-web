<template>
  <div v-if="" id="auth-notification" class="modal">
    <div class="modal-content flow-text">
      <h4 v-if="auth">未授权访问</h4>
      <h4 v-else>网络故障</h4>
      <p v-if="auth">有一些资源不能访问，可能是因为你当前在校外或错误地设置了代理。我们即将为您跳转到学校的统一认证平台进行登录，登录成功之后可以返回当前网页继续观看。如果登录成功之后依然出现以上该错误，可以尝试配置浏览器开启三方cookie。</p>
      <p v-else>有一些资源不能访问，请稍后重试。</p>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" v-if="auth" @click="doLogin">跳转</a>
      <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">取消</a>
      <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" @click="dismissed=true">不再显示</a>
    </div>
  </div>
</template>

<script>
import jQuery from 'jquery';

import config from '../../config.json5';

export default {
  name: 'auth-notification',
  data() {
    return {
      dismissed: false,
      auth: !!config.authUrl,
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
