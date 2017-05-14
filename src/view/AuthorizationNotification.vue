<template>
  <v-dialog v-model="show">
    <v-card-row>
      <v-card-title v-if="auth">未授权访问</v-card-title>
      <v-card-title v-else>网络故障</v-card-title>
    </v-card-row>
    <v-card-row v-if="auth">
      <v-card-text v-if="auth">有一些资源不能访问，可能是因为你当前在校外或错误地设置了代理。我们即将为您跳转到学校的统一认证平台进行登录，登录成功之后可以返回当前网页继续观看。如果登录成功之后依然出现以上该错误，可以尝试配置浏览器开启三方cookie。</v-card-text>
      <v-card-text v-else>有一些资源不能访问，请稍后重试。</v-card-text>
    </v-card-row>
    <v-card-row actions>
      <v-btn flat v-if="auth" @click.native="doLogin">跳转</v-btn>
      <v-btn flat @click.native="show=false">取消</v-btn>
      <v-btn flat @click.native="dismissed=true; show=false">不再显示</v-btn>
    </v-card-row>
  </v-dialog>
</template>

<script>
import config from '../../config.json5';

export default {
  name: 'auth-notification',
  data() {
    return {
      show: false,
      dismissed: false,
      auth: config.authUrl && config.authUrl.length !== 0,
    };
  },
  methods: {
    notify() {
      if (!this.dismissed) {
        this.show = true;
      }
    },
    doLogin() {
      window.location.assign(config.authUrl);
    },
  },
};
</script>
